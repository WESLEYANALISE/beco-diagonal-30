
import React from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';

interface Subcategory {
  subcategoria: string;
  count: number;
  sample_image: string;
  sample_product: string;
}

interface SubcategoryCardProps {
  subcategory: Subcategory;
  onClick: () => void;
  index: number;
}

export const SubcategoryCard: React.FC<SubcategoryCardProps> = ({ 
  subcategory, 
  onClick, 
  index 
}) => {
  return (
    <Card 
      className="group overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/20 border-magical-gold/30 backdrop-blur-sm hover:border-magical-gold/60 animate-fade-in"
      onClick={onClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <LazyImage
          src={subcategory.sample_image}
          alt={subcategory.subcategoria}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/80 via-magical-midnight/20 to-transparent" />
        
        {/* Badge com contador */}
        <div className="absolute top-3 right-3">
          <div className="bg-magical-gold/90 text-magical-midnight px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-magical-gold/30">
            <Package className="w-3 h-3" />
            {subcategory.count}
          </div>
        </div>
        
        {/* Overlay com hover effect */}
        <div className="absolute inset-0 bg-magical-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-magical-starlight text-sm font-bold bg-magical-midnight/50 px-3 py-1 rounded-full backdrop-blur-sm border border-magical-gold/30">
            Explorar Artefatos
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-magical-starlight text-sm mb-2 line-clamp-2 group-hover:text-magical-gold transition-colors duration-300 font-enchanted">
          {subcategory.subcategoria}
        </h3>
        <p className="text-magical-starlight/70 text-xs font-enchanted">
          {subcategory.count} {subcategory.count === 1 ? 'artefato mágico' : 'artefatos mágicos'}
        </p>
      </CardContent>
    </Card>
  );
};
