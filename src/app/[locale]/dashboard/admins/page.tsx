import AdminsTable from "./components/AdminsTable";
import AddAdminButton from "./components/AddAdminButton";
import SearchInput from "../components/ui/SearchInput"; // استدعاء المكون العام

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

      <div className="rounded-xl flex flex-col sm:flex-row justify-start items-center gap-4">
        {/* استدعاء حقل البحث الموحد */}
        <SearchInput
          placeholder={
            locale === "ar"
              ? "ابحث عن مدير بالاسم ..."
              : "Search admins by name..."
          }
        />
      </div>

      <AdminsTable locale={locale} />
    </div>
  );
}