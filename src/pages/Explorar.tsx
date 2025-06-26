
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Filter, Grid } from 'lucide-react';
import { MagicalParticles } from '@/components/MagicalParticles';
import Header from '@/components/Header';
import VideoFeed from '@/components/VideoFeed';
import { CategoryCarouselExplorar } from '@/components/CategoryCarouselExplorar';
import { useOptimizedInteractions } from '@/hooks/useOptimizedInteractions';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  link: string;
  categoria: string;
}

export const Explorar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { goBack, addToHistory } = useNavigationHistory();
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState(categoryFromUrl || 'todos');
  const [currentVideos, setCurrentVideos] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { instantAction, throttle } = useOptimizedInteractions();

  const handleProductBuy = instantAction(useCallback((product: Product) => {
    if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  }, []));

  const handleGoBack = instantAction(useCallback(() => {
    goBack();
  }, [goBack]));

  useEffect(() => {
    fetchProducts();
    addToHistory('/explorar', 'Explorar Vídeos');
  }, [addToHistory]);

  useEffect(() => {
    if (categoryFromUrl) {
      setCurrentCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    filterVideosByCategory();
  }, [currentCategory, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('id, produto, valor, video, imagem1, link, categoria')
        .not('video', 'is', null)
        .not('video', 'eq', '')
        .limit(30); // Reduzido para melhor performance

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        return;
      }

      if (data) {
        setProducts(data);
        const uniqueCategories = [...new Set(data.map(product => product.categoria))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  };

  const filterVideosByCategory = () => {
    if (currentCategory === 'todos') {
      setCurrentVideos(products);
    } else {
      const filtered = products.filter(product => product.categoria === currentCategory);
      setCurrentVideos(filtered);
    }
    setCurrentIndex(0);
  };

  const handleVideoEnd = useCallback(() => {
    goToNext();
  }, []);

  const handleCategoryChange = instantAction((category: string) => {
    setCurrentCategory(category);
    setShowFilters(false);
  });

  const goToNext = throttle(useCallback(() => {
    if (isTransitioning || currentVideos.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % currentVideos.length;
      setTimeout(() => setIsTransitioning(false), 100);
      return nextIndex;
    });
  }, [currentVideos.length, isTransitioning]), 300);

  const goToPrevious = throttle(useCallback(() => {
    if (isTransitioning || currentVideos.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      const prevIdx = prevIndex === 0 ? currentVideos.length - 1 : prevIndex - 1;
      setTimeout(() => setIsTransitioning(false), 100);
      return prevIdx;
    });
  }, [currentVideos.length, isTransitioning]), 300);

  // Touch handlers otimizados
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 80; // Aumentado para melhor UX

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const onTouchEnd = throttle(useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      goToNext();
    } else if (isDownSwipe) {
      goToPrevious();
    }
  }, [touchStart, touchEnd, goToNext, goToPrevious]), 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple overflow-hidden">
      <MagicalParticles />
      
      <div className="max-w-md mx-auto relative z-10 h-screen flex flex-col">
        {/* Header compacto otimizado para mobile */}
        <div className="relative flex-shrink-0">
          <div className="bg-gradient-to-r from-magical-midnight/80 to-magical-deepPurple/80 backdrop-blur-md border-b border-magical-gold/20 p-3">
            <div className="flex items-center justify-between">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                size="sm"
                className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-200 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <h1 className="text-lg font-bold text-magical-starlight font-magical">
                ⚡ Explorar Relíquias
              </h1>
              
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-200"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="bg-magical-midnight/95 backdrop-blur-md border-t border-magical-gold/30 rounded-t-2xl">
                  <SheetHeader className="pb-4">
                    <SheetTitle className="text-magical-starlight font-magical text-center">
                      🏰 Filtrar por Casa
                    </SheetTitle>
                  </SheetHeader>
                  <div className="grid grid-cols-2 gap-3 pb-6">
                    <Button
                      onClick={() => handleCategoryChange('todos')}
                      className={`h-12 text-sm font-medium transition-all duration-300 ${
                        currentCategory === 'todos'
                          ? 'bg-magical-gold text-magical-midnight shadow-lg scale-105'
                          : 'bg-magical-starlight/10 text-magical-starlight border border-magical-gold/30 hover:bg-magical-gold/20 hover:text-magical-gold'
                      }`}
                    >
                      Todas as Casas
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`h-12 text-sm font-medium transition-all duration-300 ${
                          currentCategory === category
                            ? 'bg-magical-gold text-magical-midnight shadow-lg scale-105'
                            : 'bg-magical-starlight/10 text-magical-starlight border border-magical-gold/30 hover:bg-magical-gold/20 hover:text-magical-gold'
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        {/* Video Feed Container - Tela cheia otimizada */}
        <div 
          className="flex-1 relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {currentVideos.length > 0 ? (
            <>
              {currentVideos.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-transform duration-100 ${
                    index === currentIndex ? 'translate-y-0' : 
                    index < currentIndex ? '-translate-y-full' : 'translate-y-full'
                  }`}
                  style={{ 
                    willChange: 'transform'
                  }}
                >
                  <VideoFeed
                    key={product.id}
                    productId={product.id}
                    videoUrl={product.video}
                    title={product.produto}
                    price={product.valor}
                    image={product.imagem1}
                    category={product.categoria}
                    isActive={index === currentIndex}
                    onBuy={() => handleProductBuy(product)}
                    onVideoEnd={index === currentIndex ? handleVideoEnd : undefined}
                  />
                </div>
              ))}

              {/* Controles de navegação laterais */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-30">
                <Button
                  onClick={goToPrevious}
                  disabled={isTransitioning}
                  size="sm"
                  className="bg-magical-starlight/20 hover:bg-magical-starlight/40 text-magical-gold border border-magical-gold/30 backdrop-blur-sm transition-all duration-200 active:scale-95 w-12 h-12 rounded-full"
                >
                  <ChevronUp className="w-5 h-5" />
                </Button>
                <Button
                  onClick={goToNext}
                  disabled={isTransitioning}
                  size="sm"
                  className="bg-magical-starlight/20 hover:bg-magical-starlight/40 text-magical-gold border border-magical-gold/30 backdrop-blur-sm transition-all duration-200 active:scale-95 w-12 h-12 rounded-full"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Indicadores de progresso modernos */}
              <div className="absolute bottom-20 left-4 right-4 flex items-center justify-center gap-2 z-30">
                {currentVideos.slice(0, 5).map((_, index) => (
                  <button
                    key={index}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex % 5 
                        ? 'bg-magical-gold w-8 h-2 shadow-lg shadow-magical-gold/50' 
                        : 'bg-magical-starlight/50 hover:bg-magical-starlight/80 w-2 h-2'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
                {currentVideos.length > 5 && (
                  <span className="text-magical-starlight/80 text-sm ml-3 bg-magical-midnight/50 px-2 py-1 rounded-full backdrop-blur-sm border border-magical-gold/20">
                    {currentIndex + 1}/{currentVideos.length}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-magical-gold/30">
                  <Grid className="w-10 h-10 text-magical-gold/50" />
                </div>
                <h2 className="text-xl font-bold text-magical-starlight font-magical">
                  Nenhuma relíquia encontrada
                </h2>
                <p className="text-magical-starlight/80 font-enchanted">
                  Não há vídeos disponíveis para esta categoria
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explorar;
