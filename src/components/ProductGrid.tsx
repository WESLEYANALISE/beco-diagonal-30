
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
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

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  compact = true,
  selectable = false,
  selectedProducts = [],
  onProductToggle
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2 md:gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="h-48 sm:h-56 md:h-64 bg-white/20 rounded-xl md:rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 animate-fade-in">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 backdrop-blur-sm animate-pulse">
          <div className="w-12 h-12 md:w-16 md:h-16 text-white/50">📦</div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
          Nenhum produto encontrado
        </h2>
        <p className="text-white/80 text-sm md:text-base">
          Não há produtos disponíveis no momento
        </p>
      </div>
    );
  }

  // Use different grid layouts for mobile vs desktop
  const gridClasses = isMobile 
    ? "grid grid-cols-2 gap-1.5 sm:gap-2" // Mobile: 2 columns only
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3"; // Desktop: responsive grid

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          compact={compact}
          selectable={selectable}
          selected={selectedProducts.some(p => p.id === product.id)}
          onToggle={onProductToggle}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </div>
  );
};
