import { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { BookOpen, Gamepad2, ShoppingBag, Wand2, Sparkles, Crown, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { OptimizedCarousel } from '@/components/OptimizedCarousel';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSupabaseCache } from '@/hooks/useSupabaseCache';
import { useSequentialMagicalSounds } from '@/hooks/useSequentialMagicalSounds';
import { useProductClicks } from '@/hooks/useProductClicks';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

// Lazy load components for better performance
const VideoCarouselHome = lazy(() => import('@/components/VideoCarouselHome').then(module => ({ default: module.VideoCarouselHome })));
const ProductDetailModal = lazy(() => import('@/components/ProductDetailModal').then(module => ({ default: module.ProductDetailModal })));

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
  descricao?: string;
  uso?: string;
}

interface CategoryStats {
  categoria: string;
  count: number;
  hasSubcategories: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const { playNextSequentialSound } = useSequentialMagicalSounds();
  const { trackProductClick } = useProductClicks();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Optimized products query with specific field selection and caching
  const productsQuery = async () => {
    const { data, error } = await supabase
      .from('HARRY POTTER')
      .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, link, categoria, subcategoria, descricao, uso')
      .not('imagem1', 'is', null)
      .not('produto', 'is', null)
      .not('valor', 'is', null)
      .limit(50); // Limit for better performance
    
    return { data: data || [], error };
  };

  // Optimized categories query with minimal field selection
  const categoriesQuery = async () => {
    const { data, error } = await supabase
      .from('HARRY POTTER')
      .select('categoria, subcategoria')
      .not('categoria', 'is', null);
    
    return { data: data || [], error };
  };

  const { data: products = [], loading: productsLoading } = useSupabaseCache<Product[]>(
    productsQuery,
    'home-products',
    []
  );

  const { data: categoriesData = [], loading: categoriesLoading } = useSupabaseCache<any[]>(
    categoriesQuery,
    'home-categories',
    []
  );

  // Memoized categories processing
  const categories = useMemo(() => {
    const categoryMap = new Map<string, { count: number; hasSubcategories: boolean }>();
    
    categoriesData.forEach(item => {
      const cat = item.categoria;
      if (categoryMap.has(cat)) {
        const existing = categoryMap.get(cat)!;
        existing.count += 1;
        if (item.subcategoria && item.subcategoria.trim() !== '') {
          existing.hasSubcategories = true;
        }
      } else {
        categoryMap.set(cat, {
          count: 1,
          hasSubcategories: !!(item.subcategoria && item.subcategoria.trim() !== '')
        });
      }
    });

    return Array.from(categoryMap.entries()).map(([categoria, stats]) => ({
      categoria,
      count: stats.count,
      hasSubcategories: stats.hasSubcategories
    })).slice(0, 6); // Limit to 6 for performance
  }, [categoriesData]);

  // Memoized valid products
  const validProducts = useMemo(() => 
    products.filter(product => 
      product && 
      product.produto && 
      product.valor && 
      product.imagem1 &&
      typeof product.produto === 'string' &&
      typeof product.valor === 'string'
    ), [products]
  );

  const handleProductClick = async (productId: number) => {
    playNextSequentialSound();
    await trackProductClick(productId, 'home_carousel_click');
    
    const product = validProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleCategoryClick = (category: CategoryStats) => {
    playNextSequentialSound();
    
    if (category.hasSubcategories) {
      navigate(`/subcategoria-detalhes?categoria=${encodeURIComponent(category.categoria)}`);
    } else {
      navigate(`/categoria-lista?categoria=${encodeURIComponent(category.categoria)}&tipo=categoria`);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Itens Colecionáveis': Crown,
      'Bonecas e Brinquedos de Pelúcia': Sparkles,
      'Luminária': Wand2,
      'Colares': Crown,
      'Moletons e Suéteres': ShoppingBag,
      'Capinhas': ShoppingBag,
      'Canecas': ShoppingBag
    };
    return iconMap[category] || BookOpen;
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-magical-mysticalPurple to-magical-deepPurple',
      'from-magical-gold to-magical-bronze',
      'from-magical-emerald to-magical-mysticalPurple',
      'from-magical-crimson to-magical-gold',
      'from-magical-silver to-magical-deepPurple',
      'from-magical-bronze to-magical-mysticalPurple'
    ];
    return gradients[index % gradients.length];
  };

