
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCounts: Record<string, number>;
  compact?: boolean;
}

const CategoryFilterComponent: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  productCounts,
  compact = false
}) => {
  // Split categories into two rows if compact
  const categoriesPerRow = compact ? Math.ceil((categories.length + 1) / 2) : categories.length + 1;
  const firstRowCategories = compact ? ['todas', ...categories.slice(0, categoriesPerRow - 1)] : ['todas', ...categories];
  const secondRowCategories = compact ? categories.slice(categoriesPerRow - 1) : [];

  const CategoryButton = ({ category, isAll = false }: { category: string; isAll?: boolean }) => (
    <Button
      variant={selectedCategory === category ? 'default' : 'outline'}
      size={compact ? "sm" : "sm"}
      onClick={() => onCategoryChange(category)}
      className={`whitespace-nowrap transition-all duration-300 ${
        compact ? 'text-xs px-2 py-1 h-7' : ''
      } ${
        selectedCategory === category 
          ? 'bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze border-0 shadow-lg animate-magical-glow' 
          : 'bg-magical-deepPurple/60 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/20 hover:text-magical-gold backdrop-blur-sm'
      }`}
    >
      {isAll ? 'Todas as Categorias' : category}
    </Button>
  );

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-magical-midnight/90 via-magical-deepPurple/90 to-magical-midnight/90 backdrop-blur-md border-b border-magical-gold/20 p-3 space-y-2">
        {/* First row */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {firstRowCategories.map(category => (
              <CategoryButton 
                key={category} 
                category={category} 
                isAll={category === 'todas'} 
              />
            ))}
          </div>
        </div>
        
        {/* Second row */}
        {secondRowCategories.length > 0 && (
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max">
              {secondRowCategories.map(category => (
                <CategoryButton key={category} category={category} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-magical-midnight/90 via-magical-deepPurple/90 to-magical-midnight/90 backdrop-blur-md border-b border-magical-gold/20">
      <div className="flex gap-2 p-4 overflow-x-auto">
        <CategoryButton category="todas" isAll />
        {categories.map(category => (
          <CategoryButton key={category} category={category} />
        ))}
      </div>
    </div>
  );
};

export const CategoryFilter = memo(CategoryFilterComponent);
CategoryFilter.displayName = 'CategoryFilter';
