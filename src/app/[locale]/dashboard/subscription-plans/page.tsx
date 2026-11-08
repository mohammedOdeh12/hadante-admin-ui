import PlansTable from "./components/PlansTable";
import AddPlanButton from "./components/AddPlanButton";

export default async function SubscriptionPlansPage({
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
            {locale === "ar" ? "باقات الاشتراك" : "Subscription Plans"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "إدارة خطط وباقات الاشتراك المتاحة للحضانات في النظام."
              : "Manage subscription plans available for nurseries in the system."}
          </p>
        </div>
        <AddPlanButton locale={locale} />
      </div>

     

      <PlansTable locale={locale} />
    </div>
  );
}