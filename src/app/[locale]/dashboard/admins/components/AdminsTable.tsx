"use client";

import { useEffect, useState } from "react";
import AdminActions from "./AdminActions";
import SearchInput from "../../components/ui/SearchInput"; // استدعاء حقل البحث

interface Role {
  id: number;
  name: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: Role;
}

export default function AdminsTable({ locale }: { locale: string }) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالات البحث والترقيم
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
        
        const response = await fetch(`${apiUrl}/api/admin/super-admins`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true", 
          },
        });

        const data = await response.json();
        setAdmins(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // دالة البحث المحدثة التي تحل خطأ cascading renders
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // إعادة الترقيم للصفحة الأولى عند البحث
  };

  // تصفية البيانات (Filtering) بناءً على نص البحث
  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      (admin.role && admin.role.name.toLowerCase().includes(searchLower))
    );
  });

  // حساب بيانات الترقيم (Pagination)
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAdmins.slice(startIndex, endIndex);

  if (isLoading) return <div className="flex justify-center h-64 items-center bg-background border rounded-xl"><svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

  return (
    <div className="space-y-4">
      {/* عرض حقل البحث فوق الجدول مباشرة */}
      <div className="flex justify-start">
        <SearchInput
          placeholder={
            locale === "ar"
              ? "ابحث بالاسم، البريد، أو الدور..."
              : "Search by name, email, or role..."
          }
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
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الاسم" : "Name"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الدور" : "Role"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50 space-y-2">
                      
                      <p className="text-lg font-medium">
                        {searchTerm 
                          ? (locale === "ar" ? `لا توجد نتائج لـ "${searchTerm}"` : `No results found for "${searchTerm}"`)
                          : (locale === "ar" ? "لا يوجد مدراء." : "No admins found.")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((admin) => (
                  <tr key={admin.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{admin.id}</td>
                    <td className="px-6 py-4 font-medium">{admin.name}</td>
                    <td className="px-6 py-4 text-foreground/80">{admin.email}</td>
                    <td className="px-6 py-4 text-foreground/80">
                      {admin.role ? admin.role.name : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {admin.is_active ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AdminActions admin={admin} locale={locale} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* أزرار الترقيم (Pagination) */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/5">
            <span className="text-sm text-foreground/60">
              {locale === "ar" 
                ? `عرض ${startIndex + 1} إلى ${Math.min(endIndex, filteredAdmins.length)} من أصل ${filteredAdmins.length} مدير`
                : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredAdmins.length)} of ${filteredAdmins.length} admins`
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