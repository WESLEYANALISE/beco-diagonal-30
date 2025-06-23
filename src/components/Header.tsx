
import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onPriceFilter?: (min: number, max: number) => void;
}

const Header = ({ onSearch, onPriceFilter }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    setIsSearchModalOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="py-4">
                <Button variant="ghost" className="w-full justify-start">
                  Início
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Categorias
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Favoritos
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsAboutModalOpen(true)}>
                  Sobre o App
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <span className="font-bold text-xl">Shopee Produtos</span>

          {/* Search Bar (Hidden on small screens) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="h-9"
            />
            <Button type="submit" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </form>

          {/* Mobile Search Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsSearchModalOpen(true)}>
            <Search className="w-5 h-5" />
          </Button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* About Modal */}
      <Dialog open={isAboutModalOpen} onOpenChange={setIsAboutModalOpen}>
        <DialogContent className="w-full max-w-[95vw] max-h-[90vh] sm:max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-center mb-4">
              Sobre o App
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 px-2 sm:px-4">
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Shopee Produtos</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Descubra os melhores produtos da Shopee com preços incríveis e frete grátis para todo o Brasil!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">🛍️ Variedade</h4>
                <p className="text-xs sm:text-sm text-blue-700">
                  Milhares de produtos organizados por categorias para facilitar sua busca.
                </p>
              </div>
              
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">💰 Preços Baixos</h4>
                <p className="text-xs sm:text-sm text-green-700">
                  Os melhores preços do mercado com ofertas exclusivas da Shopee.
                </p>
              </div>
              
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">🚚 Frete Grátis</h4>
                <p className="text-xs sm:text-sm text-purple-700">
                  Entrega gratuita para todo o Brasil em produtos selecionados.
                </p>
              </div>
              
              <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2 text-sm sm:text-base">⭐ Qualidade</h4>
                <p className="text-xs sm:text-sm text-orange-700">
                  Produtos avaliados com alta qualidade e satisfação dos clientes.
                </p>
              </div>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs sm:text-sm text-gray-500 mb-4">
                Versão 1.0.0 • Desenvolvido com ❤️
              </p>
              <Button 
                onClick={() => setIsAboutModalOpen(false)}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2"
              >
                Começar a Comprar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SearchModal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <DialogTitle>Buscar Produtos</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsSearchModalOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 p-4">
            <Input
              type="search"
              placeholder="Digite o nome do produto..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
