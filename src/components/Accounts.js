import React, { useState } from 'react';
import { Plus, Edit, Wallet, CreditCard, PiggyBank } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, getTipoContaIcon } from '../supabaseClient';

const Accounts = () => {
  const { accounts, loading, createAccount, updateAccount } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const accountTypes = [
    { value: 'conta_corrente', label: 'Conta Corrente', icon: '🏦' },
    { value: 'poupanca', label: 'Poupança', icon: '💰' },
    { value: 'cartao_credito', label: 'Cartão de Crédito', icon: '💳' },
    { value: 'cartao_debito', label: 'Cartão de Débito', icon: '💳' },
    { value: 'dinheiro', label: 'Dinheiro', icon: '💵' },
    { value: 'investimento', label: 'Investimento', icon: '📈' }
  ];

  const handleNew = () => {
    setEditingAccount(null);
    setModalOpen(true);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setModalOpen(true);
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (account.saldo_atual || 0), 0);
  };

  const getAccountsByType = () => {
    const grouped = {};
    accountTypes.forEach(type => {
      grouped[type.value] = accounts.filter(account => account.tipo === type.value);
    });
    return grouped;
  };

  const accountsByType = getAccountsByType();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Contas</h1>
          <p className="page-subtitle">
            Gerencie suas contas bancárias, cartões e carteiras
          </p>
        </div>
        
        <button
          onClick={handleNew}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Nova Conta
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="card-body">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Wallet size={24} className="text-primary-600" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Saldo Total</h3>
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(getTotalBalance())}
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-success-100 rounded-full">
                <CreditCard size={24} className="text-success-600" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Contas Ativas</h3>
            <div className="text-2xl font-bold text-success-600">
              {accounts.filter(acc => acc.ativo).length}
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-warning-100 rounded-full">
                <PiggyBank size={24} className="text-warning-600" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Poupança</h3>
            <div className="text-2xl font-bold text-warning-600">
              {formatCurrency(
                accounts
                  .filter(acc => acc.tipo === 'poupanca')
                  .reduce((sum, acc) => sum + (acc.saldo_atual || 0), 0)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Contas por Tipo */}
      {loading.accounts ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading"></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">🏦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma conta cadastrada
            </h3>
            <p className="text-gray-500 mb-6">
              Comece adicionando sua primeira conta
            </p>
            <button
              onClick={handleNew}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Adicionar Conta
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {accountTypes.map(type => {
            const accountsOfType = accountsByType[type.value];
            
            if (accountsOfType.length === 0) return null;

            return (
              <div key={type.value} className="card">
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <h3 className="card-title">{type.label}</h3>
                    <span className="badge badge-gray">{accountsOfType.length}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accountsOfType.map(account => (
                      <div 
                        key={account.id} 
                        className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: account.cor || '#6B7280' }}
                            ></div>
                            <div>
                              <h4 className="font-medium text-gray-900">{account.nome}</h4>
                              {account.banco && (
                                <p className="text-sm text-gray-500">{account.banco}</p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleEdit(account)}
                            className="btn btn-secondary btn-sm"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Saldo Atual</span>
                            <span className={`font-medium ${
                              (account.saldo_atual || 0) >= 0 ? 'text-success-600' : 'text-error-600'
                            }`}>
                              {formatCurrency(account.saldo_atual || 0)}
                            </span>
                          </div>
                          
                          {account.limite_credito && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Limite</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(account.limite_credito)}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`badge ${account.ativo ? 'badge-success' : 'badge-gray'}`}>
                              {account.ativo ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Conta */}
      {modalOpen && (
        <AccountModal
          account={editingAccount}
          onClose={() => {
            setModalOpen(false);
            setEditingAccount(null);
          }}
        />
      )}
    </div>
  );
};

// Modal de Conta (componente interno simplificado)
const AccountModal = ({ account, onClose }) => {
  const { createAccount, updateAccount, loading } = useFinance();
  const [formData, setFormData] = useState({
    nome: account?.nome || '',
    tipo: account?.tipo || 'conta_corrente',
    banco: account?.banco || '',
    saldo_inicial: account?.saldo_inicial?.toString() || '0',
    limite_credito: account?.limite_credito?.toString() || '',
    cor: account?.cor || '#3B82F6',
    ativo: account?.ativo !== false
  });

  const accountTypes = [
    { value: 'conta_corrente', label: 'Conta Corrente' },
    { value: 'poupanca', label: 'Poupança' },
    { value: 'cartao_credito', label: 'Cartão de Crédito' },
    { value: 'cartao_debito', label: 'Cartão de Débito' },
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'investimento', label: 'Investimento' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const accountData = {
      ...formData,
      saldo_inicial: parseFloat(formData.saldo_inicial) || 0,
      limite_credito: formData.limite_credito ? parseFloat(formData.limite_credito) : null
    };

    let result;
    if (account) {
      result = await updateAccount(account.id, accountData);
    } else {
      result = await createAccount(accountData);
    }

    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {account ? 'Editar Conta' : 'Nova Conta'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nome da Conta *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="form-input"
                placeholder="Ex: Conta Corrente Banco do Brasil"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                className="form-select"
                required
              >
                {accountTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Banco/Instituição</label>
              <input
                type="text"
                value={formData.banco}
                onChange={(e) => setFormData(prev => ({ ...prev, banco: e.target.value }))}
                className="form-input"
                placeholder="Ex: Banco do Brasil, Nubank..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cor</label>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                className="form-input h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Saldo Inicial</label>
              <input
                type="number"
                value={formData.saldo_inicial}
                onChange={(e) => setFormData(prev => ({ ...prev, saldo_inicial: e.target.value }))}
                className="form-input"
                placeholder="0,00"
                step="0.01"
              />
            </div>

            {(formData.tipo === 'cartao_credito') && (
              <div className="form-group">
                <label className="form-label">Limite de Crédito</label>
                <input
                  type="number"
                  value={formData.limite_credito}
                  onChange={(e) => setFormData(prev => ({ ...prev, limite_credito: e.target.value }))}
                  className="form-input"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded"
              />
              <span className="form-label mb-0">Conta ativa</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading.accounts}>
              {loading.accounts ? 'Salvando...' : (account ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Accounts;