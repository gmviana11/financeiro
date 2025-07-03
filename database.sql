-- Sistema Financeiro Pessoal - Database Schema para Supabase
-- Execute este script no Supabase SQL Editor

-- Habilitar Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Tabela de usuários (caso queira multi-usuário)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas (contas bancárias, cartões, etc.)
CREATE TABLE IF NOT EXISTS contas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('conta_corrente', 'poupanca', 'cartao_credito', 'cartao_debito', 'dinheiro', 'investimento')),
    banco VARCHAR(255),
    saldo_inicial DECIMAL(10,2) DEFAULT 0,
    saldo_atual DECIMAL(10,2) DEFAULT 0,
    limite_credito DECIMAL(10,2),
    cor VARCHAR(7) DEFAULT '#3B82F6', -- Cor para identificação visual
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    cor VARCHAR(7) DEFAULT '#6B7280',
    icone VARCHAR(255), -- Nome do ícone ou emoji
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tags
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cor VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, nome)
);

-- Tabela principal de transações/pagamentos
CREATE TABLE IF NOT EXISTS transacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    conta_id UUID REFERENCES contas(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo_transacao VARCHAR(50) NOT NULL CHECK (tipo_transacao IN ('receita', 'despesa')),
    tipo_pagamento VARCHAR(50) NOT NULL CHECK (tipo_pagamento IN ('normal', 'fixo', 'recorrente')),
    data_transacao DATE NOT NULL,
    data_vencimento DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'agendado', 'cancelado')),
    observacoes TEXT,
    
    -- Campos para pagamentos recorrentes
    recorrencia_tipo VARCHAR(50) CHECK (recorrencia_tipo IN ('diario', 'semanal', 'quinzenal', 'mensal', 'bimestral', 'trimestral', 'semestral', 'anual')),
    recorrencia_intervalo INTEGER DEFAULT 1, -- Ex: a cada 2 meses
    data_inicio_recorrencia DATE,
    data_fim_recorrencia DATE,
    transacao_pai_id UUID REFERENCES transacoes(id) ON DELETE CASCADE, -- Para vincular recorrências
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relacionamento entre transações e tags
CREATE TABLE IF NOT EXISTS transacao_tags (
    transacao_id UUID REFERENCES transacoes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (transacao_id, tag_id)
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS orcamentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
    valor_limite DECIMAL(10,2) NOT NULL,
    periodo VARCHAR(50) NOT NULL CHECK (periodo IN ('mensal', 'anual')),
    mes INTEGER CHECK (mes BETWEEN 1 AND 12),
    ano INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, categoria_id, periodo, mes, ano)
);

