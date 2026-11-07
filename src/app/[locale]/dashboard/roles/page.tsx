import RolesTable from "./components/RolesTable";
import AddRoleButton from "./components/AddRoleButton";
import SearchInput from "../components/ui/SearchInput"; // استدعاء مكون البحث المشترك

export default async function RolesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {locale === "ar" ? "إدارة الأدوار" : "Roles Management"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar" 
              ? "إدارة أدوار المستخدمين في النظام." 
              : "Manage user roles in the system."}
          </p>
        </div>
        
        <AddRoleButton locale={locale} />
      </div>

      <div className="rounded-xl flex flex-col sm:flex-row justify-start items-center gap-4">
        {/* استخدام مكون البحث المشترك */}
        <SearchInput 
          placeholder={
            locale === "ar"
              ? "ابحث عن دور بالاسم..."
              : "Search roles by name..."
          }
        />
      </div>

      <RolesTable locale={locale} />
    </div>
  );
}