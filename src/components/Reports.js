import React, { useState } from 'react';
import { BarChart3, PieChart, Calendar, Download, Filter } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../supabaseClient';
import ExpenseChart from './charts/ExpenseChart';
import MonthlyTrendsChart from './charts/MonthlyTrendsChart';

const Reports = () => {
  const { transactions, categories, accounts, filters } = useFinance();
  const [reportType, setReportType] = useState('overview');
  const [showFilters, setShowFilters] = useState(false);

  // Calcular dados para relatórios
  const getReportData = () => {
    const receitas = transactions.filter(t => t.tipo_transacao === 'receita' && t.status === 'pago');
    const despesas = transactions.filter(t => t.tipo_transacao === 'despesa' && t.status === 'pago');
    
    const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);
    const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0);
    const saldo = totalReceitas - totalDespesas;

    // Gastos por categoria
    const gastosPorCategoria = categories.map(cat => {
      const gastos = despesas.filter(t => t.categoria_id === cat.id);
      const total = gastos.reduce((sum, t) => sum + t.valor, 0);
      return {
        categoria: cat.nome,
        total,
        cor: cat.cor,
        icone: cat.icone,
        transacoes: gastos.length
      };
    }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

    // Receitas por categoria
    const receitasPorCategoria = categories.map(cat => {
      const receitas = transactions.filter(t => t.tipo_transacao === 'receita' && t.categoria_id === cat.id && t.status === 'pago');
      const total = receitas.reduce((sum, t) => sum + t.valor, 0);
      return {
        categoria: cat.nome,
        total,
        cor: cat.cor,
        icone: cat.icone,
        transacoes: receitas.length
      };
    }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

    // Gastos por conta
    const gastosPorConta = accounts.map(acc => {
      const transacoesConta = despesas.filter(t => t.conta_id === acc.id);
      const total = transacoesConta.reduce((sum, t) => sum + t.valor, 0);
      return {
        conta: acc.nome,
        total,
        cor: acc.cor,
        transacoes: transacoesConta.length
      };
    }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

    // Pagamentos por tipo
    const pagamentosPorTipo = {
      normal: despesas.filter(t => t.tipo_pagamento === 'normal').reduce((sum, t) => sum + t.valor, 0),
      fixo: despesas.filter(t => t.tipo_pagamento === 'fixo').reduce((sum, t) => sum + t.valor, 0),
      recorrente: despesas.filter(t => t.tipo_pagamento === 'recorrente').reduce((sum, t) => sum + t.valor, 0)
    };

    return {
      totalReceitas,
      totalDespesas,
      saldo,
      gastosPorCategoria,
      receitasPorCategoria,
      gastosPorConta,
      pagamentosPorTipo,
      totalTransacoes: transactions.length,
      receitasCount: receitas.length,
      despesasCount: despesas.length
    };
  };

  const reportData = getReportData();

  const reportTypes = [
    { value: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { value: 'categories', label: 'Por Categoria', icon: PieChart },
    { value: 'accounts', label: 'Por Conta', icon: Calendar },
    { value: 'trends', label: 'Tendências', icon: BarChart3 }
  ];

  const exportData = () => {
    // Implementar exportação dos dados
    const dataToExport = {
      periodo: `${filters.month}/${filters.year}`,
      resumo: {
        receitas: reportData.totalReceitas,
        despesas: reportData.totalDespesas,
        saldo: reportData.saldo
      },
      gastosPorCategoria: reportData.gastosPorCategoria,
      transacoes: transactions
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `relatorio-financeiro-${filters.month}-${filters.year}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Relatórios</h1>
          <p className="page-subtitle">
            Análises detalhadas das suas finanças em {String(filters.month).padStart(2, '0')}/{filters.year}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            <Filter size={16} />
            Filtros
          </button>
          
          <button
            onClick={exportData}
            className="btn btn-primary"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Seletor de Tipo de Relatório */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map(type => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`btn ${reportType === type.value ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <IconComponent size={16} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="card-body">
            <h3 className="font-medium text-gray-900 mb-2">Total de Receitas</h3>
            <div className="text-2xl font-bold text-success-600">
              {formatCurrency(reportData.totalReceitas)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {reportData.receitasCount} transações
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <h3 className="font-medium text-gray-900 mb-2">Total de Despesas</h3>
            <div className="text-2xl font-bold text-error-600">
              {formatCurrency(reportData.totalDespesas)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {reportData.despesasCount} transações
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <h3 className="font-medium text-gray-900 mb-2">Saldo do Período</h3>
            <div className={`text-2xl font-bold ${
              reportData.saldo >= 0 ? 'text-success-600' : 'text-error-600'
            }`}>
              {formatCurrency(reportData.saldo)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {reportData.totalTransacoes} transações
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <h3 className="font-medium text-gray-900 mb-2">Taxa de Gastos</h3>
            <div className="text-2xl font-bold text-primary-600">
              {reportData.totalReceitas > 0 
                ? ((reportData.totalDespesas / reportData.totalReceitas) * 100).toFixed(1)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              das receitas gastas
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Relatório */}
      {reportType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Gastos por Categoria</h3>
            </div>
            <div className="card-body">
              <ExpenseChart data={reportData.gastosPorCategoria} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tendência Mensal</h3>
            </div>
            <div className="card-body">
              <MonthlyTrendsChart />
            </div>
          </div>
        </div>
      )}

      {reportType === 'categories' && (
        <div className="space-y-6">
          {/* Despesas por Categoria */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Despesas por Categoria</h3>
            </div>
            <div className="card-body">
              {reportData.gastosPorCategoria.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma despesa encontrada no período
                </div>
              ) : (
                <div className="space-y-3">
                  {reportData.gastosPorCategoria.map((item, index) => {
                    const percentage = reportData.totalDespesas > 0 
                      ? (item.total / reportData.totalDespesas) * 100 
                      : 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.cor || '#6B7280' }}
                          ></div>
                          <div>
                            <span className="font-medium">{item.icone} {item.categoria}</span>
                            <div className="text-sm text-gray-500">
                              {item.transacoes} transações
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.total)}</div>
                          <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Receitas por Categoria */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Receitas por Categoria</h3>
            </div>
            <div className="card-body">
              {reportData.receitasPorCategoria.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma receita encontrada no período
                </div>
              ) : (
                <div className="space-y-3">
                  {reportData.receitasPorCategoria.map((item, index) => {
                    const percentage = reportData.totalReceitas > 0 
                      ? (item.total / reportData.totalReceitas) * 100 
                      : 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.cor || '#10B981' }}
                          ></div>
                          <div>
                            <span className="font-medium">{item.icone} {item.categoria}</span>
                            <div className="text-sm text-success-600">
                              {item.transacoes} transações
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-success-600">{formatCurrency(item.total)}</div>
                          <div className="text-sm text-success-600">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {reportType === 'accounts' && (
        <div className="space-y-6">
          {/* Gastos por Conta */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Gastos por Conta</h3>
            </div>
            <div className="card-body">
              {reportData.gastosPorConta.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum gasto encontrado no período
                </div>
              ) : (
                <div className="space-y-3">
                  {reportData.gastosPorConta.map((item, index) => {
                    const percentage = reportData.totalDespesas > 0 
                      ? (item.total / reportData.totalDespesas) * 100 
                      : 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.cor || '#6B7280' }}
                          ></div>
                          <div>
                            <span className="font-medium">{item.conta}</span>
                            <div className="text-sm text-gray-500">
                              {item.transacoes} transações
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.total)}</div>
                          <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tipos de Pagamento */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Despesas por Tipo de Pagamento</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900 mb-1">Normal</div>
                  <div className="text-2xl font-bold text-gray-600">
                    {formatCurrency(reportData.pagamentosPorTipo.normal)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Pagamentos únicos
                  </div>
                </div>

                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-lg font-semibold text-primary-900 mb-1">Fixo</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {formatCurrency(reportData.pagamentosPorTipo.fixo)}
                  </div>
                  <div className="text-sm text-primary-600 mt-1">
                    Pagamentos fixos
                  </div>
                </div>

                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <div className="text-lg font-semibold text-success-900 mb-1">Recorrente</div>
                  <div className="text-2xl font-bold text-success-600">
                    {formatCurrency(reportData.pagamentosPorTipo.recorrente)}
                  </div>
                  <div className="text-sm text-success-600 mt-1">
                    Pagamentos recorrentes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'trends' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tendências e Análises</h3>
          </div>
          <div className="card-body">
            <MonthlyTrendsChart />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;