
import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface CategoryCarouselProps {
  onExploreCollection: (categoria: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ onExploreCollection }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) throw error;

      const uniqueCategories = [...new Set(data?.map(item => item.categoria) || [])];
      setCategories(uniqueCategories.slice(0, 6));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Livros': '📚',
      'Varitas': '🪄',
      'Poções': '🧪',
      'Roupas': '👘',
      'Acessórios': '💍',
      'Default': '✨'
    };
    return icons[category] || icons['Default'];
  };

  return (
    <section className="px-4 py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-magical-starlight font-magical flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-magical-gold" />
          Explorar por Categoria
          <Sparkles className="w-6 h-6 text-magical-gold" />
        </h2>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-3">
          {categories.map((category, index) => (
            <CarouselItem key={category} className="pl-2 md:pl-3 basis-1/2 md:basis-1/3">
              <Card className="group overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/20 border-magical-gold/30 backdrop-blur-sm animate-fade-in" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-bold text-magical-starlight text-sm mb-3 group-hover:text-magical-gold transition-colors duration-300 font-enchanted">
                    {category}
                  </h3>
                  <Button 
                    onClick={() => onExploreCollection(category)}
                    size="sm" 
                    className="w-full bg-magical-gold/20 text-magical-starlight border border-magical-gold/30 hover:bg-magical-gold hover:text-magical-midnight transition-all duration-300 font-enchanted"
                  >
                    Explorar Coleção
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30" />
        <CarouselNext className="right-2 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30" />
      </Carousel>
    </section>
  );
};
