import React from 'react';
import { Filter, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const FilterBar = () => {
  const { 
    filters, 
    updateFilters, 
    accounts, 
    categories 
  } = useFinance();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const transactionTypes = [
    { value: '', label: 'Todos os tipos' },
    { value: 'receita', label: 'Receitas' },
    { value: 'despesa', label: 'Despesas' }
  ];

  const paymentTypes = [
    { value: '', label: 'Todos os pagamentos' },
    { value: 'normal', label: 'Normal' },
    { value: 'fixo', label: 'Fixo' },
    { value: 'recorrente', label: 'Recorrente' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'atrasado', label: 'Atrasado' },
    { value: 'agendado', label: 'Agendado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const handleFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const clearFilters = () => {
    updateFilters({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      account_id: '',
      category_id: '',
      transaction_type: '',
      payment_type: '',
      status: ''
    });
  };

  const hasActiveFilters = () => {
    const defaultMonth = new Date().getMonth() + 1;
    const defaultYear = new Date().getFullYear();
    
    return filters.month !== defaultMonth ||
           filters.year !== defaultYear ||
           filters.account_id ||
           filters.category_id ||
           filters.transaction_type ||
           filters.payment_type ||
           filters.status;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="card-title">Filtros</h3>
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="btn btn-secondary btn-sm"
          >
            <X size={16} />
            Limpar Filtros
          </button>
        )}
      </div>
      
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {/* Mês */}
          <div className="form-group">
            <label className="form-label">Mês</label>
            <select
              className="form-select"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div className="form-group">
            <label className="form-label">Ano</label>
            <select
              className="form-select"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Conta */}
          <div className="form-group">
            <label className="form-label">Conta</label>
            <select
              className="form-select"
              value={filters.account_id}
              onChange={(e) => handleFilterChange('account_id', e.target.value)}
            >
              <option value="">Todas as contas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div className="form-group">
            <label className="form-label">Categoria</label>
            <select
              className="form-select"
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icone} {category.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Transação */}
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={filters.transaction_type}
              onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
            >
              {transactionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Pagamento */}
          <div className="form-group">
            <label className="form-label">Pagamento</label>
            <select
              className="form-select"
              value={filters.payment_type}
              onChange={(e) => handleFilterChange('payment_type', e.target.value)}
            >
              {paymentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters() && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              
              {filters.account_id && (
                <span className="badge badge-primary">
                  Conta: {accounts.find(a => a.id === filters.account_id)?.nome}
                </span>
              )}
              
              {filters.category_id && (
                <span className="badge badge-primary">
                  Categoria: {categories.find(c => c.id === filters.category_id)?.nome}
                </span>
              )}
              
              {filters.transaction_type && (
                <span className="badge badge-primary">
                  Tipo: {transactionTypes.find(t => t.value === filters.transaction_type)?.label}
                </span>
              )}
              
              {filters.payment_type && (
                <span className="badge badge-primary">
                  Pagamento: {paymentTypes.find(p => p.value === filters.payment_type)?.label}
                </span>
              )}
              
              {filters.status && (
                <span className="badge badge-primary">
                  Status: {statusOptions.find(s => s.value === filters.status)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;