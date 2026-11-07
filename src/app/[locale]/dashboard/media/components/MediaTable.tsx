"use client";

import { useEffect, useState } from "react";
import MediaActions from "./MediaActions";

interface Nursery { id: number; name: string; }

interface MediaItem {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  nursery: Nursery;
}

export default function MediaTable({ locale }: { locale: string }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/media`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMediaItems(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (isLoading) return <div className="flex justify-center h-64 items-center bg-background border rounded-xl"><svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-secondary/5 text-primary border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-start">ID</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "اسم الملف" : "File Name"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "النوع" : "Type"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحضانة" : "Nursery"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الرابط" : "Link"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mediaItems.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/50">{locale === "ar" ? "لا يوجد وسائط." : "No media found."}</td></tr>
            ) : (
              mediaItems.map((item) => (
                <tr key={item.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.id}</td>
                  <td className="px-6 py-4 font-medium" dir="ltr"><span className="truncate max-w-37.5 inline-block">{item.file_name}</span></td>
                  <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">{item.file_type}</span></td>
                  <td className="px-6 py-4 text-foreground/80">{item.nursery?.name || "-"}</td>
                  <td className="px-6 py-4">
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary flex items-center gap-1 text-xs font-semibold bg-primary/10 px-3 py-1.5 rounded-lg w-fit transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      {locale === "ar" ? "عرض الملف" : "View"}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <MediaActions item={item} locale={locale} />
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