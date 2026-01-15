
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator as CalcIcon, 
  TrendingUp, 
  Table as TableIcon, 
  PieChart as ChartIcon,
  Sparkles,
  Info,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { 
  SimulationInputs, 
  SimulationResult, 
  SummaryData 
} from './types';
import { 
  calculateCompoundInterest, 
  getSummary, 
  formatCurrency 
} from './utils/calculations';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { getFinancialInsight } from './services/geminiService';

export default function App() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    initialAmount: 1000,
    monthlyContribution: 100,
    interestRate: 1,
    rateType: 'monthly',
    period: 5,
    periodType: 'years',
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(() => calculateCompoundInterest(inputs), [inputs]);
  const summary = useMemo(() => getSummary(results), [results]);

  const handleInputChange = (field: keyof SimulationInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const fetchAiInsight = async () => {
    setIsAiLoading(true);
    const insight = await getFinancialInsight(summary, inputs);
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  // Re-fetch chart friendly data for display
  const chartData = useMemo(() => {
    // Limit data points to avoid crowding
    const totalPoints = results.length;
    if (totalPoints <= 60) return results;
    
    // Pick ~60 points evenly distributed
    const step = Math.ceil(totalPoints / 60);
    return results.filter((_, idx) => idx % step === 0 || idx === totalPoints - 1);
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Simulador de Juros Compostos</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Inputs */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <CalcIcon className="w-5 h-5 text-emerald-600" />
              <h2 className="font-semibold text-slate-800">Parâmetros da Simulação</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Inicial</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <input 
                    type="number"
                    value={inputs.initialAmount}
                    onChange={(e) => handleInputChange('initialAmount', Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Aporte Mensal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                  <input 
                    type="number"
                    value={inputs.monthlyContribution}
                    onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Taxa de Juros (%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={inputs.interestRate}
                    onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Taxa</label>
                  <select 
                    value={inputs.rateType}
                    onChange={(e) => handleInputChange('rateType', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Período</label>
                  <input 
                    type="number"
                    value={inputs.period}
                    onChange={(e) => handleInputChange('period', Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
                  <select 
                    value={inputs.periodType}
                    onChange={(e) => handleInputChange('periodType', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="months">Meses</option>
                    <option value="years">Anos</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchAiInsight}
              disabled={isAiLoading}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-100"
            >
              {isAiLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Análise IA
                </>
              )}
            </button>
          </div>

          {aiInsight && (
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-3 text-blue-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">Insight da IA</h3>
              </div>
              <div className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap">
                {aiInsight}
              </div>
            </div>
          )}
        </section>

        {/* Dashboard Results */}
        <section className="lg:col-span-8 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Valor Total Final</p>
              <h3 className="text-xl font-bold text-emerald-600">{formatCurrency(summary.totalAmount)}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Total Investido</p>
              <h3 className="text-xl font-bold text-slate-800">{formatCurrency(summary.totalInvested)}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Total em Juros</p>
              <h3 className="text-xl font-bold text-amber-600">{formatCurrency(summary.totalInterest)}</h3>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <ChartIcon className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-800">Evolução Patrimonial</h2>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs">
                   <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                   <span>Investido</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span>Juros</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(val) => `Mês ${val}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                    minTickGap={30}
                  />
                  <YAxis 
                    tickFormatter={(val) => formatCurrency(val).replace('R$', '')}
                    axisLine={false}
                    tickLine={false}
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mês ${label}`}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalInvested" 
                    stackId="1"
                    stroke="#94a3b8" 
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                    name="Total Investido"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalInterest" 
                    stackId="1"
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorInterest)" 
                    name="Total em Juros"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Trigger */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button 
              onClick={() => setShowTable(!showTable)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-800">Tabela de Evolução Mensal</h2>
              </div>
              {showTable ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            {showTable && (
              <div className="px-6 pb-6 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-y border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-medium">Mês</th>
                      <th className="px-4 py-3 font-medium">Juros</th>
                      <th className="px-4 py-3 font-medium">Total Juros</th>
                      <th className="px-4 py-3 font-medium">Aporte</th>
                      <th className="px-4 py-3 font-medium">Total Investido</th>
                      <th className="px-4 py-3 font-medium">Total Acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-600">{row.month}</td>
                        <td className="px-4 py-3 text-emerald-600 font-medium">
                          {idx === 0 ? 'R$ 0,00' : formatCurrency(results[idx].totalInterest - results[idx-1].totalInterest)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{formatCurrency(row.totalInterest)}</td>
                        <td className="px-4 py-3 text-slate-500">{formatCurrency(row.monthlyContribution)}</td>
                        <td className="px-4 py-3 text-slate-500">{formatCurrency(row.totalInvested)}</td>
                        <td className="px-4 py-3 text-slate-800 font-semibold">{formatCurrency(row.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Explanation Footer */}
          <div className="bg-slate-800 text-white p-8 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold">O que são Juros Compostos?</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Diferente dos juros simples, onde o rendimento incide apenas sobre o valor inicial, os juros compostos incidem sobre o valor inicial e também sobre os juros acumulados de períodos anteriores. É o famoso "juros sobre juros".
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-700">
                <h4 className="font-semibold text-emerald-400 mb-2">Poder do Tempo</h4>
                <p className="text-sm text-slate-400">Quanto mais tempo seu dinheiro fica investido, mais rápida é a curva de crescimento devido ao efeito multiplicador.</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-700">
                <h4 className="font-semibold text-emerald-400 mb-2">Aportes Constantes</h4>
                <p className="text-sm text-slate-400">Manter aportes mensais ajuda a acelerar a formação do montante, aproveitando melhor as taxas de juros.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky Quick Calc on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Montante Final</p>
          <p className="font-bold text-emerald-600">{formatCurrency(summary.totalAmount)}</p>
        </div>
        <button 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
        >
          Ajustar Parâmetros
        </button>
      </div>
    </div>
  );
}
