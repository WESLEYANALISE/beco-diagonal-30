
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { MagicalParticles } from '@/components/MagicalParticles';
import Header from '@/components/Header';
import VideoFeed from '@/components/VideoFeed';
import { CategoryCarouselExplorar } from '@/components/CategoryCarouselExplorar';
import { useAdvancedBackgroundMusic } from '@/hooks/useAdvancedBackgroundMusic';
import { useOptimizedInteractions } from '@/hooks/useOptimizedInteractions';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState(categoryFromUrl || 'todos');
  const [currentVideos, setCurrentVideos] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { changeContext } = useAdvancedBackgroundMusic();
  const { instantAction, throttle } = useOptimizedInteractions();

  const handleProductBuy = instantAction(useCallback((product: Product) => {
    if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  }, []));

  const handleGoBack = instantAction(useCallback(() => {
    navigate(-1);
  }, [navigate]));

  useEffect(() => {
    fetchProducts();
    changeContext('explorar-categoria');
  }, [changeContext]);

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
        .not('video', 'eq', '');

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
  });

  const goToNext = throttle(useCallback(() => {
    if (isTransitioning || currentVideos.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % currentVideos.length;
      setTimeout(() => setIsTransitioning(false), 200);
      return nextIndex;
    });
  }, [currentVideos.length, isTransitioning]), 100);

  const goToPrevious = throttle(useCallback(() => {
    if (isTransitioning || currentVideos.length === 0) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      const prevIdx = prevIndex === 0 ? currentVideos.length - 1 : prevIndex - 1;
      setTimeout(() => setIsTransitioning(false), 200);
      return prevIdx;
    });
  }, [currentVideos.length, isTransitioning]), 100);

  // Optimized touch handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 30;

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
  }, [touchStart, touchEnd, goToNext, goToPrevious]), 50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <MagicalParticles />
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Header with back button */}
        <div className="relative">
          <Header />
          <Button
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
            className="absolute top-3 left-3 text-magical-starlight hover:bg-magical-gold/20 backdrop-blur-sm z-50 transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        </div>
        
        <main className="pt-3">
          {/* Category Carousel */}
          <div className="px-3 mb-3">
            <CategoryCarouselExplorar 
              categories={categories}
              currentCategory={currentCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          {/* Video Feed Container */}
          <div 
            className="h-[calc(100vh-160px)] overflow-hidden relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentVideos.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-transform duration-200 ${
                  index === currentIndex ? 'translate-y-0' : 
                  index < currentIndex ? '-translate-y-full' : 'translate-y-full'
                }`}
                style={{ 
                  marginBottom: index === currentVideos.length - 1 ? '100px' : '0',
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
          </div>
          
          {/* Navigation controls */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-30">
            <Button
              onClick={goToPrevious}
              disabled={isTransitioning}
              size="sm"
              className="bg-magical-starlight/20 hover:bg-magical-starlight/40 text-magical-gold border border-magical-gold/30 backdrop-blur-sm transition-all duration-200 active:scale-95"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              onClick={goToNext}
              disabled={isTransitioning}
              size="sm"
              className="bg-magical-starlight/20 hover:bg-magical-starlight/40 text-magical-gold border border-magical-gold/30 backdrop-blur-sm transition-all duration-200 active:scale-95"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Navigation dots */}
          <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-1 z-30">
            {currentVideos.slice(0, 5).map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === currentIndex % 5 ? 'bg-magical-gold w-4' : 'bg-magical-starlight/50 hover:bg-magical-starlight/80'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
            {currentVideos.length > 5 && (
              <span className="text-magical-starlight/60 text-xs ml-2">
                {currentIndex + 1}/{currentVideos.length}
              </span>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explorar;
