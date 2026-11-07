"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import CustomSelect from "../../components/ui/CustomSelect";

interface Nursery {
  id: number;
  name: string;
}

export default function AddActivityButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nurseries, setNurseries] = useState<Nursery[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    day_of_week: "",
    nursery_id: "",
  });

  const daysOptions = [
    { value: "Sunday", label: locale === "ar" ? "الأحد" : "Sunday" },
    { value: "Monday", label: locale === "ar" ? "الإثنين" : "Monday" },
    { value: "Tuesday", label: locale === "ar" ? "الثلاثاء" : "Tuesday" },
    { value: "Wednesday", label: locale === "ar" ? "الأربعاء" : "Wednesday" },
    { value: "Thursday", label: locale === "ar" ? "الخميس" : "Thursday" },
    { value: "Friday", label: locale === "ar" ? "الجمعة" : "Friday" },
    { value: "Saturday", label: locale === "ar" ? "السبت" : "Saturday" },
  ];

  useEffect(() => {
    if (isOpen) {
      const fetchNurseries = async () => {
        try {
          const token = localStorage.getItem("token");
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
          
          const res = await fetch(`${apiUrl}/api/admin/nurseries`, {
            headers: { 
              "Authorization": `Bearer ${token}`,
              "ngrok-skip-browser-warning": "true"
            },
          });
          const data = await res.json();
          setNurseries(data.data || []);
        } catch (error) {
          console.error("فشل جلب الحضانات", error);
        }
      };
      fetchNurseries();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      };

      const response = await fetch(`${apiUrl}/api/admin/weekly-activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("فشل في إضافة النشاط");

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
        {locale === "ar" ? "إضافة نشاط" : "Add Activity"}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={locale === "ar" ? "إضافة نشاط أسبوعي" : "Add Weekly Activity"} locale={locale} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "عنوان النشاط *" : "Title *"}</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" placeholder={locale === "ar" ? "مثال: حصة رسم" : "e.g. Art Class"} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "اليوم *" : "Day of Week *"}</label>
                <CustomSelect name="day_of_week" value={formData.day_of_week} onChange={handleChange} placeholder={locale === "ar" ? "اختر اليوم..." : "Select Day..."} options={daysOptions} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "الحضانة التابع لها *" : "Nursery *"}</label>
              <CustomSelect name="nursery_id" value={formData.nursery_id} onChange={handleChange} placeholder={locale === "ar" ? "اختر الحضانة..." : "Select Nursery..."} options={nurseries.map((n) => ({ value: n.id.toString(), label: n.name }))} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">{locale === "ar" ? "الوصف" : "Description"}</label>
              <textarea name="description" rows={3} required value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start resize-none transition-all" />
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