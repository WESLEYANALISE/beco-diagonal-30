import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, SortAsc, DollarSign, Sparkles, Wand2, Crown, Shirt, Smartphone } from 'lucide-react';
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
import { OptimizedProductCard } from '@/components/OptimizedProductCard';
import { VirtualizedGrid } from '@/components/VirtualizedGrid';
import { MagicalParticles } from '@/components/MagicalParticles';
import { VideoCarouselHome } from '@/components/VideoCarouselHome';
import { useProductClicks } from '@/hooks/useProductClicks';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
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
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
  uso?: string;
  descricao?: string;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToHistory } = useNavigationHistory();
  const { debounce, throttle } = usePerformanceOptimization();
  const categoryFromUrl = searchParams.get('categoria');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [videoProducts, setVideoProducts] = useState<Product[]>([]);
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
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  // Memoized functions for better performance
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    if (!Array.isArray(array)) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const parsePrice = useCallback((priceString: string): number => {
    if (!priceString) return 0;
    const cleanPrice = priceString.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  }, []);

  // Optimized data fetching with all required fields
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, link, categoria, subcategoria, uso, descricao')
        .order('id')
        .limit(60); // Reduced initial load

      if (error) throw error;
      if (!data || !Array.isArray(data)) {
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      const validProducts = data.filter(product => 
        product?.produto && product?.valor && product?.categoria
      );
      
      const processedProducts = shuffleArray(validProducts);
      setProducts(processedProducts);
      setFilteredProducts(processedProducts);
      
      const initialFeatured = processedProducts.slice(0, 6); // Reduced featured items
      setFeaturedProducts(initialFeatured);

      const withVideos = processedProducts.filter(product => product.video).slice(0, 6);
      setVideoProducts(withVideos);
      
      const uniqueCategories = [...new Set(validProducts.map(product => product.categoria).filter(cat => cat?.trim()))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao buscar artefatos mágicos:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [shuffleArray]);

  // Optimized filtering with debouncing
  const debouncedFilterProducts = useCallback(
    debounce('filterProducts', () => {
      if (!Array.isArray(filteredProducts)) {
        setDisplayedProducts([]);
        return;
      }
      
      let filtered = [...filteredProducts];
      
      if (selectedCategory && selectedCategory !== 'todas') {
        filtered = filtered.filter(product => product?.categoria === selectedCategory);
      }
      
      if (searchTerm?.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(product => 
          product?.produto?.toLowerCase().includes(searchLower)
        );
      }

      // Apply price filter
      filtered = filtered.filter(product => {
        const price = parsePrice(product.valor || '');
        return price >= priceFilter.min && price <= priceFilter.max;
      });

      // Apply sorting
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        if (sortBy === 'nome') {
          const comparison = (a.produto || '').localeCompare(b.produto || '');
          return sortOrder === 'asc' ? comparison : -comparison;
        } else {
          const priceA = parsePrice(a.valor || '');
          const priceB = parsePrice(b.valor || '');
          const comparison = priceA - priceB;
          return sortOrder === 'asc' ? comparison : -comparison;
        }
      });
      
      setDisplayedProducts(filtered.slice(0, 18)); // Reduced displayed items
    }, 150),
    [filteredProducts, selectedCategory, searchTerm, sortBy, sortOrder, parsePrice, priceFilter]
  );

  useEffect(() => {
    fetchProducts();
    addToHistory('/', 'Página Inicial');
  }, [fetchProducts, addToHistory]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    debouncedFilterProducts();
  }, [debouncedFilterProducts]);

  // Memoized components and handlers
  const { trackProductClick } = useProductClicks();
  
  const handleProductClick = useCallback(
    throttle('productClick', async (productId: number) => {
      if (!productId) return;
      try {
        trackProductClick(productId, 'product_view').catch(console.error);
        const productElement = document.getElementById(`product-${productId}`);
        if (productElement) {
          productElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          setSearchTerm('');
        }
      } catch (error) {
        console.error('Error handling product click:', error);
      }
    }, 100),
    [trackProductClick]
  );

  const handleTabChange = useCallback((tab: 'featured' | 'ai') => {
    setShowingAI(tab === 'ai');
  }, []);

  const handleProductToggle = useCallback((product: Product) => {
    if (!product) return;
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 5) return prev;
        return [...prev, product];
      }
    });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (selectedProducts.length > 0) {
      setShowAnalysisModal(true);
    }
  }, [selectedProducts.length]);

  const analyzeProducts = async (products: Product[]): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-products', {
        body: { products, userPreferences: questionnaireAnswers }
      });
      if (error) throw new Error(error.message || 'Erro ao analisar produtos');
      return data?.analysis || 'Análise não disponível';
    } catch (error) {
      console.error('Error in analyzeProducts:', error);
      throw error;
    }
  };

  const getCategoryIcon = useCallback((category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Itens Colecionáveis': Crown,
      'Bonecas e Brinquedos de Pelúcia': Sparkles,
      'Luminária': Wand2,
      'Colares': Crown,
      'Moletons e Suéteres': Shirt,
      'Capinhas': Smartphone,
      'Canecas': ShoppingCart
    };
    return iconMap[category] || ShoppingCart;
  }, []);

  const getCategoryProducts = useCallback((category: string, limit: number = 6) => {
    if (!category || !Array.isArray(filteredProducts)) return [];
    const categoryProducts = filteredProducts.filter(p => p?.categoria === category);
    return shuffleArray(categoryProducts).slice(0, limit);
  }, [filteredProducts, shuffleArray]);

  const handleExplorarColecaoClick = useCallback(async (category: string) => {
    addToHistory(window.location.pathname, document.title);
    try {
      const { data } = await supabase
        .from('HARRY POTTER')
        .select('subcategoria')
        .eq('categoria', category)
        .not('subcategoria', 'is', null)
        .not('subcategoria', 'eq', '');
        
      if (data && data.length > 0) {
        navigate(`/categoria/${encodeURIComponent(category)}`);
      } else {
        navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`);
      }
    } catch (error) {
      console.error('Error checking subcategories:', error);
      navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`);
    }
  }, [navigate, addToHistory]);

  const handlePriceFilter = useCallback((minPrice: number, maxPrice: number) => {
    setPriceFilter({ min: minPrice, max: maxPrice });
  }, []);

  // Memoized category carousel
  const memoizedCategoryCarousel = useMemo(() => 
    Array.isArray(filteredProducts) && filteredProducts.length > 0 && (
      <CategoryCarousel 
        products={filteredProducts.slice(0, 12)} 
        onProductClick={handleProductClick} 
      />
    ), [filteredProducts, handleProductClick]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
        <MagicalParticles />
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30"></div>
            <VirtualizedGrid products={[]} compact={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20 relative overflow-hidden">
      <MagicalParticles />
      
      <Header onSearch={setSearchTerm} onPriceFilter={handlePriceFilter} />
      
      {searchTerm && Array.isArray(filteredProducts) && (
        <SearchPreview 
          searchTerm={searchTerm} 
          products={filteredProducts.filter(p => 
            p?.produto?.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5)} 
          onProductClick={handleProductClick} 
        />
      )}

      {memoizedCategoryCarousel}
      
      <section className="px-4 py-4 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleExplorarColecaoClick('todas')} 
              className="whitespace-nowrap bg-magical-gold/30 text-magical-starlight border-magical-gold/50 hover:bg-magical-gold/40 flex items-center gap-2 font-enchanted"
            >
              <Wand2 className="w-4 h-4" />
              Todos os Artefatos
            </Button>
            {Array.isArray(categories) && categories.map(category => {
              const IconComponent = getCategoryIcon(category);
              return (
                <Button 
                  key={category} 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleExplorarColecaoClick(category)} 
                  className="whitespace-nowrap bg-magical-gold/20 text-magical-starlight border-magical-gold/40 hover:bg-magical-gold/30 flex items-center gap-2 font-enchanted"
                >
                  <IconComponent className="w-4 h-4" />
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <HeroSection productsCount={filteredProducts.length} />

      {videoProducts.length > 0 && <VideoCarouselHome products={videoProducts} />}

      {!showingAI && Array.isArray(categories) && categories.map((category, index) => {
        const categoryProducts = getCategoryProducts(category);
        const IconComponent = getCategoryIcon(category);
        
        if (categoryProducts.length === 0) return null;
        
        return (
          <section 
            key={category} 
            style={{ animationDelay: `${index * 0.1}s` }} 
            className="md:px-6 py-4 animate-fade-in px-[6px]"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-magical-gold/40 to-magical-bronze/40 rounded-xl flex items-center justify-center backdrop-blur-sm border border-magical-gold/30">
                    <IconComponent className="w-4 h-4 text-magical-gold" />
                  </div>
                  <h3 className="text-base font-bold text-magical-starlight font-magical">{category}</h3>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleExplorarColecaoClick(category)} 
                  className="bg-magical-gold/30 text-magical-starlight border-magical-gold/40 hover:bg-magical-gold/40 text-xs px-3 py-1 h-auto font-enchanted"
                >
                  Explorar
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-3">
                  {categoryProducts.map(product => (
                    <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                      <OptimizedProductCard product={product} compact={true} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 w-6 h-6" />
                <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 w-6 h-6" />
              </Carousel>
            </div>
          </section>
        );
      })}

      <section className="px-4 md:px-6 py-8 md:py-12 bg-gradient-to-r from-magical-mysticalPurple/30 via-magical-deepPurple/30 to-magical-mysticalPurple/30 backdrop-blur-sm animate-fade-in border-y border-magical-gold/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <TabNavigation showingAI={showingAI} onTabChange={handleTabChange} />
            
            {showingAI ? (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 font-magical">
                  🔮 Oráculo das Relíquias
                </h2>
                <p className="text-magical-starlight/90 font-enchanted">
                  Selecione até 5 artefatos e descubra qual possui o poder mais adequado para você
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 font-magical">
                  ⚡ Relíquias Lendárias
                </h2>
                <p className="text-magical-starlight/80 font-enchanted">
                  Os artefatos favoritos dos bruxos mais poderosos
                </p>
              </div>
            )}
          </div>

          {showingAI ? (
            <>
              <div className="max-w-md mx-auto mb-6">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-magical-starlight/90 border-magical-gold/40 text-magical-midnight font-enchanted">
                    <SelectValue placeholder="Selecione uma Casa" />
                  </SelectTrigger>
                  <SelectContent className="bg-magical-starlight border-magical-gold/30 z-50">
                    <SelectItem value="todas">Todas as Casas</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <ProductSelector 
                products={displayedProducts.slice(0, 12)} 
                selectedProducts={selectedProducts} 
                onProductToggle={handleProductToggle} 
                onAnalyze={handleAnalyze} 
                onQuestionnaireChange={setQuestionnaireAnswers} 
              />
            </>
          ) : (
            <Carousel className="w-full mb-6">
              <CarouselContent className="-ml-2 md:-ml-3">
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <ProductCard product={product} showBadge={true} badgeText="RELÍQUIA" compact={false} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30" />
              <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30" />
            </Carousel>
          )}
        </div>
      </section>

      {!showingAI && (
        <section className="px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight font-magical">
                🏰 Explorar Relíquias
              </h2>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                  <SelectTrigger className="bg-magical-starlight text-magical-midnight border-0 w-32 font-enchanted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-magical-starlight border-magical-gold/30 z-50">
                    <SelectItem value="nome">
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4" />
                        Nome
                      </div>
                    </SelectItem>
                    <SelectItem value="preco">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Valor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
                  className="bg-magical-starlight text-magical-midnight border-0 hover:bg-magical-silver/20"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>

            <div className="max-w-md mx-auto mb-6">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-magical-starlight/90 border-magical-gold/40 text-magical-midnight font-enchanted">
                  <SelectValue placeholder="Selecione uma Casa" />
                </SelectTrigger>
                <SelectContent className="bg-magical-starlight border-magical-gold/30 z-50">
                  <SelectItem value="todas">Todas as Casas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <VirtualizedGrid 
              products={displayedProducts} 
              compact={true}
              itemsPerPage={18}
            />

            {displayedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-magical-gold/30">
                  <Wand2 className="w-16 h-16 text-magical-gold/50" />
                </div>
                <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
                  Nenhuma relíquia encontrada
                </h2>
                <p className="text-magical-starlight/80 mb-6 font-enchanted">
                  {searchTerm ? `Não encontramos relíquias para "${searchTerm}"` : 'Não há relíquias nesta Casa'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')} 
                    className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold font-enchanted"
                  >
                    Ver Todas as Relíquias
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

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
