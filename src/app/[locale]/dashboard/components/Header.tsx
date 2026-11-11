"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ locale }: { locale: string }) {
  const [, setIsDarkMode] = useState(false);
  const [isPending, startTransition] = useTransition(); 
  const [userName, setUserName] = useState<string>("..."); 
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initTimer = setTimeout(() => {
      const storedName = localStorage.getItem("userName");
      if (storedName && storedName !== "undefined" && storedName !== "null") {
        setUserName(storedName);
      } else {
        setUserName("Admin");
      }
      if (document.documentElement.classList.contains("dark")) setIsDarkMode(true);
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

  const formatName = (name: string) => {
    if (name === "...") return name;
    return name.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  };

  const displayName = formatName(userName);

  return (
    <header className="px-4 sm:px-6 pt-4 pb-2 z-30">
      {/* تصميم الهيدر كـ بطاقة منفصلة (Card) بنفس شكل الصورة تماماً */}
      <div className="max-w-full mx-auto bg-background border border-border/60 rounded-lg shadow-sm px-6 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          {/* زر القائمة للهواتف */}
          <button
            onClick={() => window.dispatchEvent(new Event("toggleMobileSidebar"))}
            className="lg:hidden p-2 -ms-2 rounded-xl text-foreground hover:bg-secondary/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-lg font-bold text-primary flex items-center gap-2">
            {/* أيقونة تعبيرية مصغرة اختيارية أو ترك النص */}
            {locale === "ar" ? "لوحة الإدارة" : "Admin Dashboard"}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleLanguage}
            disabled={isPending}
            className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-secondary/5 text-foreground transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isPending ? "opacity-80 cursor-wait" : "hover:bg-secondary/10 hover:text-primary"
            }`}
            title={locale === "ar" ? "Switch to English" : "التبديل للعربية"}
          >
            {isPending ? (
              <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="font-bold text-xs">{locale === "ar" ? "EN" : "AR"}</span>
            )}
          </button>

          <div className="flex items-center gap-2 bg-primary/5 px-3.5 py-1.5 rounded-xl border border-border/40">
            <span className="font-semibold text-xs text-primary truncate whitespace-nowrap" title={displayName}>
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}