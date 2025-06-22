import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Play, ShoppingCart, Star, TrendingUp, Gift, Zap, ChevronDown, SortAsc, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { SearchPreview } from '@/components/SearchPreview';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { ProductSelector } from '@/components/ProductSelector';
import { AIAnalysisModal } from '@/components/AIAnalysisModal';
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

const Index = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'todas');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showingNewest, setShowingNewest] = useState(false);
  const [showingAI, setShowingAI] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products, showAll, searchTerm, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id');

      if (error) throw error;
      setProducts(data || []);
      setFeaturedProducts((data || []).slice(0, 8));
      setNewestProducts((data || []).slice(-8).reverse());

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
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(product => 
        product.produto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'nome') {
        const comparison = a.produto.localeCompare(b.produto);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = parseFloat(a.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const priceB = parseFloat(b.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const comparison = priceA - priceB;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    setDisplayedProducts(showAll ? filtered : filtered.slice(0, 20));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setShowAll(false);
  };

  const handlePriceFilter = (min: number, max: number) => {
    console.log('Price filter:', min, max);
  };

  const handleProductClick = (productId: number) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSearchTerm(''); // Clear search to hide preview
    }
  };

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 5) {
          return prev; // Don't add if already 5 selected
        }
        return [...prev, product];
      }
    });
  };

  const handleAnalyze = () => {
    if (selectedProducts.length > 0) {
      setShowAnalysisModal(true);
    }
  };

  const analyzeProducts = async (products: Product[]): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-products', {
        body: { products }
      });

      if (error) {
        console.error('Error calling analyze-products function:', error);
        throw new Error(error.message || 'Erro ao analisar produtos');
      }

      return data.analysis || 'Análise não disponível';
    } catch (error) {
      console.error('Error in analyzeProducts:', error);
      throw error;
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
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                <div key={i} className="h-64 bg-white/20 rounded-2xl animate-shimmer"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      {/* Search Preview */}
      {searchTerm && (
        <SearchPreview 
          searchTerm={searchTerm} 
          products={products.filter(p => 
            p.produto.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)} 
          onProductClick={handleProductClick}
        />
      )}

      {/* Category Carousel */}
      <CategoryCarousel 
        categories={categories}
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      
      {/* Category Quick Access Buttons */}
      <section className="px-4 py-2 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              size="sm"
              variant={selectedCategory === 'todas' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('todas')}
              className={`whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                selectedCategory === 'todas' 
                  ? 'bg-white text-red-600 hover:bg-gray-100 shadow-lg' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              Todas
            </Button>
            {categories.slice(0, 8).map(category => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category 
                    ? 'bg-white text-red-600 hover:bg-gray-100 shadow-lg' 
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="px-4 md:px-6 py-6 md:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-8">
            <div className="animate-fade-in-scale">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-2xl backdrop-blur-sm">
                <Gift className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight animate-slide-in-left">
                Achadinhos <span className="text-yellow-300 animate-pulse">Shopee</span>
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
                Os melhores produtos com os menores preços! Descubra ofertas incríveis e promoções imperdíveis.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto animate-scale-in">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4 animate-pulse" />
                  {products.length}+
                </div>
                <div className="text-xs text-white/80">Produtos</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                  4.8
                </div>
                <div className="text-xs text-white/80">Avaliação</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
                  70%
                </div>
                <div className="text-xs text-white/80">Desconto</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditional rendering based on category selection */}
      {selectedCategory !== 'todas' ? (
        // Category-specific layout with carousel + grid
        <section className="px-4 md:px-6 py-8 md:py-12 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                🔥 {selectedCategory} - Mais Vendidos
              </h2>
              <p className="text-base text-white/80 animate-slide-in-right">
                Os 5 produtos mais populares desta categoria
              </p>
            </div>

            {/* Carousel for exactly 5 products */}
            <Carousel className="w-full mb-12 animate-scale-in">
              <CarouselContent className="-ml-2 md:-ml-3">
                {displayedProducts.slice(0, 5).map(product => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-4/5 md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                    <Card id={`product-${product.id}`} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group animate-fade-in">
                      <div className="relative">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {getProductImages(product).map((image, index) => (
                              <CarouselItem key={index}>
                                <div className="aspect-square overflow-hidden">
                                  <img 
                                    src={image} 
                                    alt={`${product.produto} - ${index + 1}`} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-1 bg-white/90 hover:bg-white w-6 h-6" />
                          <CarouselNext className="right-1 bg-white/90 hover:bg-white w-6 h-6" />
                        </Carousel>
                        
                        {product.video && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-red-500 rounded-full p-1 animate-pulse">
                              <Play className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white font-bold text-xs animate-bounce">
                            MAIS VENDIDO
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-3">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm hover:text-red-600 transition-colors">
                          {product.produto}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-bold text-red-500">
                            Menos de {formatPrice(product.valor)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current animate-spin-slow" />
                            <span className="text-xs text-gray-600">4.8</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
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
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs hover:scale-105 transition-all duration-300" 
                            onClick={() => window.open(product.link, '_blank')}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Comprar na Shopee
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-orange-200" />
              <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-orange-200" />
            </Carousel>

            {/* "Todos" section with sorting */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 animate-slide-in-left">
                  Todos os Produtos - {selectedCategory}
                </h3>
                <div className="flex gap-2 animate-slide-in-right">
                  <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                    <SelectTrigger className="bg-white text-gray-900 border-0 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="nome">
                        <div className="flex items-center gap-2">
                          <SortAsc className="w-4 h-4" />
                          Nome
                        </div>
                      </SelectItem>
                      <SelectItem value="preco">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Preço
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="bg-white text-gray-900 border-0 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 mb-6">
                {displayedProducts.slice(5).map((product, index) => (
                  <Card 
                    key={product.id}
                    id={`product-${product.id}`}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {getProductImages(product).map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="aspect-square overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`${product.produto} - ${index + 1}`} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
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
                          <div className="bg-red-500 rounded-full p-1 animate-pulse">
                            <Play className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-2">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-xs leading-tight hover:text-red-600 transition-colors">
                        {product.produto}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-red-500">
                          Menos de {formatPrice(product.valor)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
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
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs py-1 hover:scale-105 transition-all duration-300" 
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
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Products Carousel with Toggle */}
          <section className="px-4 md:px-6 py-8 md:py-12 bg-white/10 backdrop-blur-sm animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    variant={!showingNewest && !showingAI ? 'default' : 'outline'}
                    onClick={() => {
                      setShowingNewest(false);
                      setShowingAI(false);
                    }}
                    className={`${!showingNewest && !showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
                  >
                    🔥 Mais Vendidos
                  </Button>
                  <Button
                    variant={showingNewest && !showingAI ? 'default' : 'outline'}
                    onClick={() => {
                      setShowingNewest(true);
                      setShowingAI(false);
                    }}
                    className={`${showingNewest && !showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
                  >
                    ✨ Novidades
                  </Button>
                  <Button
                    variant={showingAI ? 'default' : 'outline'}
                    onClick={() => {
                      setShowingAI(true);
                      setShowingNewest(false);
                    }}
                    className={`${showingAI ? 'bg-white text-red-600' : 'bg-white/20 text-white border-white/30'}`}
                  >
                    🤖 Me Ajuda Escolher
                  </Button>
                </div>
                
                {showingAI ? (
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                      🤖 Me Ajuda Escolher
                    </h2>
                    <div className="text-base text-white/90 animate-slide-in-right space-y-2">
                      <p><strong>Selecione até 5 produtos</strong> e nossa <strong>IA</strong> irá te ajudar a decidir qual é melhor</p>
                      <p className="text-sm">✨ <em>Análise personalizada baseada em suas necessidades</em></p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                      {showingNewest ? '✨ Novidades' : '🔥 Mais Vendidos'}
                    </h2>
                    <p className="text-base text-white/80 animate-slide-in-right">
                      {showingNewest ? 'Os produtos mais recentes da nossa loja' : 'Os produtos favoritos dos nossos clientes'}
                    </p>
                  </div>
                )}
              </div>

              {showingAI ? (
                <>
                  {/* Categories during AI mode */}
                  <div className="max-w-md mx-auto mb-6 animate-scale-in">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 z-50">
                        <SelectItem value="todas">Todas as Categorias</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <ProductSelector
                    products={displayedProducts}
                    selectedProducts={selectedProducts}
                    onProductToggle={handleProductToggle}
                    onAnalyze={handleAnalyze}
                  />
                </>
              ) : (
                <Carousel className="w-full animate-scale-in">
                  <CarouselContent className="-ml-2 md:-ml-3">
                    {(showingNewest ? newestProducts : featuredProducts).map((product, index) => (
                      <CarouselItem 
                        key={product.id} 
                        className="pl-2 md:pl-3 basis-3/4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Card id={`product-${product.id}`} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group">
                          <div className="relative">
                            <Carousel className="w-full">
                              <CarouselContent>
                                {getProductImages(product).map((image, index) => (
                                  <CarouselItem key={index}>
                                    <div className="aspect-square overflow-hidden">
                                      <img 
                                        src={image} 
                                        alt={`${product.produto} - ${index + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="left-1 bg-white/90 hover:bg-white w-6 h-6" />
                              <CarouselNext className="right-1 bg-white/90 hover:bg-white w-6 h-6" />
                            </Carousel>
                            
                            {product.video && (
                              <div className="absolute top-2 right-2">
                                <div className="bg-red-500 rounded-full p-1 animate-pulse">
                                  <Play className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}
                            
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-red-500 text-white font-bold text-xs animate-bounce">
                                {showingNewest ? 'NOVO' : 'MAIS VENDIDO'}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-3">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm hover:text-red-600 transition-colors">
                              {product.produto}
                            </h3>
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-bold text-red-500">
                                Menos de {formatPrice(product.valor)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current animate-spin-slow" />
                                <span className="text-xs text-gray-600">4.8</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
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
                              <Button 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs py-1 hover:scale-105 transition-all duration-300" 
                                onClick={() => window.open(product.link, '_blank')}
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Comprar na Shopee
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-orange-200" />
                  <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-orange-200" />
                </Carousel>
              )}
            </div>
          </section>

          {/* Category Filter and Products Grid - only show when not in AI mode */}
          {!showingAI && (
            <section className="px-4 md:px-6 py-8 md:py-12 animate-fade-in">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
                      Todos os Produtos
                    </h2>
                    <p className="text-base text-white/80 mb-4 animate-slide-in-right">
                      {searchTerm ? `Resultados para "${searchTerm}"` : 'Explore nossa coleção completa por categoria'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 animate-slide-in-right">
                    <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                      <SelectTrigger className="bg-white text-gray-900 border-0 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 z-50">
                        <SelectItem value="nome">
                          <div className="flex items-center gap-2">
                            <SortAsc className="w-4 h-4" />
                            Nome
                          </div>
                        </SelectItem>
                        <SelectItem value="preco">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Preço
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="bg-white text-gray-900 border-0 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="max-w-md mx-auto mb-6 animate-scale-in">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 z-50">
                      <SelectItem value="todas">Todas as Categorias</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {displayedProducts.length === 0 ? (
                  <div className="text-center py-16 animate-fade-in">
                    <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse">
                      <ShoppingCart className="w-16 h-16 text-white/50" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Nenhum produto encontrado
                    </h2>
                    <p className="text-white/80 mb-6">
                      {searchTerm ? `Não encontramos produtos para "${searchTerm}"` : 'Não há produtos nesta categoria'}
                    </p>
                    {searchTerm && (
                      <Button 
                        onClick={() => setSearchTerm('')} 
                        className="bg-white text-red-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Ver Todos os Produtos
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 mb-6">
                      {displayedProducts.map((product, index) => (
                        <Card 
                          key={product.id}
                          id={`product-${product.id}`}
                          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="relative">
                            <Carousel className="w-full">
                              <CarouselContent>
                                {getProductImages(product).map((image, index) => (
                                  <CarouselItem key={index}>
                                    <div className="aspect-square overflow-hidden">
                                      <img 
                                        src={image} 
                                        alt={`${product.produto} - ${index + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
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
                                <div className="bg-red-500 rounded-full p-1 animate-pulse">
                                  <Play className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}

                            {product.categoria && (
                              <div className="absolute bottom-1 left-1">
                                <Badge variant="secondary" className="text-xs bg-white/90 px-1 py-0">
                                  {product.categoria}
                                </Badge>
                              </div>
                            )}
                          </div>

                          <CardContent className="p-2">
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-xs leading-tight hover:text-red-600 transition-colors">
                              {product.produto}
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-xs font-bold text-red-500">
                                Menos de {formatPrice(product.valor)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">4.8</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
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
                              <Button 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs py-1 hover:scale-105 transition-all duration-300" 
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

                    {/* Ver Mais Button - removed as requested */}
                  </>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA Section - only show when not in AI mode */}
      {!showingAI && (
        <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white animate-slide-in-left">
                Não Perca Nenhuma Oferta!
              </h2>
              <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
                Descubra os melhores produtos com preços incríveis na Shopee
              </p>
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-gray-100 py-4 px-8 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Ver Todos os Produtos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        selectedProducts={selectedProducts}
        onAnalyze={analyzeProducts}
      />
    </div>
  );
};

export default Index;
