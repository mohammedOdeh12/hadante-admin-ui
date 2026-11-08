import PermissionsTable from "./components/PermissionsTable";
import AddPermissionButton from "./components/AddPermissionButton";

export default async function PermissionsPage({
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
            {locale === "ar" ? "إدارة الصلاحيات" : "Permissions Management"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "إضافة وتعديل صلاحيات النظام التي يمكن ربطها بالأدوار (Roles)."
              : "Add and manage system permissions that can be assigned to Roles."}
          </p>
        </div>
        <AddPermissionButton locale={locale} />
      </div>

      

      <PermissionsTable locale={locale} />
    </div>
  );
}