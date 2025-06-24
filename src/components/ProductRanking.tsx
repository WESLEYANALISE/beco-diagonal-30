
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Star, Crown } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import { supabase } from "@/integrations/supabase/client";

interface ProductRanking {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  link: string;
  categoria: string;
  score: number;
}

export const ProductRanking = () => {
  const [generalRanking, setGeneralRanking] = useState<ProductRanking[]>([]);
  const [categoryRankings, setCategoryRankings] = useState<Record<string, ProductRanking[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankingData();
  }, []);

  const fetchRankingData = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .limit(50);

      if (error) throw error;

      // Simulate ranking scores (in a real app, this would come from analytics)
      const productsWithScores = (data || []).map((product) => ({
        ...product,
        score: Math.floor(Math.random() * 1000) + 100
      }));

      // General ranking
      const general = productsWithScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      setGeneralRanking(general);

      // Category rankings
      const uniqueCategories = [...new Set(productsWithScores.map(p => p.categoria).filter(Boolean))];
      setCategories(uniqueCategories);

      const categoryRanks: Record<string, ProductRanking[]> = {};
      uniqueCategories.forEach(category => {
        categoryRanks[category] = productsWithScores
          .filter(p => p.categoria === category)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
      });
      setCategoryRankings(categoryRanks);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3: return <Star className="w-5 h-5 text-orange-500" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-white/20 rounded-lg w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-white/20 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 py-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Ranking de Produtos Mais Vendidos
          </h2>
          <p className="text-white/80">Os produtos favoritos dos nossos clientes</p>
        </div>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="geral" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
              Geral
            </TabsTrigger>
            {categories.slice(0, 3).map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900 hidden lg:block"
              >
                {category.length > 15 ? `${category.substring(0, 15)}...` : category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="geral" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generalRanking.map((product, index) => (
                <Card 
                  key={product.id}
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-2 ${
                    index < 3 ? 'border-yellow-400 shadow-lg' : 'border-gray-200'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${getRankBadgeColor(index + 1)} flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <OptimizedImage 
                          src={product.imagem1}
                          alt={product.produto}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                          {product.produto}
                        </h4>
                        <p className="text-red-500 font-bold text-sm">
                          {formatPrice(product.valor)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getRankIcon(index + 1)}
                          <span className="text-xs text-gray-500">{product.score} vendas</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                      onClick={() => window.open(product.link, '_blank')}
                    >
                      Ver Produto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {categories.slice(0, 3).map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryRankings[category]?.map((product, index) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${getRankBadgeColor(index + 1)} flex items-center justify-center text-white font-bold`}>
                          {index + 1}
                        </div>
                        <div className="w-16 h-16 rounded-lg overflow-hidden">
                          <OptimizedImage 
                            src={product.imagem1}
                            alt={product.produto}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                            {product.produto}
                          </h4>
                          <p className="text-red-500 font-bold text-sm">
                            {formatPrice(product.valor)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getRankIcon(index + 1)}
                            <span className="text-xs text-gray-500">{product.score} vendas</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        onClick={() => window.open(product.link, '_blank')}
                      >
                        Ver Produto
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
