
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, Home, Search, User, Grid3X3, Filter, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from '@/hooks/useFavorites';

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
  onPriceFilter?: (minPrice: number, maxPrice: number) => void;
}

const Header = ({ onSearch, onPriceFilter }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/categorias', label: 'Categorias', icon: Grid3X3 },
    { path: '/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handlePriceFilter = () => {
    onPriceFilter?.(priceRange[0], priceRange[1]);
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
                <h1 className="text-lg font-bold">Achadinhos Shopee</h1>
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
                    {item.path === '/favoritos' && favoritesCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs min-w-[20px] h-5 flex items-center justify-center p-0">
                        {favoritesCount}
                      </Badge>
                    )}
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
                        <h2 className="text-lg font-bold">Achadinhos Shopee</h2>
                        <p className="text-sm text-orange-100">Ofertas Imperdíveis</p>
                      </div>
                    </div>
                    
                    {/* Advanced Price Filter */}
                    {location.pathname === '/' && (
                      <Card className="mb-6 mx-2 bg-white/10 border-white/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-sm flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filtro por Preço
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/80">
                              <span>R$ {priceRange[0]}</span>
                              <span>R$ {priceRange[1]}</span>
                            </div>
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={1000}
                              min={0}
                              step={10}
                              className="w-full"
                            />
                          </div>
                          <Button
                            onClick={handlePriceFilter}
                            size="sm"
                            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                            variant="outline"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Aplicar Filtro
                          </Button>
                        </CardContent>
                      </Card>
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
                          {item.path === '/favoritos' && favoritesCount > 0 && (
                            <Badge className="ml-auto bg-yellow-500 text-black text-xs">
                              {favoritesCount}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Search Bar - Always visible at top */}
        {location.pathname === '/' && (
          <div className="px-4 pb-3">
            <div className="relative w-full">
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
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
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
              {item.path === '/favoritos' && favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs min-w-[16px] h-4 flex items-center justify-center p-0">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
