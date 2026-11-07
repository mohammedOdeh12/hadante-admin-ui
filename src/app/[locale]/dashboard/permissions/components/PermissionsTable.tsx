"use client";

import { useEffect, useState } from "react";
import PermissionActions from "./PermissionActions";

interface Permission {
  id: number;
  name: string;
  description: string;
}

export default function PermissionsTable({ locale }: { locale: string }) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/permissions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setPermissions(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  if (isLoading) return <div className="flex justify-center h-64 items-center bg-background border rounded-xl"><svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-secondary/5 text-primary border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-start">ID</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "مفتاح الصلاحية" : "Permission Key"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الوصف" : "Description"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {permissions.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-foreground/50">{locale === "ar" ? "لا يوجد صلاحيات." : "No permissions found."}</td></tr>
            ) : (
              permissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{permission.id}</td>
                  <td className="px-6 py-4 font-medium text-primary  inline-block  rounded-md" dir="ltr">{permission.name}</td>
                  <td className="px-6 py-4 text-foreground/80">{permission.description || "-"}</td>
                  <td className="px-6 py-4">
                    <PermissionActions permission={permission} locale={locale} />
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