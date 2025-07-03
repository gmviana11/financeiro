import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { FinanceService } from '../supabaseClient';
import { toast } from 'react-toastify';

// Estado inicial
const initialState = {
  // Dados
  user: null,
  accounts: [],
  categories: [],
  transactions: [],
  tags: [],
  budgets: [],
  
  // Filtros
  filters: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    account_id: '',
    category_id: '',
    transaction_type: '',
    payment_type: '',
    status: '',
    tag_id: ''
  },
  
  // Estados de carregamento
  loading: {
    dashboard: false,
    transactions: false,
    accounts: false,
    categories: false,
    reports: false
  },
  
  // Dashboard data
  dashboardData: {
    totalReceitas: 0,
    totalDespesas: 0,
    contasPendentes: 0,
    contasAtrasadas: 0,
    proximosPagamentos: [],
    gastosPorCategoria: []
  }
};

// Actions
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_TAGS: 'SET_TAGS',
  SET_BUDGETS: 'SET_BUDGETS',
  SET_FILTERS: 'SET_FILTERS',
  SET_LOADING: 'SET_LOADING',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  ADD_ACCOUNT: 'ADD_ACCOUNT',
  UPDATE_ACCOUNT: 'UPDATE_ACCOUNT',
  ADD_CATEGORY: 'ADD_CATEGORY',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  ADD_TAG: 'ADD_TAG'
};

// Reducer
function financeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
      
    case ACTIONS.SET_ACCOUNTS:
      return { ...state, accounts: action.payload };
      
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
      
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
      
    case ACTIONS.SET_TAGS:
      return { ...state, tags: action.payload };
      
    case ACTIONS.SET_BUDGETS:
      return { ...state, budgets: action.payload };
      
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
      
    case ACTIONS.SET_LOADING:
      return { 
        ...state, 
        loading: { ...state.loading, ...action.payload } 
      };
      
    case ACTIONS.SET_DASHBOARD_DATA:
      return { ...state, dashboardData: action.payload };
      
    case ACTIONS.ADD_ACCOUNT:
      return { 
        ...state, 
        accounts: [...state.accounts, action.payload] 
      };
      
    case ACTIONS.UPDATE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        )
      };
      
    case ACTIONS.ADD_CATEGORY:
      return { 
        ...state, 
        categories: [...state.categories, action.payload] 
      };
      
    case ACTIONS.ADD_TRANSACTION:
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions] 
      };
      
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
      
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        )
      };
      
    case ACTIONS.ADD_TAG:
      return { 
        ...state, 
        tags: [...state.tags, action.payload] 
      };
      
    default:
      return state;
  }
}

// Context
const FinanceContext = createContext();

