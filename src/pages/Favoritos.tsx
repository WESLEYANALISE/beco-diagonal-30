
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from "@/integrations/supabase/client";

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
}

const Favoritos = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .in('id', favorites);

      if (error) throw error;
      setFavoriteProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImages = (product: Product) => {
    return [
      product.imagem1,
      product.imagem2,
      product.imagem3,
      product.imagem4,
      product.imagem5
    ].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-white/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <Header />
      
      <section className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl backdrop-blur-sm">
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-white fill-current" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meus Favoritos
            </h1>
            <p className="text-lg text-white/80">
              {favoriteProducts.length > 0 
                ? `${favoriteProducts.length} produto${favoriteProducts.length > 1 ? 's' : ''} favoritado${favoriteProducts.length > 1 ? 's' : ''}`
                : 'Nenhum produto favoritado ainda'
              }
            </p>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Heart className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Nenhum produto favoritado
              </h2>
              <p className="text-white/80 mb-6">
                Explore nossos produtos e adicione seus favoritos aqui!
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
              >
                Explorar Produtos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {favoriteProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group">
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {getProductImages(product).map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={image} 
                                alt={`${product.produto} - ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-1 bg-white/90 hover:bg-white w-6 h-6" />
                      <CarouselNext className="right-1 bg-white/90 hover:bg-white w-6 h-6" />
                    </Carousel>
                    
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white font-bold text-xs">
                        FAVORITO
                      </Badge>
                    </div>

                    {product.categoria && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="text-xs bg-white/90">
                          {product.categoria}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-3">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                      {product.produto}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-base md:text-lg font-bold text-red-500">
                        {product.valor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <FavoriteButton productId={product.id} />
                      {product.video && (
                        <ProductVideoModal videoUrl={product.video} productName={product.produto} />
                      )}
                      <ProductPhotosModal images={getProductImages(product)} productName={product.produto} />
                      <Button 
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs"
                        onClick={() => window.open(product.link, '_blank')}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Comprar na Shopee
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favoritos;
