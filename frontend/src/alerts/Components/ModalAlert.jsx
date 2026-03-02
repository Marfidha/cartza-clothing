import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ModalAlert = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;

  const theme = {
    danger: {
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      btnBg: 'bg-slate-900 hover:bg-slate-800',
      shadow: 'shadow-slate-200'
    },
    warning: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
      shadow: 'shadow-amber-100'
    }
  }[type] || theme.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-[420px] rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          {/* Top Section */}
          <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center ${theme.iconColor}`}>
              <AlertTriangle size={28} />
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content Section */}
          <div className="space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className={`flex-1 px-6 py-3.5 rounded-2xl ${theme.btnBg} text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg ${theme.shadow} order-1 sm:order-2 active:scale-95`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAlert;