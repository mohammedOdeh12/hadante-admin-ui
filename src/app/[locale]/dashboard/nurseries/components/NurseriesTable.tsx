"use client";

import { useEffect, useState } from "react";
import NurseryActions from "./NurseryActions";
import SearchInput from "../../components/ui/SearchInput"; // استدعاء مكون البحث

interface Nursery {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function NurseriesTable({ locale }: { locale: string }) {
  const [nurseries, setNurseries] = useState<Nursery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // حالات البحث والترقيم
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // عدد العناصر في الصفحة الواحدة

  useEffect(() => {
    const fetchNurseries = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";

        const response = await fetch(`${apiUrl}/api/admin/nurseries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "حدث خطأ أثناء جلب البيانات");
        }

        setNurseries(data.data || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("خطأ غير متوقع");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNurseries();
  }, []);

  // دالة البحث المحدثة التي تحل خطأ cascading renders
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // إعادة الترقيم للصفحة الأولى عند كل تغيير في البحث مباشرة
  };

  // تصفية البيانات بناءً على نص البحث
  const filteredNurseries = nurseries.filter((nursery) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      nursery.name.toLowerCase().includes(searchLower) ||
      nursery.email.toLowerCase().includes(searchLower) ||
      (nursery.phone && nursery.phone.includes(searchLower))
    );
  });

  // حساب بيانات الترقيم (Pagination)
  const totalPages = Math.ceil(filteredNurseries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNurseries.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-background border border-border rounded-xl shadow-sm">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-start">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* حقل البحث يظهر فوق الجدول مباشرة */}
      <div className="flex justify-start">
        <SearchInput
          placeholder={
            locale === "ar"
              ? "ابحث عن حضانة بالاسم، الإيميل، أو الهاتف..."
              : "Search nurseries by name, email, or phone..."
          }
          value={searchTerm}
          onChange={handleSearch} // استخدام الدالة المحدثة هنا
        />
      </div>

      {/* الجدول */}
      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-secondary/5 text-primary border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-start">ID</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "اسم الحضانة" : "Name"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "رقم الهاتف" : "Phone"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "العنوان" : "Address"}</th>
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
                        {searchTerm 
                          ? (locale === "ar" ? `لا توجد نتائج لـ "${searchTerm}"` : `No results found for "${searchTerm}"`)
                          : (locale === "ar" ? "لا توجد حضانات مسجلة حالياً." : "No nurseries found.")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((nursery) => (
                  <tr key={nursery.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{nursery.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{nursery.name}</td>
                    <td className="px-6 py-4 text-foreground/80">{nursery.email}</td>
                    <td className="px-6 py-4 text-foreground/80" dir="ltr">{nursery.phone || "-"}</td>
                    <td className="px-6 py-4 text-foreground/80 truncate max-w-37.5" title={nursery.address}>{nursery.address || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${nursery.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {nursery.is_active ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <NurseryActions nursery={nursery} locale={locale} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* أزرار الترقيم (Pagination) تظهر فقط إذا كان هناك أكثر من صفحة */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/5">
            <span className="text-sm text-foreground/60">
              {locale === "ar" 
                ? `عرض ${startIndex + 1} إلى ${Math.min(endIndex, filteredNurseries.length)} من أصل ${filteredNurseries.length} حضانة`
                : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredNurseries.length)} of ${filteredNurseries.length} nurseries`
              }
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
              >
                <svg className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex items-center justify-center px-4 font-semibold text-sm text-primary bg-primary/10 rounded-lg border border-primary/20">
                {currentPage}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-secondary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-1"
              >
                <svg className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}