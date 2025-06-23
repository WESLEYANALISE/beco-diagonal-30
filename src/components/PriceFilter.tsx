
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Filter } from 'lucide-react';

interface PriceFilterProps {
  onFilter: (min: number, max: number) => void;
  onClear: () => void;
}

export const PriceFilter = ({ onFilter, onClear }: PriceFilterProps) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleFilter = () => {
    const min = minPrice ? parseFloat(minPrice.replace(/[^\d,]/g, '').replace(',', '.')) : 0;
    const max = maxPrice ? parseFloat(maxPrice.replace(/[^\d,]/g, '').replace(',', '.')) : 999999;
    
    if (min <= max) {
      onFilter(min, max);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    onClear();
    setIsOpen(false);
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    const formatted = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    return formatted;
  };

  const handlePriceChange = (value: string, setter: (value: string) => void) => {
    const formatted = formatCurrency(value);
    setter(formatted);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
      >
        <DollarSign className="w-4 h-4 mr-2" />
        Preço
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 z-50 w-80 bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filtrar por Preço</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Preço Mínimo</label>
                  <Input
                    placeholder="R$ 0,00"
                    value={minPrice}
                    onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Preço Máximo</label>
                  <Input
                    placeholder="R$ 999,00"
                    value={maxPrice}
                    onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleFilter}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Filtrar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
