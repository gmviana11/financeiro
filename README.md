# Sistema Financeiro Pessoal

Um sistema completo de controle financeiro pessoal desenvolvido com React e Supabase, oferecendo funcionalidades para gerenciar pagamentos recorrentes, fixos e normais, com dashboard interativo e relatórios detalhados.

## 🚀 Funcionalidades

### 📊 Dashboard Completo
- Visão geral das finanças com cards informativos
- Gráficos interativos de gastos por categoria
- Tendências mensais de receitas e despesas
- Próximos pagamentos e alertas de vencimento
- Indicadores de performance financeira

### 💰 Gestão de Transações
- **Pagamentos Normais**: Transações únicas e pontuais
- **Pagamentos Fixos**: Pagamentos em datas específicas
- **Pagamentos Recorrentes**: Automatização de pagamentos repetitivos
- Categorização detalhada com tags
- Status de pagamento (Pendente, Pago, Atrasado, etc.)

### 🎯 Sistema de Filtros Avançados
- Filtros por mês e ano
- Filtros por tipo de transação (Receita/Despesa)
- Filtros por categoria e conta
- Filtros por tipo de pagamento e status
- Filtros por tags personalizadas

### 📈 Relatórios e Análises
- Relatórios mensais detalhados
- Análise de gastos por categoria
- Projeções e tendências
- Comparativos período a período
- Alertas e notificações

### 🏦 Gestão de Contas
- Contas bancárias e cartões
- Saldo em tempo real
- Histórico de movimentações
- Diferentes tipos de conta

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, React Router DOM
- **Gráficos**: Chart.js, React-Chartjs-2
- **Backend**: Supabase (PostgreSQL)
- **Estilização**: CSS customizado com variáveis
- **Ícones**: Lucide React
- **Notificações**: React Toastify
- **Datas**: Date-fns

## 📋 Pré-requisitos

- Node.js 16+ 
- NPM ou Yarn
- Conta no Supabase

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd sistema-financeiro-pessoal
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados Supabase

#### 3.1. Crie um projeto no Supabase
1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Aguarde a criação do banco de dados

#### 3.2. Execute o script SQL
1. No dashboard do Supabase, vá para "SQL Editor"
2. Copie todo o conteúdo do arquivo `database.sql`
3. Cole no editor e execute

#### 3.3. Configure as variáveis de ambiente
1. Copie o arquivo `.env.example` para `.env`
```bash
cp .env.example .env
```

2. No dashboard do Supabase, vá para Settings > API
3. Copie a URL e a chave anônima
4. Substitua as variáveis no arquivo `.env`:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 4. Inicie a aplicação
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **usuarios**: Informações dos usuários
- **contas**: Contas bancárias, cartões e carteiras
- **categorias**: Categorias para organização das transações
- **transacoes**: Tabela principal com todas as transações/pagamentos
- **tags**: Tags para marcação adicional das transações
- **orcamentos**: Orçamentos definidos por categoria e período
- **metas**: Metas financeiras do usuário

### Funcionalidades Automáticas

- Cálculo automático de saldos das contas
- Triggers para atualização de timestamps
- Views para relatórios otimizados
- Índices para performance

## 🎯 Como Usar

### 1. Dashboard
- Visualize um resumo completo das suas finanças
- Monitore receitas, despesas e saldo do mês
- Acompanhe próximos pagamentos
- Analise gastos por categoria

### 2. Transações
- Cadastre receitas e despesas
- Configure pagamentos recorrentes (mensais, anuais, etc.)
- Defina pagamentos fixos para datas específicas
- Organize com categorias e tags

### 3. Tipos de Pagamento

#### Pagamentos Normais
- Transações únicas e pontuais
- Ex: Compra no supermercado, combustível

#### Pagamentos Fixos
- Pagamentos em datas específicas, não recorrentes
- Ex: IPTU anual, seguro do carro

#### Pagamentos Recorrentes
- Pagamentos que se repetem automaticamente
- Ex: Aluguel, mensalidades, assinaturas
- Configure frequência: diário, semanal, mensal, etc.

### 4. Filtros e Relatórios
- Use filtros para analisar períodos específicos
- Filtre por categoria, conta, tipo de pagamento
- Gere relatórios personalizados
- Exporte dados quando necessário

## 🎨 Personalização

### Cores e Temas
As cores do sistema podem ser personalizadas no arquivo `src/styles/globals.css` através das variáveis CSS:

```css
:root {
  --primary-500: #3b82f6;
  --success-500: #22c55e;
  --error-500: #ef4444;
  --warning-500: #f59e0b;
}
```

### Categorias Padrão
O sistema inclui categorias padrão que podem ser modificadas diretamente no banco de dados ou através da interface.

## 🔒 Segurança

- Row Level Security (RLS) configurado para multi-usuário
- Políticas de acesso baseadas em autenticação
- Validação de dados no frontend e backend
- Sanitização de entradas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona bem em:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🚀 Deploy

### Netlify
1. Conecte seu repositório no Netlify
2. Configure as variáveis de ambiente
3. Deploy automático

### Vercel
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

- [ ] Autenticação de usuários
- [ ] Integração bancária (Open Banking)
- [ ] Exportação para Excel/PDF
- [ ] Aplicativo mobile (React Native)
- [ ] Notificações push
- [ ] Sistema de metas avançado
- [ ] Investimentos e carteira
- [ ] Comparação com benchmarks
- [ ] IA para categorização automática

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💬 Suporte

Se você encontrar algum problema ou tiver sugestões:

1. Verifique se o problema já foi reportado nos Issues
2. Crie um novo Issue com detalhes do problema
3. Forneça informações sobre seu ambiente (OS, Node.js, navegador)

## 🙏 Agradecimentos

- [React](https://reactjs.org/) - Biblioteca JavaScript
- [Supabase](https://supabase.com/) - Backend como serviço
- [Chart.js](https://www.chartjs.org/) - Gráficos interativos
- [Lucide React](https://lucide.dev/) - Ícones
- Comunidade open source

---

Desenvolvido com ❤️ para ajudar no controle financeiro pessoal.