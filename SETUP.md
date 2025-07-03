# 🚀 Guia de Configuração - Sistema Financeiro Pessoal

Este guia te ajudará a configurar e executar o sistema financeiro pessoal em sua máquina.

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- Conta no **Supabase** (gratuita)

## 🔧 Configuração Passo a Passo

### 1. Instalação das Dependências

```bash
# Instalar todas as dependências
npm install

# Ou se preferir usar yarn
yarn install
```

### 2. Configuração do Supabase

#### 2.1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta gratuita
3. Clique em "New Project"
4. Escolha uma organização
5. Defina:
   - **Name**: Sistema Financeiro Pessoal
   - **Database Password**: [escolha uma senha forte]
   - **Region**: Brazil (ou mais próximo)
6. Clique em "Create new project"
7. Aguarde a criação (pode levar alguns minutos)

#### 2.2. Executar Script SQL

1. No dashboard do Supabase, vá para **SQL Editor**
2. Abra o arquivo `database.sql` deste projeto
3. **Copie TODO o conteúdo** do arquivo
4. **Cole no SQL Editor** do Supabase
5. Clique em **"Run"** para executar
6. Verifique se todas as tabelas foram criadas em **Table Editor**

#### 2.3. Obter Credenciais

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (chave longa)

### 3. Configuração das Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` e substitua pelos seus valores:

```env
REACT_APP_SUPABASE_URL=https://sua-url-do-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 4. Execução do Projeto

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Ou com yarn
yarn start
```

O projeto estará disponível em: **http://localhost:3000**

## 🗃️ Estrutura do Banco de Dados

Após executar o script SQL, você terá as seguintes tabelas:

### Tabelas Principais
- **usuarios**: Informações dos usuários
- **contas**: Contas bancárias, cartões e carteiras
- **categorias**: Categorias para organização (com dados padrão)
- **transacoes**: Transações/pagamentos (normal, fixo, recorrente)
- **tags**: Tags para marcação adicional
- **orcamentos**: Orçamentos por categoria
- **metas**: Metas financeiras

### Funcionalidades Automáticas
- ✅ Cálculo automático de saldos
- ✅ Triggers para timestamps
- ✅ Views para relatórios
- ✅ Índices para performance
- ✅ Categorias padrão pré-criadas

## 🎯 Primeiros Passos

### 1. Criar Suas Contas
1. Vá para **Contas** no menu lateral
2. Clique em **"Nova Conta"**
3. Adicione suas contas bancárias, cartões, etc.

### 2. Ajustar Categorias
1. Vá para **Categorias**
2. O sistema já vem com categorias padrão
3. Adicione ou edite conforme necessário

### 3. Adicionar Transações
1. Vá para **Transações**
2. Clique em **"Nova Transação"**
3. Experimente os diferentes tipos:
   - **Normal**: Transações únicas
   - **Fixo**: Pagamentos em datas específicas
   - **Recorrente**: Pagamentos que se repetem

### 4. Explorar o Dashboard
1. Vá para **Dashboard**
2. Use os filtros para diferentes períodos
3. Analise os gráficos e relatórios

## 🎨 Personalização

### Cores e Temas
As cores podem ser personalizadas editando `src/styles/globals.css`:

```css
:root {
  --primary-500: #3b82f6;    /* Azul principal */
  --success-500: #22c55e;    /* Verde sucesso */
  --error-500: #ef4444;      /* Vermelho erro */
  --warning-500: #f59e0b;    /* Amarelo alerta */
}
```

### Categorias Padrão
Você pode editar as categorias padrão diretamente no banco ou pela interface.

## 🚨 Problemas Comuns

### Erro de Conexão com Supabase
- ✅ Verifique se as URLs e chaves estão corretas no `.env`
- ✅ Confirme que o projeto Supabase está ativo
- ✅ Verifique se executou todo o script SQL

### Tabelas não Criadas
- ✅ Execute o script `database.sql` completo
- ✅ Verifique se não há erros no SQL Editor
- ✅ Confirme que todas as tabelas aparecem no Table Editor

### Erro ao Instalar Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS
- ✅ Confirme que está usando `localhost:3000`
- ✅ Verifique as configurações de CORS no Supabase

## 📱 Funcionalidades Implementadas

### ✅ Dashboard Completo
- Cards de resumo financeiro
- Gráficos interativos
- Próximos pagamentos
- Alertas de vencimento

### ✅ Gestão de Transações
- Pagamentos normais, fixos e recorrentes
- Sistema de categorização
- Filtros avançados
- CRUD completo

### ✅ Contas e Carteiras
- Múltiplos tipos de conta
- Saldo automático
- Cores personalizadas
- Gestão de limites

### ✅ Relatórios e Análises
- Gastos por categoria
- Tendências mensais
- Análise por conta
- Exportação de dados

### ✅ Sistema de Configurações
- Preferências pessoais
- Backup/Restauração
- Notificações
- Temas e personalização

## 🎯 Próximos Passos

### Para Desenvolvimento
1. Implementar autenticação real
2. Adicionar notificações push
3. Criar app mobile
4. Integração bancária (Open Banking)

### Para Produção
1. Configurar deploy (Vercel/Netlify)
2. Otimizar performance
3. Implementar testes
4. Documentação da API

## 💡 Dicas de Uso

### Organização
- Use categorias específicas (ex: "Supermercado" em vez de só "Alimentação")
- Aproveite as tags para classificações extras
- Configure recorrências para economizar tempo

### Análise
- Use os filtros para analisar períodos específicos
- Compare mês a mês para identificar tendências
- Defina orçamentos para controlar gastos

### Backup
- Faça backup regular dos dados
- Use a exportação para análises externas
- Mantenha as configurações salvas

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique este guia** - a maioria dos problemas está documentada
2. **Confira o README.md** - informações detalhadas do projeto
3. **Veja os logs do browser** - erros específicos podem aparecer no console
4. **Teste com dados simples** - comece com poucas transações

## 🎉 Pronto!

Agora você tem um sistema completo de controle financeiro pessoal rodando localmente!

Aproveite para:
- 📊 Organizar suas finanças
- 📈 Acompanhar tendências
- 💰 Controlar gastos
- 🎯 Atingir suas metas

**Boa gestão financeira! 💪**