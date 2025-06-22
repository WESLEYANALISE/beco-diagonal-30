
import { useState } from 'react';
import { Menu, X, Users, Trophy, Home, Package, Play, Book } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/desafio', label: 'Desafio 90 Dias', icon: Trophy },
    { path: '/loja', label: 'Produtos', icon: Package },
    { path: '/videos', label: 'Vídeos', icon: Play },
    { path: '/blog', label: 'Blog', icon: Book },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-2xl p-2 backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Minha Barba</h1>
                <p className="text-xs text-blue-100">Transformação Garantida</p>
              </div>
            </Link>

            <div className="flex items-center space-x-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white">
                  <div className="py-6">
                    <div className="flex items-center space-x-3 mb-8 px-2">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Minha Barba</h2>
                        <p className="text-sm text-gray-600">Transformação Garantida</p>
                      </div>
                    </div>
                    
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                            isActive(item.path)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg'
                              : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
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
        </div>
      </header>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 shadow-2xl">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-blue-600 bg-blue-50 scale-105 shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate max-w-full">
                {item.label === 'Desafio 90 Dias' ? 'Desafio' : item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
