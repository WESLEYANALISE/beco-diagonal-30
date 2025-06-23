import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Play, Sparkles, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LazyImage } from '@/components/LazyImage';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import FooterNavigation from '@/components/FooterNavigation';

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewestProducts();
  }, []);

  const fetchNewestProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id', { ascending: false })
        .limit(50);

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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <Header />
      
      <section className="px-4 md:px-6 py-8 md:py-16 pb-20">
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white animate-slide-in-left">
              ✨ Produtos Novos
            </h1>
            <p className="text-white/80 animate-slide-in-right">
              Os {products.length} produtos mais recentes da nossa loja
            </p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2 bg-white/20 border-white/30 hover:bg-white/30 text-white"
            >
              <Grid className="w-4 h-4" />
            </Button>
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
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" : 
            "space-y-2 sm:space-y-3"
          }>
            {products.map((product, index) => (
              viewMode === 'grid' ? (
                // Grid View
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => handleProductClick(product)}>
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <LazyImage 
                        src={product.imagem1} 
                        alt={product.produto} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-2 right-2">
                        <FavoriteButton productId={product.id} size="sm" />
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white font-bold text-xs animate-bounce">
                          NOVO
                        </Badge>
                      </div>
                      {product.video && (
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-red-500 rounded-full p-1 animate-pulse">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-2">
                        {product.produto}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-red-500 text-sm">
                          {formatPrice(product.valor)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <ProductPhotosModal 
                          images={getProductImages(product)} 
                          productName={product.produto} 
                          productPrice={formatPrice(product.valor)} 
                          productLink={product.link}
                          videoUrl={product.video}
                        />
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs" 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(product.link, '_blank');
                          }}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // List View
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white border-0 shadow-lg group animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                      <Carousel className="w-full h-full">
                        <CarouselContent>
                          {getProductImages(product).map((image, imgIndex) => (
                            <CarouselItem key={imgIndex}>
                              <div className="h-48 overflow-hidden">
                                <LazyImage
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
                          
                          <div className="text-xl font-bold text-red-500 mb-4">
                            A partir de {formatPrice(product.valor)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex gap-2 flex-1">
                            <FavoriteButton productId={product.id} />
                            <ProductPhotosModal 
                              images={getProductImages(product)} 
                              productName={product.produto} 
                              productPrice={formatPrice(product.valor)} 
                              productLink={product.link}
                              videoUrl={product.video}
                            />
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold hover:scale-105 transition-all duration-300 sm:w-auto w-full" 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(product.link, '_blank');
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Comprar na Shopee
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal with Tips */}
      {selectedProduct && (
        <ProductDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          product={selectedProduct} 
        />
      )}
      
      <FooterNavigation />
    </div>
  );
};

export default Novos;
