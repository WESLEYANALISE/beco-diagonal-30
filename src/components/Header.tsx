
import React, { useState } from 'react';
import { Search, Filter, Menu, X, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { UserGreeting } from './UserGreeting';
import { AboutModal } from './AboutModal';

interface HeaderProps {
  onSearch?: (term: string) => void;
  onPriceFilter?: (min: number, max: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onPriceFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAbout, setShowAbout] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onPriceFilter?.(values[0], values[1]);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top row with logo and menu */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Shopee Ofertas
              </h1>
              <UserGreeting />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAbout(true)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Info className="w-4 h-4" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="py-6">
                    <h2 className="text-lg font-semibold mb-4">Menu</h2>
                    <nav className="space-y-2">
                      <a href="/" className="block py-2 px-3 rounded-lg hover:bg-gray-100">Início</a>
                      <a href="/categorias" className="block py-2 px-3 rounded-lg hover:bg-gray-100">Categorias</a>
                      <a href="/favoritos" className="block py-2 px-3 rounded-lg hover:bg-gray-100">Favoritos</a>
                      <a href="/novos" className="block py-2 px-3 rounded-lg hover:bg-gray-100">Novos</a>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search and filters row */}
          <div className="pb-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 border-0 focus:bg-white"
                />
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Filter className="w-4 h-4" />
              </Button>
              
              <Button 
                type="submit" 
                size="sm"
                className="bg-white text-red-600 hover:bg-gray-100"
              >
                Buscar
              </Button>
            </form>

            {/* Price filter */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-medium">Faixa de Preço</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-white text-xs">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
};

export default Header;
