
import React, { memo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from "@/components/ui/button";
import { Grid, List } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  compact?: boolean;
  selectable?: boolean;
  selectedProducts?: Product[];
  onProductToggle?: (product: Product) => void;
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  compact = true,
  selectable = false,
  selectedProducts = [],
  onProductToggle
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="space-y-4">
        {/* View mode controls for mobile/tablet only */}
        {isMobile && (
          <div className="flex justify-end gap-2 px-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className={`${viewMode === 'list' && isMobile 
          ? 'space-y-4 px-4' 
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3'}`}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={`bg-white/20 rounded-2xl animate-pulse ${
              viewMode === 'list' && isMobile ? 'h-32' : 'h-64'
            }`}></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
          <div className="w-16 h-16 text-white/50">📦</div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Nenhum produto encontrado
        </h2>
        <p className="text-white/80">
          Não há produtos disponíveis no momento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View mode controls - only show on mobile/tablet */}
      {isMobile && (
        <div className="flex justify-end gap-2 px-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Products container */}
      <div className={`${
        viewMode === 'list' && isMobile 
          ? 'space-y-4 px-4' 
          : `grid gap-2 md:gap-3 ${
              compact 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`
      }`}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            compact={viewMode === 'grid' ? compact : false}
            listView={viewMode === 'list' && isMobile}
            selectable={selectable}
            selected={selectedProducts.some(p => p.id === product.id)}
            onToggle={onProductToggle}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';
