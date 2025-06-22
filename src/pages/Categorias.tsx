
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import { supabase } from "@/integrations/supabase/client";

interface CategoryStats {
  categoria: string;
  count: number;
}

const Categorias = () => {
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) throw error;

      // Count products per category
      const categoryCount = (data || []).reduce((acc: Record<string, number>, item) => {
        const cat = item.categoria;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      const categoryStats = Object.entries(categoryCount).map(([categoria, count]) => ({
        categoria,
        count: count as number
      }));

      setCategories(categoryStats);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/?categoria=${encodeURIComponent(category)}`);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      'Beleza e Cuidados Pessoais': '💄',
      'Casa e Decoração': '🏠',
      'Diversão e Familia': '🎮',
      'Estilo e Moda': '👗',
      'Tecnologia e Acessórios': '📱'
    };
    return iconMap[category] || '🛍️';
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-pink-500 to-red-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-purple-500 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-48 bg-white/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <Header />
      
      {/* Hero Section */}
      <section className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl backdrop-blur-sm">
              <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Explore por <span className="text-yellow-300">Categorias</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubra produtos incríveis organizados por categoria
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 md:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.categoria} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg group cursor-pointer"
                onClick={() => handleCategoryClick(category.categoria)}
              >
                <div className={`bg-gradient-to-br ${getCategoryGradient(index)} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{getCategoryIcon(category.categoria)}</div>
                    <h3 className="text-xl font-bold mb-2">{category.categoria}</h3>
                    <p className="text-white/80 text-sm">{category.count} produtos disponíveis</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  >
                    Ver Produtos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categorias;
