
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from '@/components/ProductCard';
import { ProductSelector } from '@/components/ProductSelector';
import { TabNavigation } from '@/components/TabNavigation';
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

interface FeaturedSectionProps {
  showingAI: boolean;
  onTabChange: (tab: 'featured' | 'ai') => void;
  featuredProducts: Product[];
  currentFeaturedCategory: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  displayedProducts: Product[];
  selectedProducts: Product[];
  onProductToggle: (product: Product) => void;
  onAnalyze: () => void;
  setQuestionnaireAnswers: (answers: Record<string, string>) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  showingAI,
  onTabChange,
  featuredProducts,
  currentFeaturedCategory,
  selectedCategory,
  setSelectedCategory,
  categories,
  displayedProducts,
  selectedProducts,
  onProductToggle,
  onAnalyze,
  setQuestionnaireAnswers
}) => {
  const navigate = useNavigate();

  return (
    <section className="px-4 md:px-6 py-8 md:py-12 bg-gradient-to-r from-magical-mysticalPurple/30 via-magical-deepPurple/30 to-magical-mysticalPurple/30 backdrop-blur-sm animate-fade-in border-y border-magical-gold/40 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple/30 via-magical-mysticalPurple/30 to-magical-darkBlue/30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <TabNavigation showingAI={showingAI} onTabChange={onTabChange} />
          
          {showingAI ? (
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 animate-slide-in-left font-magical">
                🔮 Oráculo das Relíquias
              </h2>
              <div className="text-base text-magical-starlight/90 animate-slide-in-right space-y-2 font-enchanted">
                <p><strong>Selecione até 5 artefatos mágicos</strong> e nosso <strong>Oráculo</strong> revelará qual possui o poder mais adequado para você</p>
                <p className="text-sm">✨ <em>Consulta baseada na magia ancestral de Hogwarts</em></p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 animate-slide-in-left font-magical">
                ⚡ Relíquias Lendárias de Hogwarts
              </h2>
              <p className="text-base text-magical-starlight/80 animate-slide-in-right font-enchanted">
                {currentFeaturedCategory ? `Os tesouros mais procurados em ${currentFeaturedCategory}` : 'Os artefatos favoritos dos bruxos mais poderosos'}
              </p>
            </div>
          )}
        </div>

        {showingAI ? (
          <>
            <div className="max-w-md mx-auto mb-6 animate-scale-in">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-magical-starlight/90 border-magical-gold/40 text-magical-midnight font-enchanted shadow-lg">
                  <SelectValue placeholder="Selecione uma Casa de Hogwarts" />
                </SelectTrigger>
                <SelectContent className="bg-magical-starlight border-magical-gold/30 z-50">
                  <SelectItem value="todas">Todas as Casas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ProductSelector 
              products={displayedProducts.slice(0, 20)} 
              selectedProducts={selectedProducts} 
              onProductToggle={onProductToggle} 
              onAnalyze={onAnalyze} 
              onQuestionnaireChange={setQuestionnaireAnswers} 
            />
          </>
        ) : (
          <>
            <Carousel className="w-full animate-scale-in mb-6">
              <CarouselContent className="-ml-2 md:-ml-3">
                {featuredProducts.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-3/4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                    <ProductCard product={product} showBadge={true} badgeText="RELÍQUIA" compact={false} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 shadow-xl" />
              <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 shadow-xl" />
            </Carousel>
            
            <div className="text-center animate-fade-in">
              <Button 
                onClick={() => navigate('/categoria-lista?tipo=mais-vendidos')} 
                className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-2xl hover:shadow-magical-gold/30"
              >
                Explorar Mais Relíquias
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
