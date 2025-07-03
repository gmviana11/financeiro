import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../supabaseClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyTrendsChart = ({ showValues = true }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Dados simulados para os últimos 6 meses
    // Em um app real, isso viria da API
    const generateMockData = () => {
      const months = [];
      const receitas = [];
      const despesas = [];
      
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        
        months.push(monthName);
        receitas.push(Math.random() * 3000 + 2000); // Receitas entre 2000-5000
        despesas.push(Math.random() * 2500 + 1500); // Despesas entre 1500-4000
      }
      
      return { months, receitas, despesas };
    };

    const data = generateMockData();
    
    setChartData({
      labels: data.months,
      datasets: [
        {
          label: 'Receitas',
          data: data.receitas,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Despesas',
          data: data.despesas,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (showValues) {
              return `${label}: ${formatCurrency(value)}`;
            } else {
              return `${label}: ***`;
            }
          },
          afterBody: function(tooltipItems) {
            if (tooltipItems.length >= 2 && showValues) {
              const receita = tooltipItems.find(item => item.dataset.label === 'Receitas')?.parsed.y || 0;
              const despesa = tooltipItems.find(item => item.dataset.label === 'Despesas')?.parsed.y || 0;
              const saldo = receita - despesa;
              
              return [``, `Saldo: ${formatCurrency(saldo)}`];
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            if (showValues) {
              return formatCurrency(value);
            } else {
              return '***';
            }
          }
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading"></div>
      </div>
    );
  }

  // Calcular estatísticas
  const receitaMedia = chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length;
  const despesaMedia = chartData.datasets[1].data.reduce((a, b) => a + b, 0) / chartData.datasets[1].data.length;
  const saldoMedio = receitaMedia - despesaMedia;

  const ultimoMes = chartData.datasets[0].data.length - 1;
  const receitaUltimoMes = chartData.datasets[0].data[ultimoMes];
  const despesaUltimoMes = chartData.datasets[1].data[ultimoMes];
  const saldoUltimoMes = receitaUltimoMes - despesaUltimoMes;

  const tendenciaReceita = ultimoMes > 0 ? 
    ((receitaUltimoMes - chartData.datasets[0].data[ultimoMes - 1]) / chartData.datasets[0].data[ultimoMes - 1]) * 100 : 0;
  
  const tendenciaDespesa = ultimoMes > 0 ? 
    ((despesaUltimoMes - chartData.datasets[1].data[ultimoMes - 1]) / chartData.datasets[1].data[ultimoMes - 1]) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Receita Média</div>
          <div className="text-lg font-semibold text-success-600">
            {showValues ? formatCurrency(receitaMedia) : '***'}
          </div>
          <div className="text-xs text-gray-500">
            {tendenciaReceita > 0 ? '↗' : '↘'} {Math.abs(tendenciaReceita).toFixed(1)}% vs mês anterior
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Despesa Média</div>
          <div className="text-lg font-semibold text-error-600">
            {showValues ? formatCurrency(despesaMedia) : '***'}
          </div>
          <div className="text-xs text-gray-500">
            {tendenciaDespesa > 0 ? '↗' : '↘'} {Math.abs(tendenciaDespesa).toFixed(1)}% vs mês anterior
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Saldo Médio</div>
          <div className={`text-lg font-semibold ${saldoMedio >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            {showValues ? formatCurrency(saldoMedio) : '***'}
          </div>
          <div className="text-xs text-gray-500">
            Último: {showValues ? formatCurrency(saldoUltimoMes) : '***'}
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">💡 Insights</h4>
        <div className="space-y-1 text-sm text-gray-600">
          {saldoMedio > 0 && (
            <p>• Você mantém um saldo positivo em média. Continue assim!</p>
          )}
          {tendenciaReceita > 0 && (
            <p>• Suas receitas têm crescido nos últimos meses.</p>
          )}
          {tendenciaDespesa > 10 && (
            <p>• Atenção: suas despesas aumentaram significativamente.</p>
          )}
          {Math.abs(receitaMedia - despesaMedia) < 500 && (
            <p>• Suas receitas e despesas estão equilibradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendsChart;