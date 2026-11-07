"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ locale }: { locale: string }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  // إضافة حالة الانتقال للأنيميشن
  const [isPending, startTransition] = useTransition(); 
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkTheme = setTimeout(() => {
      if (document.documentElement.classList.contains("dark")) {
        setIsDarkMode(true);
      }
    }, 0);

    return () => clearTimeout(checkTheme);
  }, []);

  // const toggleDarkMode = () => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.remove("dark");
  //     setIsDarkMode(false);
  //   } else {
  //     document.documentElement.classList.add("dark");
  //     setIsDarkMode(true);
  //   }
  // };

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    
    // وضع عملية تغيير الرابط داخل startTransition لتفعيل حالة التحميل
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 ">
      <div className="text-xl font-bold text-primary">
        {locale === "ar" ? "لوحة الإدارة" : "Admin Panel"}
      </div>

      <div className="flex items-center gap-4">
        {/* زر تبديل اللغة مع الأنيميشن */}
        <button
          onClick={toggleLanguage}
          disabled={isPending}
          className={`flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground transition-all duration-300 transform hover:scale-110 hover:-rotate-3 active:scale-95 ${
            isPending ? "opacity-80 cursor-wait bg-secondary/10" : "hover:bg-secondary/10 hover:text-primary"
          }`}
          title={locale === "ar" ? "Switch to English" : "التبديل للعربية"}
        >
          {isPending ? (
            // أنيميشن التحميل الدائري باللون الخمري يظهر أثناء تغيير الرابط
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            // النص الطبيعي
            <span className="font-bold text-sm">
              {locale === "ar" ? "EN" : "AR"}
            </span>
          )}
        </button>

        {/* زر تبديل الوضع الداكن/الفاتح مع تأثير مشابه 
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-foreground transition-all duration-300 transform hover:scale-110 hover:rotate-12 active:scale-95 hover:bg-secondary/10 hover:text-primary"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        */}

        {/* أيقونة المستخدم */}
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md cursor-pointer transition-all duration-300 hover:bg-secondary hover:scale-105 active:scale-95">
          M
        </div>
      </div>
    </header>
  );
}