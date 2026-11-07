import MediaTable from "./components/MediaTable";
import AddMediaButton from "./components/AddMediaButton";
import SearchInput from "../components/ui/SearchInput";

export default async function MediaPage({
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
            {locale === "ar" ? "إدارة الوسائط" : "Media Management"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "إدارة الصور والملفات الخاصة بالحضانات."
              : "Manage images and files for nurseries."}
          </p>
        </div>
        <AddMediaButton locale={locale} />
      </div>

      <div className="rounded-xl flex flex-col sm:flex-row justify-start items-center gap-4">
        <SearchInput
          placeholder={
            locale === "ar"
              ? "ابحث باسم الملف..."
              : "Search by file name..."
          }
        />
      </div>

      <MediaTable locale={locale} />
    </div>
  );
}