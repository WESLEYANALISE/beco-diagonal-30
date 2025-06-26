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
  return;
};