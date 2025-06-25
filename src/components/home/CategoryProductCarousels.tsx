
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from '@/components/ProductCard';
import { useNavigate } from 'react-router-dom';

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
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
}

interface CategoryProductCarouselsProps {
  categories: string[];
  getCategoryProducts: (category: string, limit?: number) => Product[];
  getCategoryIcon: (category: string) => React.ComponentType<any>;
  showingAI: boolean;
}

export const CategoryProductCarousels: React.FC<CategoryProductCarouselsProps> = ({ 
  categories, 
  getCategoryProducts, 
  getCategoryIcon, 
  showingAI 
}) => {
  const navigate = useNavigate();

  const handleExploreCategory = (category: string) => {
    // First navigate to subcategories page, which will handle redirecting to products if no subcategories exist
    navigate(`/subcategoria-detalhes?categoria=${encodeURIComponent(category)}`);
  };

  if (showingAI) return null;

  return (
    <>
      {categories.map((category, index) => {
        if (!category) return null;
        
        const categoryProducts = getCategoryProducts(category);
        const IconComponent = getCategoryIcon(category);
        
        if (categoryProducts.length === 0) return null;
        return (
          <section 
            key={category} 
            style={{animationDelay: `${index * 0.1}s`}} 
            className="md:px-6 py-4 animate-fade-in px-[6px]"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-magical-gold/40 to-magical-bronze/40 rounded-xl flex items-center justify-center backdrop-blur-sm border border-magical-gold/30 shadow-lg animate-magical-glow">
                    <IconComponent className="w-4 h-4 text-magical-gold" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-magical-starlight font-magical">{category}</h3>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleExploreCategory(category)} 
                  className="bg-magical-gold/30 text-magical-starlight border-magical-gold/40 hover:bg-magical-gold/40 text-xs px-3 py-1 h-auto font-enchanted shadow-md hover:shadow-magical-gold/20 transition-all duration-300 hover:scale-105"
                >
                  Explorar Coleção
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-3">
                  {categoryProducts.map(product => (
                    <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
                      <ProductCard product={product} compact={true} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 w-6 h-6 shadow-lg" />
                <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 w-6 h-6 shadow-lg" />
              </Carousel>
            </div>
          </section>
        );
      })}
    </>
  );
};
