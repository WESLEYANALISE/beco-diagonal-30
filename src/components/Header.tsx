import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Crown, Wand2, Home, Search, Grid3X3, Sparkles, Info, Star, ShoppingCart, Shirt, Smartphone, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PriceFilter } from '@/components/PriceFilter';
import { useFavorites } from '@/hooks/useFavorites';
import { MagicalLogo } from '@/components/MagicalLogo';
import { supabase } from "@/integrations/supabase/client";
interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onPriceFilter?: (minPrice: number, maxPrice: number) => void;
}
const Header = ({
  onSearch = () => {},
  onPriceFilter = () => {}
}: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    favoritesCount
  } = useFavorites();
  const navItems = [{
    path: '/',
    label: 'Salão Principal',
    icon: Home
  }, {
    path: '/categorias',
    label: 'Escolas de Magia',
    icon: Grid3X3
  }, {
    path: '/favoritos',
    label: 'Grimório Pessoal',
    icon: Crown
  }, {
    path: '/novos',
    label: 'Novos Encantamentos',
    icon: Sparkles
  }, {
    path: '/explorar',
    label: 'Mapa do Maroto',
    icon: Search
  }];
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('HARRY POTTER').select('categoria').not('categoria', 'is', null).not('categoria', 'eq', '');
      if (error) throw error;
      if (data) {
        const uniqueCategories = [...new Set(data.map(item => item.categoria))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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
    return iconMap[category] || Package;
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  const handleCategoryNavigation = (category: string) => {
    navigate(`/categoria/${encodeURIComponent(category)}`);
    setIsOpen(false);
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };
  const handlePriceFilterChange = (minPrice: number, maxPrice: number) => {
    onPriceFilter(minPrice, maxPrice);
  };
  const handleClearFilter = () => {
    onPriceFilter(0, 1000);
  };
  const handleEvaluateApp = () => {
    window.open('https://play.google.com/store/apps/details?id=br.com.app.gpu3121847.gpu5864a3ed792bc282cc5655927ef358d2', '_blank');
    setIsOpen(false);
  };
  return <>
      {/* Desktop/Mobile Header */}
      <header className="bg-gradient-to-r from-magical-deepPurple via-magical-mysticalPurple to-magical-darkBlue text-magical-starlight shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-magical-gold/20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <MagicalLogo size="md" showText={true} />
            </div>

            <div className="flex items-center space-x-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.slice(1).map(item => <Button key={item.path} variant="ghost" size="sm" className="text-magical-starlight hover:bg-magical-gold/20 rounded-xl relative font-enchanted hover:text-magical-gold transition-all duration-300" onClick={() => handleNavigation(item.path)}>
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>)}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gradient-to-b from-magical-deepPurple to-magical-mysticalPurple text-magical-starlight border-l border-magical-gold/30">
                  <div className="py-6">
                    <div className="flex items-center space-x-3 mb-8 px-2">
                      <MagicalLogo size="md" showText={true} />
                    </div>
                    
                    {/* Price Filter - Only show on homepage */}
                    {location.pathname === '/' && <div className="mb-6 mx-2">
                        <PriceFilter onFilter={handlePriceFilterChange} onClear={handleClearFilter} />
                      </div>}
                    
                    <nav className="space-y-2">
                      {/* About App - First item */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-magical-gold/20 font-enchanted">
                            <Info className="w-5 h-5" />
                            <span className="font-medium">Sobre o Universo</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm mx-4 bg-magical-midnight/95 backdrop-blur-xl border border-magical-gold/30 shadow-2xl max-h-[90vh] overflow-y-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-midnight/90 rounded-lg backdrop-blur-xl"></div>
                          <div className="relative z-10">
                            <DialogHeader className="space-y-3 text-center pb-4">
                              <MagicalLogo size="lg" showText={false} />
                              <DialogTitle className="text-xl font-magical font-bold bg-gradient-to-r from-magical-gold to-magical-bronze bg-clip-text text-transparent">
                                Universo Potter
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-magical-starlight text-sm">
                              <div className="text-center">
                                <p className="font-semibold text-magical-gold mb-2 font-enchanted">
                                  Bem-vindo ao mundo mágico de compras!
                                </p>
                                <p className="text-xs text-magical-silver leading-relaxed">
                                  Descubra artefatos mágicos com os melhores preços do mundo bruxo
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-magical-gold rounded-full mt-1.5 flex-shrink-0 animate-sparkle"></div>
                                  <p className="text-xs leading-relaxed">
                                    Nosso universo reúne cuidadosamente os <span className="font-semibold text-magical-gold">melhores artefatos mágicos</span>, oferecendo acesso aos itens mais essenciais para sua jornada bruxa.
                                  </p>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-magical-bronze rounded-full mt-1.5 flex-shrink-0 animate-sparkle"></div>
                                  <p className="text-xs leading-relaxed">
                                    Desde poções de beleza, decoração para sua casa até varinhas e acessórios mágicos, tudo selecionado para garantir <span className="font-semibold text-magical-bronze">qualidade e economia</span>.
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-r from-magical-gold/20 via-magical-bronze/20 to-magical-gold/20 p-3 rounded-lg border border-magical-gold/30 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base">✨</span>
                                  <p className="text-xs font-semibold text-magical-gold font-magical">
                                    Economize tempo e galeões
                                  </p>
                                </div>
                                <p className="text-xs text-magical-bronze">
                                  Encontre os melhores encantamentos em um só lugar!
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Navigation Items */}
                      {navItems.map(item => <button key={item.path} onClick={() => handleNavigation(item.path)} className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-magical-gold/20 relative font-enchanted">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>)}
                      
                      {/* Separator */}
                      <div className="border-t border-magical-gold/20 my-4 mx-4"></div>
                      
                      {/* Product Categories */}
                      <div className="px-4 py-2">
                        <h3 className="text-sm font-semibold text-magical-gold mb-3 font-magical">
                          🏰 Casas de Hogwarts
                        </h3>
                        <div className="space-y-1">
                          {categories.map(category => {
                          const IconComponent = getCategoryIcon(category);
                          return <button key={category} onClick={() => handleCategoryNavigation(category)} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 w-full text-left hover:bg-magical-gold/20 text-sm font-enchanted">
                                <IconComponent className="w-4 h-4 text-magical-bronze" />
                                <span className="font-medium">{category}</span>
                              </button>;
                        })}
                        </div>
                      </div>
                      
                      {/* Separator */}
                      <div className="border-t border-magical-gold/20 my-4 mx-4"></div>
                      
                      {/* Rate App */}
                      <button onClick={handleEvaluateApp} className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-magical-gold/20 font-enchanted">
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Avaliar Universo</span>
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Bar - Always visible at top - Smaller on desktop */}
        {location.pathname === '/' && <div className="px-4 pb-3">
            <div className="relative w-full max-w-md mx-auto md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magical-gold/70 w-5 h-5" />
              <Input placeholder="Buscar artefatos mágicos..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="pl-10 bg-magical-starlight/90 border-magical-gold/30 text-magical-midnight placeholder:text-magical-deepPurple/60 focus:bg-magical-starlight focus:border-magical-gold" />
            </div>
          </div>}
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-magical-deepPurple to-magical-mysticalPurple border-t border-magical-gold/30 z-50 shadow-2xl">
        
      </div>
    </>;
};
export default Header;