// Provider
export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // ID do usuário (para simplificar, usamos um UUID fixo)
  // Em produção, isso viria da autenticação
  const USER_ID = '00000000-0000-0000-0000-000000000000';

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Carregar transações quando filtros mudarem
  useEffect(() => {
    loadTransactions();
  }, [state.filters]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadAccounts(),
        loadCategories(),
        loadTags(),
        loadBudgets()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      toast.error('Erro ao carregar dados iniciais');
    }
  };

  const loadAccounts = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { accounts: true } });
      const { data, error } = await FinanceService.getContas(USER_ID);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.SET_ACCOUNTS, payload: data || [] });
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
      toast.error('Erro ao carregar contas');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { accounts: false } });
    }
  };

  const loadCategories = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { categories: true } });
      const { data, error } = await FinanceService.getCategorias(USER_ID);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: data || [] });
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { categories: false } });
    }
  };

  const loadTransactions = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { transactions: true } });
      const { data, error } = await FinanceService.getTransacoes(USER_ID, state.filters);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.SET_TRANSACTIONS, payload: data || [] });
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { transactions: false } });
    }
  };

  const loadTags = async () => {
    try {
      const { data, error } = await FinanceService.getTags(USER_ID);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.SET_TAGS, payload: data || [] });
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast.error('Erro ao carregar tags');
    }
  };

  const loadBudgets = async () => {
    try {
      const { data, error } = await FinanceService.getOrcamentos(
        USER_ID, 
        state.filters.month, 
        state.filters.year
      );
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.SET_BUDGETS, payload: data || [] });
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast.error('Erro ao carregar orçamentos');
    }
  };

  const loadDashboardData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { dashboard: true } });
      
      const [dashboardRes, proximosRes, gastosRes] = await Promise.all([
        FinanceService.getDashboardData(USER_ID, state.filters.month, state.filters.year),
        FinanceService.getProximosPagamentos(USER_ID),
        FinanceService.getGastosPorCategoria(USER_ID, state.filters.month, state.filters.year)
      ]);

      const dashboardData = {
        totalReceitas: dashboardRes.data?.total_receitas || 0,
        totalDespesas: dashboardRes.data?.total_despesas || 0,
        contasPendentes: dashboardRes.data?.contas_pendentes || 0,
        contasAtrasadas: dashboardRes.data?.contas_atrasadas || 0,
        proximosPagamentos: proximosRes.data || [],
        gastosPorCategoria: gastosRes.data || []
      };

      dispatch({ type: ACTIONS.SET_DASHBOARD_DATA, payload: dashboardData });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: { dashboard: false } });
    }
  };

  // Actions
  const createAccount = async (accountData) => {
    try {
      const { data, error } = await FinanceService.createConta({
        ...accountData,
        usuario_id: USER_ID
      });
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.ADD_ACCOUNT, payload: data[0] });
      toast.success('Conta criada com sucesso!');
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast.error('Erro ao criar conta');
      return { success: false, error };
    }
  };

  const updateAccount = async (accountId, updates) => {
    try {
      const { data, error } = await FinanceService.updateConta(accountId, updates);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.UPDATE_ACCOUNT, payload: data[0] });
      toast.success('Conta atualizada com sucesso!');
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      toast.error('Erro ao atualizar conta');
      return { success: false, error };
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const { data, error } = await FinanceService.createCategoria({
        ...categoryData,
        usuario_id: USER_ID
      });
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.ADD_CATEGORY, payload: data[0] });
      toast.success('Categoria criada com sucesso!');
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      toast.error('Erro ao criar categoria');
      return { success: false, error };
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      const { data, error } = await FinanceService.createTransacao({
        ...transactionData,
        usuario_id: USER_ID
      });
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: data[0] });
      toast.success('Transação criada com sucesso!');
      
      // Recarregar contas para atualizar saldos
      loadAccounts();
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      toast.error('Erro ao criar transação');
      return { success: false, error };
    }
  };

  const updateTransaction = async (transactionId, updates) => {
    try {
      const { data, error } = await FinanceService.updateTransacao(transactionId, updates);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: data[0] });
      toast.success('Transação atualizada com sucesso!');
      
      // Recarregar contas para atualizar saldos
      loadAccounts();
      
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
      return { success: false, error };
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const { error } = await FinanceService.deleteTransacao(transactionId);
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: transactionId });
      toast.success('Transação excluída com sucesso!');
      
      // Recarregar contas para atualizar saldos
      loadAccounts();
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
      return { success: false, error };
    }
  };

  const createTag = async (tagData) => {
    try {
      const { data, error } = await FinanceService.createTag({
        ...tagData,
        usuario_id: USER_ID
      });
      
      if (error) throw error;
      
      dispatch({ type: ACTIONS.ADD_TAG, payload: data[0] });
      toast.success('Tag criada com sucesso!');
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
      return { success: false, error };
    }
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: newFilters });
  };

  const value = {
    // Estado
    ...state,
    
    // Actions
    createAccount,
    updateAccount,
    createCategory,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createTag,
    updateFilters,
    loadDashboardData,
    loadTransactions,
    loadAccounts,
    loadCategories,
    loadTags,
    loadBudgets
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

// Hook para usar o contexto
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
}