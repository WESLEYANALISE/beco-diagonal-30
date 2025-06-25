
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LazyImage } from '@/components/LazyImage';

interface Subcategory {
  subcategoria: string;
  count: number;
  sample_image: string;
  sample_product: string;
}

interface SubcategoryExplorerProps {
  categoria: string;
  onBack: () => void;
}

export const SubcategoryExplorer: React.FC<SubcategoryExplorerProps> = ({
  categoria,
  onBack
}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
  }, [categoria]);

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('subcategoria, imagem1, produto')
        .eq('categoria', categoria)
        .not('subcategoria', 'is', null)
        .not('subcategoria', 'eq', '');

      if (error) throw error;

      // Processar subcategorias
      const subcategoryMap = new Map<string, { count: number; sample_image: string; sample_product: string }>();
      
      (data || []).forEach(item => {
        const sub = item.subcategoria;
        if (subcategoryMap.has(sub)) {
          subcategoryMap.get(sub)!.count += 1;
        } else {
          subcategoryMap.set(sub, {
            count: 1,
            sample_image: item.imagem1 || '',
            sample_product: item.produto || ''
          });
        }
      });

      const subcategoryStats = Array.from(subcategoryMap.entries()).map(([subcategoria, stats]) => ({
        subcategoria,
        count: stats.count,
        sample_image: stats.sample_image,
        sample_product: stats.sample_product
      }));

      setSubcategories(subcategoryStats);
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (subcategoria: string) => {
    navigate(`/categoria/${encodeURIComponent(categoria)}/subcategoria/${encodeURIComponent(subcategoria)}`);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-magical-gold/20 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-xl font-bold text-magical-starlight font-magical">
          {categoria}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {subcategories.map((subcategory, index) => (
          <Card
            key={subcategory.subcategoria}
            className="group overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/20 border-magical-gold/30 backdrop-blur-sm hover:border-magical-gold/60 animate-fade-in"
            onClick={() => handleSubcategoryClick(subcategory.subcategoria)}
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
        ))}
      </div>
    </div>
  );
};
