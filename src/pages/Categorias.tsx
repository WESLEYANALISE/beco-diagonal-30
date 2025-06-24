
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowRight, Sparkles, Home, Gamepad2, Shirt, Smartphone, Zap, Crown, Wand2, ShoppingCart } from 'lucide-react';
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
        .from('HARRY POTTER')
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
    navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Itens Colecionáveis': Crown,
      'Bonecas e Brinquedos de Pelúcia': Sparkles,
      'Luminária': Wand2,
      'Colares': Crown,
      'Moletons e Suéteres': Shirt,
      'Capinhas': Smartphone,
      'Canecas': ShoppingCart
    };
    return iconMap[category] || Book;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30 animate-magical-glow"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20">
      <Header />
      
      {/* Hero Section */}
      <section className="md:px-6 md:py-16 px-[15px] py-[26px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-levitate shadow-2xl backdrop-blur-sm border border-magical-gold/40">
              <Book className="w-10 h-10 md:w-12 md:h-12 text-magical-gold" />
              <Sparkles className="w-4 h-4 text-magical-gold absolute top-2 right-2 animate-sparkle" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-magical-starlight mb-4 leading-tight font-magical">
              Explore por <span className="text-magical-gold animate-magical-glow">Categorias Mágicas</span>
            </h1>
            <p className="text-lg md:text-xl text-magical-starlight/90 mb-8 max-w-3xl mx-auto leading-relaxed font-enchanted">
              Descubra artefatos mágicos organizados pelos mestres da magia de Hogwarts
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 md:px-6 py-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.categoria);
              
              return (
                <Card 
                  key={category.categoria} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 shadow-lg group cursor-pointer animate-fade-in hover:-translate-y-1 backdrop-blur-sm hover:shadow-magical-gold/20 hover:animate-magical-glow" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleCategoryClick(category.categoria)}
                >
                  <div className={`bg-gradient-to-br ${getCategoryGradient(index)} p-4 md:p-6 text-magical-starlight relative overflow-hidden`}>
                    <div className="absolute -top-4 -right-4 w-16 md:w-24 h-16 md:h-24 bg-magical-gold/20 rounded-full transition-transform duration-500 group-hover:scale-110"></div>
                    <div className="absolute -bottom-4 -left-4 w-12 md:w-16 h-12 md:h-16 bg-magical-starlight/10 rounded-full transition-transform duration-500 group-hover:scale-125"></div>
                    
                    {/* Magical sparkles */}
                    <Zap className="absolute top-1 right-1 w-3 h-3 text-magical-gold animate-sparkle" />
                    
                    <div className="relative z-10">
                      <div className="mb-3 md:mb-4 transform transition-transform duration-300 group-hover:scale-110">
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
                      className="w-full bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold transition-all duration-300 hover:scale-105 text-xs md:text-sm py-2 md:py-3 shadow-lg hover:shadow-xl font-enchanted border-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.categoria);
                      }}
                    >
                      Ver Artefatos Mágicos
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categorias;
