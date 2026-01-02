
import React, { useState, useEffect, useMemo } from 'react';
import { Debt, StrategyType, AIAdvice } from './types';
import DebtCard from './components/DebtCard';
import { calculateTotalDebt, calculateProgressPercentage, getSortedDebts, calculateTotalInitialDebt } from './utils/calculations';
import { getFinancialAdvice } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const INITIAL_DEBTS: Debt[] = [
  { id: '1', name: 'Tarjeta de Crédito Visa', totalAmount: 5000, remainingAmount: 3200, interestRate: 24, minimumPayment: 150, category: 'Credit Card' },
  { id: '2', name: 'Préstamo Personal', totalAmount: 12000, remainingAmount: 8500, interestRate: 12, minimumPayment: 300, category: 'Loan' },
  { id: '3', name: 'Crédito Automotriz', totalAmount: 25000, remainingAmount: 18000, interestRate: 8, minimumPayment: 450, category: 'Other' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

const App: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>(INITIAL_DEBTS);
  const [strategy, setStrategy] = useState<StrategyType>('snowball');
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    name: '',
    totalAmount: 0,
    remainingAmount: 0,
    interestRate: 0,
    minimumPayment: 0,
    category: 'Other'
  });

  const totalRemaining = useMemo(() => calculateTotalDebt(debts), [debts]);
  const totalInitial = useMemo(() => calculateTotalInitialDebt(debts), [debts]);
  const progress = useMemo(() => calculateProgressPercentage(debts), [debts]);
  const sortedDebts = useMemo(() => getSortedDebts(debts, strategy), [debts, strategy]);

  const chartData = useMemo(() => 
    debts.map(d => ({ name: d.name, value: d.remainingAmount })),
    [debts]
  );

  const fetchAI = async () => {
    if (debts.length === 0) return;
    setLoadingAI(true);
    const advice = await getFinancialAdvice(debts, strategy);
    setAiAdvice(advice);
    setLoadingAI(false);
  };

  useEffect(() => {
    fetchAI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDebt.name && newDebt.totalAmount && newDebt.remainingAmount) {
      const debtToAdd: Debt = {
        id: Math.random().toString(36).substr(2, 9),
        name: newDebt.name,
        totalAmount: Number(newDebt.totalAmount),
        remainingAmount: Number(newDebt.remainingAmount),
        interestRate: Number(newDebt.interestRate || 0),
        minimumPayment: Number(newDebt.minimumPayment || 0),
        category: (newDebt.category as any) || 'Other',
      };
      setDebts([...debts, debtToAdd]);
      setShowForm(false);
      setNewDebt({ name: '', totalAmount: 0, remainingAmount: 0, interestRate: 0, minimumPayment: 0, category: 'Other' });
    }
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">DeudaZero</h1>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + Nueva Deuda
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <span className="text-slate-500 text-sm font-medium">Deuda Total Pendiente</span>
            <div className="mt-2">
              <h2 className="text-3xl font-bold text-slate-900">${totalRemaining.toLocaleString()}</h2>
              <p className="text-xs text-slate-400 mt-1">de un total inicial de ${totalInitial.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-500 text-sm font-medium">Progreso General</span>
            <div className="mt-4 flex items-center justify-center relative">
              <div className="text-2xl font-bold text-indigo-600 z-10">{progress}%</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path className="stroke-current text-slate-200" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-current text-indigo-600" strokeDasharray={`${progress}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <span className="text-slate-500 text-sm font-medium">Distribución</span>
            <div className="h-32 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 mb-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-white/20 p-1 rounded">✨</span>
              <h3 className="font-bold text-lg">Análisis de IA</h3>
            </div>
            
            {loadingAI ? (
              <div className="flex items-center space-x-3 py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="text-white/80 animate-pulse">Analizando tus finanzas...</span>
              </div>
            ) : aiAdvice ? (
              <div className="space-y-4">
                <p className="text-white/90 leading-relaxed italic">"{aiAdvice.summary}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Recomendaciones</h4>
                    <ul className="space-y-2 text-sm">
                      {aiAdvice.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 flex flex-col justify-center items-center text-center">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Fecha de Libertad Estimada</h4>
                    <span className="text-2xl font-bold">{aiAdvice.estimatedFreedomDate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={fetchAI}
                className="bg-white text-indigo-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-100 transition-colors"
              >
                Obtener Plan Personalizado
              </button>
            )}
          </div>
        </section>

        {/* Strategy Selector */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Tus Deudas</h2>
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex text-sm shadow-sm">
            <button 
              onClick={() => setStrategy('snowball')}
              className={`px-4 py-2 rounded-lg transition-all ${strategy === 'snowball' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              Bola de Nieve
            </button>
            <button 
              onClick={() => setStrategy('avalanche')}
              className={`px-4 py-2 rounded-lg transition-all ${strategy === 'avalanche' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              Avalancha
            </button>
          </div>
        </div>

        {/* Debt List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedDebts.map(debt => (
            <DebtCard key={debt.id} debt={debt} onDelete={deleteDebt} />
          ))}
          {debts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No tienes deudas registradas. ¡Buen trabajo!</p>
              <button onClick={() => setShowForm(true)} className="mt-4 text-indigo-600 font-bold hover:underline">Agregar mi primera deuda</button>
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Nueva Deuda</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleAddDebt} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre de la deuda</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Tarjeta de Crédito"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={newDebt.name}
                  onChange={e => setNewDebt({...newDebt, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monto Inicial ($)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={newDebt.totalAmount || ''}
                    onChange={e => setNewDebt({...newDebt, totalAmount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monto Actual ($)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={newDebt.remainingAmount || ''}
                    onChange={e => setNewDebt({...newDebt, remainingAmount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Interés Anual (%)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={newDebt.interestRate || ''}
                    onChange={e => setNewDebt({...newDebt, interestRate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pago Mínimo ($)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    value={newDebt.minimumPayment || ''}
                    onChange={e => setNewDebt({...newDebt, minimumPayment: Number(e.target.value)})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Guardar Deuda
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Bottom Nav / Status Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-8 z-40">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-indigo-600 uppercase">{debts.length}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Deudas</span>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-green-600 uppercase">{progress}%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Progreso</span>
        </div>
        <div className="h-8 w-px bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-900 uppercase">${(totalInitial - totalRemaining).toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Pagado</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
