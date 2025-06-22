import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, SortAsc, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { SearchPreview } from '@/components/SearchPreview';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { ProductSelector } from '@/components/ProductSelector';
import { AIAnalysisModal } from '@/components/AIAnalysisModal';
import { HeroSection } from '@/components/HeroSection';
import { TabNavigation } from '@/components/TabNavigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductGrid } from '@/components/ProductGrid';
import { useToastNotifications } from '@/hooks/useToastNotifications';
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
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || 'todas');
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showingAI, setShowingAI] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string>>({});
  const { showSuccess, showError, showLoading, showInfo } = useToastNotifications();
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
  }, [selectedCategory, products, searchTerm, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      showLoading("Carregando produtos");
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id');

      if (error) throw error;
      
      setProducts(data || []);
      setFeaturedProducts((data || []).slice(0, 8));

      const uniqueCategories = [...new Set((data || []).map(product => product.categoria).filter(Boolean))];
      setCategories(uniqueCategories);
      
      showSuccess("Produtos carregados com sucesso!");
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError("Erro ao carregar produtos", "Tente novamente em alguns instantes");
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

    setDisplayedProducts(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePriceFilter = (min: number, max: number) => {
    console.log('Price filter:', min, max);
    showInfo("Filtro de preço aplicado", `R$ ${min} - R$ ${max}`);
  };

  const handleProductClick = (productId: number) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSearchTerm(''); // Clear search to hide preview
    }
  };

  const handleTabChange = (tab: 'featured' | 'ai') => {
    setShowingAI(tab === 'ai');
  };

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        showInfo("Produto removido da seleção");
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 5) {
          showError("Limite atingido", "Você pode selecionar no máximo 5 produtos");
          return prev;
        }
        showSuccess("Produto adicionado à seleção");
        return [...prev, product];
      }
    });
  };

  const handleAnalyze = () => {
    if (selectedProducts.length > 0) {
      setShowAnalysisModal(true);
      showLoading("Preparando análise da IA");
    } else {
      showError("Nenhum produto selecionado", "Selecione pelo menos um produto para análise");
    }
  };

  const analyzeProducts = async (products: Product[]): Promise<string> => {
    try {
      showLoading("Analisando produtos com IA");
      const { data, error } = await supabase.functions.invoke('analyze-products', {
        body: { 
          products,
          userPreferences: questionnaireAnswers
        }
      });

      if (error) {
        console.error('Error calling analyze-products function:', error);
        throw new Error(error.message || 'Erro ao analisar produtos');
      }

      showSuccess("Análise concluída!");
      return data.analysis || 'Análise não disponível';
    } catch (error) {
      console.error('Error in analyzeProducts:', error);
      showError("Erro na análise", "Não foi possível analisar os produtos");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 pb-20">
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl animate-shimmer"></div>
            <ProductGrid loading={true} products={[]} />
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

      {/* Novidades Carousel */}
      <CategoryCarousel 
        products={products}
        onProductClick={handleProductClick}
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
      <HeroSection productsCount={products.length} />

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
                    <ProductCard 
                      product={product} 
                      showBadge={true}
                      badgeText="MAIS VENDIDO"
                      compact={false}
                    />
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

              <ProductGrid 
                products={displayedProducts.slice(5)} 
                compact={true}
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Products Carousel with Toggle */}
          <section className="px-4 md:px-6 py-8 md:py-12 bg-white/10 backdrop-blur-sm animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <TabNavigation 
                  showingAI={showingAI}
                  onTabChange={handleTabChange}
                />
                
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
                      🔥 Mais Vendidos
                    </h2>
                    <p className="text-base text-white/80 animate-slide-in-right">
                      Os produtos favoritos dos nossos clientes
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
                    onQuestionnaireChange={setQuestionnaireAnswers}
                  />
                </>
              ) : (
                <Carousel className="w-full animate-scale-in">
                  <CarouselContent className="-ml-2 md:-ml-3">
                    {featuredProducts.map((product, index) => (
                      <CarouselItem 
                        key={product.id} 
                        className="pl-2 md:pl-3 basis-3/4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ProductCard 
                          product={product} 
                          showBadge={true}
                          badgeText="MAIS VENDIDO"
                          compact={false}
                        />
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

                <ProductGrid products={displayedProducts} compact={true} />

                {displayedProducts.length === 0 && (
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
