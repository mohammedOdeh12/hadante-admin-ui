import NurseriesTable from "./components/NurseriesTable";
import AddNurseryButton from "./components/AddNurseryButton";
import SearchInput from "../components/ui/SearchInput"; // استدعاء مكون البحث

export default async function NurseriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      {/* الترويسة العلوية: العنوان وزر الإضافة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {locale === "ar" ? "إدارة الحضانات" : "Nurseries Management"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "عرض، إضافة، وتعديل بيانات الحضانات المشتركة في النظام."
              : "View, add, and edit nurseries registered in the system."}
          </p>
        </div>

        <AddNurseryButton locale={locale} />
      </div>

      {/* منطقة البحث والفلترة */}
      <div className="rounded-xl flex flex-col sm:flex-row justify-start items-center gap-4">
        
        {/* استدعاء حقل البحث الموحد */}
        <SearchInput 
          placeholder={
            locale === "ar"
              ? "ابحث عن حضانة بالاسم أو البريد..."
              : "Search nurseries by name..."
          }
        />
        
      </div>

      {/* استدعاء الجدول التفاعلي المربوط بالباك إند */}
      <NurseriesTable locale={locale} />
    </div>
  );
}