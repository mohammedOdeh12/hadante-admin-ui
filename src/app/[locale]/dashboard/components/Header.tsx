"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ locale }: { locale: string }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPending, startTransition] = useTransition(); 
  
  // حالة تخزين اسم المستخدم
  const [userName, setUserName] = useState<string>("..."); 
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // نستخدم setTimeout لحل مشكلة الـ Cascading Renders
    const initTimer = setTimeout(() => {
      // قراءة الاسم من المتصفح (تم حفظه في شاشة تسجيل الدخول)
      const storedName = localStorage.getItem("userName");
      
      if (storedName && storedName !== "undefined" && storedName !== "null") {
        setUserName(storedName);
      } else {
        setUserName("Admin"); // في حال لم يكن هناك اسم
      }

      // فحص الوضع الداكن
      if (document.documentElement.classList.contains("dark")) {
        setIsDarkMode(true);
      }
    }, 0);

    return () => clearTimeout(initTimer);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    
    startTransition(() => {
      router.push(newPath);
    });
  };

  // دالة لتكبير أول حرف من كل كلمة (Mohammed Odeh)
  const formatName = (name: string) => {
    if (name === "...") return name;
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // دالة لاستخراج الحروف الأولى للأيقونة (مثلاً MO بدلاً من M فقط)
  const getInitials = (name: string) => {
    if (name === "..." || !name) return "";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const displayName = formatName(userName);

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 ">
      <div className="text-xl font-bold text-primary">
        {locale === "ar" ? "لوحة الإدارة" : "Admin Panel"}
      </div>

      <div className="flex items-center gap-4">
        {/* زر تبديل اللغة */}
        <button
          onClick={toggleLanguage}
          disabled={isPending}
          className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-full border border-border text-foreground transition-all duration-300 transform hover:scale-110 hover:-rotate-3 active:scale-95 ${
            isPending ? "opacity-80 cursor-wait bg-secondary/10" : "hover:bg-secondary/10 hover:text-primary"
          }`}
          title={locale === "ar" ? "Switch to English" : "التبديل للعربية"}
        >
          {isPending ? (
            <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span className="font-bold text-sm">
              {locale === "ar" ? "EN" : "AR"}
            </span>
          )}
        </button>

        {/* عرض اسم المستخدم وحرفه الأول الديناميكي */}
        <div className="flex items-center gap-3 bg-secondary/5 pe-1.5 ps-4 py-1.5 rounded-full border border-border shadow-sm max-w-[200px] sm:max-w-[250px]">
          {/* عرض الاسم المنسق (Mohammed Odeh) */}
          <span className="font-semibold text-md text-foreground/90 truncate whitespace-nowrap" title={displayName}>
            {displayName}
          </span>
          
          {/* عرض الحروف المختصرة (MO) */}
          <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md uppercase text-sm tracking-wider">
            {getInitials(userName)}
          </div>
        </div>
        
      </div>
    </header>
  );
}