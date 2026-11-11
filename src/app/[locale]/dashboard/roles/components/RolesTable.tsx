"use client";

import { useEffect, useState } from "react";
import RoleActions from "./RoleActions";
import SearchInput from "../../components/ui/SearchInput"; // استدعاء حقل البحث
import TableSkeleton from "../../components/ui/TableSkeleton";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[]; 
}

export default function RolesTable({ locale }: { locale: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // حالات البحث والترقيم
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
        
        const response = await fetch(`${apiUrl}/api/admin/roles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true", // تخطي التحذير
          },
        });

        const data = await response.json();
        setRoles(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // دالة البحث المحدثة التي تحل خطأ cascading renders
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // إعادة الترقيم للصفحة الأولى عند البحث
  };

  // تصفية البيانات (Filtering) بناءً على نص البحث
  const filteredRoles = roles.filter((role) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      role.name.toLowerCase().includes(searchLower) ||
      (role.description && role.description.toLowerCase().includes(searchLower))
    );
  });

  // حساب بيانات الترقيم (Pagination)
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRoles.slice(startIndex, endIndex);

 if (isLoading) {
    return <TableSkeleton columns={7} rows={6} />;
  }


  return (
    <div className="space-y-4">
      {/* عرض حقل البحث فوق الجدول مباشرة */}
      <div className="flex justify-start">
        <SearchInput
          placeholder={
            locale === "ar"
              ? "ابحث باسم الدور أو الوصف..."
              : "Search by role name or description..."
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
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "اسم الدور" : "Role Name"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الوصف" : "Description"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الصلاحيات" : "Permissions"}</th>
                <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-foreground/50 space-y-2">
                      
                      <p className="text-lg font-medium">
                        {searchTerm 
                          ? (locale === "ar" ? `لا توجد نتائج لـ "${searchTerm}"` : `No results found for "${searchTerm}"`)
                          : (locale === "ar" ? "لا يوجد أدوار مسجلة." : "No roles found.")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((role) => (
                  <tr key={role.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{role.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{role.name}</td>
                    <td className="px-6 py-4 text-foreground/80 max-w-xs truncate" title={role.description}>{role.description || "-"}</td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {role.permissions && role.permissions.length > 0 ? (
                          role.permissions.map((perm) => (
                            <span 
                              key={perm.id} 
                              className="bg-primary/10 text-primary border border-primary/20 text-[11px] px-2 py-1 rounded-md"
                              title={perm.description} 
                              dir="ltr"
                            >
                              {perm.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-foreground/50 text-xs bg-secondary/10 px-2 py-1 rounded-md">
                            {locale === "ar" ? "لا يوجد صلاحيات" : "No permissions"}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <RoleActions role={role} locale={locale} />
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
                ? `عرض ${startIndex + 1} إلى ${Math.min(endIndex, filteredRoles.length)} من أصل ${filteredRoles.length} دور`
                : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredRoles.length)} of ${filteredRoles.length} roles`
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