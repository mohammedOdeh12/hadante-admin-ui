"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import CustomSelect from "../../components/ui/CustomSelect";

interface Nursery {
  id: number;
  name: string;
}

export default function AddMediaButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nurseries, setNurseries] = useState<Nursery[]>([]);

  const [formData, setFormData] = useState({
    file_name: "",
    file_url: "",
    file_type: "image/png", // قيمة افتراضية
    nursery_id: "",
  });

  const fileTypeOptions = [
    { value: "image/png", label: "Image (PNG)" },
    { value: "image/jpeg", label: "Image (JPG/JPEG)" },
    { value: "application/pdf", label: "Document (PDF)" },
    { value: "video/mp4", label: "Video (MP4)" },
  ];

  useEffect(() => {
    if (isOpen) {
      const fetchNurseries = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/nurseries`, {
            headers: { Authorization: `Bearer ${token}` },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        nursery_id: parseInt(formData.nursery_id),
      };

      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("فشل في إضافة الوسائط");

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
        {locale === "ar" ? "إضافة وسائط" : "Add Media"}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>

      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={locale === "ar" ? "إضافة ملف وسائط جديد" : "Add New Media File"} locale={locale} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{locale === "ar" ? "اسم الملف *" : "File Name *"}</label>
                <input type="text" name="file_name" required value={formData.file_name} onChange={handleChange} dir="ltr" className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${locale === "ar" ? "text-end" : "text-start"}`} placeholder="nursery_logo.png" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{locale === "ar" ? "نوع الملف *" : "File Type *"}</label>
                <CustomSelect name="file_type" value={formData.file_type} onChange={handleChange} options={fileTypeOptions} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{locale === "ar" ? "رابط الملف (URL) *" : "File URL *"}</label>
              <input type="url" name="file_url" required value={formData.file_url} onChange={handleChange} dir="ltr" className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${locale === "ar" ? "text-end" : "text-start"}`} placeholder="https://example.com/uploads/..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{locale === "ar" ? "الحضانة التابع لها *" : "Nursery *"}</label>
              <CustomSelect name="nursery_id" value={formData.nursery_id} onChange={handleChange} placeholder={locale === "ar" ? "اختر الحضانة..." : "Select Nursery..."} options={nurseries.map((n) => ({ value: n.id.toString(), label: n.name }))} />
            </div>

          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3 bg-secondary/5">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-lg border">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground min-w-30">{isLoading ? "..." : (locale === "ar" ? "حفظ" : "Save")}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}