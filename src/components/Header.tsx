
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, Home, Search, Grid3X3, Sparkles, Info, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PriceFilter } from '@/components/PriceFilter';
import { useFavorites } from '@/hooks/useFavorites';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onPriceFilter?: (minPrice: number, maxPrice: number) => void;
}

const Header = ({ onSearch = () => {}, onPriceFilter = () => {} }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/categorias', label: 'Categorias', icon: Grid3X3 },
    { path: '/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/novos', label: 'Novidades', icon: Sparkles },
    { path: '/explorar', label: 'Explorar', icon: Search },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
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
    onPriceFilter(0, 1000); // Reset to default range
  };

  const handleEvaluateApp = () => {
    window.open('https://play.google.com/store/apps/details?id=br.com.app.gpu3121847.gpu5864a3ed792bc282cc5655927ef358d2', '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop/Mobile Header */}
      <header className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="bg-white/20 rounded-2xl p-2 backdrop-blur-sm">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Achadinhos Online</h1>
                <p className="text-xs text-orange-100">Ofertas Imperdíveis</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.slice(1).map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-xl relative"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/20 p-2 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gradient-to-b from-red-500 to-orange-500 text-white border-0">
                  <div className="py-6">
                    <div className="flex items-center space-x-3 mb-8 px-2">
                      <div className="bg-white/20 rounded-2xl p-3">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Achadinhos Online</h2>
                        <p className="text-sm text-orange-100">Ofertas Imperdíveis</p>
                      </div>
                    </div>
                    
                    {/* Price Filter - Only show on homepage */}
                    {location.pathname === '/' && (
                      <div className="mb-6 mx-2">
                        <PriceFilter
                          onFilter={handlePriceFilterChange}
                          onClear={handleClearFilter}
                        />
                      </div>
                    )}
                    
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20 relative"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                      
                      {/* Separator */}
                      <div className="border-t border-white/20 my-4 mx-4"></div>
                      
                      {/* About App */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20">
                            <Info className="w-5 h-5" />
                            <span className="font-medium">Sobre o app</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm mx-4 bg-white/95 backdrop-blur-xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-50/90 via-orange-50/90 to-white/90 rounded-lg backdrop-blur-xl"></div>
                          <div className="relative z-10">
                            <DialogHeader className="space-y-3 text-center pb-4">
                              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingCart className="w-6 h-6 text-white" />
                              </div>
                              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                Achadinhos Online
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-gray-700 text-sm">
                              <div className="text-center">
                                <p className="font-semibold text-gray-800 mb-2">
                                  Seu companheiro perfeito para economizar!
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  Encontre os melhores produtos com os menores preços
                                </p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <p className="text-xs leading-relaxed">
                                    Nosso app reúne cuidadosamente os <span className="font-semibold text-red-600">melhores achadinhos online</span>, oferecendo acesso aos produtos mais essenciais para o seu dia a dia.
                                  </p>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                  <p className="text-xs leading-relaxed">
                                    Desde itens de beleza, casa e decoração até gadgets e acessórios, tudo selecionado para garantir <span className="font-semibold text-orange-600">qualidade e economia</span>.
                                  </p>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-r from-red-100 via-orange-100 to-red-100 p-3 rounded-lg border border-red-200/50 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base">💰</span>
                                  <p className="text-xs font-semibold text-red-700">
                                    Economize tempo e dinheiro
                                  </p>
                                </div>
                                <p className="text-xs text-red-600">
                                  Encontre as melhores ofertas em um só lugar!
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Rate App */}
                      <button
                        onClick={handleEvaluateApp}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20"
                      >
                        <Star className="w-5 h-5" />
                        <span className="font-medium">Avaliar App</span>
                      </button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Bar - Always visible at top - Smaller on desktop */}
        {location.pathname === '/' && (
          <div className="px-4 pb-3">
            <div className="relative w-full max-w-md mx-auto md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-white border-white/30 text-gray-900 placeholder:text-gray-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 border-t border-white/20 z-50 shadow-2xl">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 text-white hover:bg-white/20 relative"
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
