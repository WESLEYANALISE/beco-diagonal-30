
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, X, Sparkles, Book, Wand2, Package, Shirt, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagicalLogo } from '@/components/MagicalLogo';
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('categoria')
        .not('categoria', 'is', null);

      if (error) throw error;

      const uniqueCategories = [...new Set(data?.map(item => item.categoria) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Livros': <Book className="w-4 h-4" />,
      'Varitas': <Wand2 className="w-4 h-4" />,
      'Poções': <Package className="w-4 h-4" />,
      'Roupas': <Shirt className="w-4 h-4" />,
      'Acessórios': <Crown className="w-4 h-4" />,
    };
    return iconMap[category] || <Sparkles className="w-4 h-4" />;
  };

  const handleCategoryClick = (categoria: string) => {
    navigate(`/categoria/${encodeURIComponent(categoria)}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 backdrop-blur-xl border-b border-magical-gold/30 shadow-2xl">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu Hambúrguer */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(true)}
            className="text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/10 transition-colors duration-300"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo */}
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <MagicalLogo />
          </div>

          {/* Botão de Busca */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/explorar')}
            className="text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/10 transition-colors duration-300"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Barra de busca (opcional, pode ser expandida) */}
        <form onSubmit={handleSearch} className="mt-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar artefatos mágicos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-magical-starlight/10 border-magical-gold/30 text-magical-starlight placeholder:text-magical-starlight/60 focus:border-magical-gold focus:ring-magical-gold/20 font-enchanted"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-magical-gold hover:bg-magical-bronze text-magical-midnight"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Menu Lateral */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-magical-midnight/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-b from-magical-deepPurple via-magical-mysticalPurple to-magical-deepPurple border-r-2 border-magical-gold/30 shadow-2xl shadow-magical-gold/20 overflow-y-auto">
            <div className="p-4">
              {/* Header do Menu */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-magical-gold animate-pulse" />
                  <h2 className="text-xl font-bold text-magical-starlight font-magical">Menu Mágico</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-magical-starlight hover:text-magical-gold"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                {/* Sobre o Universo - Primeiro item */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/10 transition-all duration-300 font-enchanted p-3 rounded-lg border border-magical-gold/20"
                  onClick={() => {
                    navigate('/sobre');
                    setIsMenuOpen(false);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-3" />
                  Sobre o Universo
                </Button>

                {/* Divisor */}
                <div className="my-4 border-t border-magical-gold/30"></div>

                {/* Categorias */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-magical-gold mb-3 font-magical flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Categorias de Artefatos
                  </h3>
                  <div className="space-y-1 ml-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className="w-full justify-start text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/10 transition-all duration-300 font-enchanted p-2 rounded text-sm"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {getCategoryIcon(category)}
                        <span className="ml-3">{category}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Outras opções do menu */}
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/10 transition-all duration-300 font-enchanted p-3"
                    onClick={() => {
                      navigate('/favoritos');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Crown className="w-4 h-4 mr-3" />
                    Favoritos
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/10 transition-all duration-300 font-enchanted p-3"
                    onClick={() => {
                      navigate('/novos');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-3" />
                    Novidades
                  </Button>
                </div>
              </nav>

              {/* Footer do Menu */}
              <div className="mt-8 pt-4 border-t border-magical-gold/30">
                <p className="text-xs text-magical-starlight/60 text-center font-enchanted">
                  ✨ Explore o mundo mágico ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
