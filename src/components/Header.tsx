
import { useState } from 'react';
import { Menu, X, Calendar, Video, Users, ShoppingCart, Book, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-amber-800 to-amber-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-white rounded-full p-2">
              <Users className="w-6 h-6 text-amber-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Minha Barba</h1>
              <p className="text-xs text-amber-200">Dicas e Minoxidil</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-amber-200 transition-colors">Início</Link>
            <Link to="/blog" className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <Book className="w-4 h-4" />
              Blog
            </Link>
            <Link to="/videos" className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <Video className="w-4 h-4" />
              Vídeos
            </Link>
            <Link to="/desafio" className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Desafio 90 Dias
            </Link>
            <Link to="/loja" className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              Loja
            </Link>
            <Link to="/lembrete" className="hover:text-amber-200 transition-colors flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Lembretes
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-amber-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-amber-200 transition-colors py-2">Início</Link>
              <Link to="/blog" className="hover:text-amber-200 transition-colors py-2 flex items-center gap-2">
                <Book className="w-4 h-4" />
                Blog
              </Link>
              <Link to="/videos" className="hover:text-amber-200 transition-colors py-2 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Vídeos
              </Link>
              <Link to="/desafio" className="hover:text-amber-200 transition-colors py-2 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Desafio 90 Dias
              </Link>
              <Link to="/loja" className="hover:text-amber-200 transition-colors py-2 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Loja
              </Link>
              <Link to="/lembrete" className="hover:text-amber-200 transition-colors py-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Lembretes
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
