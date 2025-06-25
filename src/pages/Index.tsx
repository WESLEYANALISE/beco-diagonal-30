
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { ProductsExploreSection } from '@/components/home/ProductsExploreSection';
import { SearchPreview } from '@/components/SearchPreview';
import { Product } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { logger } from '@/utils/logger';
import { StrategicPriceFilter } from '@/components/StrategicPriceFilter';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showingAI, setShowingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentFeaturedCategory, setCurrentFeaturedCategory] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, string>>({});
  const [priceFilter, setPriceFilter] = useState<{min: number, max: number} | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const randomIndex = Math.floor(Math.random() * categories.length);
      setCurrentFeaturedCategory(categories[randomIndex]);
    }
  }, [categories]);

  useEffect(() => {
    if (currentFeaturedCategory) {
      const filtered = products.filter(product => product.categoria === currentFeaturedCategory);
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 8));
    } else {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 8));
    }
  }, [products, currentFeaturedCategory]);

  const fetchProducts = async () => {
    try {
      logger.info('Fetching products from Supabase');
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        logger.error('Error fetching products:', error);
        throw error;
      }

      if (data) {
        setProducts(data);
        logger.info(`Fetched ${data.length} products`);
      }
    } catch (error) {
      logger.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      logger.info('Fetching categories from Supabase');
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('categoria');

      if (error) {
        logger.error('Error fetching categories:', error);
        throw error;
      }

      if (data) {
        const uniqueCategories = [...new Set(data.map(item => item.categoria).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
        logger.info(`Fetched ${uniqueCategories.length} categories`);
      }
    } catch (error) {
      logger.error('Error fetching categories:', error);
    }
  };

  const handleTabChange = useCallback((tab: 'featured' | 'ai') => {
    setShowingAI(tab === 'ai');
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedProducts([]);
  }, []);

  const handleProductToggle = useCallback((product: Product) => {
    setSelectedProducts(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (selectedProducts.length < 2 || selectedProducts.length > 5) {
      alert('Selecione entre 2 e 5 produtos para análise.');
      return;
    }

    // Lógica de análise aqui (pode ser uma chamada de API)
    alert(`Analisando ${selectedProducts.length} produtos...`);
  }, [selectedProducts]);

  const handlePriceFilter = useCallback((minPrice: number, maxPrice: number) => {
    setPriceFilter({ min: minPrice, max: maxPrice });
  }, []);

  const handleClearPriceFilter = useCallback(() => {
    setPriceFilter(null);
  }, []);

  // Enhanced displayedProducts with price filtering
  const displayedProducts = useMemo(() => {
    let filtered = showingAI ? [] : products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'todas' || product.categoria === selectedCategory;
      
      // Price filtering
      let matchesPrice = true;
      if (priceFilter) {
        const productPrice = parseFloat(product.valor.replace(/[^\d.,]/g, '').replace(',', '.'));
        if (!isNaN(productPrice)) {
          matchesPrice = productPrice >= priceFilter.min && productPrice <= priceFilter.max;
        }
      }
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort filtered products
    filtered.sort((a, b) => {
      if (sortBy === 'nome') {
        const comparison = a.produto.localeCompare(b.produto);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = parseFloat(a.valor.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const priceB = parseFloat(b.valor.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const comparison = priceA - priceB;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [products, showingAI, searchTerm, selectedCategory, sortBy, sortOrder, priceFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <Header />
      <HeroSection />
      
      {/* Search Section with Strategic Price Filter */}
      <section className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magical-midnight w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar relíquias mágicas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-magical-starlight/90 border-magical-gold/40 text-magical-midnight placeholder-magical-midnight/70 focus:ring-2 focus:ring-magical-gold/50 rounded-xl font-enchanted text-base shadow-lg"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-magical-midnight/70 hover:text-magical-midnight"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Strategic Price Filter */}
            <StrategicPriceFilter
              onFilter={handlePriceFilter}
              onClear={handleClearPriceFilter}
              className="w-full md:w-auto"
            />
          </div>
          
          {/* Search Results Preview */}
          {searchTerm && !showingAI && (
            <div className="mt-4">
              <SearchPreview 
                searchTerm={searchTerm} 
                resultsCount={displayedProducts.length}
                onClearSearch={() => setSearchTerm('')}
              />
            </div>
          )}
        </div>
      </section>

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

      <CategoryCarousel
        products={products}
        onProductClick={(productId) => {
          console.log(`Product clicked: ${productId}`);
          // Implemente a lógica para lidar com o clique no produto aqui
        }}
      />

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
    </div>
  );
};

export default Index;
