import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

/**
 * A modern, premium Toast component.
 * Usage: 
 * <Toast 
 * message="Item added to bag" 
 * type="success" 
 * onClose={() => setIsVisible(false)} 
 * />
 */

const Toastalert = ({ 
  message = "Notification message", 
  type = "success", 
  duration = 4000, 
  onClose 
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        if (onClose) onClose();
      }
    }, 10);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle2 size={18} className="text-green-400" />,
      bg: "bg-zinc-900/95",
      accent: "bg-green-500",
    },
    error: {
      icon: <AlertCircle size={18} className="text-red-400" />,
      bg: "bg-red-950/95",
      accent: "bg-red-500",
    },
    info: {
      icon: <Info size={18} className="text-blue-400" />,
      bg: "bg-zinc-900/95",
      accent: "bg-blue-500",
    },
    default: {
      icon: <Bell size={18} className="text-zinc-400" />,
      bg: "bg-zinc-900/95",
      accent: "bg-zinc-500",
    }
  };

  const current = config[type] || config.default;

  return (
    <div className={`
      pointer-events-auto relative flex flex-col min-w-[320px] max-w-[400px] 
      ${current.bg} backdrop-blur-xl border border-white/10 rounded-2xl 
      shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-toastIn
    `}>
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Icon Container */}
        <div className="shrink-0 flex items-center justify-center">
          {current.icon}
        </div>
        
        {/* Message */}
        <div className="grow">
          <p className="text-[13px] font-medium text-white leading-tight tracking-wide">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      {/* Modern Progress Bar */}
      <div className="h-[3px] w-full bg-white/5">
        <div 
          className={`h-full ${current.accent} transition-all duration-100 ease-linear opacity-60`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <style>{`
        @keyframes toastIn {
          0% { transform: translateY(-20px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-toastIn { 
          animation: toastIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; 
        }
      `}</style>
    </div>
  );
};

export default Toastalert;