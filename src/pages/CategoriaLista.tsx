import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
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
}
const CategoriaLista = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';
  const tipo = searchParams.get('tipo') || 'categoria'; // 'categoria' ou 'mais-vendidos'

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    showSuccess,
    showError,
    showLoading
  } = useToastNotifications();
  useEffect(() => {
    fetchProducts();
  }, [categoria, tipo]);
  const fetchProducts = async () => {
    try {
      showLoading("Carregando produtos");
      let query = supabase.from('SHOPEE').select('*');
      if (tipo === 'categoria' && categoria && categoria !== 'todas') {
        query = query.eq('categoria', categoria);
      }
      const {
        data,
        error
      } = await query.order('id');
      if (error) throw error;

      // Se for "mais-vendidos", pega os primeiros 20 produtos
      const filteredData = tipo === 'mais-vendidos' ? (data || []).slice(0, 20) : data || [];
      setProducts(filteredData);
      showSuccess("Produtos carregados com sucesso!");
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError("Erro ao carregar produtos", "Tente novamente em alguns instantes");
    } finally {
      setLoading(false);
    }
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
    return categoria ? `${categoria}` : 'Produtos';
  };
  const getSubtitle = () => {
    if (tipo === 'mais-vendidos') {
      return 'Os produtos favoritos dos nossos clientes';
    }
    return `Explore todos os produtos de ${categoria}`;
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50">
        <Header onSearch={() => {}} onPriceFilter={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {Array.from({
            length: 8
          }).map((_, index) => <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>)}
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} onPriceFilter={() => {}} />
      
      {/* Header da página */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-red-500 hover:text-red-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{getTitle()}</h1>
              <p className="text-sm text-gray-600">{getSubtitle()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="container mx-auto py-6 px-[9px]">
        {products.length === 0 ? <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum produto encontrado
            </h2>
            <p className="text-gray-600">
              Não há produtos disponíveis nesta categoria
            </p>
          </div> : <div className="space-y-3">
            {products.map((product, index) => <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Imagem do produto */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <LazyImage src={product.imagem1} alt={product.produto} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Conteúdo do produto */}
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-2">
                          {tipo === 'mais-vendidos' && index < 3 && <Badge className="bg-red-500 text-white text-xs mb-1">
                              TOP {index + 1}
                            </Badge>}
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
                      
                      {/* Botões de ação */}
                      <div className="flex gap-2">
                        {product.video && <ProductVideoModal videoUrl={product.video} productName={product.produto} productPrice={formatPrice(product.valor)} productLink={product.link} />}
                        <ProductPhotosModal images={getProductImages(product)} productName={product.produto} productPrice={formatPrice(product.valor)} productLink={product.link} />
                        <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs flex-1" onClick={() => window.open(product.link, '_blank')}>
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
    </div>;
};
export default CategoriaLista;