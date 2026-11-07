"use client";

import { useEffect, useState } from "react";
import RoleActions from "./RoleActions";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[]; // الصلاحيات تأتي الآن من الباك إند
}

export default function RolesTable({ locale }: { locale: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch("https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/roles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-background border border-border rounded-xl shadow-sm">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
    );
  }

  return (
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
            {roles.length === 0 ? (
              // تم تعديل colSpan إلى 5 ليتناسب مع عدد الأعمدة الجديد
              <tr><td colSpan={5} className="px-6 py-8 text-center text-foreground/50">{locale === "ar" ? "لا يوجد أدوار مسجلة." : "No roles found."}</td></tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{role.id}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{role.name}</td>
                  <td className="px-6 py-4 text-foreground/80 max-w-xs truncate" title={role.description}>{role.description || "-"}</td>
                  
                  {/* عمود الصلاحيات الجديد */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {role.permissions && role.permissions.length > 0 ? (
                        role.permissions.map((perm) => (
                          <span 
                            key={perm.id} 
                            className="bg-primary/10 text-primary border border-primary/20 text-[11px] px-2 py-1 rounded-md"
                            title={perm.description} // يظهر الوصف عند تمرير الماوس
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
    </div>
  );
}