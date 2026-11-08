import RolesTable from "./components/RolesTable";
import AddRoleButton from "./components/AddRoleButton";

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

      

      <RolesTable locale={locale} />
    </div>
  );
}