
import React from 'react';
import { ArrowRight, SortAsc, DollarSign, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductGrid } from '@/components/ProductGrid';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
}

interface ProductsExploreSectionProps {
  showingAI: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'nome' | 'preco';
  setSortBy: (sort: 'nome' | 'preco') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  displayedProducts: Product[];
}

export const ProductsExploreSection: React.FC<ProductsExploreSectionProps> = ({
  showingAI,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  selectedCategory,
  setSelectedCategory,
  categories,
  displayedProducts
}) => {
  const navigate = useNavigate();

  if (showingAI) return null;

  return (
    <section className="px-4 md:px-6 py-8 md:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 animate-slide-in-left font-magical">
              🏰 Explorar Relíquias Mágicas
            </h2>
            <p className="text-base text-magical-starlight/80 mb-4 animate-slide-in-right font-enchanted">
              {searchTerm ? `Artefatos encontrados para "${searchTerm}"` : 'Navegue por nossa coleção completa de relíquias ancestrais'}
            </p>
          </div>
          
          <div className="flex gap-2 animate-slide-in-right">
            <Select value={sortBy} onValueChange={(value: 'nome' | 'preco') => setSortBy(value)}>
              <SelectTrigger className="bg-magical-starlight text-magical-midnight border-0 w-32 font-enchanted shadow-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-magical-starlight border-magical-gold/30 z-50">
                <SelectItem value="nome">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4" />
                    Nome
                  </div>
                </SelectItem>
                <SelectItem value="preco">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valor
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
              className="bg-magical-starlight text-magical-midnight border-0 hover:bg-magical-silver/20 transition-all duration-300 hover:scale-105 shadow-md"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        <div className="max-w-md mx-auto mb-6 animate-scale-in">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-magical-starlight/90 border-magical-gold/40 text-magical-midnight font-enchanted shadow-lg">
              <SelectValue placeholder="Selecione uma Casa de Hogwarts" />
            </SelectTrigger>
            <SelectContent className="bg-magical-starlight border-magical-gold/30 z-50">
              <SelectItem value="todas">Todas as Casas</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ProductGrid products={displayedProducts.slice(0, 20)} compact={true} />

        {displayedProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-levitate border border-magical-gold/30 shadow-2xl">
              <Wand2 className="w-16 h-16 text-magical-gold/50" />
            </div>
            <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
              Nenhuma relíquia encontrada
            </h2>
            <p className="text-magical-starlight/80 mb-6 font-enchanted">
              {searchTerm ? `Não encontramos relíquias para "${searchTerm}"` : 'Não há relíquias nesta Casa de Hogwarts'}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')} 
                className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-xl"
              >
                Ver Todas as Relíquias
              </Button>
            )}
          </div>
        )}

        {displayedProducts.length > 20 && (
          <div className="text-center mt-8 animate-fade-in">
            <Button 
              onClick={() => navigate(`/categoria-lista?categoria=${selectedCategory}&tipo=categoria`)} 
              className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-xl hover:shadow-magical-gold/30"
            >
              Ver Todas as {displayedProducts.length} Relíquias
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
