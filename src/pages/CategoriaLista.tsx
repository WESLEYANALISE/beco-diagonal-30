
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Filter, Grid, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { VirtualizedProductGrid } from '@/components/VirtualizedProductGrid';
import { DesktopSidebar } from '@/components/DesktopSidebar';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useSupabaseCache } from '@/hooks/useSupabaseCache';
import { useDebounce } from '@/hooks/useDebounce';
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

  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const {
    showSuccess,
    showError
  } = useToastNotifications();

  // Debounce sort changes to reduce re-renders
  const debouncedSortBy = useDebounce(sortBy, 300);
  const debouncedSortOrder = useDebounce(sortOrder, 300);

  // Optimized Supabase query with caching
  const cacheKey = `products-${categoria}-${subcategoria}-${tipo}`;
  
  const queryFunction = useCallback(async () => {
    console.log('Fetching products for categoria:', categoria, 'subcategoria:', subcategoria, 'tipo:', tipo);
    
    let query = supabase
      .from('HARRY POTTER')
      .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, imagem6, imagem7, link, categoria, subcategoria, descricao, uso');
    
    if (tipo === 'categoria' && categoria && categoria !== 'todas') {
      query = query.eq('categoria', categoria);
    }
    
    if (tipo === 'subcategoria' && subcategoria) {
      query = query.eq('categoria', categoria).eq('subcategoria', subcategoria);
    }
    
    if (tipo === 'mais-vendidos') {
      query = query.order('id').limit(20);
    }
    
    return await query;
  }, [categoria, subcategoria, tipo]);

  const { data: products = [], loading, error } = useSupabaseCache<Product[]>(
    queryFunction,
    cacheKey,
    [categoria, subcategoria, tipo]
  );

  // Show notifications based on data state
  useEffect(() => {
    if (!loading && !error) {
      if (products && products.length > 0) {
        showSuccess("Artefatos mágicos carregados com sucesso!");
      } else {
        showError("Nenhum artefato mágico encontrado");
      }
    }
    if (error) {
      console.error('Erro ao buscar artefatos mágicos:', error);
      showError("Erro ao carregar artefatos mágicos");
    }
  }, [products, loading, error, showSuccess, showError]);

  // Memoized filtered and sorted products for better performance
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    // Filter out invalid products
    const validProducts = products.filter(product => 
      product && 
      product.produto && 
      product.valor && 
      product.categoria &&
      typeof product.produto === 'string' &&
      typeof product.valor === 'string' &&
      typeof product.categoria === 'string'
    );

    // Sort products
    const sorted = [...validProducts].sort((a, b) => {
      if (!a || !b) return 0;
      
      if (debouncedSortBy === 'nome') {
        const nameA = a.produto || '';
        const nameB = b.produto || '';
        const comparison = nameA.localeCompare(nameB);
        return debouncedSortOrder === 'asc' ? comparison : -comparison;
      } else {
        const priceA = parseFloat((a.valor || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const priceB = parseFloat((b.valor || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const comparison = priceA - priceB;
        return debouncedSortOrder === 'asc' ? comparison : -comparison;
      }
    });

    return sorted;
  }, [products, debouncedSortBy, debouncedSortOrder]);

  const getMagicalCategoryName = useCallback((category: string) => {
    if (!category) return '';
    
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
  }, []);

  const getTitle = useCallback(() => {
    if (tipo === 'mais-vendidos') {
      return 'Artefatos Mais Procurados';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return `${getMagicalCategoryName(categoria)} - ${subcategoria}`;
    }
    return categoria ? getMagicalCategoryName(categoria) : 'Artefatos Mágicos';
  }, [tipo, subcategoria, categoria, getMagicalCategoryName]);

  const getSubtitle = useCallback(() => {
    if (tipo === 'mais-vendidos') {
      return 'Os artefatos favoritos dos nossos magos';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return `Explore todos os artefatos de ${subcategoria}`;
    }
    return `Explore todos os artefatos de ${getMagicalCategoryName(categoria)}`;
  }, [tipo, subcategoria, categoria, getMagicalCategoryName]);

  const getBackRoute = useCallback(() => {
    if (tipo === 'subcategoria') {
      return `/subcategoria-detalhes?categoria=${encodeURIComponent(categoria)}`;
    }
    return '/categorias';
  }, [tipo, categoria]);

  const handleProductClick = useCallback((product: Product) => {
    if (!product) return;
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
        <Header />
        <div className="flex">
          <div className="flex-1 container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-24 bg-magical-gold/20 rounded-lg backdrop-blur-sm border border-magical-gold/30 animate-magical-glow"></div>
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
                  onClick={() => navigate(getBackRoute())} 
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
                
                <Badge className="bg-magical-gold/20 text-magical-gold border-magical-gold/30 text-xs font-enchanted">
                  {filteredProducts.length} artefatos encontrados
                </Badge>
              </div>
            </div>
          </div>

          {/* Content with Virtualized Grid */}
          <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
            <VirtualizedProductGrid
              products={filteredProducts}
              height={800}
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