-- Tabela de metas financeiras
CREATE TABLE IF NOT EXISTS metas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    valor_objetivo DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) DEFAULT 0,
    data_objetivo DATE,
    status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'concluida', 'cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS configuracoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE UNIQUE,
    moeda VARCHAR(10) DEFAULT 'BRL',
    formato_data VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    dias_alerta_vencimento INTEGER DEFAULT 3,
    receber_notificacoes BOOLEAN DEFAULT true,
    tema VARCHAR(20) DEFAULT 'light' CHECK (tema IN ('light', 'dark')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_transacoes_usuario_id ON transacoes(usuario_id);
CREATE INDEX idx_transacoes_conta_id ON transacoes(conta_id);
CREATE INDEX idx_transacoes_categoria_id ON transacoes(categoria_id);
CREATE INDEX idx_transacoes_data_transacao ON transacoes(data_transacao);
CREATE INDEX idx_transacoes_data_vencimento ON transacoes(data_vencimento);
CREATE INDEX idx_transacoes_status ON transacoes(status);
CREATE INDEX idx_transacoes_tipo_pagamento ON transacoes(tipo_pagamento);
CREATE INDEX idx_contas_usuario_id ON contas(usuario_id);
CREATE INDEX idx_categorias_usuario_id ON categorias(usuario_id);
CREATE INDEX idx_orcamentos_usuario_id ON orcamentos(usuario_id);

-- Functions para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contas_updated_at BEFORE UPDATE ON contas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transacoes_updated_at BEFORE UPDATE ON transacoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function para calcular saldo atual das contas
CREATE OR REPLACE FUNCTION calcular_saldo_conta(conta_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    saldo_calculado DECIMAL(10,2);
    saldo_inicial DECIMAL(10,2);
BEGIN
    -- Buscar saldo inicial
    SELECT c.saldo_inicial INTO saldo_inicial FROM contas c WHERE c.id = conta_uuid;
    
    -- Calcular saldo com base nas transações pagas
    SELECT 
        saldo_inicial + COALESCE(SUM(
            CASE 
                WHEN t.tipo_transacao = 'receita' THEN t.valor
                WHEN t.tipo_transacao = 'despesa' THEN -t.valor
                ELSE 0
            END
        ), 0) INTO saldo_calculado
    FROM transacoes t
    WHERE t.conta_id = conta_uuid 
    AND t.status = 'pago';
    
    RETURN COALESCE(saldo_calculado, saldo_inicial);
END;
$$ LANGUAGE plpgsql;

-- Function para atualizar saldo da conta após inserção/atualização de transação
CREATE OR REPLACE FUNCTION atualizar_saldo_conta()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar saldo para a conta da transação nova/atualizada
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE contas 
        SET saldo_atual = calcular_saldo_conta(NEW.conta_id)
        WHERE id = NEW.conta_id;
    END IF;
    
    -- Se foi um UPDATE e a conta mudou, atualizar a conta antiga também
    IF TG_OP = 'UPDATE' AND OLD.conta_id != NEW.conta_id THEN
        UPDATE contas 
        SET saldo_atual = calcular_saldo_conta(OLD.conta_id)
        WHERE id = OLD.conta_id;
    END IF;
    
    -- Se foi DELETE, atualizar a conta da transação deletada
    IF TG_OP = 'DELETE' THEN
        UPDATE contas 
        SET saldo_atual = calcular_saldo_conta(OLD.conta_id)
        WHERE id = OLD.conta_id;
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar saldo automaticamente
CREATE TRIGGER trigger_atualizar_saldo_conta
    AFTER INSERT OR UPDATE OR DELETE ON transacoes
    FOR EACH ROW EXECUTE FUNCTION atualizar_saldo_conta();

-- Inserir categorias padrão (execute após criar um usuário)
INSERT INTO categorias (usuario_id, nome, tipo, cor, icone) VALUES
('00000000-0000-0000-0000-000000000000', 'Alimentação', 'despesa', '#EF4444', '🍽️'),
('00000000-0000-0000-0000-000000000000', 'Transporte', 'despesa', '#F59E0B', '🚗'),
('00000000-0000-0000-0000-000000000000', 'Moradia', 'despesa', '#8B5CF6', '🏠'),
('00000000-0000-0000-0000-000000000000', 'Saúde', 'despesa', '#10B981', '⚕️'),
('00000000-0000-0000-0000-000000000000', 'Educação', 'despesa', '#3B82F6', '📚'),
('00000000-0000-0000-0000-000000000000', 'Lazer', 'despesa', '#F97316', '🎮'),
('00000000-0000-0000-0000-000000000000', 'Vestuário', 'despesa', '#EC4899', '👕'),
('00000000-0000-0000-0000-000000000000', 'Serviços', 'despesa', '#6B7280', '🔧'),
('00000000-0000-0000-0000-000000000000', 'Salário', 'receita', '#10B981', '💼'),
('00000000-0000-0000-0000-000000000000', 'Freelance', 'receita', '#059669', '💻'),
('00000000-0000-0000-0000-000000000000', 'Investimentos', 'receita', '#7C3AED', '📈'),
('00000000-0000-0000-0000-000000000000', 'Outros', 'receita', '#6B7280', '💰')
ON CONFLICT DO NOTHING;

-- View para relatórios mensais
CREATE OR REPLACE VIEW relatorio_mensal AS
SELECT 
    t.usuario_id,
    EXTRACT(YEAR FROM t.data_transacao) as ano,
    EXTRACT(MONTH FROM t.data_transacao) as mes,
    c.nome as categoria,
    t.tipo_transacao,
    SUM(t.valor) as total,
    COUNT(*) as quantidade_transacoes
FROM transacoes t
LEFT JOIN categorias c ON t.categoria_id = c.id
WHERE t.status = 'pago'
GROUP BY t.usuario_id, ano, mes, c.nome, t.tipo_transacao
ORDER BY ano DESC, mes DESC, total DESC;

-- View para dashboard
CREATE OR REPLACE VIEW dashboard_resumo AS
SELECT 
    t.usuario_id,
    SUM(CASE WHEN t.tipo_transacao = 'receita' AND t.status = 'pago' THEN t.valor ELSE 0 END) as total_receitas,
    SUM(CASE WHEN t.tipo_transacao = 'despesa' AND t.status = 'pago' THEN t.valor ELSE 0 END) as total_despesas,
    COUNT(CASE WHEN t.status = 'pendente' AND t.data_vencimento >= CURRENT_DATE THEN 1 END) as contas_pendentes,
    COUNT(CASE WHEN t.status = 'atrasado' OR (t.status = 'pendente' AND t.data_vencimento < CURRENT_DATE) THEN 1 END) as contas_atrasadas
FROM transacoes t
WHERE EXTRACT(MONTH FROM t.data_transacao) = EXTRACT(MONTH FROM CURRENT_DATE)
AND EXTRACT(YEAR FROM t.data_transacao) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY t.usuario_id;

-- Row Level Security (RLS) - Descomente se usando autenticação
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transacoes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (descomente se usando autenticação)
-- CREATE POLICY "Usuarios podem ver apenas seus próprios dados" ON usuarios FOR ALL USING (auth.uid() = id);
-- CREATE POLICY "Contas do usuário" ON contas FOR ALL USING (auth.uid() = usuario_id);
-- CREATE POLICY "Categorias do usuário" ON categorias FOR ALL USING (auth.uid() = usuario_id);
-- CREATE POLICY "Transações do usuário" ON transacoes FOR ALL USING (auth.uid() = usuario_id);
-- CREATE POLICY "Tags do usuário" ON tags FOR ALL USING (auth.uid() = usuario_id);
-- CREATE POLICY "Orçamentos do usuário" ON orcamentos FOR ALL USING (auth.uid() = usuario_id);
-- CREATE POLICY "Metas do usuário" ON metas FOR ALL USING (auth.uid() = usuario_id);
-- CREATE POLICY "Configurações do usuário" ON configuracoes FOR ALL USING (auth.uid() = usuario_id);

-- Comentários das tabelas
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema';
COMMENT ON TABLE contas IS 'Contas bancárias, cartões e carteiras do usuário';
COMMENT ON TABLE categorias IS 'Categorias para organização das transações';
COMMENT ON TABLE transacoes IS 'Tabela principal com todas as transações/pagamentos';
COMMENT ON TABLE tags IS 'Tags para marcação adicional das transações';
COMMENT ON TABLE orcamentos IS 'Orçamentos definidos por categoria e período';
COMMENT ON TABLE metas IS 'Metas financeiras do usuário';
COMMENT ON TABLE configuracoes IS 'Configurações personalizadas do usuário';