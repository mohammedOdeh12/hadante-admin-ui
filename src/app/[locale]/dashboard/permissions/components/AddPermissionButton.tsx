"use client";

import { useState } from "react";
import Modal from "../../components/ui/Modal";

export default function AddPermissionButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/permissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("فشل في إضافة الصلاحية");

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
        {locale === "ar" ? "إضافة صلاحية" : "Add Permission"}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>

      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={locale === "ar" ? "إضافة صلاحية جديدة" : "Add New Permission"} locale={locale}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "اسم الصلاحية (مفتاح) *" : "Permission Name (Key) *"}
              </label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} dir="ltr" className={`w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all ${locale === "ar" ? "text-end" : "text-start"}`} placeholder="e.g. manage_users" />
              <p className="text-xs text-foreground/50 mt-1">{locale === "ar" ? "يفضل كتابته بالإنجليزية وبدون مسافات" : "Preferably in English without spaces"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "الوصف" : "Description"}
              </label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start resize-none transition-all" placeholder={locale === "ar" ? "شرح لدور هذه الصلاحية..." : "Explanation of this permission..."} />
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