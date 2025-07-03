import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  Tag, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral das finanças'
    },
    {
      path: '/transactions',
      label: 'Transações',
      icon: CreditCard,
      description: 'Lançamentos e pagamentos'
    },
    {
      path: '/accounts',
      label: 'Contas',
      icon: Wallet,
      description: 'Contas bancárias e cartões'
    },
    {
      path: '/categories',
      label: 'Categorias',
      icon: Tag,
      description: 'Organização dos gastos'
    },
    {
      path: '/reports',
      label: 'Relatórios',
      icon: BarChart3,
      description: 'Análises e gráficos'
    },
    {
      path: '/settings',
      label: 'Configurações',
      icon: Settings,
      description: 'Preferências do sistema'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isMobile ? (isOpen ? 'open' : '') : ''}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">FinanceApp</h1>
                <p className="text-xs text-gray-500">Controle Financeiro</p>
              </div>
            </div>
            
            {isMobile && (
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.path) 
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <IconComponent 
                    size={20} 
                    className={isActive(item.path) ? 'text-primary-600' : 'text-gray-400'} 
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm text-gray-900 mb-3">Resumo Rápido</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Receitas</span>
                <span className="text-xs font-medium text-success-600">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Despesas</span>
                <span className="text-xs font-medium text-error-600">R$ 0,00</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-900">Saldo</span>
                  <span className="text-xs font-medium text-gray-900">R$ 0,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-8 p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">U</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">Usuário</div>
                <div className="text-xs text-gray-500">usuario@email.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;