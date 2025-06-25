
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagicalParticles } from '@/components/MagicalParticles';
import Header from '@/components/Header';
import VideoFeed from '@/components/VideoFeed';
import { CategoryCarouselExplorar } from '@/components/CategoryCarouselExplorar';
import { supabase } from "@/integrations/supabase/client";

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
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState(categoryFromUrl || 'todos');
  const [currentVideos, setCurrentVideos] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const handleProductBuy = useCallback((product: Product) => {
    if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

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
    setCurrentIndex(prevIndex => (prevIndex + 1) % currentVideos.length);
  }, [currentVideos.length]);

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <MagicalParticles />
      
      <div className="max-w-md mx-auto relative z-10">
        <Header />
        
        <main className="pt-4">
          {/* Category Carousel */}
          <div className="px-4 mb-4">
            <CategoryCarouselExplorar 
              categories={categories}
              currentCategory={currentCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          {/* Video Feed */}
          <div className="h-[calc(100vh-200px)] overflow-hidden relative">
            {currentVideos.map((product, index) => (
              <div
                key={product.id}
                className={`absolute inset-0 transition-transform duration-500 ${
                  index === currentIndex ? 'translate-y-0' : 
                  index < currentIndex ? '-translate-y-full' : 'translate-y-full'
                }`}
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
          
          {/* Navigation dots */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
            {currentVideos.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-magical-gold' : 'bg-magical-starlight/50 hover:bg-magical-starlight/80'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Explorar;
