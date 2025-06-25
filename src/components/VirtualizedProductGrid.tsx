
import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
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

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    products: Product[];
    columnsPerRow: number;
    compact: boolean;
  };
}

const Cell = memo<CellProps>(({ columnIndex, rowIndex, style, data }) => {
  const { products, columnsPerRow, compact } = data;
  const index = rowIndex * columnsPerRow + columnIndex;
  const product = products[index];

  if (!product) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="p-2">
      <ProductCard
        product={product}
        compact={compact}
        style={{ animationDelay: `${index * 0.05}s` }}
      />
    </div>
  );
});

Cell.displayName = 'VirtualizedCell';

const VirtualizedProductGridComponent: React.FC<VirtualizedProductGridProps> = ({
  products,
  height = 600,
  compact = true
}) => {
  const isMobile = useIsMobile();

  const { columnsPerRow, columnWidth, rowHeight, totalWidth } = useMemo(() => {
    const cols = isMobile ? 2 : compact ? 5 : 3;
    const colWidth = isMobile ? 180 : compact ? 200 : 280;
    const rowH = isMobile ? 280 : compact ? 320 : 380;
    const width = cols * colWidth;
    
    return {
      columnsPerRow: cols,
      columnWidth: colWidth,
      rowHeight: rowH,
      totalWidth: width
    };
  }, [isMobile, compact]);

  const rowCount = Math.ceil(products.length / columnsPerRow);

  const itemData = useMemo(() => ({
    products,
    columnsPerRow,
    compact
  }), [products, columnsPerRow, compact]);

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
      <Grid
        columnCount={columnsPerRow}
        columnWidth={columnWidth}
        height={height}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={totalWidth}
        itemData={itemData}
        overscanRowCount={2}
        overscanColumnCount={1}
      >
        {Cell}
      </Grid>
    </div>
  );
};

export const VirtualizedProductGrid = memo(VirtualizedProductGridComponent);
VirtualizedProductGrid.displayName = 'VirtualizedProductGrid';
