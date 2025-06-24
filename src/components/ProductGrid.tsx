
import React from 'react';
import { ProductCard } from '@/components/ProductCard';

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
  showListToggle?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  compact = true,
  selectable = false,
  selectedProducts = [],
  onProductToggle,
  showListToggle = false
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="space-y-4">
        {/* View Toggle - Only show on mobile/tablet when showListToggle is true */}
        {showListToggle && (
          <div className="flex justify-end lg:hidden">
            <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-red-500' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <div className="w-4 h-4">⊞</div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-red-500' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <div className="w-4 h-4">☰</div>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-64 bg-white/20 rounded-2xl animate-pulse"></div>
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
      {/* View Toggle - Only show on mobile/tablet when showListToggle is true */}
      {showListToggle && (
        <div className="flex justify-end lg:hidden">
          <div className="bg-white/20 rounded-lg p-1 backdrop-blur-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-red-500' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <div className="w-4 h-4">⊞</div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-red-500' 
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <div className="w-4 h-4">☰</div>
            </button>
          </div>
        </div>
      )}

      {/* Desktop always shows grid, mobile/tablet can toggle between grid and list */}
      <div className={`
        ${viewMode === 'list' && showListToggle 
          ? 'lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-3 space-y-2 lg:space-y-0' 
          : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3'
        }
      `}>
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            compact={compact}
            selectable={selectable}
            selected={selectedProducts.some(p => p.id === product.id)}
            onToggle={onProductToggle}
            listView={viewMode === 'list' && showListToggle}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
};
