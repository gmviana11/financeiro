import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate, getStatusColor } from '../supabaseClient';
import FilterBar from './FilterBar';
import TransactionModal from './modals/TransactionModal';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    deleteTransaction,
    accounts,
    categories
  } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      await deleteTransaction(transactionId);
    }
  };

  const handleNew = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pago': { label: 'Pago', class: 'badge-success' },
      'pendente': { label: 'Pendente', class: 'badge-warning' },
      'atrasado': { label: 'Atrasado', class: 'badge-error' },
      'agendado': { label: 'Agendado', class: 'badge-primary' },
      'cancelado': { label: 'Cancelado', class: 'badge-gray' }
    };
    
    const config = statusConfig[status] || statusConfig['pendente'];
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getPaymentTypeBadge = (type) => {
    const typeConfig = {
      'normal': { label: 'Normal', class: 'badge-gray' },
      'fixo': { label: 'Fixo', class: 'badge-primary' },
      'recorrente': { label: 'Recorrente', class: 'badge-success' }
    };
    
    const config = typeConfig[type] || typeConfig['normal'];
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transações</h1>
          <p className="page-subtitle">
            Gerencie seus pagamentos recorrentes, fixos e normais
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
            onClick={handleNew}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && <FilterBar />}

      {/* Lista de Transações */}
      <div className="card">
        {loading.transactions ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              Comece adicionando sua primeira transação
            </p>
            <button
              onClick={handleNew}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Adicionar Transação
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Categoria</th>
                  <th>Conta</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.descricao}
                        </div>
                        {transaction.observacoes && (
                          <div className="text-sm text-gray-500">
                            {transaction.observacoes}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className={`font-medium ${
                        transaction.tipo_transacao === 'receita' 
                          ? 'text-success-600' 
                          : 'text-error-600'
                      }`}>
                        {transaction.tipo_transacao === 'receita' ? '+' : '-'}
                        {formatCurrency(transaction.valor)}
                      </div>
                    </td>
                    
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{transaction.categoria?.icone}</span>
                        <span>{transaction.categoria?.nome || 'Sem categoria'}</span>
                      </div>
                    </td>
                    
                    <td>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: transaction.conta?.cor || '#6B7280' }}
                        ></div>
                        <span>{transaction.conta?.nome}</span>
                      </div>
                    </td>
                    
                    <td>
                      {getPaymentTypeBadge(transaction.tipo_pagamento)}
                    </td>
                    
                    <td>
                      {getStatusBadge(transaction.status)}
                    </td>
                    
                    <td>
                      <div>
                        <div className="text-sm">
                          {formatDate(transaction.data_transacao)}
                        </div>
                        {transaction.data_vencimento && 
                         transaction.data_vencimento !== transaction.data_transacao && (
                          <div className="text-xs text-gray-500">
                            Venc: {formatDate(transaction.data_vencimento)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="btn btn-secondary btn-sm"
                          title="Editar"
                        >
                          <Edit size={14} />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="btn btn-error btn-sm"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumo */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="card-body">
              <h4 className="font-medium text-gray-900 mb-2">Total de Receitas</h4>
              <div className="text-2xl font-bold text-success-600">
                {formatCurrency(
                  transactions
                    .filter(t => t.tipo_transacao === 'receita')
                    .reduce((sum, t) => sum + t.valor, 0)
                )}
              </div>
            </div>
          </div>
          
          <div className="card text-center">
            <div className="card-body">
              <h4 className="font-medium text-gray-900 mb-2">Total de Despesas</h4>
              <div className="text-2xl font-bold text-error-600">
                {formatCurrency(
                  transactions
                    .filter(t => t.tipo_transacao === 'despesa')
                    .reduce((sum, t) => sum + t.valor, 0)
                )}
              </div>
            </div>
          </div>
          
          <div className="card text-center">
            <div className="card-body">
              <h4 className="font-medium text-gray-900 mb-2">Saldo</h4>
              <div className={`text-2xl font-bold ${
                transactions
                  .reduce((sum, t) => 
                    sum + (t.tipo_transacao === 'receita' ? t.valor : -t.valor), 0
                  ) >= 0 ? 'text-success-600' : 'text-error-600'
              }`}>
                {formatCurrency(
                  transactions
                    .reduce((sum, t) => 
                      sum + (t.tipo_transacao === 'receita' ? t.valor : -t.valor), 0
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Transação */}
      {modalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default Transactions;