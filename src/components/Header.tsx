
import { useState } from 'react';
import { Search, Heart, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { PriceFilter } from './PriceFilter';

interface HeaderProps {
  onSearch?: (term: string) => void;
  onPriceFilter?: (min: number, max: number) => void;
}

const Header = ({ onSearch, onPriceFilter }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handlePriceFilter = (min: number, max: number) => {
    if (onPriceFilter) {
      onPriceFilter(min, max);
    }
  };

  const handlePriceClear = () => {
    if (onPriceFilter) {
      onPriceFilter(0, 999999);
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="bg-white rounded-lg p-2">
              <span className="text-red-500 font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">ShopeeHub</span>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-900 border-0 rounded-l-lg rounded-r-none h-10 pr-4"
              />
              <Button 
                type="submit"
                className="absolute right-0 top-0 h-10 px-4 bg-white hover:bg-gray-100 text-red-500 rounded-l-none rounded-r-lg border-0"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </form>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <PriceFilter onFilter={handlePriceFilter} onClear={handlePriceClear} />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/favoritos')}
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-5 h-5 mr-2" />
              Favoritos
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-900 border-0 rounded-l-lg rounded-r-none"
              />
              <Button 
                type="submit"
                className="bg-white hover:bg-gray-100 text-red-500 rounded-l-none rounded-r-lg border-0"
              >
                <Search className="w-5 h-5" />
              </Button>
            </form>
            
            <div className="flex items-center justify-between">
              <PriceFilter onFilter={handlePriceFilter} onClear={handlePriceClear} />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate('/favoritos');
                  setShowMobileMenu(false);
                }}
                className="text-white hover:bg-white/20"
              >
                <Heart className="w-5 h-5 mr-2" />
                Favoritos
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
