import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Filter, Grid, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { OptimizedImage } from '@/components/OptimizedImage';
import { SubcategoryCard } from '@/components/SubcategoryCard';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { DesktopSidebar } from '@/components/DesktopSidebar';
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
  subcategoria?: string;
  uso?: string;
}

interface SubcategoryGroup {
  subcategoria: string;
  products: Product[];
  sampleImage: string;
}

const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';
  const subcategoria = searchParams.get('subcategoria') || '';
  const tipo = searchParams.get('tipo') || 'categoria';

  const [products, setProducts] = useState<Product[]>([]);
  const [subcategoryGroups, setSubcategoryGroups] = useState<SubcategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const {
    showSuccess,
    showError
  } = useToastNotifications();

  useEffect(() => {
    fetchProducts();
  }, [categoria, subcategoria, tipo]);

  useEffect(() => {
    if (tipo === 'categoria' && !subcategoria) {
      groupProductsBySubcategory();
    } else {
      applyFilters();
    }
  }, [products, sortBy, sortOrder, tipo, subcategoria]);

  const fetchProducts = async () => {
    try {
      let query = supabase.from('SHOPEE').select('*');
      
      if (tipo === 'categoria' && categoria && categoria !== 'todas') {
        query = query.eq('categoria', categoria);
      } else if (tipo === 'subcategoria' && categoria && subcategoria) {
        query = query.eq('categoria', categoria).eq('subcategoria', subcategoria);
      } else if (tipo === 'mais-vendidos') {
        query = query.order('id');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;

      let filteredData = data || [];
      
      if (tipo === 'mais-vendidos') {
        filteredData = filteredData.slice(0, 20);
      }
      
      setProducts(filteredData);
      showSuccess("Artefatos mágicos carregados!");
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError("Erro ao carregar artefatos mágicos");
    } finally {
      setLoading(false);
    }
  };

  const groupProductsBySubcategory = () => {
    if (tipo !== 'categoria' || subcategoria) return;
    
    const grouped = products.reduce((acc: Record<string, Product[]>, product) => {
      const subcat = product.subcategoria || 'Outros';
      if (!acc[subcat]) {
        acc[subcat] = [];
      }
      acc[subcat].push(product);
      return acc;
    }, {});

    const groups = Object.entries(grouped).map(([subcategoria, products]) => ({
      subcategoria,
      products: products.sort((a, b) => {
        if (sortBy === 'nome') {
          const comparison = a.produto.localeCompare(b.produto);
          return sortOrder === 'asc' ? comparison : -comparison;
        } else {
          const priceA = parseFloat(a.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
          const priceB = parseFloat(b.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
          const comparison = priceA - priceB;
          return sortOrder === 'asc' ? comparison : -comparison;
        }
      }),
      sampleImage: products[0]?.imagem1 || ''
    }));

    setSubcategoryGroups(groups);
  };

  const applyFilters = () => {
    let filtered = [...products];
    
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

    setFilteredProducts(filtered);
  };

  // Get magical names
  const getMagicalCategoryName = (category: string) => {
    const nameMap: Record<string, string> = {
      'Beleza e Cuidados Pessoais': 'Poções e Unguentos',
      'Casa e Decoração': 'Artefatos do Lar',
      'Diversão e Familia': 'Entretenimento Mágico',
      'Estilo e Moda': 'Vestes e Acessórios',
      'Tecnologia e Acessórios': 'Artefatos Místicos'
    };
    return nameMap[category] || category;
  };

  const getTitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Artefatos Mais Procurados';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return subcategoria;
    }
    return categoria ? getMagicalCategoryName(categoria) : 'Artefatos Mágicos';
  };

  const getSubtitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Os artefatos favoritos dos nossos magos';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return `Artefatos em ${getMagicalCategoryName(categoria)} > ${subcategoria}`;
    }
    return `Explore todas as escolas de ${getMagicalCategoryName(categoria)}`;
  };

  const getBackPath = () => {
    if (tipo === 'subcategoria') {
      return `/categoria-lista?categoria=${encodeURIComponent(categoria)}&tipo=categoria`;
    }
    return '/categorias';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleSubcategoryClick = (subcategoriaName: string) => {
    navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(subcategoriaName)}&tipo=subcategoria`);
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-magical-mysticalPurple to-magical-deepPurple',
      'from-magical-gold to-magical-bronze',
      'from-magical-emerald to-magical-mysticalPurple',
      'from-magical-crimson to-magical-gold',
      'from-magical-silver to-magical-deepPurple',
      'from-magical-bronze to-magical-mysticalPurple',
      'from-magical-deepPurple to-magical-gold',
      'from-magical-mysticalPurple to-magical-emerald',
      'from-magical-gold to-magical-deepPurple',
      'from-magical-bronze to-magical-mysticalPurple'
    ];
    return gradients[index % gradients.length];
  };

  const showingProducts = tipo === 'subcategoria' || tipo === 'mais-vendidos';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
        <Header />
        <div className="flex">
          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-24 bg-magical-gold/20 rounded-lg backdrop-blur-sm border border-magical-gold/30"></div>
              ))}
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
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
      <Header />
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header da página */}
          <div className="bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 backdrop-blur-md border-b border-magical-gold/30 sticky top-0 z-10">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-4 mb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(getBackPath())} 
                  className="text-magical-gold hover:text-magical-darkGold hover:bg-magical-gold/20 p-1 sm:p-2 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Voltar</span>
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-magical-starlight truncate font-magical">{getTitle()}</h1>
                  <p className="text-xs sm:text-sm text-magical-starlight/80 truncate font-enchanted">{getSubtitle()}</p>
                </div>
                <Sparkles className="w-5 h-5 text-magical-gold animate-sparkle" />
              </div>

              {/* Controles de visualização e filtros - mostrar quando exibindo produtos */}
              {showingProducts && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                      <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm bg-magical-deepPurple/60 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-magical-deepPurple border-magical-gold/30">
                        <SelectItem value="nome" className="text-magical-starlight hover:bg-magical-gold/20">Nome</SelectItem>
                        <SelectItem value="preco" className="text-magical-starlight hover:bg-magical-gold/20">Preço</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-2 sm:px-3 bg-magical-deepPurple/60 text-magical-starlight border-magical-gold/30 hover:bg-magical-gold/20 hover:text-magical-gold"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
            {tipo === 'categoria' && !subcategoria ? (
              // Enhanced subcategories grid
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-magical-starlight mb-2 font-magical">
                    Escolas de Magia
                  </h2>
                  <p className="text-magical-starlight/80 mb-6 font-enchanted">
                    Encontre exatamente o que procura em {subcategoryGroups.length} escolas especializadas
                  </p>
                </div>
                
                {subcategoryGroups.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-levitate shadow-2xl backdrop-blur-sm border border-magical-gold/40">
                      <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-magical-gold" />
                      <Sparkles className="w-4 h-4 text-magical-gold absolute top-2 right-2 animate-sparkle" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-magical-starlight mb-4 font-magical">
                      Nenhuma escola de magia encontrada
                    </h2>
                    <p className="text-magical-starlight/80 font-enchanted">
                      Esta categoria ainda não possui escolas especializadas
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {subcategoryGroups.map((group, index) => (
                      <SubcategoryCard
                        key={group.subcategoria}
                        subcategoria={group.subcategoria}
                        productCount={group.products.length}
                        sampleImage={group.sampleImage}
                        gradient={getCategoryGradient(index)}
                        onClick={() => handleSubcategoryClick(group.subcategoria)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Show filtered products using ProductGrid component
              <ProductGrid
                products={filteredProducts}
                loading={loading}
                compact={true}
              />
            )}
          </div>
        </div>

        {/* Desktop Sidebar - only show on large screens */}
        <div className="hidden lg:block">
          <DesktopSidebar />
        </div>
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

export default CategoriaLista;
