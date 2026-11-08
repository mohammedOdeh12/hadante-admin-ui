import ActivitiesTable from "./components/ActivitiesTable";
import AddActivityButton from "./components/AddActivityButton";

export default async function WeeklyActivitiesPage({
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
            {locale === "ar" ? "الأنشطة الأسبوعية" : "Weekly Activities"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "إدارة وجدولة الأنشطة الأسبوعية المخصصة لكل حضانة."
              : "Manage and schedule weekly activities for each nursery."}
          </p>
        </div>
        <AddActivityButton locale={locale} />
      </div>

      

      <ActivitiesTable locale={locale} />
    </div>
  );
}