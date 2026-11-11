"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NurseryActions from "./NurseryActions";
import SearchInput from "../../components/ui/SearchInput";
import StatusBadge from "../../components/ui/StatusBadge"; 
import TableSkeleton from "../../components/ui/TableSkeleton";

interface Subscription {
  plan?: { name: string };
  billing_cycle?: string;
  status?: string;
}

interface Nursery {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: { id: number; file_url: string; file_name: string } | null;
  is_active: boolean;
  created_at: string;
  subscriptions?: Subscription[];
}

export default function NurseriesTable({ locale }: { locale: string }) {
  const [nurseries, setNurseries] = useState<Nursery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchNurseries = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://epidural-anointer-shrunk.ngrok-free.dev";

        const response = await fetch(`${apiUrl}/api/admin/nurseries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredNurseries = nurseries.filter((nursery) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      nursery.name.toLowerCase().includes(searchLower) ||
      nursery.email.toLowerCase().includes(searchLower) ||
      (nursery.phone && nursery.phone.includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredNurseries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNurseries.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("data:image") || url.startsWith("blob:")) return url;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://epidural-anointer-shrunk.ngrok-free.dev";
    const cleanApiUrl = apiUrl.replace(/\/+$/, "");
    const cleanPath = url.startsWith("/") ? url : `/${url}`;

    return `${cleanApiUrl}${cleanPath}`;
  };

   if (isLoading) {
      return <TableSkeleton columns={7} rows={6} />;
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
      <div className="flex justify-start">
        <SearchInput
          placeholder={
            locale === "ar"
              ? "ابحث عن حضانة بالاسم، الإيميل، أو الهاتف..."
              : "Search nurseries by name, email, or phone..."
          }
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* أزلت pb-2 من هنا لأنها كانت تسبب الفراغ تحت الجدول */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          {/* تأكدت من أن الجدول يأخذ الارتفاع كاملاً */}
          <table className="w-full text-sm text-start min-w-250 border-collapse">
            <thead className="bg-secondary/5 text-primary border-b border-border">
              <tr className="whitespace-nowrap">
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "الشعار" : "Logo"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">ID</th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "الاسم" : "Name"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "خطة الاشتراك" : "Subscription Plan"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "دورة الدفع" : "Billing cycle"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "تاريخ الاستحقاق" : "Billing anchor"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "حالة الاشتراك" : "Subscription Status"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "العنوان" : "Address"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "رقم الهاتف" : "Phone"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "تاريخ الإنشاء" : "Created At"}
                </th>
                <th className="px-4 py-4 font-semibold text-start">
                  {locale === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            
            {/* استخدام divide-y ولكن بشكل يضمن تمدد الـ hover */}
            <tbody className="divide-y divide-border bg-background">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center">
                    <p className="text-lg font-medium text-foreground/50">
                      {searchTerm
                        ? locale === "ar"
                          ? `لا توجد نتائج لـ "${searchTerm}"`
                          : `No results found for "${searchTerm}"`
                        : locale === "ar"
                          ? "لا توجد حضانات مسجلة حالياً."
                          : "No nurseries found."}
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((nursery) => {
                  const currentSub = nursery.subscriptions?.[0];
                  const imageUrl = getImageUrl(nursery.logo?.file_url);

                  return (
                    <tr
                      key={nursery.id}
                      // التأكد من أن الـ hover يغطي الصف بالكامل بدون أي فراغات
                      className="hover:bg-secondary/5 transition-colors group"
                    >
                      <td className="px-4 py-4 text-start whitespace-nowrap align-middle">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={nursery.name}
                            width={40}
                            height={40}
                            className="object-contain"
                            unoptimized={true}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.parentElement?.classList.add(
                                "flex",
                                "items-center",
                                "justify-center",
                                "bg-primary/10",
                                "text-primary",
                                "font-bold",
                                "text-lg",
                                "uppercase",
                                "border",
                                "border-primary/20",
                              );
                              if (target.parentElement)
                                target.parentElement.innerHTML =
                                  nursery.name.charAt(0);
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary font-bold text-lg uppercase border border-primary/20">
                            {nursery.name.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground text-start whitespace-nowrap align-middle">
                        {nursery.id}
                      </td>
                      <td className="px-4 py-4 font-medium text-foreground text-start min-w-30 align-middle">
                        {nursery.name}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 text-start min-w-30 align-middle">
                        {currentSub?.plan?.name || "-"}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 text-start whitespace-nowrap align-middle">
                        {currentSub?.billing_cycle || "Monthly"}
                      </td>
                      <td className="px-4 py-4 text-foreground/80 text-start min-w-50 align-middle">
                        <div className="flex flex-col">
                          <span>-</span>
                          <span className="text-xs text-foreground/50">
                            Legacy calendar (renewal on day 1)
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-start whitespace-nowrap align-middle">
                        <StatusBadge status={currentSub?.status || "pending"} />
                      </td>

                      <td className="px-4 py-4 text-foreground/80 text-start min-w-[150px] align-middle">
                        {nursery.address || "-"}
                      </td>
                      <td
                        className="px-4 py-4 text-foreground/80 text-start whitespace-nowrap align-middle"
                        dir="ltr"
                      >
                        {nursery.phone || "-"}
                      </td>

                      <td className="px-4 py-4 text-start whitespace-nowrap align-middle">
                        <StatusBadge status={nursery.is_active} />
                      </td>

                      <td className="px-4 py-4 text-foreground/80 text-start text-xs max-w-[100px] align-middle">
                        {formatDate(nursery.created_at)}
                      </td>
                      <td className="px-4 py-4 text-start whitespace-nowrap align-middle">
                        <NurseryActions nursery={nursery} locale={locale} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-secondary/5 mt-auto">
            <span className="text-sm text-foreground/60 text-start">
              {locale === "ar"
                ? `عرض ${startIndex + 1} إلى ${Math.min(endIndex, filteredNurseries.length)} من أصل ${filteredNurseries.length} حضانة`
                : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredNurseries.length)} of ${filteredNurseries.length} nurseries`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-secondary/10 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center justify-center px-4 font-semibold text-sm text-primary bg-primary/10 rounded-lg border border-primary/20">
                {currentPage}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground hover:bg-secondary/10 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 ${locale === "ar" ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}