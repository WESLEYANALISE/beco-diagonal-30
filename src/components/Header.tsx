
import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, DollarSign, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MagicalLogo } from '@/components/MagicalLogo';
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onSearch: (term: string) => void;
  onPriceFilter: (min: number, max: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onPriceFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    onSearch('');
  }, [onSearch]);

  const handlePriceRangeChange = useCallback((values: number[]) => {
    setPriceRange(values);
  }, []);

  const applyPriceFilter = useCallback(() => {
    onPriceFilter(priceRange[0], priceRange[1]);
    setIsPriceFilterActive(true);
    setIsFilterOpen(false);
  }, [priceRange, onPriceFilter]);

  const clearPriceFilter = useCallback(() => {
    setPriceRange([0, 500]);
    onPriceFilter(0, 1000);
    setIsPriceFilterActive(false);
  }, [onPriceFilter]);

  const predefinedRanges = useMemo(() => [
    { label: 'Até R$ 50', min: 0, max: 50 },
    { label: 'R$ 50-100', min: 50, max: 100 },
    { label: 'R$ 100-200', min: 100, max: 200 },
    { label: 'Acima R$ 200', min: 200, max: 500 }
  ], []);

  const formatPrice = (price: number) => `R$ ${price}`;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-magical-deepPurple/95 via-magical-mysticalPurple/95 to-magical-deepPurple/95 backdrop-blur-xl border-b border-magical-gold/30 shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <MagicalLogo />
          </div>

          {/* Search and Filter Container */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex items-center gap-2">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magical-starlight/60 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar artefatos mágicos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-10 bg-magical-starlight/10 border-magical-gold/30 text-magical-starlight placeholder:text-magical-starlight/60 focus:border-magical-gold focus:ring-magical-gold/20 rounded-full h-10"
                  />
                  {searchTerm && (
                    <Button
                      onClick={handleClearSearch}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-magical-gold/20 text-magical-starlight/60 hover:text-magical-gold"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`relative border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20 rounded-full h-10 px-3 ${
                      isPriceFilterActive ? 'bg-magical-gold/20 border-magical-gold' : ''
                    }`}
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    {isMobile ? '' : 'Preço'}
                    {isPriceFilterActive && (
                      <Badge className="ml-1 bg-magical-crimson text-white text-xs px-1 py-0 h-4">
                        •
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Card className="border-magical-gold/30 bg-magical-deepPurple/95 backdrop-blur-xl">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-magical-starlight flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Filtro por Preço
                        </h3>
                        {isPriceFilterActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearPriceFilter}
                            className="h-6 w-6 p-0 hover:bg-magical-crimson/20 text-magical-crimson"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      {/* Range Display */}
                      <div className="flex justify-between text-sm text-magical-starlight/80">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>

                      {/* Slider */}
                      <Slider
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        max={500}
                        min={0}
                        step={5}
                        className="w-full"
                      />

                      {/* Predefined Ranges */}
                      <div className="grid grid-cols-2 gap-2">
                        {predefinedRanges.map((range) => (
                          <Button
                            key={range.label}
                            variant="outline"
                            size="sm"
                            onClick={() => setPriceRange([range.min, range.max])}
                            className="text-xs h-8 border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20"
                          >
                            {range.label}
                          </Button>
                        ))}
                      </div>

                      {/* Apply Button */}
                      <Button
                        onClick={applyPriceFilter}
                        size="sm"
                        className="w-full bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold"
                      >
                        Aplicar Filtro
                      </Button>
                    </CardContent>
                  </Card>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Optional: Additional header content on desktop */}
          {!isMobile && (
            <div className="flex-shrink-0">
              {/* Espaço para conteúdo adicional no desktop se necessário */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
