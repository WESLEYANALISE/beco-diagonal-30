
import { useState } from 'react';
import { Menu, X, Calendar, Video, Users, ShoppingCart, Book, Trophy, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/blog', label: 'Blog', icon: Book },
    { path: '/videos', label: 'Vídeos', icon: Video },
    { path: '/desafio', label: 'Desafio 90 Dias', icon: Trophy },
    { path: '/loja', label: 'Loja', icon: ShoppingCart },
    { path: '/lembrete', label: 'Lembretes', icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-2">
                <Users className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Minha Barba</h1>
                <p className="text-xs text-amber-100">Dicas e Minoxidil</p>
              </div>
            </Link>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-amber-500">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="py-6">
                  <div className="flex items-center space-x-3 mb-8 px-2">
                    <div className="bg-amber-100 rounded-full p-2">
                      <Users className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Minha Barba</h2>
                      <p className="text-sm text-gray-600">Dicas e Minoxidil</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-amber-100 text-amber-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
