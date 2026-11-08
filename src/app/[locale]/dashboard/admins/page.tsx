import AdminsTable from "./components/AdminsTable";
import AddAdminButton from "./components/AddAdminButton";

export default async function AdminsPage({
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
            {locale === "ar" ? "مدراء النظام" : "Super Admins"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "إدارة حسابات مدراء النظام وصلاحيات الدخول الخاصة بهم."
              : "Manage super admin accounts and their access permissions."}
          </p>
        </div>
        <AddAdminButton locale={locale} />
      </div>

      {/* الجدول وبداخله سيكون حقل البحث */}
      <AdminsTable locale={locale} />
    </div>
  );
}