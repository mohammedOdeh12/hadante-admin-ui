"use client";

import { useEffect, useState } from "react";
import ActivityActions from "./ActivityActions";

interface Nursery { id: number; name: string; }

interface Activity {
  id: number;
  title: string;
  description: string;
  day_of_week: string;
  nursery: Nursery;
}

export default function ActivitiesTable({ locale }: { locale: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
        
        const response = await fetch(`${apiUrl}/api/admin/weekly-activities`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true" 
          },
        });
        const data = await response.json();
        setActivities(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const translateDay = (day: string) => {
    if (locale !== "ar") return day;
    const daysMap: Record<string, string> = {
      Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء",
      Wednesday: "الأربعاء", Thursday: "الخميس", Friday: "الجمعة", Saturday: "السبت"
    };
    return daysMap[day] || day;
  };

  if (isLoading) return <div className="flex justify-center h-64 items-center bg-background border rounded-xl"><svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-start">
          <thead className="bg-secondary/5 text-primary border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-start">ID</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "العنوان" : "Title"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الوصف" : "Description"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "اليوم" : "Day"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الحضانة" : "Nursery"}</th>
              <th className="px-6 py-4 font-semibold text-start">{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-foreground/50">{locale === "ar" ? "لا يوجد أنشطة مسجلة." : "No activities found."}</td></tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{activity.id}</td>
                  <td className="px-6 py-4 font-medium">{activity.title}</td>
                  <td className="px-6 py-4 text-foreground/80 max-w-xs truncate" title={activity.description}>{activity.description}</td>
                  <td className="px-6 py-4 font-medium text-primary rounded-lg inline-block ">{translateDay(activity.day_of_week)}</td>
                  <td className="px-6 py-4 text-foreground/80">{activity.nursery?.name || "-"}</td>
                  <td className="px-6 py-4">
                    <ActivityActions activity={activity} locale={locale} />
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