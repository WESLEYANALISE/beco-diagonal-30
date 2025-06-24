
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, ShoppingCart, X, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { PriceFilter } from '@/components/PriceFilter';
import { useFavorites } from '@/hooks/useFavorites';

interface HeaderProps {
  onSearch?: (term: string) => void;
  onPriceFilter?: (min: number, max: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onPriceFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useFavorites();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const menuItems = [
    { label: 'Início', path: '/' },
    { label: 'Categorias', path: '/categorias' },
    { label: 'Favoritos', path: '/favoritos' },
    { label: 'Novidades', path: '/novos' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handlePriceFilterChange = (min: number, max: number) => {
    if (onPriceFilter) {
      onPriceFilter(min, max);
    }
  };

  return (
    <header className="bg-gradient-to-r from-red-500 to-orange-500 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo/Brand - Mobile optimized */}
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl md:rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-white">Achadinhos Shopee</h1>
              <p className="text-xs md:text-sm text-white/80">Ofertas Imperdíveis</p>
            </div>
          </div>

          {/* Search Bar - Desktop version (smaller) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg xl:max-w-xl mx-4">
            <form onSubmit={handleSearch} className="flex w-full gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white border-0 text-gray-900 placeholder-gray-500 text-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="bg-white text-gray-700 border-0 hover:bg-gray-100"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden flex-1 mx-2">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white border-0 text-gray-900 placeholder-gray-500 text-sm pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* Mobile Price Filter Button */}
          <div className="md:hidden">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className="bg-white text-gray-700 border-0 hover:bg-gray-100 p-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`text-white hover:bg-white/20 transition-colors ${
                  location.pathname === item.path ? 'bg-white/20' : ''
                }`}
              >
                {item.label}
                {item.label === 'Favoritos' && favorites.length > 0 && (
                  <Badge className="ml-2 bg-yellow-500 text-yellow-900 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <nav className="space-y-3">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => handleMenuClick(item.path)}
                      className={`w-full justify-start text-gray-900 hover:bg-gray-100 ${
                        location.pathname === item.path ? 'bg-gray-100' : ''
                      }`}
                    >
                      {item.label}
                      {item.label === 'Favoritos' && favorites.length > 0 && (
                        <Badge className="ml-auto bg-yellow-500 text-yellow-900 text-xs">
                          {favorites.length}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Price Filter */}
        {showPriceFilter && (
          <div className="mt-3 md:mt-4">
            <PriceFilter onPriceChange={handlePriceFilterChange} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
