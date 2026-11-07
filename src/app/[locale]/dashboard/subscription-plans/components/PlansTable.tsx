"use client";

import { useEffect, useState } from "react";
import PlanActions from "./PlanActions";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  duration_in_months: number;
  description: string;
  is_active: boolean;
}

export default function PlansTable({ locale }: { locale: string }) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
        
        const response = await fetch(`${apiUrl}/api/admin/subscription-plans`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true", // تخطي التحذير
          },
        });

        const data = await response.json();
        setPlans(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (isLoading) return <div className="flex justify-center h-64 items-center bg-background border rounded-xl"><svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-secondary/5 text-primary border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-start">ID</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "اسم الباقة" : "Plan Name"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "السعر" : "Price"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "المدة" : "Duration"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {plans.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/50">{locale === "ar" ? "لا يوجد باقات." : "No plans found."}</td></tr>
            ) : (
              plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{plan.id}</td>
                  <td className="px-6 py-4 font-medium">{plan.name}</td>
                  <td className="px-6 py-4 text-foreground/80">{plan.price}</td>
                  <td className="px-6 py-4 text-foreground/80">{plan.duration_in_months} {locale === "ar" ? "أشهر" : "Months"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                      {plan.is_active ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <PlanActions plan={plan} locale={locale} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}