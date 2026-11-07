"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import CustomSelect from "../../components/ui/CustomSelect";

interface Nursery { id: number; name: string; }
interface Plan { id: number; name: string; }

export default function AddSubscriptionButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // حالات لتخزين الخيارات القادمة من الباك إند
  const [nurseries, setNurseries] = useState<Nursery[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  const [formData, setFormData] = useState({
    nursery_id: "",
    plan_id: "",
    start_date: "",
    end_date: "",
    amount_paid: "",
    status: "active", // حالة افتراضية
  });

  // جلب البيانات للـ Dropdowns عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
          
          const [nurseriesRes, plansRes] = await Promise.all([
            fetch(`${apiUrl}/api/admin/nurseries`, { 
              headers: { 
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true" 
              } 
            }),
            fetch(`${apiUrl}/api/admin/subscription-plans`, { 
              headers: { 
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
              } 
            })
          ]);

          const nurseriesData = await nurseriesRes.json();
          const plansData = await plansRes.json();

          setNurseries(nurseriesData.data || []);
          setPlans(plansData.data || []);
        } catch (error) {
          console.error("فشل جلب البيانات للخيارات", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
      
      const payload = {
        ...formData,
        nursery_id: parseInt(formData.nursery_id),
        plan_id: parseInt(formData.plan_id),
        amount_paid: parseFloat(formData.amount_paid),
      };

      const response = await fetch(`${apiUrl}/api/admin/nursery-subscriptions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("فشل الإضافة");

      setIsOpen(false);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-secondary text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5">
        {locale === "ar" ? "إضافة اشتراك" : "Add Subscription"}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={locale === "ar" ? "إضافة اشتراك حضانة" : "Add Nursery Subscription"} locale={locale} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "الحضانة *" : "Nursery *"}</label>
                <CustomSelect
                  name="nursery_id"
                  value={formData.nursery_id}
                  onChange={handleChange}
                  placeholder={locale === "ar" ? "اختر الحضانة..." : "Select Nursery..."}
                  options={nurseries.map(n => ({ value: n.id.toString(), label: n.name }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "الباقة *" : "Plan *"}</label>
                <CustomSelect
                  name="plan_id"
                  value={formData.plan_id}
                  onChange={handleChange}
                  placeholder={locale === "ar" ? "اختر الباقة..." : "Select Plan..."}
                  options={plans.map(p => ({ value: p.id.toString(), label: p.name }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "تاريخ البداية *" : "Start Date *"}</label>
                <input type="date" name="start_date" required value={formData.start_date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "تاريخ النهاية *" : "End Date *"}</label>
                <input type="date" name="end_date" required value={formData.end_date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "المبلغ المدفوع *" : "Amount Paid *"}</label>
                <input type="number" step="0.01" name="amount_paid" required value={formData.amount_paid} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" placeholder="120.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "حالة الاشتراك *" : "Status *"}</label>
                <CustomSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: "active", label: locale === "ar" ? "نشط" : "Active" },
                    { value: "expired", label: locale === "ar" ? "منتهي" : "Expired" },
                    { value: "cancelled", label: locale === "ar" ? "ملغى" : "Cancelled" }
                  ]}
                />
              </div>
            </div>

          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/5">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30">{isLoading ? "..." : (locale === "ar" ? "حفظ" : "Save")}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}