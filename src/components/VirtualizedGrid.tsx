
import React, { memo, useMemo } from 'react';
import { OptimizedProductCard } from '@/components/OptimizedProductCard';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  categoria: string;
  link: string;
}

interface VirtualizedGridProps {
  products: Product[];
  compact?: boolean;
  selectable?: boolean;
  selectedProducts?: Product[];
  onProductToggle?: (product: Product) => void;
  itemsPerPage?: number;
}

const VirtualizedGrid = memo<VirtualizedGridProps>(({
  products,
  compact = true,
  selectable = false,
  selectedProducts = [],
  onProductToggle,
  itemsPerPage = 24
}) => {
  const visibleProducts = useMemo(() => {
    return products.slice(0, itemsPerPage);
  }, [products, itemsPerPage]);

  const gridClassName = useMemo(() => {
    return compact 
      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'
      : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4';
  }, [compact]);

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
    <div className={gridClassName}>
      {visibleProducts.map((product, index) => (
        <OptimizedProductCard
          key={product.id}
          product={product}
          compact={compact}
          selectable={selectable}
          selected={selectedProducts.some(p => p.id === product.id)}
          onToggle={onProductToggle}
          style={{ animationDelay: `${index * 0.02}s` }}
        />
      ))}
    </div>
  );
});

VirtualizedGrid.displayName = 'VirtualizedGrid';

export { VirtualizedGrid };