  const loading = productsLoading || categoriesLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
        <Header />
        <div className="flex">
          <div className="flex-1">
            <div className="animate-pulse space-y-8 p-4">
              <div className="h-64 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30"></div>
              <div className="h-32 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-48 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30 animate-magical-glow"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <DesktopSidebar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
        <Header />
        
        <div className="flex">
          <div className="flex-1">
            {/* Hero Section - Otimizado */}
            <section className="md:px-6 md:py-16 px-[15px] py-[26px]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-6 mb-12">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-levitate shadow-2xl backdrop-blur-sm border border-magical-gold/40">
                    <Wand2 className="w-10 h-10 md:w-12 md:h-12 text-magical-gold" />
                    <Sparkles className="w-4 h-4 text-magical-gold absolute top-2 right-2 animate-sparkle" />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold text-magical-starlight mb-4 leading-tight font-magical">
                    Bem-vindo ao <span className="text-magical-gold animate-magical-glow">Mundo Mágico</span>
                  </h1>
                  <p className="text-lg md:text-xl text-magical-starlight/90 mb-8 max-w-3xl mx-auto leading-relaxed font-enchanted">
                    Descubra artefatos mágicos únicos, poções encantadas e relíquias místicas
                  </p>
                </div>
              </div>
            </section>

            {/* Carousel de Produtos Otimizado */}
            {validProducts.length > 0 && (
              <OptimizedCarousel 
                products={validProducts}
                onProductClick={handleProductClick}
                autoScrollInterval={6000}
                itemsToShow={2}
              />
            )}

            {/* Video Carousel com Suspense */}
            <Suspense fallback={
              <div className="h-64 bg-magical-gold/20 rounded-2xl animate-pulse mx-4 my-8"></div>
            }>
              <VideoCarouselHome products={validProducts} />
            </Suspense>

            {/* Categories Grid Otimizado */}
            <section className="px-4 md:px-6 py-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 font-magical">
                    Explorar por <span className="text-magical-gold">Categorias</span>
                  </h2>
                  <p className="text-magical-starlight/90 font-enchanted">
                    Descubra artefatos organizados pelos mestres de Hogwarts
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {categories.map((category, index) => {
                    const IconComponent = getCategoryIcon(category.categoria);
                    
                    return (
                      <Card 
                        key={category.categoria} 
                        className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 shadow-lg group cursor-pointer animate-fade-in hover:-translate-y-1 backdrop-blur-sm hover:shadow-magical-gold/20 will-change-transform" 
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className={`bg-gradient-to-br ${getCategoryGradient(index)} p-4 md:p-6 text-magical-starlight relative overflow-hidden`}>
                          <div className="absolute -top-4 -right-4 w-16 md:w-24 h-16 md:h-24 bg-magical-gold/20 rounded-full transition-transform duration-300 group-hover:scale-110 will-change-transform"></div>
                          <div className="absolute -bottom-4 -left-4 w-12 md:w-16 h-12 md:h-16 bg-magical-starlight/10 rounded-full transition-transform duration-300 group-hover:scale-125 will-change-transform"></div>
                          
                          {category.hasSubcategories && (
                            <div className="absolute top-1 right-1 w-3 h-3 bg-magical-gold rounded-full animate-pulse" title="Possui subcategorias"></div>
                          )}
                          
                          <Star className="absolute top-1 left-1 w-3 h-3 text-magical-gold animate-sparkle" />
                          
                          <div className="relative z-10">
                            <div className="mb-3 md:mb-4 transform transition-transform duration-200 group-hover:scale-110 will-change-transform">
                              <IconComponent className="w-8 h-8 md:w-12 md:h-12 text-magical-starlight drop-shadow-lg" />
                            </div>
                            <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 line-clamp-2 font-magical">
                              {category.categoria}
                            </h3>
                            <p className="text-xs md:text-sm text-magical-starlight/80 font-enchanted">
                              {category.count} artefatos mágicos
                            </p>
                          </div>
                        </div>
                        
                        <CardContent className="p-3 md:p-6">
                          <Button 
                            className="w-full bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold transition-all duration-200 hover:scale-105 text-xs md:text-sm py-2 md:py-3 shadow-lg hover:shadow-xl font-enchanted border-0 will-change-transform" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(category);
                            }}
                          >
                            {category.hasSubcategories ? 'Explorar Coleção' : 'Ver Artefatos'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <DesktopSidebar />
          </div>
        </div>

        {/* Product Detail Modal com Suspense */}
        {selectedProduct && (
          <Suspense fallback={null}>
            <ProductDetailModal 
              isOpen={!!selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
              product={selectedProduct} 
            />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Index;
