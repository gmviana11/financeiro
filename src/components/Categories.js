import React, { useState } from 'react';
import { Plus, Edit, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const Categories = () => {
  const { categories, loading, createCategory } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  const handleNew = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const filteredCategories = selectedType === 'all' 
    ? categories 
    : categories.filter(cat => cat.tipo === selectedType);

  const getCategoriesByType = () => {
    const receitas = categories.filter(cat => cat.tipo === 'receita');
    const despesas = categories.filter(cat => cat.tipo === 'despesa');
    return { receitas, despesas };
  };

  const { receitas, despesas } = getCategoriesByType();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">
            Organize suas transações por categorias
          </p>
        </div>
        
        <button
          onClick={handleNew}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Nova Categoria
        </button>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="card-body">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-success-100 rounded-full">
                <TrendingUp size={24} className="text-success-600" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Receitas</h3>
            <div className="text-2xl font-bold text-success-600">
              {receitas.length}
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-error-100 rounded-full">
                <TrendingDown size={24} className="text-error-600" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Despesas</h3>
            <div className="text-2xl font-bold text-error-600">
              {despesas.length}
            </div>
          </div>
        </div>

        <div className="card text-center">
          <div className="card-body">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Tag size={24} className="text-primary-600" />
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Total</h3>
            <div className="text-2xl font-bold text-primary-600">
              {categories.length}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">Filtrar por:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`btn btn-sm ${selectedType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setSelectedType('receita')}
                className={`btn btn-sm ${selectedType === 'receita' ? 'btn-success' : 'btn-secondary'}`}
              >
                Receitas
              </button>
              <button
                onClick={() => setSelectedType('despesa')}
                className={`btn btn-sm ${selectedType === 'despesa' ? 'btn-error' : 'btn-secondary'}`}
              >
                Despesas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      {loading.categories ? (
        <div className="flex justify-center items-center py-12">
          <div className="loading"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">🏷️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedType === 'all' ? 'Nenhuma categoria encontrada' : `Nenhuma categoria de ${selectedType} encontrada`}
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando suas primeiras categorias
            </p>
            <button
              onClick={handleNew}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Criar Categoria
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Categorias de Receita */}
          {(selectedType === 'all' || selectedType === 'receita') && receitas.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-success-600" />
                  <h3 className="card-title text-success-600">Receitas</h3>
                  <span className="badge badge-success">{receitas.length}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {receitas.map(category => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Categorias de Despesa */}
          {(selectedType === 'all' || selectedType === 'despesa') && despesas.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <TrendingDown size={20} className="text-error-600" />
                  <h3 className="card-title text-error-600">Despesas</h3>
                  <span className="badge badge-error">{despesas.length}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {despesas.map(category => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de Categoria */}
      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

// Componente do Card de Categoria
const CategoryCard = ({ category, onEdit }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
            style={{ backgroundColor: category.cor || '#6B7280' }}
          >
            {category.icone || '🏷️'}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{category.nome}</h4>
            <span className={`text-xs ${
              category.tipo === 'receita' ? 'text-success-600' : 'text-error-600'
            }`}>
              {category.tipo === 'receita' ? 'Receita' : 'Despesa'}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onEdit(category)}
          className="btn btn-secondary btn-sm"
        >
          <Edit size={14} />
        </button>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Status</span>
        <span className={`badge ${category.ativo ? 'badge-success' : 'badge-gray'}`}>
          {category.ativo ? 'Ativa' : 'Inativa'}
        </span>
      </div>
    </div>
  );
};

// Modal de Categoria
const CategoryModal = ({ category, onClose }) => {
  const { createCategory, loading } = useFinance();
  const [formData, setFormData] = useState({
    nome: category?.nome || '',
    tipo: category?.tipo || 'despesa',
    cor: category?.cor || '#EF4444',
    icone: category?.icone || '',
    ativo: category?.ativo !== false
  });

  const commonIcons = {
    receita: ['💼', '💰', '📈', '💳', '🏆', '💎', '🎁', '🔄', '📊', '💸'],
    despesa: ['🍽️', '🚗', '🏠', '⚕️', '📚', '🎮', '👕', '🔧', '✈️', '🛒']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await createCategory(formData);
    
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          <button onClick={onClose} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nome da Categoria *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="form-input"
                placeholder="Ex: Alimentação, Salário..."
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
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Cor</label>
              <input
                type="color"
                value={formData.cor}
                onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                className="form-input h-12"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ícone</label>
              <input
                type="text"
                value={formData.icone}
                onChange={(e) => setFormData(prev => ({ ...prev, icone: e.target.value }))}
                className="form-input"
                placeholder="Ex: 🍽️ (emoji)"
              />
            </div>
          </div>

          {/* Seletor de Ícones */}
          <div className="form-group">
            <label className="form-label">Ícones Sugeridos</label>
            <div className="grid grid-cols-10 gap-2">
              {commonIcons[formData.tipo].map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icone: icon }))}
                  className={`p-2 text-lg border rounded hover:bg-gray-50 ${
                    formData.icone === icon ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                className="rounded"
              />
              <span className="form-label mb-0">Categoria ativa</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading.categories}>
              {loading.categories ? 'Salvando...' : (category ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Categories;