import React from 'react';

const AlertContext = React.createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = React.useState(null);

  const showAlert = React.useCallback((message, options = {}) => {
    setAlert({
      message,
      title: options.title || 'Notice',
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel
    });
  }, []);

  const closeAlert = React.useCallback((confirmed = true) => {
    if (confirmed && alert?.onConfirm) {
      alert.onConfirm();
    } else if (!confirmed && alert?.onCancel) {
      alert.onCancel();
    }
    setAlert(null);
  }, [alert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <AlertModal alert={alert} onClose={closeAlert} />}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
}

function AlertModal({ alert, onClose }) {
  const handleOverlayClick = () => {
    // If there's a cancel button, treat clicking outside as cancel
    if (alert.cancelText) {
      onClose(false);
    } else {
      onClose(true);
    }
  };

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Escape key should cancel if there's a cancel button
        if (alert.cancelText) {
          onClose(false);
        } else {
          onClose(true);
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, alert.cancelText]);

  return (
    <div className="alert-modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div 
        className="alert-modal-content bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="alert-modal-header px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
        </div>
        <div className="alert-modal-body px-6 py-5">
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {alert.message}
          </p>
        </div>
        <div className="alert-modal-footer px-6 py-4 bg-slate-50 flex justify-end gap-2">
          {alert.cancelText && (
            <button
              onClick={() => onClose(false)}
              className="alert-cancel-btn px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
            >
              {alert.cancelText}
            </button>
          )}
          <button
            onClick={() => onClose(true)}
            className="alert-confirm-btn px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {alert.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
