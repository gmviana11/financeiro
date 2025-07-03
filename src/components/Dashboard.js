import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../supabaseClient';
import ExpenseChart from './charts/ExpenseChart';
import MonthlyTrendsChart from './charts/MonthlyTrendsChart';
import FilterBar from './FilterBar';

const Dashboard = () => {
  const { 
    dashboardData, 
    loading, 
    loadDashboardData, 
    filters 
  } = useFinance();

  const [showValues, setShowValues] = useState(true);
  
  useEffect(() => {
    loadDashboardData();
  }, [filters.month, filters.year]);

  const saldo = dashboardData.totalReceitas - dashboardData.totalDespesas;
  const percentualGasto = dashboardData.totalReceitas > 0 
    ? (dashboardData.totalDespesas / dashboardData.totalReceitas) * 100 
    : 0;

  const summaryCards = [
    {
      title: 'Receitas do Mês',
      value: dashboardData.totalReceitas,
      icon: TrendingUp,
      color: 'success',
      trend: '+12%',
      description: 'vs mês anterior'
    },
    {
      title: 'Despesas do Mês',
      value: dashboardData.totalDespesas,
      icon: TrendingDown,
      color: 'error',
      trend: '+8%',
      description: 'vs mês anterior'
    },
    {
      title: 'Saldo do Mês',
      value: saldo,
      icon: DollarSign,
      color: saldo >= 0 ? 'success' : 'error',
      trend: saldo >= 0 ? '+15%' : '-5%',
      description: 'vs mês anterior'
    },
    {
      title: 'Contas Pendentes',
      value: dashboardData.contasPendentes,
      icon: Clock,
      color: 'warning',
      isCount: true,
      description: 'próximos 7 dias'
    }
  ];

  const getCardColorClasses = (color) => {
    const colors = {
      success: 'border-success-200 bg-success-50',
      error: 'border-error-200 bg-error-50',
      warning: 'border-warning-200 bg-warning-50',
      primary: 'border-primary-200 bg-primary-50'
    };
    return colors[color] || colors.primary;
  };

  const getIconColorClasses = (color) => {
    const colors = {
      success: 'text-success-600 bg-success-100',
      error: 'text-error-600 bg-error-100',
      warning: 'text-warning-600 bg-warning-100',
      primary: 'text-primary-600 bg-primary-100'
    };
    return colors[color] || colors.primary;
  };

  if (loading.dashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Dashboard</h1>
          <div className="loading"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Visão geral das suas finanças em {String(filters.month).padStart(2, '0')}/{filters.year}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowValues(!showValues)}
            className="btn btn-secondary btn-sm"
          >
            {showValues ? <EyeOff size={16} /> : <Eye size={16} />}
            {showValues ? 'Ocultar' : 'Mostrar'} Valores
          </button>
          
          <button
            onClick={loadDashboardData}
            className="btn btn-primary btn-sm"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          
          return (
            <div key={index} className={`card border-l-4 ${getCardColorClasses(card.color)}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {showValues ? (
                      card.isCount ? card.value : formatCurrency(card.value)
                    ) : (
                      '***'
                    )}
                  </p>
                  {card.trend && (
                    <p className="text-xs text-gray-500 mt-1">
                      <span className={`inline-flex items-center ${
                        card.trend.startsWith('+') ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {card.trend}
                      </span>
                      <span className="ml-1">{card.description}</span>
                    </p>
                  )}
                  {!card.trend && card.description && (
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  )}
                </div>
                
                <div className={`p-3 rounded-full ${getIconColorClasses(card.color)}`}>
                  <IconComponent size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertas */}
      {dashboardData.contasAtrasadas > 0 && (
        <div className="card border-l-4 border-error-500 bg-error-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-error-100 rounded-full">
              <AlertTriangle size={20} className="text-error-600" />
            </div>
            <div>
              <h3 className="font-medium text-error-900">
                Atenção: {dashboardData.contasAtrasadas} conta(s) em atraso
              </h3>
              <p className="text-sm text-error-700">
                Verifique suas transações pendentes para evitar multas e juros.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Gastos por Categoria */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Gastos por Categoria</h3>
          </div>
          <div className="card-body">
            <ExpenseChart data={dashboardData.gastosPorCategoria} showValues={showValues} />
          </div>
        </div>

        {/* Tendência Mensal */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tendência dos Últimos Meses</h3>
          </div>
          <div className="card-body">
            <MonthlyTrendsChart showValues={showValues} />
          </div>
        </div>
      </div>

      {/* Próximos Pagamentos */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Próximos Pagamentos</h3>
          <span className="text-sm text-gray-500">Próximos 7 dias</span>
        </div>
        <div className="card-body">
          {dashboardData.proximosPagamentos.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pagamento próximo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.proximosPagamentos.slice(0, 5).map((pagamento) => (
                <div key={pagamento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning-500"></div>
                    <div>
                      <p className="font-medium text-gray-900">{pagamento.descricao}</p>
                      <p className="text-sm text-gray-500">
                        {pagamento.categoria?.nome} • {pagamento.conta?.nome}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {showValues ? formatCurrency(pagamento.valor) : '***'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(pagamento.data_vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {dashboardData.proximosPagamentos.length > 5 && (
                <div className="text-center pt-3">
                  <p className="text-sm text-gray-500">
                    +{dashboardData.proximosPagamentos.length - 5} pagamentos adicionais
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Indicadores Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="card-body">
            <h4 className="font-medium text-gray-900 mb-2">Taxa de Gastos</h4>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {percentualGasto.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500">das receitas gastas</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${Math.min(percentualGasto, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <h4 className="font-medium text-gray-900 mb-2">Maior Categoria</h4>
            {dashboardData.gastosPorCategoria.length > 0 ? (
              <>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {dashboardData.gastosPorCategoria[0].categoria}
                </div>
                <div className="text-2xl font-bold text-error-600">
                  {showValues ? formatCurrency(dashboardData.gastosPorCategoria[0].total) : '***'}
                </div>
              </>
            ) : (
              <div className="text-lg text-gray-500">Sem dados</div>
            )}
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <h4 className="font-medium text-gray-900 mb-2">Meta do Mês</h4>
            <div className="text-3xl font-bold text-success-600 mb-2">85%</div>
            <p className="text-sm text-gray-500">do orçamento atingido</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-success-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;