
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Filter, DollarSign, X } from 'lucide-react';

interface PriceFilterProps {
  onFilter: (minPrice: number, maxPrice: number) => void;
  onClear: () => void;
  className?: string;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  onFilter,
  onClear,
  className = ""
}) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [manualMin, setManualMin] = useState('');
  const [manualMax, setManualMax] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleSliderChange = (values: number[]) => {
    setPriceRange(values);
    setManualMin(values[0].toString());
    setManualMax(values[1].toString());
  };

  const handleManualChange = () => {
    const min = parseInt(manualMin) || 0;
    const max = parseInt(manualMax) || 1000;
    setPriceRange([min, max]);
  };

  const applyFilter = () => {
    onFilter(priceRange[0], priceRange[1]);
    setIsActive(true);
  };

  const clearFilter = () => {
    setPriceRange([0, 500]);
    setManualMin('');
    setManualMax('');
    setIsActive(false);
    onClear();
  };

  return (
    <Card className={`bg-magical-starlight/10 border-magical-gold/30 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-magical-starlight text-sm font-magical flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-magical-gold" />
          Filtro de Preço
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Slider
            value={priceRange}
            onValueChange={handleSliderChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-magical-starlight/80 font-enchanted">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            value={manualMin}
            onChange={(e) => setManualMin(e.target.value)}
            onBlur={handleManualChange}
            className="bg-magical-starlight/20 border-magical-gold/30 text-magical-starlight text-xs"
          />
          <Input
            placeholder="Max"
            value={manualMax}
            onChange={(e) => setManualMax(e.target.value)}
            onBlur={handleManualChange}
            className="bg-magical-starlight/20 border-magical-gold/30 text-magical-starlight text-xs"
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={applyFilter}
            className="flex-1 bg-magical-gold/90 text-magical-midnight hover:bg-magical-gold font-enchanted text-xs"
          >
            <Filter className="w-3 h-3 mr-1" />
            Filtrar
          </Button>
          {isActive && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearFilter}
              className="bg-magical-starlight/20 border-magical-gold/30 text-magical-starlight hover:bg-magical-starlight/30 text-xs"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
