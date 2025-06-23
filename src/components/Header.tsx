
import { useState } from 'react';
import { Search, Menu, X, Info, ShoppingBag, Heart, User, Filter, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch: (term: string) => void;
  onPriceFilter: (min: number, max: number) => void;
}

const Header = ({ onSearch, onPriceFilter }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSearchTerm('');
  };

  const handlePriceFilter = () => {
    onPriceFilter(priceRange[0], priceRange[1]);
  };

  const navigationItems = [
    { name: 'Início', path: '/', icon: ShoppingBag },
    { name: 'Categorias', path: '/categorias', icon: Menu },
    { name: 'Novos', path: '/novos', icon: ShoppingBag },
    { name: 'Favoritos', path: '/favoritos', icon: Heart },
    { name: 'Perfil', path: '/perfil', icon: User },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              ShopeeHub
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-8 px-3"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {item.name}
                </Button>
              );
            })}
            
            {/* Price Filter */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-500" />
                    Filtro de Preço
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Faixa de Preço</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      min={0}
                      step={10}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>R$ {priceRange[0]}</span>
                      <span>R$ {priceRange[1]}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePriceFilter}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Aplicar Filtro
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* About Dialog */}
            <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                  <Info className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-lg mx-4 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Sobre o ShopeeHub
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm leading-relaxed">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-700 mb-2">🛍️ Sua Central de Compras</h3>
                    <p className="text-gray-700">
                      O ShopeeHub é sua plataforma definitiva para descobrir os melhores produtos da Shopee, 
                      com curadoria especializada e ferramentas inteligentes para ajudar você a encontrar 
                      exatamente o que precisa.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-600 mb-1">🔍 Busca Inteligente</h4>
                      <p className="text-xs text-gray-600">
                        Encontre produtos por categoria, preço ou palavra-chave com nossa busca avançada.
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-600 mb-1">🤖 IA Assistente</h4>
                      <p className="text-xs text-gray-600">
                        Nossa IA analisa produtos e te ajuda a escolher a melhor opção baseada nas suas necessidades.
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-600 mb-1">❤️ Lista de Favoritos</h4>
                      <p className="text-xs text-gray-600">
                        Salve seus produtos favoritos e acesse-os rapidamente quando quiser.
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-600 mb-1">📱 Totalmente Responsivo</h4>
                      <p className="text-xs text-gray-600">
                        Funciona perfeitamente em celular, tablet e desktop.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-700 mb-2">✨ Recursos Principais</h3>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>• Navegação por categorias organizadas</li>
                      <li>• Produtos em destaque e novidades</li>
                      <li>• Comparação inteligente com IA</li>
                      <li>• Interface limpa e intuitiva</li>
                      <li>• Links diretos para a Shopee</li>
                      <li>• Atualizações constantes do catálogo</li>
                    </ul>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-500 mb-3">
                      Desenvolvido com ❤️ para melhorar sua experiência de compras
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => setIsAboutOpen(false)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6"
                      >
                        Começar a Explorar
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-8 px-3"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-orange-200 bg-white/95 backdrop-blur-sm">
            <div className="py-4 space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  >
                    <IconComponent className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                );
              })}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                    <Filter className="w-4 h-4 mr-3" />
                    Filtros
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm mx-4">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-orange-500" />
                      Filtro de Preço
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Faixa de Preço</label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        min={0}
                        step={10}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>R$ {priceRange[0]}</span>
                        <span>R$ {priceRange[1]}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={handlePriceFilter}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Aplicar Filtro
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                onClick={() => {
                  setIsAboutOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              >
                <Info className="w-4 h-4 mr-3" />
                Sobre o App
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
