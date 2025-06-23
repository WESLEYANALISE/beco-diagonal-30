import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LazyImage } from '@/components/LazyImage';
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'nome' | 'preco'>('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const {
    showSuccess,
    showError,
    showLoading
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
      showLoading("Carregando produtos");
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
      showSuccess("Produtos carregados com sucesso!");
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError("Erro ao carregar produtos", "Tente novamente em alguns instantes");
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
      })
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

  const getProductImages = (product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const getTitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Mais Vendidos';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return subcategoria;
    }
    return categoria ? `${categoria}` : 'Produtos';
  };

  const getSubtitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Os produtos favoritos dos nossos clientes';
    }
    if (tipo === 'subcategoria' && subcategoria) {
      return `Produtos em ${categoria} > ${subcategoria}`;
    }
    return `Explore todos os produtos de ${categoria}`;
  };

  const getBackPath = () => {
    if (tipo === 'subcategoria') {
      return `/subcategoria-lista?categoria=${encodeURIComponent(categoria)}`;
    }
    return '/categorias';
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const renderProductCard = (product: Product, index: number) => (
    viewMode === 'grid' ? (
      <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductClick(product)}>
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <LazyImage 
              src={product.imagem1} 
              alt={product.produto} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-2 right-2">
              <FavoriteButton productId={product.id} size="sm" />
            </div>
            {tipo === 'mais-vendidos' && index < 3 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                TOP {index + 1}
              </Badge>
            )}
          </div>
          
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-2">
              {product.produto}
            </h3>
            
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-red-500 text-sm">
                {formatPrice(product.valor)}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <ProductPhotosModal 
                images={getProductImages(product)} 
                productName={product.produto} 
                productPrice={formatPrice(product.valor)} 
                productLink={product.link}
                videoUrl={product.video}
              />
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs"  
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.link, '_blank');
                }}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Comprar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ) : (
      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleProductClick(product)}>
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
              <LazyImage 
                src={product.imagem1} 
                alt={product.produto} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1 p-2 sm:p-3 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  {tipo === 'mais-vendidos' && index < 3 && (
                    <Badge className="bg-red-500 text-white text-xs mb-1">
                      TOP {index + 1}
                    </Badge>
                  )}
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                    {product.produto}
                  </h3>
                </div>
                <FavoriteButton productId={product.id} />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-red-500 text-sm">
                  {formatPrice(product.valor)}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">4.8</span>
                </div>
              </div>
              
              <div className="flex gap-1 sm:gap-2">
                <ProductPhotosModal 
                  images={getProductImages(product)} 
                  productName={product.produto} 
                  productPrice={formatPrice(product.valor)} 
                  productLink={product.link}
                  videoUrl={product.video}
                />
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs flex-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(product.link, '_blank');
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Comprar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header da página */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(getBackPath())} 
              className="text-red-500 hover:text-red-600 p-1 sm:p-2"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{getTitle()}</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{getSubtitle()}</p>
            </div>
          </div>

          {/* Controles de visualização e filtros */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
                <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="preco">Preço</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 sm:px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-4 sm:py-6 px-2 sm:px-4">
        {tipo === 'categoria' && !subcategoria ? (
          // Show products grouped by subcategory (like home page)
          <div className="space-y-8">
            {subcategoryGroups.map((group) => (
              <div key={group.subcategoria} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{group.subcategoria}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(group.subcategoria)}&tipo=subcategoria`)}
                  >
                    Ver todos
                  </Button>
                </div>
                
                <div className={viewMode === 'grid' ? 
                  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" : 
                  "space-y-2 sm:space-y-3"
                }>
                  {group.products.slice(0, viewMode === 'grid' ? 10 : 5).map((product, index) => 
                    renderProductCard(product, index)
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show filtered products list
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Nenhum produto encontrado
                </h2>
                <p className="text-gray-600">
                  Não há produtos disponíveis nesta {tipo === 'subcategoria' ? 'subcategoria' : 'categoria'}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4" : 
                "space-y-2 sm:space-y-3"
              }>
                {filteredProducts.map((product, index) => renderProductCard(product, index))}
              </div>
            )}
          </>
        )}
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
