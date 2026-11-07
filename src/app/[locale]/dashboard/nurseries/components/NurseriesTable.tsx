"use client";

import { useEffect, useState } from "react";
import NurseryActions from "./NurseryActions";

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

  useEffect(() => {
    const fetchNurseries = async () => {
      try {
        const token = localStorage.getItem("token");

        // استخدام متغير البيئة أفضل، مع الإبقاء على الرابط كقيمة احتياطية
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";

        const response = await fetch(`${apiUrl}/api/admin/nurseries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true", // السطر السحري لتخطي شاشة Ngrok
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
            {nurseries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-foreground/50">
                  {locale === "ar" ? "لا توجد حضانات مسجلة حالياً." : "No nurseries found."}
                </td>
              </tr>
            ) : (
              nurseries.map((nursery) => (
                <tr key={nursery.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{nursery.id}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{nursery.name}</td>
                  <td className="px-6 py-4 text-foreground/80">{nursery.email}</td>
                  <td className="px-6 py-4 text-foreground/80" dir="ltr">{nursery.phone || "-"}</td>
                  <td className="px-6 py-4 text-foreground/80">{nursery.address || "-"}</td>
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
    </div>
  );
}