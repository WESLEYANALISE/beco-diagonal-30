
import { Home, Heart, Grid3X3, User, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FooterNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: Grid3X3,
      label: 'Categorias',
      path: '/categorias',
      active: location.pathname === '/categorias'
    },
    {
      icon: Heart,
      label: 'Favoritos',
      path: '/favoritos',
      active: location.pathname === '/favoritos'
    },
    {
      icon: Sparkles,
      label: 'Novos',
      path: '/novos',
      active: location.pathname === '/novos'
    },
    {
      icon: User,
      label: 'Perfil',
      path: '/perfil',
      active: location.pathname === '/perfil'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              item.active
                ? 'text-orange-500 bg-orange-50'
                : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
            }`}
          >
            <item.icon className={`w-5 h-5 mb-1 ${item.active ? 'text-orange-500' : 'text-gray-600'}`} />
            <span className={`text-xs font-medium ${item.active ? 'text-orange-500' : 'text-gray-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default FooterNavigation;
