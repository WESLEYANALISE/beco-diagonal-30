
import React, { memo, useMemo } from 'react';
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

interface VirtualizedProductGridProps {
  products: Product[];
  height?: number;
  compact?: boolean;
}

const VirtualizedProductGridComponent: React.FC<VirtualizedProductGridProps> = ({
  products,
  height = 600,
  compact = true
}) => {
  const isMobile = useIsMobile();

  const { columnsPerRow } = useMemo(() => {
    const cols = isMobile ? 2 : compact ? 5 : 3;
    return { columnsPerRow: cols };
  }, [isMobile, compact]);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse border border-magical-gold/30">
          <div className="w-16 h-16 text-magical-gold/50">📦</div>
        </div>
        <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
          Nenhum artefato encontrado
        </h2>
        <p className="text-magical-starlight/80 font-enchanted">
          Não há artefatos disponíveis no momento
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className={`grid gap-2 md:gap-4`}
        style={{ 
          gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
          maxHeight: height,
          overflowY: 'auto'
        }}
      >
        {products.map((product, index) => (
          <div key={product.id} className="p-2">
            <ProductCard
              product={product}
              compact={compact}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const VirtualizedProductGrid = memo(VirtualizedProductGridComponent);
VirtualizedProductGrid.displayName = 'VirtualizedProductGrid';
