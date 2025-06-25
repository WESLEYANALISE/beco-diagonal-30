
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Filter, X } from 'lucide-react';

interface StrategicPriceFilterProps {
  onFilter: (minPrice: number, maxPrice: number) => void;
  onClear: () => void;
  className?: string;
}

export const StrategicPriceFilter: React.FC<StrategicPriceFilterProps> = ({ 
  onFilter, 
  onClear, 
  className = "" 
}) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (values: number[]) => {
    setPriceRange(values);
  };

  const applyFilter = () => {
    onFilter(priceRange[0], priceRange[1]);
    setIsActive(true);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setPriceRange([0, 500]);
    setIsActive(false);
    onClear();
    setIsOpen(false);
  };

  const quickFilters = [
    { label: 'Até R$ 50', min: 0, max: 50 },
    { label: 'R$ 50-100', min: 50, max: 100 },
    { label: 'R$ 100-200', min: 100, max: 200 },
    { label: 'Acima R$ 200', min: 200, max: 1000 }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`${className} bg-magical-starlight/90 border-magical-gold/40 text-magical-midnight hover:bg-magical-silver/20 transition-all duration-300 hover:scale-105 font-enchanted relative ${
            isActive ? 'ring-2 ring-magical-gold/50 bg-magical-gold/10' : ''
          }`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          {isActive ? `R$ ${priceRange[0]}-${priceRange[1]}` : 'Preço'}
          <Filter className="w-3 h-3 ml-1" />
          
          {isActive && (
            <div className="absolute -top-1 -right-1 bg-magical-crimson text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
              !
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-magical-starlight/95 border-magical-gold/30 backdrop-blur-sm" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-magical-midnight font-enchanted">Filtrar por Preço</h4>
            {isActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilter}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <X className="w-3 h-3 text-red-500" />
              </Button>
            )}
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-magical-midnight/70 font-enchanted">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={handleSliderChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Quick filters */}
          <div className="grid grid-cols-2 gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setPriceRange([filter.min, filter.max]);
                }}
                className="text-xs h-8 hover:bg-magical-gold/20 hover:border-magical-gold/50 font-enchanted"
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Apply button */}
          <Button
            onClick={applyFilter}
            className={`w-full ${
              isActive 
                ? 'bg-magical-emerald hover:bg-magical-emerald/80 text-white' 
                : 'bg-magical-gold hover:bg-magical-darkGold text-magical-midnight'
            } font-enchanted`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {isActive ? 'Filtro Aplicado' : 'Aplicar Filtro'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
