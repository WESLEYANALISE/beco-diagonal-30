
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
        {isMobile && (
          <div className="flex justify-end gap-2 px-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="bg-magical-gold/20 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/30 transition-all duration-200"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="bg-magical-gold/20 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/30 transition-all duration-200"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className={`${viewMode === 'list' && isMobile 
          ? 'space-y-4 px-4' 
          : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'}`}>
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className={`bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 rounded-2xl animate-pulse backdrop-blur-sm border border-magical-gold/20 ${
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
        <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse border border-magical-gold/30">
          <div className="text-4xl">⚡</div>
        </div>
        <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
          Nenhuma relíquia encontrada
        </h2>
        <p className="text-magical-starlight/80 font-enchanted">
          Não há relíquias disponíveis no momento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isMobile && (
        <div className="flex justify-end gap-2 px-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="bg-magical-gold/20 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/30 transition-all duration-200"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="bg-magical-gold/20 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/30 transition-all duration-200"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className={`${
        viewMode === 'list' && isMobile 
          ? 'space-y-4 px-4' 
          : `grid gap-3 md:gap-4 ${
              compact 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
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
            style={{ animationDelay: `${index * 0.03}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';
