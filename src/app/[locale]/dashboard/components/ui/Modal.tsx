"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  locale: string;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  locale,
  maxWidth = "max-w-lg",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        // 1. تم إزالة overflow-hidden من هنا لكي نسمح للقائمة بالخروج براحتها
        className={`bg-background w-full ${maxWidth} rounded-2xl shadow-2xl border border-border transform transition-all scale-100 opacity-100 flex flex-col relative`}
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/* رأس النافذة */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/5 rounded-t-2xl">
          <h3 className="text-xl font-bold text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-foreground/50 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* محتوى النافذة المتغير (الفورم والأزرار) */}
        <div className="rounded-b-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}