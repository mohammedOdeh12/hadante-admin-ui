"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ConfirmAlert from "../components/ui/ConfirmAlert"; 

export default function Sidebar({ locale }: { locale: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // حالة الهاتف
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  
  const pathname = usePathname();
  const router = useRouter(); 
  const isRtl = locale === "ar";

  // الاستماع لحدث فتح القائمة من الهيدر
  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener("toggleMobileSidebar", handleToggle);
    return () => window.removeEventListener("toggleMobileSidebar", handleToggle);
  }, []);

  // تم حذف الـ useEffect الخاص بـ pathname لتجنب خطأ (cascading renders)

  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token"); 
    setIsLogoutAlertOpen(false);
    setIsLoggingOut(false);
    router.replace(`/${locale}/login`); 
    router.refresh(); 
  };

  const navItems = [
    { name: locale === "ar" ? "الرئيسية" : "Dashboard", href: `/${locale}/dashboard`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { name: locale === "ar" ? "مدراء النظام" : "Admins", href: `/${locale}/dashboard/admins`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
    { name: locale === "ar" ? "الحضانات" : "Nurseries", href: `/${locale}/dashboard/nurseries`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { name: locale === "ar" ? "باقات الاشتراك" : "Subscription Plans", href: `/${locale}/dashboard/subscription-plans`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    )},
    { name: locale === "ar" ? "اشتراكات الحضانات" : "Nursery Subscriptions", href: `/${locale}/dashboard/nursery-subscriptions`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    )},
    { name: locale === "ar" ? "الصلاحيات" : "Permissions", href: `/${locale}/dashboard/permissions`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
    )},
    { name: locale === "ar" ? "الأدوار" : "Roles", href: `/${locale}/dashboard/roles`, icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    )},
  ];

  return (
    <>
      {/* خلفية معتمة تظهر في الهاتف عند فتح القائمة */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 z-50 flex flex-col h-full bg-background transition-all duration-300 ease-out shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        lg:relative lg:translate-x-0
        ${isCollapsed ? "lg:w-20" : "lg:w-72"} w-72 
        ${isMobileOpen ? "translate-x-0" : isRtl ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* منطقة الشعار بدون الخط المزعج */}
        <div className="h-20 flex items-center justify-between px-6 pt-2">
          {!isCollapsed && (
            <Image src="/logo.avif" alt="Logo" width={140} height={40} className="object-contain" priority />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex p-2 rounded-xl hover:bg-secondary/10 text-primary transition-colors ${isCollapsed ? "mx-auto" : ""}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
          </button>
        </div>
        
        {/* الخط المتدرج الأنيق بديل للـ Border */}
        <div className="px-6 mb-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-70"></div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1.5 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)} // تم إضافة الإغلاق هنا عند الضغط على الرابط
                className={`flex items-center rounded-xl transition-all duration-200 px-4 py-3.5 group ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "text-foreground/80 hover:bg-secondary/10 hover:text-primary font-medium"
                } ${isCollapsed ? "justify-center" : "justify-start"}`}
                title={isCollapsed ? item.name : ""}
              >
                <div className={`${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform duration-200`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="ms-3.5">{item.name}</span>}
                
                {/* مؤشر جانبي ناعم للعنصر النشط */}
                {isActive && !isCollapsed && (
                  <div className={`absolute ${isRtl ? 'right-0' : 'left-0'} w-1.5 h-8 bg-primary rounded-e-full`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* زر تسجيل الخروج بدون Border صلب */}
        <div className="p-4 mt-auto">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50 mb-3"></div>
          <button
            onClick={() => setIsLogoutAlertOpen(true)} 
            title={isCollapsed ? (locale === "ar" ? "تسجيل الخروج" : "Logout") : ""}
            className={`w-full flex items-center rounded-xl transition-all px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 font-medium group ${
              isCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <div className="group-hover:scale-110 transition-transform duration-200">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            {!isCollapsed && (
              <span className="ms-3.5">{locale === "ar" ? "تسجيل الخروج" : "Logout"}</span>
            )}
          </button>
        </div>
      </aside>

      <ConfirmAlert
        isOpen={isLogoutAlertOpen}
        onClose={() => setIsLogoutAlertOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        title={locale === "ar" ? "تأكيد تسجيل الخروج" : "Confirm Logout"}
        message={locale === "ar" ? "هل أنت متأكد أنك تريد تسجيل الخروج من النظام؟" : "Are you sure you want to log out of the system?"}
        locale={locale}
      />
    </>
  );
}