import React, { useState, useEffect } from 'react';
import { X, Calendar, Repeat } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const TransactionModal = ({ transaction, onClose }) => {
  const { 
    createTransaction, 
    updateTransaction, 
    accounts, 
    categories, 
    loading 
  } = useFinance();

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo_transacao: 'despesa',
    tipo_pagamento: 'normal',
    data_transacao: new Date().toISOString().split('T')[0],
    data_vencimento: '',
    status: 'pendente',
    conta_id: '',
    categoria_id: '',
    observacoes: '',
    // Campos para recorrência
    recorrencia_tipo: '',
    recorrencia_intervalo: 1,
    data_inicio_recorrencia: '',
    data_fim_recorrencia: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        data_transacao: transaction.data_transacao?.split('T')[0] || '',
        data_vencimento: transaction.data_vencimento?.split('T')[0] || '',
        data_inicio_recorrencia: transaction.data_inicio_recorrencia?.split('T')[0] || '',
        data_fim_recorrencia: transaction.data_fim_recorrencia?.split('T')[0] || '',
        valor: transaction.valor?.toString() || ''
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.valor || isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }

    if (!formData.conta_id) {
      newErrors.conta_id = 'Conta é obrigatória';
    }

    if (!formData.data_transacao) {
      newErrors.data_transacao = 'Data da transação é obrigatória';
    }

    // Validações específicas para pagamentos recorrentes
    if (formData.tipo_pagamento === 'recorrente') {
      if (!formData.recorrencia_tipo) {
        newErrors.recorrencia_tipo = 'Tipo de recorrência é obrigatório';
      }
      
      if (!formData.data_inicio_recorrencia) {
        newErrors.data_inicio_recorrencia = 'Data de início da recorrência é obrigatória';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData = {
      ...formData,
      valor: parseFloat(formData.valor),
      recorrencia_intervalo: parseInt(formData.recorrencia_intervalo) || 1,
      // Remover campos vazios de recorrência se não for pagamento recorrente
      ...(formData.tipo_pagamento !== 'recorrente' && {
        recorrencia_tipo: null,
        data_inicio_recorrencia: null,
        data_fim_recorrencia: null
      })
    };

    let result;
    if (transaction) {
      result = await updateTransaction(transaction.id, transactionData);
    } else {
      result = await createTransaction(transactionData);
    }

    if (result.success) {
      onClose();
    }
  };

  const recurrenceTypes = [
    { value: '', label: 'Selecione...' },
    { value: 'diario', label: 'Diário' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'quinzenal', label: 'Quinzenal' },
    { value: 'mensal', label: 'Mensal' },
    { value: 'bimestral', label: 'Bimestral' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' }
  ];

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'agendado', label: 'Agendado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Descrição *</label>
              <input
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ex: Aluguel, Salário, Compras..."
              />
              {errors.descricao && <div className="form-error">{errors.descricao}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Valor *</label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0,00"
                step="0.01"
                min="0"
              />
              {errors.valor && <div className="form-error">{errors.valor}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Tipo de Transação</label>
              <select
                name="tipo_transacao"
                value={formData.tipo_transacao}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Pagamento</label>
              <select
                name="tipo_pagamento"
                value={formData.tipo_pagamento}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="normal">Normal</option>
                <option value="fixo">Fixo</option>
                <option value="recorrente">Recorrente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Conta *</label>
              <select
                name="conta_id"
                value={formData.conta_id}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Selecione uma conta</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.nome}
                  </option>
                ))}
              </select>
              {errors.conta_id && <div className="form-error">{errors.conta_id}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Selecione uma categoria</option>
                {categories
                  .filter(cat => cat.tipo === formData.tipo_transacao)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icone} {category.nome}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Data da Transação *</label>
              <input
                type="date"
                name="data_transacao"
                value={formData.data_transacao}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.data_transacao && <div className="form-error">{errors.data_transacao}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Data de Vencimento</label>
              <input
                type="date"
                name="data_vencimento"
                value={formData.data_vencimento}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campos de Recorrência */}
          {formData.tipo_pagamento === 'recorrente' && (
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <Repeat size={20} className="text-primary-600" />
                <h3 className="font-medium text-primary-900">Configuração de Recorrência</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Tipo de Recorrência *</label>
                  <select
                    name="recorrencia_tipo"
                    value={formData.recorrencia_tipo}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {recurrenceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.recorrencia_tipo && <div className="form-error">{errors.recorrencia_tipo}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Intervalo</label>
                  <input
                    type="number"
                    name="recorrencia_intervalo"
                    value={formData.recorrencia_intervalo}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    placeholder="Ex: a cada 2 meses"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Data de Início *</label>
                  <input
                    type="date"
                    name="data_inicio_recorrencia"
                    value={formData.data_inicio_recorrencia}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  {errors.data_inicio_recorrencia && <div className="form-error">{errors.data_inicio_recorrencia}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Fim (opcional)</label>
                  <input
                    type="date"
                    name="data_fim_recorrencia"
                    value={formData.data_fim_recorrencia}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="form-group">
            <label className="form-label">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              placeholder="Informações adicionais sobre esta transação..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading.transactions}
            >
              {loading.transactions ? 'Salvando...' : (transaction ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;