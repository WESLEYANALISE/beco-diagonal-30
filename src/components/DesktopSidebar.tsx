
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, ShoppingCart, Star } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { supabase } from "@/integrations/supabase/client";

interface ProductMetric {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  link: string;
  clicks?: number;
  shopee_clicks?: number;
}

export const DesktopSidebar = () => {
  const [topProducts, setTopProducts] = useState<ProductMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('id, produto, valor, imagem1, link')
        .limit(10);

      if (error) throw error;

      // Simulate metrics (in a real app, these would come from analytics)
      const productsWithMetrics = (data || []).map((product, index) => ({
        ...product,
        clicks: Math.floor(Math.random() * 1000) + 100,
        shopee_clicks: Math.floor(Math.random() * 500) + 50
      })).sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

      setTopProducts(productsWithMetrics);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  };

  const handleProductClick = (product: ProductMetric) => {
    // Track click (in a real app, this would update analytics)
    console.log('Product clicked:', product.id);
  };

  const handleShopeeClick = (product: ProductMetric, e: React.MouseEvent) => {
    e.stopPropagation();
    // Track Shopee click
    console.log('Shopee link clicked:', product.id);
    window.open(product.link, '_blank');
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-500" />
          Produtos em Destaque
        </h2>
        <p className="text-sm text-gray-600">
          Os mais clicados e engajados
        </p>
      </div>

      {/* Top Products */}
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <Card 
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-red-200"
            onClick={() => handleProductClick(product)}
          >
            <CardContent className="p-0">
              <div className="flex gap-3 p-3">
                {/* Ranking Badge */}
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <OptimizedImage 
                      src={product.imagem1} 
                      alt={product.produto}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Badge 
                    className={`absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center ${
                      index < 3 ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                  >
                    {index + 1}
                  </Badge>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {product.produto}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-red-500">
                      {formatPrice(product.valor)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">4.8</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.clicks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      <span>{product.shopee_clicks}</span>
                    </div>
                  </div>

                  {/* Shopee Button - Updated to magical purple */}
                  <Button 
                    size="sm"
                    className="w-full h-7 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-white text-xs font-medium border-0 shadow-lg hover:shadow-xl"
                    onClick={(e) => handleShopeeClick(product, e)}
                  >
                    Adquirir Artefato
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-magical-mysticalPurple/10 to-magical-deepPurple/10 border-magical-gold/30">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">
            Estatísticas Mágicas
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-magical-mysticalPurple">
                {topProducts.reduce((sum, p) => sum + (p.clicks || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">Total Cliques</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-magical-deepPurple">
                {topProducts.reduce((sum, p) => sum + (p.shopee_clicks || 0), 0)}
              </div>
              <div className="text-xs text-gray-600">Artefatos Adquiridos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
