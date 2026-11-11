"use client";

import { useState } from "react";
import Modal from "../../components/ui/Modal";
import CustomSelect from "../../components/ui/CustomSelect"; // تم استيراد CustomSelect

export default function AddPlanButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    monthly_price: "",
    yearly_price: "",
    max_children: "",
    ai_reports_enabled: "false", 
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        monthly_price: parseFloat(formData.monthly_price),
        yearly_price: parseFloat(formData.yearly_price),
        max_children: parseInt(formData.max_children),
        ai_reports_enabled: formData.ai_reports_enabled === "true",
      };

      const response = await fetch(`${apiUrl}/api/admin/subscription-plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "فشل في إضافة الباقة");
      }

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
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-secondary text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
      >
        {locale === "ar" ? "إضافة باقة" : "Add Plan"}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={locale === "ar" ? "إضافة باقة اشتراك جديدة" : "Add New Subscription Plan"}
        locale={locale}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "اسم الباقة *" : "Plan Name *"}
              </label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" placeholder={locale === "ar" ? "مثال: الباقة الذهبية" : "e.g. Gold Plan"} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "السعر الشهري *" : "Monthly Price *"}
                </label>
                <input type="number" step="0.01" name="monthly_price" required value={formData.monthly_price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" placeholder="15.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "السعر السنوي *" : "Yearly Price *"}
                </label>
                <input type="number" step="0.01" name="yearly_price" required value={formData.yearly_price} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" placeholder="150.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "أقصى عدد أطفال *" : "Max Children *"}
                </label>
                <input type="number" name="max_children" required value={formData.max_children} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "تقارير الذكاء الاصطناعي" : "AI Reports"}
                </label>
                {/* استبدال الـ select العادي بـ CustomSelect */}
                <CustomSelect
                  name="ai_reports_enabled"
                  value={formData.ai_reports_enabled}
                  onChange={handleChange}
                  options={[
                    { value: "true", label: locale === "ar" ? "مفعل" : "Enabled" },
                    { value: "false", label: locale === "ar" ? "معطل" : "Disabled" },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "الوصف" : "Description"}
              </label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start resize-none transition-all" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/5">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors">
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30">
              {isLoading ? "..." : (locale === "ar" ? "حفظ" : "Save")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}