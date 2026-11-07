"use client";

import { useEffect, useState } from "react";
import SubscriptionActions from "./SubscriptionActions";

interface Nursery { id: number; name: string; }
interface Plan { id: number; name: string; }

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string;
  nursery: Nursery;
  plan: Plan;
}

export default function SubscriptionsTable({ locale }: { locale: string }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/nursery-subscriptions`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();
        setSubscriptions(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { style: "bg-green-100 text-green-700", text: locale === "ar" ? "نشط" : "Active" };
      case "expired": // كما يظهر في بوستمان[cite: 6]
        return { style: "bg-red-100 text-red-700", text: locale === "ar" ? "منتهي" : "Expired" };
      case "cancelled":
        return { style: "bg-gray-100 text-gray-700", text: locale === "ar" ? "ملغى" : "Cancelled" };
      default:
        return { style: "bg-blue-100 text-blue-700", text: status };
    }
  };

  if (isLoading) return <div className="flex justify-center h-64 items-center bg-background border rounded-xl"><svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-secondary/5 text-primary border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-start">ID</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحضانة" : "Nursery"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الباقة" : "Plan"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "تاريخ النهاية" : "End Date"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "المدفوع" : "Paid"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscriptions.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-foreground/50">{locale === "ar" ? "لا يوجد اشتراكات." : "No subscriptions found."}</td></tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{sub.id}</td>
                  {/* عرض أسماء الحضانات والباقات من الكائنات المتداخلة[cite: 6] */}
                  <td className="px-6 py-4 font-medium">{sub.nursery?.name || "-"}</td>
                  <td className="px-6 py-4 text-foreground/80">{sub.plan?.name || "-"}</td>
                  <td className="px-6 py-4 text-foreground/80">{sub.end_date}</td>
                  <td className="px-6 py-4 font-medium text-green-600">{sub.amount_paid}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(sub.status).style}`}>
                      {getStatusBadge(sub.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <SubscriptionActions sub={sub} locale={locale} />
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