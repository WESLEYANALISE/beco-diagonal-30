
import { useState, useEffect } from 'react';
import { ArrowRight, Play, ShoppingCart, Star, TrendingUp, Gift, Zap, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
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

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products, showAll]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id');

      if (error) throw error;

      setProducts(data || []);
      // Pega os primeiros 8 produtos como destaques (mais vendidos)
      setFeaturedProducts((data || []).slice(0, 8));
      
      // Extrai categorias únicas
      const uniqueCategories = [...new Set((data || []).map(product => product.categoria).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    if (selectedCategory !== 'todas') {
      filtered = products.filter(product => product.categoria === selectedCategory);
    }
    
    // Mostra apenas 12 produtos inicialmente, ou todos se showAll for true
    setDisplayedProducts(showAll ? filtered : filtered.slice(0, 12));
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
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
      
      {/* Hero Section */}
      <section className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8 mb-12">
            <div className="animate-fade-in-scale">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl backdrop-blur-sm">
                <Gift className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Achadinhos <span className="text-yellow-300">Shopee</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Os melhores produtos com os menores preços! Descubra ofertas incríveis e promoções imperdíveis.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {products.length}+
                </div>
                <div className="text-sm text-white/80">Produtos</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-yellow-300" />
                  4.8
                </div>
                <div className="text-sm text-white/80">Avaliação</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-300" />
                  70%
                </div>
                <div className="text-sm text-white/80">Desconto</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Sold Products Carousel */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🔥 Mais Vendidos
            </h2>
            <p className="text-lg text-white/80">
              Os produtos favoritos dos nossos clientes
            </p>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="p-3">
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group">
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
                          <CarouselPrevious className="left-2 bg-white/90 hover:bg-white" />
                          <CarouselNext className="right-2 bg-white/90 hover:bg-white" />
                        </Carousel>
                        
                        {product.video && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-red-500 rounded-full p-2">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white font-bold">
                            MAIS VENDIDO
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {product.produto}
                        </h3>
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl font-bold text-red-500">
                            {product.valor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => window.open(product.link, '_blank')}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar na Shopee
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-orange-200" />
            <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-orange-200" />
          </Carousel>
        </div>
      </section>

      {/* Category Filter and Products Grid */}
      <section className="px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Todos os Produtos
            </h2>
            <p className="text-lg text-white/80 mb-6">
              Explore nossa coleção completa por categoria
            </p>
            
            {/* Category Filter */}
            <div className="max-w-md mx-auto mb-8">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedProducts.map((product) => (
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
                    <CarouselPrevious className="left-2 bg-white/90 hover:bg-white" />
                    <CarouselNext className="right-2 bg-white/90 hover:bg-white" />
                  </Carousel>
                  
                  {product.video && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-red-500 rounded-full p-2">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 text-white font-bold text-xs">
                      PROMO
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

                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {product.produto}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-red-500">
                      {product.valor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs"
                    onClick={() => window.open(product.link, '_blank')}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Comprar na Shopee
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ver Mais Button */}
          {!showAll && (selectedCategory === 'todas' ? products.length > 12 : products.filter(p => p.categoria === selectedCategory).length > 12) && (
            <div className="text-center">
              <Button 
                onClick={() => setShowAll(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-8 py-3"
                variant="outline"
              >
                Ver Mais Produtos
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto animate-bounce-gentle">
              <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Não Perca Nenhuma Oferta!
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Descubra os melhores produtos com preços incríveis na Shopee
            </p>
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-gray-100 py-5 px-10 font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Ver Todos os Produtos
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
