"use client";

import { useEffect, useState } from "react";
import SubscriptionActions from "./SubscriptionActions";
import SearchInput from "../../components/ui/SearchInput"; 
import StatusBadge from "../../components/ui/StatusBadge"; // استدعاء المكون الجديد
import TableSkeleton from "../../components/ui/TableSkeleton";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
        
        const response = await fetch(`${apiUrl}/api/admin/nursery-subscriptions`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true" 
          },
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // دالة مساعدة لترجمة الحالة خصيصاً لميزة البحث
  const getLocalizedStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return locale === "ar" ? "نشط" : "active";
      case "expired": return locale === "ar" ? "منتهي" : "expired";
      case "cancelled": return locale === "ar" ? "ملغى" : "cancelled";
      case "pending": return locale === "ar" ? "قيد الانتظار" : "pending";
      default: return status || "";
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchLower = searchTerm.toLowerCase();
    const statusText = getLocalizedStatus(sub.status).toLowerCase();
    
    return (
      (sub.nursery && sub.nursery.name.toLowerCase().includes(searchLower)) ||
      (sub.plan && sub.plan.name.toLowerCase().includes(searchLower)) ||
      statusText.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSubscriptions.slice(startIndex, endIndex);

 if (isLoading) {
    return <TableSkeleton columns={7} rows={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <SearchInput
          placeholder={locale === "ar" ? "ابحث باسم الحضانة، الباقة، أو الحالة..." : "Search by nursery, plan, or status..."}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

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
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50 space-y-2">
                      <p className="text-lg font-medium">
                        {searchTerm ? (locale === "ar" ? `لا توجد نتائج لـ "${searchTerm}"` : `No results found for "${searchTerm}"`) : (locale === "ar" ? "لا يوجد اشتراكات." : "No subscriptions found.")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((sub) => (
                  <tr key={sub.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{sub.id}</td>
                    <td className="px-6 py-4 font-medium">{sub.nursery?.name || "-"}</td>
                    <td className="px-6 py-4 text-foreground/80">{sub.plan?.name || "-"}</td>
                    <td className="px-6 py-4 text-foreground/80">{sub.end_date}</td>
                    <td className="px-6 py-4 font-medium text-green-600">{sub.amount_paid}</td>
                    
                    {/* استخدام المكون الموحد للحالة */}
                    <td className="px-6 py-4 text-start whitespace-nowrap">
                      <StatusBadge status={sub.status} />
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

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/5">
            <span className="text-sm text-foreground/60">
              {locale === "ar" ? `عرض ${startIndex + 1} إلى ${Math.min(endIndex, filteredSubscriptions.length)} من أصل ${filteredSubscriptions.length} اشتراك` : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredSubscriptions.length)} of ${filteredSubscriptions.length} subscriptions`}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-secondary/10 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-1">
                <svg className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex items-center justify-center px-4 font-semibold text-sm text-primary bg-primary/10 rounded-lg border border-primary/20">{currentPage}</div>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-secondary/10 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-1">
                <svg className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}