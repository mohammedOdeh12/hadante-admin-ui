"use client";

interface ConfirmAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
  locale: string;
}

export default function ConfirmAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  locale,
}: ConfirmAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-background w-full max-w-sm rounded-2xl shadow-2xl border border-border overflow-hidden transform transition-all text-center p-6"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/* أيقونة تحذير جميلة */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-foreground/70 text-sm mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors w-1/2"
          >
            {locale === "ar" ? "تراجع" : "Cancel"}
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70 w-1/2 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              locale === "ar" ? "نعم، متأكد" : "Yes, Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}