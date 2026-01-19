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
    <div className="alert-modal-overlay mie:fixed mie:inset-0 mie:bg-mieoverlay mie:flex mie:items-center mie:justify-center mie:z-50" onClick={handleOverlayClick}>
      <div 
        className="alert-modal-content mie:bg-miesurface mie:rounded-lg mie:shadow-2xl mie:max-w-md mie:w-full mie:mx-4 mie:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="alert-modal-header mie:px-6 mie:py-4 mie:border-b mie:border-mieborder">
          <h3 className="mie:text-lg mie:font-semibold mie:text-mietext">{alert.title}</h3>
        </div>
        <div className="alert-modal-body mie:px-6 mie:py-5">
          <p className="mie:text-sm mie:text-mietext mie:whitespace-pre-line mie:leading-relaxed">
            {alert.message}
          </p>
        </div>
        <div className="alert-modal-footer mie:px-6 mie:py-4 mie:bg-miebackground mie:flex mie:justify-end mie:gap-2">
          {alert.cancelText && (
            <button
              onClick={() => onClose(false)}
              className="alert-cancel-btn mie:px-4 mie:py-2 mie:bg-miesurface mie:border-0 mie:text-mietext mie:text-sm mie:font-medium mie:rounded-md mie:hover:bg-miebackground mie:outline-none mie:focus:outline-none mie:focus:ring-2 mie:focus:ring-mieprimary mie:focus:ring-offset-2 mie:transition-colors"
            >
              {alert.cancelText}
            </button>
          )}
          <button
            onClick={() => onClose(true)}
            className="alert-confirm-btn mie:px-4 mie:py-2 mie:bg-mieprimary mie:border-0 mie:text-miesurface mie:text-sm mie:font-medium mie:rounded-md mie:hover:bg-mieprimary/90 mie:outline-none mie:focus:outline-none mie:focus:ring-2 mie:focus:ring-mieprimary mie:focus:ring-offset-2 mie:transition-colors"
          >
            {alert.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
