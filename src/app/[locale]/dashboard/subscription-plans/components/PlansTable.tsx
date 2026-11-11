"use client";

import { useEffect, useState } from "react";
import PlanActions from "./PlanActions";
import SearchInput from "../../components/ui/SearchInput";
import StatusBadge from "../../components/ui/StatusBadge";
import TableSkeleton from "../../components/ui/TableSkeleton";

interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: string | number;
  yearly_price: string | number;
  max_children: number;
  ai_reports_enabled: boolean;
  description: string;
  is_active: boolean;
}

export default function PlansTable({ locale }: { locale: string }) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
            "ngrok-skip-browser-warning": "true",
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPlans = plans.filter((plan) => {
    const searchLower = searchTerm.toLowerCase();
    const statusText = plan.is_active ? (locale === "ar" ? "نشط" : "active") : (locale === "ar" ? "غير نشط" : "inactive");
    const aiText = plan.ai_reports_enabled ? (locale === "ar" ? "مفعل" : "enabled") : (locale === "ar" ? "معطل" : "disabled");
    
    return (
      plan.name.toLowerCase().includes(searchLower) ||
      (plan.description && plan.description.toLowerCase().includes(searchLower)) ||
      plan.monthly_price.toString().includes(searchLower) ||
      plan.yearly_price.toString().includes(searchLower) ||
      statusText.includes(searchLower) ||
      aiText.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredPlans.slice(startIndex, endIndex);

 if (isLoading) {
    return <TableSkeleton columns={7} rows={6} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <SearchInput
          placeholder={locale === "ar" ? "ابحث باسم الباقة، السعر، أو الحالة..." : "Search by plan name, price, or status..."}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start whitespace-nowrap">
            <thead className="bg-secondary/5 text-primary border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-start">ID</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "اسم الباقة" : "Plan Name"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "السعر الشهري" : "Monthly Price"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "السعر السنوي" : "Yearly Price"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "أقصى عدد أطفال" : "Max Children"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "تقارير الذكاء" : "AI Reports"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50 space-y-2">
                      <p className="text-lg font-medium">
                        {searchTerm ? (locale === "ar" ? `لا توجد نتائج لـ "${searchTerm}"` : `No results found for "${searchTerm}"`) : (locale === "ar" ? "لا يوجد باقات مسجلة." : "No plans found.")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((plan) => (
                  <tr key={plan.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{plan.id}</td>
                    <td className="px-6 py-4 font-medium">{plan.name}</td>
                    <td className="px-6 py-4 text-foreground/80">{plan.monthly_price}</td>
                    <td className="px-6 py-4 text-foreground/80">{plan.yearly_price}</td>
                    <td className="px-6 py-4 text-foreground/80 font-medium">{plan.max_children}</td>
                    
                    {/* استخدام المكون الموحد لحالة الذكاء الاصطناعي */}
                    <td className="px-6 py-4 text-start whitespace-nowrap">
                      <StatusBadge status={plan.ai_reports_enabled ? "enabled" : "disabled"} /> 
                    </td>

                    {/* استخدام المكون الموحد للحالة الأساسية */}
                    <td className="px-6 py-4 text-start whitespace-nowrap">
                      <StatusBadge status={plan.is_active} />
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

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/5">
            <span className="text-sm text-foreground/60">
              {locale === "ar" ? `عرض ${startIndex + 1} إلى ${Math.min(endIndex, filteredPlans.length)} من أصل ${filteredPlans.length} باقة` : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredPlans.length)} of ${filteredPlans.length} plans`}
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