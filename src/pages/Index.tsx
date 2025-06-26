
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagicalParticles } from '@/components/MagicalParticles';
import { HeroSection } from '@/components/HeroSection';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { VideoCarouselHome } from '@/components/VideoCarouselHome';
import Header from '@/components/Header';
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

const Index = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const playBackgroundMusic = () => {
    const audio = new Audio('https://www.dropbox.com/scl/fi/oco24n4cbrgjyekyr9nld/Sem-t-tulo-junho-24-2025.mp3?rlkey=u3urdej3xq7q3nbs1u0yspqwa&st=vkxi6gyd&dl=1');
    audio.volume = 0.15;
    audio.loop = false;
    audio.play().catch(console.error);
  };

  const handleExploreCollection = (categoria: string) => {
    playBackgroundMusic();
    navigate(`/categoria/${encodeURIComponent(categoria)}`);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('id, produto, valor, video, imagem1, link, categoria')
        .not('video', 'is', null)
        .not('video', 'eq', '')
        .limit(12);

      if (error) {
        console.error('Error fetching featured products:', error);
        return;
      }

      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <MagicalParticles />
      
      <div className="max-w-md mx-auto relative z-10">
        <Header />
        
        <main>
          <HeroSection onExploreCollection={handleExploreCollection} />
          <CategoryCarousel onExploreCollection={handleExploreCollection} />
          <VideoCarouselHome products={featuredProducts} />
        </main>
      </div>
    </div>
  );
};

export default Index;
