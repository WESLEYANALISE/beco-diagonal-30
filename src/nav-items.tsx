
import Categorias from './pages/Categorias';
import Favoritos from './pages/Favoritos';
import Novos from './pages/Novos';

export const navItems = [
  {
    to: '/categorias',
    page: <Categorias />,
  },
  {
    to: '/favoritos', 
    page: <Favoritos />,
  },
  {
    to: '/novos',
    page: <Novos />,
  },
];
