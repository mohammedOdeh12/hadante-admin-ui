import SubscriptionsTable from "./components/SubscriptionsTable";
import AddSubscriptionButton from "./components/AddSubscriptionButton";

export default async function SubscriptionsPage({
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
            {locale === "ar" ? "اشتراكات الحضانات" : "Nursery Subscriptions"}
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            {locale === "ar"
              ? "متابعة وإدارة فترات اشتراك الحضانات والمبالغ المدفوعة."
              : "Manage nursery subscription periods and paid amounts."}
          </p>
        </div>
        <AddSubscriptionButton locale={locale} />
      </div>

      

      <SubscriptionsTable locale={locale} />
    </div>
  );
}