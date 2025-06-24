
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, ShoppingCart, Star, Wand2, Crown, Sparkles } from 'lucide-react';
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
        .from('HARRY POTTER')
        .select('id, produto, valor, imagem1, link')
        .limit(10);

      if (error) throw error;

      // Simulate metrics for magical artifacts
      const productsWithMetrics = (data || []).map((product, index) => ({
        ...product,
        clicks: Math.floor(Math.random() * 1000) + 100,
        shopee_clicks: Math.floor(Math.random() * 500) + 50
      })).sort((a, b) => (b.clicks || 0) - (a.clicks || 0));

      setTopProducts(productsWithMetrics);
    } catch (error) {
      console.error('Erro ao buscar relíquias mágicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  };

  const handleProductClick = (product: ProductMetric) => {
    console.log('Relíquia clicada:', product.id);
  };

  const handleShopeeClick = (product: ProductMetric, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Link mágico clicado:', product.id);
    window.open(product.link, '_blank');
  };

  if (loading) {
    return (
      <div className="w-80 bg-gradient-to-br from-magical-deepPurple/70 to-magical-mysticalPurple/50 border-l border-magical-gold/40 p-6 space-y-4 backdrop-blur-md shadow-2xl">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-magical-gold/20 rounded-2xl animate-magical-glow border border-magical-gold/30 shadow-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-br from-magical-deepPurple/70 to-magical-mysticalPurple/50 border-l border-magical-gold/40 p-6 space-y-6 overflow-y-auto h-full backdrop-blur-md shadow-2xl">
      {/* Enhanced magical header */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-magical-starlight flex items-center gap-2 animate-fade-in font-magical">
          <Crown className="w-6 h-6 text-magical-gold animate-magical-glow" />
          Relíquias Lendárias
        </h2>
        <p className="text-sm text-magical-starlight/80 font-enchanted">
          Os artefatos mais cobiçados pelos bruxos de Hogwarts
        </p>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-magical-gold/50 to-transparent rounded-full"></div>
      </div>

      {/* Enhanced magical products list */}
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <Card 
            key={product.id}
            className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-magical-gold/50 hover:border-magical-gold/70 bg-gradient-to-br from-magical-gold/15 to-magical-bronze/15 backdrop-blur-sm hover:scale-102 animate-fade-in shadow-xl hover:shadow-magical-gold/30"
            onClick={() => handleProductClick(product)}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <CardContent className="p-0">
              <div className="flex gap-3 p-4">
                {/* Enhanced ranking badge */}
                <div className="flex-shrink-0 relative">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl border border-magical-gold/40 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20">
                    <OptimizedImage 
                      src={product.imagem1} 
                      alt={product.produto}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <Badge 
                    className={`absolute -top-2 -right-2 w-6 h-6 text-xs p-0 flex items-center justify-center border border-magical-gold/60 shadow-lg ${
                      index < 3 ? 'bg-gradient-to-br from-magical-gold to-magical-bronze text-magical-midnight animate-magical-glow' : 'bg-gradient-to-br from-magical-silver to-magical-bronze text-magical-midnight'
                    }`}
                  >
                    {index + 1}
                  </Badge>
                </div>

                {/* Enhanced product info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="text-sm font-medium text-magical-starlight line-clamp-2 leading-tight font-enchanted hover:text-magical-gold transition-colors">
                    {product.produto}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-magical-gold font-magical">
                      {formatPrice(product.valor)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-magical-gold fill-current animate-sparkle" />
                      <span className="text-xs text-magical-starlight/80">4.9</span>
                    </div>
                  </div>

                  {/* Enhanced magical metrics */}
                  <div className="flex items-center justify-between text-xs text-magical-starlight/70">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.clicks} visualizações</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wand2 className="w-3 h-3" />
                      <span>{product.shopee_clicks} aquisições</span>
                    </div>
                  </div>

                  {/* Enhanced magical button - agora ROXO */}
                  <Button 
                    size="sm"
                    className="w-full h-8 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight text-xs font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-enchanted"
                    onClick={(e) => handleShopeeClick(product, e)}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Adquirir Relíquia
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced magical stats */}
      <Card className="bg-gradient-to-br from-magical-mysticalPurple/30 to-magical-deepPurple/30 border-magical-gold/50 shadow-xl backdrop-blur-sm">
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-magical-starlight text-sm flex items-center gap-2 font-magical">
            <Crown className="w-4 h-4 text-magical-gold animate-magical-glow" />
            Estatísticas Mágicas
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-magical-gold font-magical animate-sparkle">
                {topProducts.reduce((sum, p) => sum + (p.clicks || 0), 0)}
              </div>
              <div className="text-xs text-magical-starlight/80 font-enchanted">Visualizações Mágicas</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-magical-bronze font-magical animate-sparkle">
                {topProducts.reduce((sum, p) => sum + (p.shopee_clicks || 0), 0)}
              </div>
              <div className="text-xs text-magical-starlight/80 font-enchanted">Relíquias Adquiridas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
