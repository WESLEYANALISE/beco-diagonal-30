
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Play, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useProductClicks } from '@/hooks/useProductClicks';
import { ProductDetailModal } from '@/components/ProductDetailModal';

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
  uso?: string;
}

interface VideoFeedProps {
  limit?: number;
}

const VideoFeedComponent: React.FC<VideoFeedProps> = ({ limit = 20 }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { trackProductClick } = useProductClicks();

  const fetchVideoProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .not('video', 'is', null)
        .not('video', 'eq', '')
        .order('id', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar vídeos de artefatos:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchVideoProducts();
  }, [fetchVideoProducts]);

  const handleWatchVideo = useCallback(async (product: Product) => {
    await trackProductClick(product.id, 'video_view');
    setSelectedProduct(product);
  }, [trackProductClick]);

  const handleBuyProduct = useCallback(async (product: Product) => {
    await trackProductClick(product.id, 'buy_click');
    window.open(product.link, '_blank');
  }, [trackProductClick]);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-magical-starlight/10 rounded-2xl animate-pulse h-64 backdrop-blur-sm border border-magical-gold/20" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-magical-gold/30">
          <Play className="w-16 h-16 text-magical-gold/50" />
        </div>
        <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
          Nenhum vídeo mágico encontrado
        </h2>
        <p className="text-magical-starlight/80 font-enchanted">
          Os vídeos dos artefatos mágicos aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="group relative bg-magical-starlight/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-magical-gold/20 hover:border-magical-gold/50 transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-magical-midnight/50 overflow-hidden">
              <img
                src={product.imagem1}
                alt={product.produto}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={() => handleWatchVideo(product)}
                  className="bg-magical-gold/90 hover:bg-magical-gold text-magical-midnight rounded-full p-4"
                  size="sm"
                >
                  <Play className="w-6 h-6 fill-current" />
                </Button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-magical-mysticalPurple/90 text-magical-starlight text-xs border border-magical-gold/30">
                  {product.categoria}
                </Badge>
              </div>

              {/* Magic Indicator */}
              <div className="absolute top-3 right-3">
                <div className="bg-magical-gold/20 rounded-full p-2 border border-magical-gold/30 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-magical-gold animate-sparkle" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-magical-starlight mb-2 line-clamp-2 text-sm leading-tight font-enchanted group-hover:text-magical-gold transition-colors duration-300">
                {product.produto}
              </h3>
              <p className="text-magical-gold font-bold text-lg mb-3 font-magical">
                Menos de {formatPrice(product.valor)}
              </p>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleWatchVideo(product)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-magical-gold/50 text-magical-gold hover:bg-magical-gold/10 font-enchanted"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Ver Magia
                </Button>
                <Button
                  onClick={() => handleBuyProduct(product)}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-enchanted"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Adquirir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export const VideoFeed = memo(VideoFeedComponent);
VideoFeed.displayName = 'VideoFeed';
