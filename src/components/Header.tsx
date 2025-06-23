
import React, { useState } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, Heart, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Greeting } from './Greeting';
import { useTutorialAndUser } from '@/hooks/useTutorialAndUser';

interface HeaderProps {
  onSearch?: (term: string) => void;
  onPriceFilter?: (min: number, max: number) => void;
}

const Header = ({ onSearch, onPriceFilter }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { userData } = useTutorialAndUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Shopee Showcase
              </h1>
              <p className="text-white/80 text-xs">
                Os melhores produtos em um só lugar
              </p>
            </div>
          </div>

          {/* Saudação */}
          <div className="hidden md:block">
            <Greeting userName={userData?.name} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/favoritos')}
              className="text-white hover:bg-white/20 rounded-xl relative"
            >
              <Heart className="w-5 h-5" />
              <span className="sr-only">Favoritos</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/perfil')}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <User className="w-5 h-5" />
              <span className="sr-only">Perfil</span>
            </Button>
          </div>
        </div>

        {/* Saudação mobile */}
        <div className="md:hidden mb-4 flex justify-center">
          <Greeting userName={userData?.name} />
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={handleInputChange}
              className="pl-10 pr-4 py-2 bg-white/90 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-white/30 transition-all duration-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl px-3"
            onClick={() => onPriceFilter && onPriceFilter(0, 1000)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
