import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../supabaseClient';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ data, showValues = true }) => {
  // Dados padrão caso não haja dados
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-300 mb-2">📊</div>
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  // Cores para as categorias
  const colors = [
    '#EF4444', // Vermelho
    '#F59E0B', // Laranja
    '#8B5CF6', // Roxo
    '#10B981', // Verde
    '#3B82F6', // Azul
    '#F97316', // Laranja escuro
    '#EC4899', // Rosa
    '#6B7280', // Cinza
    '#059669', // Verde escuro
    '#7C3AED'  // Roxo escuro
  ];

  const chartData = {
    labels: data.map(item => item.categoria || 'Sem categoria'),
    datasets: [
      {
        data: data.map(item => item.total),
        backgroundColor: colors.slice(0, data.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const displayValue = showValues ? formatCurrency(value) : '***';
                
                return {
                  text: `${label}: ${displayValue}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  lineWidth: 0,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            if (showValues) {
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            } else {
              return `${label}: *** (${percentage}%)`;
            }
          }
        }
      }
    },
    cutout: '50%', // Para fazer um gráfico de rosca
    animation: {
      animateRotate: true,
      duration: 1000
    }
  };

  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="h-64 relative">
      <Doughnut data={chartData} options={options} />
      
      {/* Total no centro */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-lg font-bold text-gray-900">
            {showValues ? formatCurrency(total) : '***'}
          </div>
        </div>
      </div>
      
      {/* Lista de categorias em formato de tabela (abaixo do gráfico) */}
      <div className="mt-6">
        <div className="space-y-2">
          {data.slice(0, 5).map((item, index) => {
            const percentage = total > 0 ? ((item.total / total) * 100) : 0;
            
            return (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.categoria || 'Sem categoria'}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {showValues ? formatCurrency(item.total) : '***'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
          
          {data.length > 5 && (
            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">
                +{data.length - 5} categorias adicionais
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;