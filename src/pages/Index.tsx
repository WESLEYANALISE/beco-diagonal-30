
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Crown, Sparkles, Shirt, Smartphone, Wand2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { SearchPreview } from '@/components/SearchPreview';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { AIAnalysisModal } from '@/components/AIAnalysisModal';
import { HeroSection } from '@/components/HeroSection';
import { VideoCarouselHome } from '@/components/VideoCarouselHome';
import { MagicalParticles } from '@/components/MagicalParticles';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from "@/components/ui/button";
import { CategoryQuickAccess } from '@/components/home/CategoryQuickAccess';
import { CategoryProductCarousels } from '@/components/home/CategoryProductCarousels';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { ProductsExploreSection } from '@/components/home/ProductsExploreSection';
import { useProductClicks } from '@/hooks/useProductClicks';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/utils/logger';

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
  
  // Initialize background music for the entire app - no manual control
  useBackgroundMusic();
  
  const categoryFromUrl = searchParams.get('categoria');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentFeaturedCategory, setCurrentFeaturedCategory] = useState<string>('');
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
  const [priceFilter, setPriceFilter] = useState<{
    min: number;
    max: number;
  }>({
    min: 0,
    max: 1000
  });

  // Optimize shuffle function with memoization
  const shuffleArray = useCallback(<T,>(array: T[], shouldShuffle: boolean = true): T[] => {
    if (!Array.isArray(array) || !shouldShuffle) return array;
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Parse price from string to number
  const parsePrice = useCallback((priceString: string): number => {
    if (!priceString || typeof priceString !== 'string') return 0;
    const cleanPrice = priceString.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanPrice) || 0;
  }, []);

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
  }, [selectedCategory, filteredProducts, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    applyPriceFilter();
  }, [products, priceFilter]);

  // Auto-rotate featured products by category every 20 seconds
  useEffect(() => {
    if (categories.length > 0 && products.length > 0 && !categoryFromUrl) {
      const interval = setInterval(() => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        setCurrentFeaturedCategory(randomCategory);
        const categoryProducts = products.filter(p => p.categoria === randomCategory);
        const shuffledProducts = shuffleArray(categoryProducts, true);
        setFeaturedProducts(shuffledProducts.slice(0, 6));
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [categories, products, categoryFromUrl, shuffleArray]);

  const fetchProducts = async () => {
    try {
      logger.info('Fetching products from Supabase');
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, link, categoria, subcategoria, descricao, uso')
        .order('id');
      
      if (error) {
        logger.error('Supabase fetch error', { error });
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        logger.warn('No data received from Supabase');
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        return;
      }

      // Filter out null/undefined products and ensure required fields exist
      const validProducts = data.filter(product => 
        product && 
        product.produto && 
        product.valor && 
        product.categoria &&
        typeof product.produto === 'string' &&
        typeof product.valor === 'string' &&
        typeof product.categoria === 'string'
      );

      logger.info('Products processed', { 
        total: data.length, 
        valid: validProducts.length,
        filtered: data.length - validProducts.length
      });

      let processedProducts = shuffleArray(validProducts, true);
      setProducts(processedProducts);

      const initialFeatured = shuffleArray(processedProducts, true).slice(0, 6);
      setFeaturedProducts(initialFeatured);
      
      // Get all unique categories from HARRY POTTER table
      const uniqueCategories = [...new Set(validProducts
        .map(product => product.categoria)
        .filter(cat => cat && typeof cat === 'string' && cat.trim() !== '')
      )];
      
      logger.debug('Categories found', { categories: uniqueCategories });
      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setCurrentFeaturedCategory(uniqueCategories[0]);
      }
    } catch (error) {
      logger.error('Error fetching magical artifacts', { error });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyPriceFilter = useCallback(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    
    const filtered = products.filter(product => {
      if (!product || !product.valor) return false;
      const price = parsePrice(product.valor);
      return price >= priceFilter.min && price <= priceFilter.max;
    });
    setFilteredProducts(filtered);
  }, [products, priceFilter, parsePrice]);

  const filterProducts = useCallback(() => {
    if (!Array.isArray(filteredProducts)) {
      setDisplayedProducts([]);
      return;
    }

    let filtered = [...filteredProducts];
    
    if (selectedCategory && selectedCategory !== 'todas') {
      filtered = filtered.filter(product => 
        product && product.categoria === selectedCategory
      );
    }
    
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product && 
        product.produto && 
        typeof product.produto === 'string' &&
        product.produto.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      if (sortBy === 'nome') {
        const nameA = a.produto || '';
        const nameB = b.produto || '';
        const comparison = nameA.localeCompare(nameB);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = parsePrice(a.valor || '');
        const priceB = parsePrice(b.valor || '');
        const comparison = priceA - priceB;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
    
    setDisplayedProducts(filtered);
  }, [filteredProducts, selectedCategory, searchTerm, sortBy, sortOrder, parsePrice]);

  // Debounced search function for better performance
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term || '');
  }, []);

  const handlePriceFilter = useCallback((min: number, max: number) => {
    setPriceFilter({
      min: min || 0,
      max: max || 1000
    });
  }, []);

  const {
    trackProductClick
  } = useProductClicks();

  const handleProductClick = useCallback(async (productId: number) => {
    if (!productId) return;
    
    try {
      await trackProductClick(productId, 'product_view');
      const productElement = document.getElementById(`product-${productId}`);
      if (productElement) {
        productElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        setSearchTerm('');
      }
    } catch (error) {
      logger.error('Error tracking product click', { error, productId });
    }
  }, [trackProductClick]);

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
        if (prev.length >= 5) {
          return prev;
        }
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
      const {
        data,
        error
      } = await supabase.functions.invoke('analyze-products', {
        body: {
          products,
          userPreferences: questionnaireAnswers
        }
      });
      if (error) {
        logger.error('Error calling analyze-products function', { error });
        throw new Error(error.message || 'Erro ao analisar produtos');
      }
      return data?.analysis || 'Análise não disponível';
    } catch (error) {
      logger.error('Error in analyzeProducts', { error });
      throw error;
    }
  };

  const getCategoryIcon = useCallback((category: string) => {
    if (!category) return ShoppingCart;
    
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

  const getCategoryProducts = useCallback((category: string, limit: number = 8) => {
    if (!category || !Array.isArray(filteredProducts)) return [];
    
    const categoryProducts = filteredProducts.filter(p => 
      p && p.categoria === category
    );
    return shuffleArray(categoryProducts, false).slice(0, limit);
  }, [filteredProducts, shuffleArray]);

  // Memoize products with videos for better performance
  const productsWithVideos = useMemo(() => {
    if (!Array.isArray(filteredProducts)) return [];
    
    const withVideos = filteredProducts.filter(product => 
      product && 
      product.video && 
      typeof product.video === 'string' &&
      product.video.trim() !== ''
    );
    return shuffleArray(withVideos, false).slice(0, 8);
  }, [filteredProducts, shuffleArray]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20 relative">
        <MagicalParticles />
        <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl animate-shimmer backdrop-blur-sm border border-magical-gold/30"></div>
            <ProductGrid loading={true} products={[]} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20 relative overflow-hidden">
      {/* Magical background particles */}
      <MagicalParticles />

      {/* Enhanced magical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-3 h-3 bg-magical-gold rounded-full animate-magical-glow opacity-60"></div>
        <div className="absolute top-32 right-20 w-4 h-4 bg-magical-bronze rounded-full animate-sparkle opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-64 left-1/4 w-2 h-2 bg-magical-silver rounded-full animate-levitate opacity-70" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-96 right-1/3 w-5 h-5 bg-magical-gold rounded-full animate-magical-glow opacity-30" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-64 left-20 w-3 h-3 bg-magical-bronze rounded-full animate-sparkle opacity-50" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-32 right-10 w-2 h-2 bg-magical-silver rounded-full animate-levitate opacity-80" style={{animationDelay: '5s'}}></div>
      </div>
      
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      {/* Search Preview */}
      {searchTerm && Array.isArray(filteredProducts) && (
        <SearchPreview 
          searchTerm={searchTerm} 
          products={filteredProducts
            .filter(p => p && p.produto && p.produto.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 5)
          } 
          onProductClick={handleProductClick} 
        />
      )}

      {/* Novidades Carousel */}
      {Array.isArray(filteredProducts) && filteredProducts.length > 0 && (
        <CategoryCarousel products={filteredProducts} onProductClick={handleProductClick} />
      )}
      
      {/* Category Quick Access Buttons */}
      <CategoryQuickAccess categories={categories} />

      {/* Hero Section */}
      <HeroSection productsCount={filteredProducts.length} />

      {/* Video Carousel - Strategic placement after hero */}
      {!showingAI && productsWithVideos.length > 0 && <VideoCarouselHome products={productsWithVideos} />}

      {/* Category Product Carousels */}
      <CategoryProductCarousels 
        categories={categories}
        getCategoryProducts={getCategoryProducts}
        getCategoryIcon={getCategoryIcon}
        showingAI={showingAI}
      />

      {/* Enhanced Featured Products Carousel with Toggle */}
      <FeaturedSection 
        showingAI={showingAI}
        onTabChange={handleTabChange}
        featuredProducts={featuredProducts}
        currentFeaturedCategory={currentFeaturedCategory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        displayedProducts={displayedProducts}
        selectedProducts={selectedProducts}
        onProductToggle={handleProductToggle}
        onAnalyze={handleAnalyze}
        setQuestionnaireAnswers={setQuestionnaireAnswers}
      />

      {/* Category Filter and Products Grid */}
      <ProductsExploreSection 
        showingAI={showingAI}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        displayedProducts={displayedProducts}
      />

      {/* CTA Section - only show when not in AI mode */}
      {!showingAI && (
        <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-magical-deepPurple via-magical-mysticalPurple to-magical-darkBlue relative overflow-hidden animate-fade-in border-t border-magical-gold/30 shadow-2xl">
          <div className="absolute inset-0 bg-magical-midnight/20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="space-y-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-magical-gold/40 to-magical-bronze/40 rounded-3xl flex items-center justify-center mx-auto animate-levitate border border-magical-gold/30 backdrop-blur-sm shadow-2xl">
                <Wand2 className="w-8 h-8 md:w-10 md:h-10 text-magical-gold animate-magical-glow" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-magical-starlight animate-slide-in-left font-magical">
                ⚡ Não Perca Nenhuma Magia!
              </h2>
              <p className="text-magical-starlight/90 text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-slide-in-right font-enchanted">
                Descubra as relíquias mais poderosas de Hogwarts com preços encantados
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze py-4 px-8 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-enchanted" 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              >
                Explorar Relíquias Mágicas
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
