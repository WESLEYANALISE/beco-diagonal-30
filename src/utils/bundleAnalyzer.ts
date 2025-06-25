
interface ModuleInfo {
  name: string;
  size: number;
  loadTime?: number;
}

interface BundleStats {
  totalSize: number;
  modules: ModuleInfo[];
  loadTimes: Record<string, number>;
}

class BundleAnalyzer {
  private modules: ModuleInfo[] = [];
  private loadTimes: Record<string, number> = {};

  startTracking() {
    if (process.env.NODE_ENV !== 'development') return;

    // Track module loads
    const originalImport = window.import || ((module: string) => import(module));
    
    window.import = async (module: string) => {
      const start = performance.now();
      try {
        const result = await originalImport(module);
        const end = performance.now();
        this.trackModuleLoad(module, end - start);
        return result;
      } catch (error) {
        console.error(`Failed to load module ${module}:`, error);
        throw error;
      }
    };
  }

  trackModuleLoad(moduleName: string, loadTime: number) {
    this.loadTimes[moduleName] = loadTime;
    
    // Estimate module size (rough approximation)
    const estimatedSize = this.estimateModuleSize(moduleName);
    
    this.modules.push({
      name: moduleName,
      size: estimatedSize,
      loadTime
    });
  }

  private estimateModuleSize(moduleName: string): number {
    // Rough size estimates based on common patterns
    const sizeMap: Record<string, number> = {
      'react': 42000,
      'react-dom': 130000,
      'lucide-react': 25000,
      '@tanstack/react-query': 45000,
      'supabase': 85000
    };

    for (const [key, size] of Object.entries(sizeMap)) {
      if (moduleName.includes(key)) {
        return size;
      }
    }

    // Default estimate
    return 15000;
  }

  generateReport(): BundleStats {
    const totalSize = this.modules.reduce((sum, module) => sum + module.size, 0);
    
    return {
      totalSize,
      modules: this.modules.sort((a, b) => b.size - a.size),
      loadTimes: this.loadTimes
    };
  }

  logReport() {
    if (process.env.NODE_ENV !== 'development') return;

    const report = this.generateReport();
    
    console.group('📦 Bundle Analysis');
    console.log(`Total estimated size: ${(report.totalSize / 1024).toFixed(2)} KB`);
    console.log('Largest modules:');
    
    report.modules.slice(0, 10).forEach(module => {
      console.log(`  ${module.name}: ${(module.size / 1024).toFixed(2)} KB`);
    });
    
    console.log('Slowest loading modules:');
    Object.entries(report.loadTimes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([name, time]) => {
        console.log(`  ${name}: ${time.toFixed(2)}ms`);
      });
    
    console.groupEnd();
  }
}

export const bundleAnalyzer = new BundleAnalyzer();
