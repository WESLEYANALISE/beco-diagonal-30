
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { ProductGrid } from '@/components/ProductGrid';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useSubcategories } from '@/hooks/useSubcategories';
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
  descricao?: string;
  uso?: string;
}

const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';
  const subcategoria = searchParams.get('subcategoria') || '';
  const tipo = searchParams.get('tipo') || 'categoria';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { subcategories, loading: subcategoriesLoading, hasSubcategories } = useSubcategories(categoria);
  const { showSuccess, showError } = useToastNotifications();

  // Redirect to subcategories if they exist and we're not already showing them
  useEffect(() => {
    if (!subcategoriesLoading && hasSubcategories && !subcategoria && tipo === 'categoria') {
      navigate(`/subcategoria-lista?categoria=${encodeURIComponent(categoria)}`);
      return;
    }
  }, [subcategoriesLoading, hasSubcategories, subcategoria, categoria, tipo, navigate]);

  useEffect(() => {
    if (!subcategoriesLoading && (!hasSubcategories || subcategoria)) {
      fetchProducts();
    }
  }, [categoria, subcategoria, tipo, subcategoriesLoading, hasSubcategories]);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('HARRY POTTER')
        .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, link, categoria, subcategoria, descricao, uso');
      
      if (tipo === 'categoria' && categoria && categoria !== 'todas') {
        query = query.eq('categoria', categoria);
        if (subcategoria) {
          query = query.eq('subcategoria', subcategoria);
        }
      } else if (tipo === 'mais-vendidos') {
        query = query.order('id').limit(20);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;

      setProducts(data || []);
      showSuccess("Artefatos mágicos carregados!");
    } catch (error) {
      showError("Erro ao carregar artefatos mágicos");
    } finally {
      setLoading(false);
    }
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

  const getMagicalCategoryName = (category: string) => {
    const nameMap: Record<string, string> = {
      'Itens Colecionáveis': 'Artefatos Colecionáveis',
      'Bonecas e Brinquedos de Pelúcia': 'Criaturas Mágicas',
      'Luminária': 'Iluminação Mágica',
      'Colares': 'Joias Encantadas',
      'Moletons e Suéteres': 'Vestes de Hogwarts',
      'Capinhas': 'Proteções Místicas',
      'Canecas': 'Cálices Encantados'
    };
    return nameMap[category] || category;
  };

  const getTitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Artefatos Mais Procurados';
    }
    if (subcategoria) {
      return `${getMagicalCategoryName(categoria)} - ${subcategoria}`;
    }
    return categoria ? getMagicalCategoryName(categoria) : 'Artefatos Mágicos';
  };

  const getSubtitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Os artefatos favoritos dos nossos magos';
    }
    if (subcategoria) {
      return `Explore todos os artefatos de ${subcategoria}`;
    }
    return `Explore todos os artefatos de ${getMagicalCategoryName(categoria)}`;
  };

  // Show loading while checking for subcategories
  if (subcategoriesLoading) {
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
        <div className="flex-1">
          {/* Header da página */}
          <div className="bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 backdrop-blur-md border-b border-magical-gold/30 sticky top-0 z-10">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-4 mb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (subcategoria) {
                      navigate(`/subcategoria-lista?categoria=${encodeURIComponent(categoria)}`);
                    } else {
                      navigate('/categorias');
                    }
                  }} 
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

              {/* Controles de visualização e filtros */}
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
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              compact={true}
            />
          </div>
        </div>

        {/* Desktop Sidebar */}
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
