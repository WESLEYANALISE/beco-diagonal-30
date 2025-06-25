
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Crown, Sparkles, Shirt, Smartphone, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  name: string;
  icon: React.ComponentType<any>;
}

interface CategoryQuickAccessProps {
  categories: string[];
}

export const CategoryQuickAccess: React.FC<CategoryQuickAccessProps> = ({ categories }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Itens Colecionáveis': Crown,
      'Bonecas e Brinquedos de Pelúcia': Sparkles,
      'Luminária': Wand2,
      'Colares': Crown,
      'Moletons e Suéteres': Shirt,
      'Capinhas': Smartphone,
      'Canecas': ShoppingCart
    };
    return iconMap[category] || ShoppingCart;
  };

  return (
    <section className="px-4 py-2 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/categoria-lista?categoria=todas&tipo=categoria')} 
            className="whitespace-nowrap transition-all duration-300 hover:scale-105 bg-magical-gold/30 text-magical-starlight border-magical-gold/50 hover:bg-magical-gold/40 flex items-center gap-2 font-enchanted shadow-lg hover:shadow-magical-gold/20"
          >
            <Wand2 className="w-4 h-4" />
            Todos os Artefatos Mágicos
          </Button>
          {categories.map(category => {
            if (!category) return null;
            const IconComponent = getCategoryIcon(category);
            return (
              <Button 
                key={category} 
                size="sm" 
                variant="outline" 
                onClick={() => navigate(`/categoria-lista?categoria=${encodeURIComponent(category)}&tipo=categoria`)} 
                className="whitespace-nowrap transition-all duration-300 hover:scale-105 bg-magical-gold/20 text-magical-starlight border-magical-gold/40 hover:bg-magical-gold/30 flex items-center gap-2 font-enchanted shadow-md hover:shadow-magical-gold/20"
              >
                <IconComponent className="w-4 h-4" />
                {category}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
