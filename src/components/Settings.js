import React, { useState } from 'react';
import { Save, User, Bell, Palette, Database, Download, Upload, Trash2 } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Perfil do usuário
    nome: 'Usuário',
    email: 'usuario@email.com',
    
    // Preferências
    moeda: 'BRL',
    formatoData: 'DD/MM/YYYY',
    diasAlertaVencimento: 3,
    tema: 'light',
    
    // Notificações
    receberNotificacoes: true,
    notificarVencimentos: true,
    notificarOrcamento: true,
    notificarMetas: true,
    
    // Dados
    backupAutomatico: false,
    manterHistorico: 365
  });

  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'preferences', label: 'Preferências', icon: Palette },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'data', label: 'Dados', icon: Database }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    // Aqui você salvaria as configurações no Supabase
    alert('Configurações salvas com sucesso!');
  };

  const exportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      settings: settings,
      note: 'Backup do sistema financeiro pessoal'
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `backup-financeiro-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.settings) {
            setSettings(importedData.settings);
            alert('Dados importados com sucesso!');
          } else {
            alert('Arquivo inválido!');
          }
        } catch (error) {
          alert('Erro ao importar arquivo!');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!')) {
      // Implementar limpeza de dados
      alert('Funcionalidade não implementada ainda. Em produção, isso limparia todos os dados.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Configurações</h1>
          <p className="page-subtitle">
            Personalize o sistema de acordo com suas preferências
          </p>
        </div>
        
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={loading}
        >
          <Save size={16} />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com Tabs */}
        <div className="card">
          <div className="card-body p-0">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Configurações */}
        <div className="lg:col-span-3">
          {/* Perfil */}
          {activeTab === 'profile' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informações do Perfil</h3>
              </div>
              <div className="card-body space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={32} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{settings.nome}</h4>
                    <p className="text-gray-500">{settings.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      value={settings.nome}
                      onChange={(e) => handleSettingChange('nome', e.target.value)}
                      className="form-input"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleSettingChange('email', e.target.value)}
                      className="form-input"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Segurança</h4>
                  <div className="space-y-3">
                    <button className="btn btn-secondary w-full md:w-auto">
                      Alterar Senha
                    </button>
                    <button className="btn btn-secondary w-full md:w-auto">
                      Configurar 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferências */}
          {activeTab === 'preferences' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Preferências do Sistema</h3>
              </div>
              <div className="card-body space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Moeda</label>
                    <select
                      value={settings.moeda}
                      onChange={(e) => handleSettingChange('moeda', e.target.value)}
                      className="form-select"
                    >
                      <option value="BRL">Real Brasileiro (R$)</option>
                      <option value="USD">Dólar Americano ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Formato de Data</label>
                    <select
                      value={settings.formatoData}
                      onChange={(e) => handleSettingChange('formatoData', e.target.value)}
                      className="form-select"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Dias de Alerta para Vencimento</label>
                    <input
                      type="number"
                      value={settings.diasAlertaVencimento}
                      onChange={(e) => handleSettingChange('diasAlertaVencimento', parseInt(e.target.value))}
                      className="form-input"
                      min="1"
                      max="30"
                    />
                    <div className="form-error">
                      Será alertado {settings.diasAlertaVencimento} dias antes do vencimento
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tema</label>
                    <select
                      value={settings.tema}
                      onChange={(e) => handleSettingChange('tema', e.target.value)}
                      className="form-select"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Exibição</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.mostrarSaldos}
                        onChange={(e) => handleSettingChange('mostrarSaldos', e.target.checked)}
                        className="rounded"
                      />
                      <span>Mostrar saldos por padrão</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.compactarListas}
                        onChange={(e) => handleSettingChange('compactarListas', e.target.checked)}
                        className="rounded"
                      />
                      <span>Usar modo compacto nas listas</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Configurações de Notificação</h3>
              </div>
              <div className="card-body space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Receber Notificações</h4>
                    <p className="text-sm text-gray-500">Ativar ou desativar todas as notificações</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.receberNotificacoes}
                      onChange={(e) => handleSettingChange('receberNotificacoes', e.target.checked)}
                      className="rounded"
                    />
                  </label>
                </div>

                {settings.receberNotificacoes && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Alertas de Vencimento</h4>
                        <p className="text-sm text-gray-500">Notificar sobre contas próximas do vencimento</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notificarVencimentos}
                          onChange={(e) => handleSettingChange('notificarVencimentos', e.target.checked)}
                          className="rounded"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Orçamento Estourado</h4>
                        <p className="text-sm text-gray-500">Notificar quando o orçamento for ultrapassado</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notificarOrcamento}
                          onChange={(e) => handleSettingChange('notificarOrcamento', e.target.checked)}
                          className="rounded"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Metas Atingidas</h4>
                        <p className="text-sm text-gray-500">Notificar quando uma meta for alcançada</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.notificarMetas}
                          onChange={(e) => handleSettingChange('notificarMetas', e.target.checked)}
                          className="rounded"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dados */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Backup e Restauração */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Backup e Restauração</h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Backup Automático</h4>
                      <p className="text-sm text-gray-500">Fazer backup automático dos dados semanalmente</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.backupAutomatico}
                        onChange={(e) => handleSettingChange('backupAutomatico', e.target.checked)}
                        className="rounded"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={exportData}
                      className="btn btn-primary flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Exportar Dados
                    </button>

                    <label className="btn btn-secondary flex items-center justify-center gap-2 cursor-pointer">
                      <Upload size={16} />
                      Importar Dados
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacidade */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Privacidade e Dados</h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="form-group">
                    <label className="form-label">Manter Histórico por (dias)</label>
                    <select
                      value={settings.manterHistorico}
                      onChange={(e) => handleSettingChange('manterHistorico', parseInt(e.target.value))}
                      className="form-select"
                    >
                      <option value={90}>90 dias</option>
                      <option value={180}>6 meses</option>
                      <option value={365}>1 ano</option>
                      <option value={730}>2 anos</option>
                      <option value={-1}>Indefinidamente</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-error-600 mb-2">Zona de Perigo</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
                    </p>
                    
                    <button
                      onClick={clearAllData}
                      className="btn btn-error flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Limpar Todos os Dados
                    </button>
                  </div>
                </div>
              </div>

              {/* Informações do Sistema */}
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Informações do Sistema</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Versão:</span>
                      <span className="ml-2 font-medium">1.0.0</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Última atualização:</span>
                      <span className="ml-2 font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Banco de dados:</span>
                      <span className="ml-2 font-medium">Supabase</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium text-success-600">Conectado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;