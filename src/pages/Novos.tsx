
import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Play, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { FavoriteButton } from '@/components/FavoriteButton';
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

const Novos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewestProducts();
  }, []);

  const fetchNewestProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id', { ascending: false }) // Produtos mais recentes primeiro
        .limit(50); // Limitamos a 50 produtos mais recentes

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos novos:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-24 bg-white/20 rounded-2xl animate-shimmer"></div>
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
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white animate-slide-in-left">
              ✨ Produtos Novos
            </h1>
            <p className="text-white/80 animate-slide-in-right">
              Os {products.length} produtos mais recentes da nossa loja
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
              <Sparkles className="w-16 h-16 text-white/50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Nenhum produto novo ainda
            </h2>
            <p className="text-white/80 mb-6">
              Novos produtos serão exibidos aqui em breve
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
            >
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-0 shadow-lg group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Imagem do produto */}
                  <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                    <Carousel className="w-full h-full">
                      <CarouselContent>
                        {getProductImages(product).map((image, imgIndex) => (
                          <CarouselItem key={imgIndex}>
                            <div className="h-48 overflow-hidden">
                              <img
                                src={image}
                                alt={`${product.produto} - ${imgIndex + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 bg-white/90 hover:bg-white w-6 h-6" />
                      <CarouselNext className="right-2 bg-white/90 hover:bg-white w-6 h-6" />
                    </Carousel>
                    
                    {product.video && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-red-500 rounded-full p-1 animate-pulse">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500 text-white font-bold text-xs animate-bounce">
                        NOVO
                      </Badge>
                    </div>
                  </div>

                  {/* Conteúdo do produto */}
                  <CardContent className="flex-1 p-4 md:p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg hover:text-red-600 transition-colors">
                            {product.produto}
                          </h3>
                          <div className="flex items-center gap-1 ml-4">
                            <Star className="w-4 h-4 text-yellow-400 fill-current animate-spin-slow" />
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                        </div>
                        
                        {product.categoria && (
                          <Badge variant="secondary" className="mb-3 animate-fade-in">
                            {product.categoria}
                          </Badge>
                        )}
                        
                        <div className="text-2xl font-bold text-red-500 mb-4 animate-pulse">
                          A partir de {formatPrice(product.valor)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex gap-2 flex-1">
                          <FavoriteButton productId={product.id} />
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
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold animate-pulse hover:animate-bounce transition-all duration-300 sm:w-auto w-full" 
                          onClick={() => window.open(product.link, '_blank')}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar na Shopee
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Novos;
