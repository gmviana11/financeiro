import { createClient } from '@supabase/supabase-js'

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Serviços para interação com o banco de dados
export const FinanceService = {
  // Usuários
  async createUser(userData) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([userData])
      .select()
    return { data, error }
  },

  async getUser(userId) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Contas
  async getContas(usuarioId) {
    const { data, error } = await supabase
      .from('contas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('ativo', true)
      .order('nome')
    return { data, error }
  },

  async createConta(contaData) {
    const { data, error } = await supabase
      .from('contas')
      .insert([contaData])
      .select()
    return { data, error }
  },

  async updateConta(contaId, updates) {
    const { data, error } = await supabase
      .from('contas')
      .update(updates)
      .eq('id', contaId)
      .select()
    return { data, error }
  },

  // Categorias
  async getCategorias(usuarioId) {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('ativo', true)
      .order('nome')
    return { data, error }
  },

  async createCategoria(categoriaData) {
    const { data, error } = await supabase
      .from('categorias')
      .insert([categoriaData])
      .select()
    return { data, error }
  },

  // Transações
  async getTransacoes(usuarioId, filters = {}) {
    let query = supabase
      .from('transacoes')
      .select(`
        *,
        conta:contas(nome, tipo, cor),
        categoria:categorias(nome, cor, icone),
        tags:transacao_tags(tag:tags(nome, cor))
      `)
      .eq('usuario_id', usuarioId)
      .order('data_transacao', { ascending: false })

    // Aplicar filtros
    if (filters.mes && filters.ano) {
      query = query
        .gte('data_transacao', `${filters.ano}-${filters.mes.toString().padStart(2, '0')}-01`)
        .lt('data_transacao', `${filters.ano}-${(filters.mes + 1).toString().padStart(2, '0')}-01`)
    }

    if (filters.categoria_id) {
      query = query.eq('categoria_id', filters.categoria_id)
    }

    if (filters.conta_id) {
      query = query.eq('conta_id', filters.conta_id)
    }

    if (filters.tipo_transacao) {
      query = query.eq('tipo_transacao', filters.tipo_transacao)
    }

    if (filters.tipo_pagamento) {
      query = query.eq('tipo_pagamento', filters.tipo_pagamento)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query
    return { data, error }
  },

  async createTransacao(transacaoData) {
    const { data, error } = await supabase
      .from('transacoes')
      .insert([transacaoData])
      .select()
    return { data, error }
  },

  async updateTransacao(transacaoId, updates) {
    const { data, error } = await supabase
      .from('transacoes')
      .update(updates)
      .eq('id', transacaoId)
      .select()
    return { data, error }
  },

  async deleteTransacao(transacaoId) {
    const { data, error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', transacaoId)
    return { data, error }
  },

  // Dashboard
  async getDashboardData(usuarioId, mes, ano) {
    const { data, error } = await supabase
      .from('dashboard_resumo')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single()
    return { data, error }
  },

  async getProximosPagamentos(usuarioId, dias = 7) {
    const hoje = new Date()
    const futuro = new Date()
    futuro.setDate(hoje.getDate() + dias)

    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        conta:contas(nome, cor),
        categoria:categorias(nome, cor, icone)
      `)
      .eq('usuario_id', usuarioId)
      .in('status', ['pendente', 'agendado'])
      .gte('data_vencimento', hoje.toISOString().split('T')[0])
      .lte('data_vencimento', futuro.toISOString().split('T')[0])
      .order('data_vencimento')
    
    return { data, error }
  },

  async getGastosPorCategoria(usuarioId, mes, ano) {
    const { data, error } = await supabase
      .from('relatorio_mensal')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('mes', mes)
      .eq('ano', ano)
      .eq('tipo_transacao', 'despesa')
      .order('total', { ascending: false })
    
    return { data, error }
  },

  // Tags
  async getTags(usuarioId) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('nome')
    return { data, error }
  },

  async createTag(tagData) {
    const { data, error } = await supabase
      .from('tags')
      .insert([tagData])
      .select()
    return { data, error }
  },

  // Orçamentos
  async getOrcamentos(usuarioId, mes, ano) {
    const { data, error } = await supabase
      .from('orcamentos')
      .select(`
        *,
        categoria:categorias(nome, cor, icone)
      `)
      .eq('usuario_id', usuarioId)
      .eq('mes', mes)
      .eq('ano', ano)
      .eq('ativo', true)
    return { data, error }
  },

  async createOrcamento(orcamentoData) {
    const { data, error } = await supabase
      .from('orcamentos')
      .insert([orcamentoData])
      .select()
    return { data, error }
  },

  // Recorrências - Gerar próximas ocorrências
  async gerarRecorrencias(transacaoId) {
    // Esta função seria implementada para gerar automaticamente
    // as próximas ocorrências de uma transação recorrente
    // Por simplicidade, isso pode ser feito no frontend ou via função do Supabase
  }
}

// Utilitários
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export const getStatusColor = (status) => {
  const colors = {
    'pago': 'green',
    'pendente': 'yellow',
    'atrasado': 'red',
    'agendado': 'blue',
    'cancelado': 'gray'
  }
  return colors[status] || 'gray'
}

export const getTipoContaIcon = (tipo) => {
  const icons = {
    'conta_corrente': '🏦',
    'poupanca': '💰',
    'cartao_credito': '💳',
    'cartao_debito': '💳',
    'dinheiro': '💵',
    'investimento': '📈'
  }
  return icons[tipo] || '💰'
}