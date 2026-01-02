
import React from 'react';
import { Debt } from '../types';

interface DebtCardProps {
  debt: Debt;
  onDelete: (id: string) => void;
}

const DebtCard: React.FC<DebtCardProps> = ({ debt, onDelete }) => {
  const progress = Math.round(((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{debt.name}</h3>
          <p className="text-sm text-slate-500">{debt.category} • {debt.interestRate}% Interés</p>
        </div>
        <button 
          onClick={() => onDelete(debt.id)}
          className="text-slate-400 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-slate-600">Progreso</span>
          <span className="text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-4">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pendiente</span>
            <span className="text-slate-900 font-bold">${debt.remainingAmount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Pago Mín.</span>
            <span className="text-slate-900 font-bold">${debt.minimumPayment.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtCard;
