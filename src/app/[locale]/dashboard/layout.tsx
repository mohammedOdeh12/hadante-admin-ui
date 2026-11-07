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
      className="flex h-screen bg-background text-foreground overflow-hidden" 
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* الشريط الجانبي الثابت */}
      <Sidebar locale={locale} />

      {/* المنطقة الرئيسية التي تحتوي الهيدر والمحتوى */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header locale={locale} />
        
        {/* منطقة المحتوى المتغير */}
        <main className="flex-1 overflow-y-auto p-6 bg-white ">
          {children}
        </main>
      </div>
    </div>
  );
}