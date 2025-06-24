import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, Play, Sparkles, Grid2X2, LayoutList, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ProductCard } from '@/components/ProductCard';
import { ProductGrid } from '@/components/ProductGrid';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LazyImage } from '@/components/LazyImage';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl animate-magical-glow backdrop-blur-sm border border-magical-gold/30"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-24 bg-magical-gold/20 rounded-2xl animate-magical-glow backdrop-blur-sm border border-magical-gold/30"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
      <Header onSearch={() => {}} onPriceFilter={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-magical-starlight hover:bg-magical-gold/20 rounded-xl transition-all duration-300 hover:scale-105 border border-magical-gold/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-magical-starlight animate-slide-in-left font-magical">
              <Wand2 className="inline w-6 h-6 mr-2 text-magical-gold animate-sparkle" />
              Artefatos Recém-Descobertos
            </h1>
            <p className="text-magical-starlight/80 animate-slide-in-right font-enchanted">
              Os {products.length} artefatos mágicos mais novos da nossa coleção
            </p>
          </div>
          
          {/* View Mode Toggle */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2 bg-magical-gold/20 border-magical-gold/30 hover:bg-magical-gold/30 text-magical-starlight"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2 bg-magical-gold/20 border-magical-gold/30 hover:bg-magical-gold/30 text-magical-starlight"
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-levitate border border-magical-gold/30">
              <Sparkles className="w-16 h-16 text-magical-gold/50" />
            </div>
            <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
              Nenhum artefato novo descoberto ainda
            </h2>
            <p className="text-magical-starlight/80 mb-6 font-enchanted">
              Novos artefatos mágicos serão revelados aqui em breve
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold transition-all duration-300 hover:scale-105 font-enchanted"
            >
              Explorar Artefatos
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile/Tablet View com toggle */}
            {isMobile ? (
              <ProductGrid 
                products={products} 
                compact={viewMode === 'grid'}
              />
            ) : (
              /* Desktop View - Lista melhorada */
              <div className="space-y-2 sm:space-y-3">
                {products.map((product, index) => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 shadow-lg group animate-fade-in cursor-pointer backdrop-blur-sm hover:shadow-magical-gold/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-64 h-64 md:h-48 flex-shrink-0">
                        <Carousel className="w-full h-full">
                          <CarouselContent>
                            {getProductImages(product).map((image, imgIndex) => (
                              <CarouselItem key={imgIndex}>
                                <div className="h-64 md:h-48 overflow-hidden">
                                  <LazyImage
                                    src={image}
                                    alt={`${product.produto} - ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-2 bg-magical-starlight/90 hover:bg-magical-starlight w-8 h-8 transition-all duration-300 hover:scale-110 border border-magical-gold/30" />
                          <CarouselNext className="right-2 bg-magical-starlight/90 hover:bg-magical-starlight w-8 h-8 transition-all duration-300 hover:scale-110 border border-magical-gold/30" />
                        </Carousel>
                        
                        {product.video && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-magical-crimson rounded-full p-2 animate-pulse shadow-lg border border-magical-gold/30">
                              <Play className="w-4 h-4 text-magical-starlight" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-gradient-to-r from-magical-emerald to-magical-gold text-magical-midnight font-bold text-xs animate-bounce shadow-lg border border-magical-gold/30">
                            NOVO
                          </Badge>
                        </div>

                        <div className="absolute bottom-2 left-2">
                          <FavoriteButton productId={product.id} size="sm" />
                        </div>
                      </div>

                      <CardContent className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-magical-starlight mb-2 line-clamp-2 text-lg hover:text-magical-gold transition-colors font-enchanted">
                                {product.produto}
                              </h3>
                              <div className="flex items-center gap-1 ml-4">
                                <Star className="w-4 h-4 text-magical-gold fill-current animate-sparkle" />
                                <span className="text-sm text-magical-starlight/80">4.8</span>
                              </div>
                            </div>
                            
                            {product.categoria && (
                              <Badge variant="secondary" className="mb-3 animate-fade-in bg-magical-gold/20 text-magical-starlight border border-magical-gold/30">
                                {product.categoria}
                              </Badge>
                            )}
                            
                            <div className="text-xl font-bold text-magical-gold mb-4 font-magical">
                              Menos de {formatPrice(product.valor)}
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
                              className="bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold hover:scale-105 transition-all duration-300 sm:w-auto w-full font-enchanted shadow-lg" 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(product.link, '_blank');
                              }}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Adquirir na Shopee
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          product={selectedProduct} 
        />
      )}
    </div>
  );
};

export default Novos;
