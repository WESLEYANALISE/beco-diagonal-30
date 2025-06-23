
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { EvolutionCarousel } from '@/components/EvolutionCarousel';
import { useSearchParams } from 'react-router-dom';
import { useGetProducts } from '@/hooks/useGetProducts';
import { HeroSection } from '@/components/HeroSection';
import { TabNavigation } from '@/components/TabNavigation';
import { SearchPreview } from '@/components/SearchPreview';
import { Tutorial } from '@/components/Tutorial';
import FooterNavigation from '@/components/FooterNavigation';
import { useTutorialAndUser } from '@/hooks/useTutorialAndUser';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'todos' | 'categorias' | 'evolution'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [productCounts, setProductCounts] = useState({
    todos: 0,
    categorias: 0,
    evolution: 0,
  });

  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('categoria');

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetProducts();

  const [filteredProducts, setFilteredProducts] = useState(products);
  const { showTutorial, completeTutorial, skipTutorial } = useTutorialAndUser();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (products) {
      let filtered = [...products];

      if (categoryFilter) {
        filtered = filtered.filter(product =>
          product.categoria.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.produto.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products, categoryFilter, searchTerm]);

  useEffect(() => {
    if (products) {
      setProductCounts({
        todos: products.length,
        categorias: 10,
        evolution: 5,
      });
    }
  }, [products]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handlePriceFilter = (min: number, max: number) => {
    console.log(`Filtrar por preço: Min ${min}, Max ${max}`);
  };

  const handleProductClick = (productId: number) => {
    console.log('Product clicked:', productId);
  };

  const handleTabChange = (tab: 'featured' | 'ai') => {
    // Mapeamento dos tipos de aba
    if (tab === 'featured') {
      setActiveTab('todos');
    } else {
      setActiveTab('evolution');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <Header onSearch={handleSearch} onPriceFilter={handlePriceFilter} />
      
      {/* Tutorial */}
      {showTutorial && (
        <Tutorial onComplete={completeTutorial} onSkip={skipTutorial} />
      )}
      
      {/* Hero Section */}
      <HeroSection productsCount={products?.length || 0} />

      {/* Navigation Tabs */}
      <TabNavigation 
        showingAI={activeTab === 'evolution'}
        onTabChange={handleTabChange}
      />

      {/* Search Preview */}
      {searchTerm && filteredProducts && (
        <SearchPreview 
          searchTerm={searchTerm} 
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      )}

      {/* Main Content */}
      <main className="px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'todos' && (
            <ProductGrid 
              products={filteredProducts || []}
              loading={isLoading}
            />
          )}
          
          {activeTab === 'categorias' && (
            <CategoryCarousel 
              products={products || []}
              onProductClick={handleProductClick}
            />
          )}
          
          {activeTab === 'evolution' && (
            <EvolutionCarousel fotos={[]} />
          )}
        </div>
      </main>

      <FooterNavigation />
    </div>
  );
};

export default Index;
