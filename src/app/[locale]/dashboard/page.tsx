"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

// تعريف نوع البيانات الخاص بالاشتراكات لإرضاء TypeScript
interface SubscriptionData {
  status: string;
  amount_paid: string;
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [stats, setStats] = useState({
    nurseries: 0,
    activeSubscriptions: 0,
    revenue: 0,
    activities: 0,
    roles: 0,
    media: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        
        // استخدام الرابط الديناميكي أو رابط Ngrok الخاص بك مباشرة
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";

        const [nurseriesRes, subsRes, activitiesRes, rolesRes, mediaRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/nurseries`, { headers }),
          fetch(`${apiUrl}/api/admin/nursery-subscriptions`, { headers }),
          fetch(`${apiUrl}/api/admin/weekly-activities`, { headers }),
          fetch(`${apiUrl}/api/admin/roles`, { headers }),
          fetch(`${apiUrl}/api/admin/media`, { headers }),
        ]);

        const [nurseriesData, subsData, activitiesData, rolesData, mediaData] = await Promise.all([
          nurseriesRes.json(),
          subsRes.json(),
          activitiesRes.json(),
          rolesRes.json(),
          mediaRes.json(),
        ]);

        const subs: SubscriptionData[] = subsData.data || [];
        
        const activeSubs = subs.filter((s: SubscriptionData) => s.status === "active").length;
        const totalRevenue = subs.reduce((sum: number, s: SubscriptionData) => sum + parseFloat(s.amount_paid || "0"), 0);

        setStats({
          nurseries: (nurseriesData.data || []).length,
          activeSubscriptions: activeSubs,
          revenue: totalRevenue,
          activities: (activitiesData.data || []).length,
          roles: (rolesData.data || []).length,
          media: (mediaData.data || []).length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: locale === "ar" ? "إجمالي الحضانات" : "Total Nurseries",
      value: stats.nurseries,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      link: `/${locale}/dashboard/nurseries`,
    },
    {
      title: locale === "ar" ? "الاشتراكات النشطة" : "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      link: `/${locale}/dashboard/nursery-subscriptions`,
    },
    {
      title: locale === "ar" ? "إجمالي الإيرادات" : "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      link: `/${locale}/dashboard/nursery-subscriptions`,
    },
    {
      title: locale === "ar" ? "الأنشطة الأسبوعية" : "Weekly Activities",
      value: stats.activities,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      link: `/${locale}/dashboard/weekly-activities`,
    },
    {
      title: locale === "ar" ? "الأدوار (Roles)" : "System Roles",
      value: stats.roles,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      link: `/${locale}/dashboard/roles`,
    },
    {
      title: locale === "ar" ? "ملفات الوسائط" : "Media Files",
      value: stats.media,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      link: `/${locale}/dashboard/media`,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            {locale === "ar" ? "مرحباً بك في نظام حضانتي" : "Welcome to Hadante System"}
            <span className="animate-bounce origin-bottom inline-block text-4xl">👋</span>
          </h1>
          <p className="text-foreground/70 mt-2 text-start">
            {locale === "ar" 
              ? "نظرة عامة حية على أداء النظام، الاشتراكات، والأنشطة المسجلة." 
              : "Live overview of system performance, subscriptions, and activities."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Link 
            href={card.link} 
            key={index}
            className="group block bg-background border border-border p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${card.bgColor}`}></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground/60 tracking-wider">
                  {card.title}
                </h3>
                {isLoading ? (
                  <div className="h-10 w-24 bg-secondary/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.value}
                  </p>
                )}
              </div>
              <div className={`p-4 rounded-xl ${card.bgColor} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {card.icon}
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}