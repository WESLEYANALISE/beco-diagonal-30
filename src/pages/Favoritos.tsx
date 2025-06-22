import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Play, Star, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from "@/integrations/supabase/client";
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
  link: string;
  categoria: string;
}

const Favoritos = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .in('id', favorites);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImages = (product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const handleRemoveFavorite = (productId: number) => {
    removeFavorite(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-white/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Meus Favoritos
            </h1>
            <p className="text-white/80">
              {products.length} {products.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Heart className="w-16 h-16 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum favorito ainda
            </h2>
            <p className="text-white/80 mb-6">
              Adicione produtos aos seus favoritos para vê-los aqui
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
            >
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group">
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
                    <CarouselPrevious className="left-1 bg-white/90 hover:bg-white w-5 h-5" />
                    <CarouselNext className="right-1 bg-white/90 hover:bg-white w-5 h-5" />
                  </Carousel>
                  
                  {product.video && (
                    <div className="absolute top-1 right-1">
                      <div className="bg-red-500 rounded-full p-1">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-1 left-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFavorite(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 h-auto rounded-full"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-2">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-xs leading-tight">
                    {product.produto}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-lg font-bold text-red-500">
                      A partir de {formatPrice(product.valor)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {product.video && (
                      <ProductVideoModal 
                        videoUrl={product.video} 
                        productName={product.produto}
                        productPrice={formatPrice(product.valor)}
                        productLink={product.link}
                      />
                    )}
                    <ProductPhotosModal 
                      images={getProductImages(product)} 
                      productName={product.produto}
                      productPrice={formatPrice(product.valor)}
                      productLink={product.link}
                    />
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs py-1 animate-pulse"
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Comprar Agora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
