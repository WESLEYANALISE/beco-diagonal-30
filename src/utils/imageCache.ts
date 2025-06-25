
interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  compressed?: boolean;
}

class ImageCacheManager {
  private cache = new Map<string, CachedImage>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100; // Maximum 100 images

  async getImage(url: string, compress = true): Promise<string> {
    // Check memory cache first
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return URL.createObjectURL(cached.blob);
    }

    try {
      // Fetch image
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');

      let blob = await response.blob();

      // Compress image if needed
      if (compress && blob.type.startsWith('image/') && blob.size > 100000) { // 100KB threshold
        blob = await this.compressImage(blob);
      }

      // Cache the image
      this.cacheImage(url, blob, compress);

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error loading image:', error);
      return '/placeholder.svg';
    }
  }

  private async compressImage(blob: Blob): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 800px width)
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob || blob);
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };

      img.onerror = () => resolve(blob);
      img.src = URL.createObjectURL(blob);
    });
  }

  private cacheImage(url: string, blob: Blob, compressed: boolean) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(url, {
      url,
      blob,
      timestamp: Date.now(),
      compressed
    });
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    const totalSize = Array.from(this.cache.values())
      .reduce((total, item) => total + item.blob.size, 0);
    
    return {
      count: this.cache.size,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
    };
  }
}

export const imageCache = new ImageCacheManager();
