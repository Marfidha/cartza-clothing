import React from 'react'

const Snackbar = ({snackbar}) => {
    if (!snackbar) return null;
 return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-6 min-w-[280px]">

        <span className="text-sm">{snackbar.message}</span>

        {snackbar.actionLabel && (
          <button
            onClick={snackbar.action}
            className="text-yellow-400 font-semibold text-sm hover:text-yellow-300"
          >
            {snackbar.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Snackbar