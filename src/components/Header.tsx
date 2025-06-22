
import { useState } from 'react';
import { Menu, X, ShoppingCart, Heart, Home, Search, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/favoritos', label: 'Favoritos', icon: Heart },
    { path: '/carrinho', label: 'Carrinho', icon: ShoppingCart },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <>
      {/* Desktop/Mobile Header */}
      <header className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-2xl p-2 backdrop-blur-sm">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Achadinhos Shopee</h1>
                <p className="text-xs text-orange-100">Ofertas Imperdíveis</p>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.slice(1).map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-xl"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/20 p-2 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-gradient-to-b from-red-500 to-orange-500 text-white border-0">
                  <div className="py-6">
                    <div className="flex items-center space-x-3 mb-8 px-2">
                      <div className="bg-white/20 rounded-2xl p-3">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Achadinhos Shopee</h2>
                        <p className="text-sm text-orange-100">Ofertas Imperdíveis</p>
                      </div>
                    </div>
                    
                    {/* Mobile Search */}
                    <div className="mb-6 px-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                        <Input
                          placeholder="Buscar produtos..."
                          className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                        />
                      </div>
                    </div>
                    
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 w-full text-left hover:bg-white/20"
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 border-t border-white/20 z-50 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 text-white hover:bg-white/20"
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
