import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, Grid2X2, LayoutList, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { VideoFeed } from '@/components/VideoFeed';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductGrid';
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from '@/hooks/use-mobile';
import { useMagicalSounds } from '@/hooks/useMagicalSounds';

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
  uso?: string;
}

const Explorar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'video' | 'grid' | 'list'>('video');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { playRandomMagicalSound } = useMagicalSounds();

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Enhanced video validation
  const isValidVideo = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    
    const isMP4 = url.toLowerCase().includes('.mp4');
    const isValidURL = url.startsWith('http') && !url.includes('undefined') && !url.includes('null');
    const isNotImage = !url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
    
    return isMP4 && isValidURL && isNotImage;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .not('video', 'is', null)
        .neq('video', '')
        .order('id');

      if (error) throw error;
      
      const validVideoProducts = (data || []).filter(product => 
        product.video && isValidVideo(product.video)
      );
      
      console.log(`Filtered ${validVideoProducts.length} valid videos from ${data?.length || 0} total products`);
      
      const shuffledProducts = shuffleArray(validVideoProducts);
      setProducts(shuffledProducts);
    } catch (error) {
      console.error('Erro ao buscar artefatos mágicos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    const productsWithValidVideos = products.filter(product => 
      product.video && isValidVideo(product.video)
    );
    
    if (selectedCategory === 'todas') {
      return productsWithValidVideos;
    }
    return productsWithValidVideos.filter(product => product.categoria === selectedCategory);
  }, [products, selectedCategory]);

  // Memoized categories and counts
  const { categories, productCounts } = useMemo(() => {
    const productsWithVideos = products.filter(product => product.video && isValidVideo(product.video));
    const categoryMap = new Map<string, number>();
    
    productsWithVideos.forEach(product => {
      if (product.categoria) {
        categoryMap.set(product.categoria, (categoryMap.get(product.categoria) || 0) + 1);
      }
    });
    
    return {
      categories: Array.from(categoryMap.keys()).sort(),
      productCounts: Object.fromEntries(categoryMap)
    };
  }, [products]);

  const handleBuyProduct = useCallback((product: Product) => {
    window.open(product.link, '_blank');
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    // Play magical sound when changing category
    playRandomMagicalSound();
    setSelectedCategory(category);
    setCurrentVideoIndex(0);
  }, [playRandomMagicalSound]);

  // Navigation function with debounce and magical sound
  const navigateToVideo = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex < 0 || newIndex >= filteredProducts.length) {
      return;
    }

    // Play magical sound when navigating videos
    playRandomMagicalSound();

    setIsTransitioning(true);
    setCurrentVideoIndex(newIndex);
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, filteredProducts.length, playRandomMagicalSound]);

  const handleVideoEnd = useCallback(() => {
    console.log('Video ended, checking for next video or category');
    
    if (currentVideoIndex < filteredProducts.length - 1) {
      navigateToVideo(currentVideoIndex + 1);
      return;
    }
    
    const currentCategoryIndex = categories.findIndex(cat => cat === selectedCategory);
    
    if (selectedCategory === 'todas') {
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
        setCurrentVideoIndex(0);
      }
    } else if (currentCategoryIndex < categories.length - 1) {
      setSelectedCategory(categories[currentCategoryIndex + 1]);
      setCurrentVideoIndex(0);
    } else {
      setSelectedCategory('todas');
      setCurrentVideoIndex(0);
    }
  }, [currentVideoIndex, filteredProducts.length, categories, selectedCategory, navigateToVideo]);

  // Enhanced scroll and touch handling
  useEffect(() => {
    if (viewMode !== 'video') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;

      if (e.deltaY > 0) {
        navigateToVideo(currentVideoIndex + 1);
      } else if (e.deltaY < 0) {
        navigateToVideo(currentVideoIndex - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      if (e.key === 'ArrowDown') {
        navigateToVideo(currentVideoIndex + 1);
      } else if (e.key === 'ArrowUp') {
        navigateToVideo(currentVideoIndex - 1);
      }
    };

    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      const diffY = touchStartY - touchEndY;
      const diffTime = touchEndTime - touchStartTime;

      // Only trigger if it's a quick swipe (less than 300ms) and sufficient distance
      if (diffTime < 300 && Math.abs(diffY) > 50) {
        if (diffY > 0) {
          navigateToVideo(currentVideoIndex + 1);
        } else {
          navigateToVideo(currentVideoIndex - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewMode, currentVideoIndex, isTransitioning, navigateToVideo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple flex items-center justify-center">
        <div className="text-magical-starlight text-xl font-magical">Carregando artefatos mágicos...</div>
      </div>
    );
  }

  // Get current and next video for conditional rendering
  const currentProduct = filteredProducts[currentVideoIndex];
  const nextProduct = filteredProducts[currentVideoIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 backdrop-blur-md border-b border-magical-gold/30">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>

          <h1 className="text-magical-starlight font-bold text-xl font-magical">Explorar Artefatos Mágicos</h1>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'video' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('video')}
              className={viewMode === 'video' ? 'bg-magical-mysticalPurple hover:bg-magical-deepPurple text-magical-starlight' : 'text-magical-starlight hover:bg-magical-gold/20'}
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-magical-mysticalPurple hover:bg-magical-deepPurple text-magical-starlight' : 'text-magical-starlight hover:bg-magical-gold/20'}
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            {isMobile && (
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-magical-mysticalPurple hover:bg-magical-deepPurple text-magical-starlight' : 'text-magical-starlight hover:bg-magical-gold/20'}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          productCounts={productCounts}
          compact={viewMode === 'video'}
        />
      </div>

      {/* Content */}
      <div className={viewMode === 'video' ? 'pt-0' : 'pt-40'}>
        {viewMode === 'video' ? (
          <div className="relative">
            {filteredProducts.length > 0 ? (
              <div className="h-screen overflow-hidden">
                {/* Render only current video */}
                {currentProduct && (
                  <div className="absolute inset-0">
                    <VideoFeed
                      key={currentProduct.id}
                      product={currentProduct}
                      isActive={true}
                      onBuy={handleBuyProduct}
                      onVideoEnd={handleVideoEnd}
                    />
                  </div>
                )}
                
                {/* Pre-load next video (hidden) */}
                {nextProduct && (
                  <div className="absolute inset-0 opacity-0 pointer-events-none">
                    <VideoFeed
                      key={nextProduct.id}
                      product={nextProduct}
                      isActive={false}
                      onBuy={handleBuyProduct}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-screen flex items-center justify-center text-magical-starlight">
                <div className="text-center">
                  <p className="text-xl mb-4 font-magical">Nenhum vídeo de artefato encontrado nesta categoria</p>
                  <Button onClick={() => setViewMode('grid')} className="bg-magical-mysticalPurple hover:bg-magical-deepPurple text-magical-starlight font-enchanted">
                    Ver em Grade Mágica
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple p-4">
            <div className="max-w-7xl mx-auto">
              <ProductGrid 
                products={filteredProducts} 
                compact={viewMode === 'grid'} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Video Navigation Indicator */}
      {viewMode === 'video' && filteredProducts.length > 0 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col gap-2">
            {filteredProducts.slice(Math.max(0, currentVideoIndex - 2), currentVideoIndex + 3).map((_, relativeIndex) => {
              const actualIndex = Math.max(0, currentVideoIndex - 2) + relativeIndex;
              return (
                <button
                  key={actualIndex}
                  onClick={() => navigateToVideo(actualIndex)}
                  disabled={isTransitioning}
                  className={`w-1 h-8 rounded-full transition-all duration-300 ${
                    actualIndex === currentVideoIndex ? 'bg-magical-gold' : 'bg-magical-starlight/30'
                  } ${isTransitioning ? 'opacity-50' : ''}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Explorar;
