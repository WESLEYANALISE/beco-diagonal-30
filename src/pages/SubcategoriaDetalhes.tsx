
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from '@/components/Header';
import { LazyImage } from '@/components/LazyImage';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { supabase } from "@/integrations/supabase/client";
import { useSequentialMagicalSounds } from '@/hooks/useSequentialMagicalSounds';

interface SubcategoryInfo {
  subcategoria: string;
  count: number;
  sampleImage: string;
  sampleProduct: string;
}

const SubcategoriaDetalhes = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoria = searchParams.get('categoria') || '';
  
  const [subcategories, setSubcategories] = useState<SubcategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { playNextSequentialSound } = useSequentialMagicalSounds();
  
  const {
    showSuccess,
    showError
  } = useToastNotifications();

  useEffect(() => {
    fetchSubcategories();
  }, [categoria]);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('subcategoria, imagem1, produto')
        .eq('categoria', categoria)
        .not('subcategoria', 'is', null)
        .neq('subcategoria', '');

      if (error) throw error;

      // If no subcategories found, redirect directly to products
      if (!data || data.length === 0) {
        navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&tipo=categoria`);
        return;
      }

      // Group by subcategory and count
      const subcategoryMap = new Map<string, { count: number; image: string; product: string }>();
      
      data.forEach(item => {
        const subcat = item.subcategoria.trim();
        if (subcat && subcat !== '') {
          if (subcategoryMap.has(subcat)) {
            subcategoryMap.get(subcat)!.count += 1;
          } else {
            subcategoryMap.set(subcat, {
              count: 1,
              image: item.imagem1 || '',
              product: item.produto || ''
            });
          }
        }
      });

      // If only empty subcategories found, redirect to products
      if (subcategoryMap.size === 0) {
        navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&tipo=categoria`);
        return;
      }

      const subcategoryList = Array.from(subcategoryMap.entries()).map(([subcategoria, data]) => ({
        subcategoria,
        count: data.count,
        sampleImage: data.image,
        sampleProduct: data.product
      }));

      setSubcategories(subcategoryList);
      showSuccess("Subcategorias mágicas carregadas!");
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
      showError("Erro ao carregar subcategorias mágicas");
      // Redirect to products if there's an error
      navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&tipo=categoria`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (subcategoria: string) => {
    playNextSequentialSound();
    navigate(`/categoria-lista?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(subcategoria)}&tipo=subcategoria`);
  };

  const getMagicalCategoryName = (category: string) => {
    const nameMap: Record<string, string> = {
      'Itens Colecionáveis': 'Artefatos Colecionáveis Mágicos',
      'Bonecas e Brinquedos de Pelúcia': 'Criaturas Mágicas Encantadas',
      'Luminária': 'Iluminação Mística de Hogwarts',
      'Colares': 'Joias e Amuletos Encantados',
      'Moletons e Suéteres': 'Vestes das Casas de Hogwarts',
      'Capinhas': 'Proteções Místicas Portáteis',
      'Canecas': 'Cálices e Poções Mágicas'
    };
    return nameMap[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl backdrop-blur-sm border border-magical-gold/30 animate-magical-glow"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
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
      
      {/* Header da página */}
      <div className="bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 backdrop-blur-md border-b border-magical-gold/30 sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/categorias')} 
              className="text-magical-gold hover:text-magical-darkGold hover:bg-magical-gold/20 p-1 sm:p-2 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-magical-starlight truncate font-magical">
                {getMagicalCategoryName(categoria)}
              </h1>
              <p className="text-xs sm:text-sm text-magical-starlight/80 truncate font-enchanted">
                {subcategories.length > 0 ? 'Escolha sua especialização mágica' : 'Carregando especialização...'}
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-magical-gold animate-sparkle" />
          </div>
        </div>
      </div>

      {/* Carrossel de Subcategorias */}
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {subcategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-levitate shadow-2xl backdrop-blur-sm border border-magical-gold/40">
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-magical-gold" />
                <Sparkles className="w-4 h-4 text-magical-gold absolute top-2 right-2 animate-sparkle" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-magical-starlight mb-4 font-magical">
                Redirecionando para Artefatos Mágicos...
              </h2>
              <p className="text-magical-starlight/80 font-enchanted">
                Esta categoria não possui subcategorias. Você será redirecionado para ver todos os artefatos.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 font-magical">
                  ✨ Escolha sua Especialização Mágica
                </h2>
                <p className="text-magical-starlight/80 font-enchanted">
                  Encontramos {subcategories.length} especialização{subcategories.length !== 1 ? 'ões' : ''} mágica{subcategories.length !== 1 ? 's' : ''} em {categoria}
                </p>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-3">
                  {subcategories.map((subcategory, index) => (
                    <CarouselItem 
                      key={subcategory.subcategoria} 
                      className="pl-2 md:pl-3 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <Card 
                        className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 shadow-lg group cursor-pointer h-full backdrop-blur-sm hover:shadow-magical-gold/20 hover:animate-magical-glow"
                        onClick={() => handleSubcategoryClick(subcategory.subcategoria)}
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <LazyImage 
                            src={subcategory.sampleImage} 
                            alt={subcategory.subcategoria} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-magical-starlight">
                            <h3 className="text-lg font-bold mb-1 line-clamp-2 font-magical">
                              {subcategory.subcategoria}
                            </h3>
                            <p className="text-sm text-magical-starlight/80 font-enchanted">
                              {subcategory.count} artefato{subcategory.count !== 1 ? 's' : ''} mágico{subcategory.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-magical-gold animate-sparkle" />
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <Star className="w-3 h-3 text-magical-gold fill-current" />
                            <span className="text-xs text-magical-starlight font-bold">4.8</span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <Button 
                            className="w-full bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-semibold transition-all duration-300 hover:scale-105 border-0 shadow-lg hover:shadow-xl font-enchanted animate-magical-glow"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubcategoryClick(subcategory.subcategoria);
                            }}
                          >
                            Explorar Coleção
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:left-4 bg-magical-deepPurple/90 hover:bg-magical-mysticalPurple text-magical-gold border-magical-gold/30 hover:border-magical-gold backdrop-blur-sm" />
                <CarouselNext className="right-2 md:right-4 bg-magical-deepPurple/90 hover:bg-magical-mysticalPurple text-magical-gold border-magical-gold/30 hover:border-magical-gold backdrop-blur-sm" />
              </Carousel>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubcategoriaDetalhes;
