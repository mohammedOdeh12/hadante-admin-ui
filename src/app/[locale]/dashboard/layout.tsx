import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "ar";

  return (
    <div 
      className="flex h-screen bg-[#f8f9fa] dark:bg-[#0f172a] text-foreground overflow-hidden" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* الشريط الجانبي */}
      <Sidebar locale={locale} />

      {/* المنطقة الرئيسية */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header locale={locale} />
        
        {/* منطقة المحتوى - أضفنا مسافة علوية (pt-2) وتنسيق عام */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 pt-10">
          <div className="w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}