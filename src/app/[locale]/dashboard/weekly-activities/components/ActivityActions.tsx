"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmAlert from "../../components/ui/ConfirmAlert";
import CustomSelect from "../../components/ui/CustomSelect";

interface Nursery { id: number; name: string; }

interface Activity {
  id: number;
  title: string;
  description: string;
  day_of_week: string;
  nursery: Nursery;
}

export default function ActivityActions({ activity, locale }: { activity: Activity; locale: string; }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [nurseries, setNurseries] = useState<Nursery[]>([]);

  // تعبئة البيانات مسبقاً بما في ذلك استخراج ID الحضانة
  const [formData, setFormData] = useState({
    title: activity.title,
    description: activity.description || "",
    day_of_week: activity.day_of_week,
    nursery_id: activity.nursery?.id?.toString() || "",
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
    if (isEditOpen) {
      const fetchNurseries = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/nurseries`, { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          setNurseries(data.data || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchNurseries();
    }
  }, [isEditOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { ...formData, nursery_id: parseInt(formData.nursery_id) };

      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/weekly-activities/${activity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("فشل التعديل");
      setIsEditOpen(false);
      window.location.reload();
    } catch (error) {
        console.error(error);
      alert("حدث خطأ أثناء التعديل");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/weekly-activities/${activity.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("فشل الحذف");
      setIsDeleteOpen(false);
      window.location.reload();
    } catch (error) {
        console.error(error);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <button onClick={() => setIsEditOpen(true)} className="text-secondary hover:text-primary transition-all transform hover:scale-110"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
        <button onClick={() => setIsDeleteOpen(true)} className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={locale === "ar" ? "تعديل النشاط" : "Edit Activity"} locale={locale} maxWidth="max-w-2xl">
        <form onSubmit={handleEdit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{locale === "ar" ? "عنوان النشاط *" : "Title *"}</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border shadow-sm focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{locale === "ar" ? "اليوم *" : "Day of Week *"}</label>
                <CustomSelect name="day_of_week" value={formData.day_of_week} onChange={handleChange} options={daysOptions} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{locale === "ar" ? "الحضانة *" : "Nursery *"}</label>
              <CustomSelect name="nursery_id" value={formData.nursery_id} onChange={handleChange} options={nurseries.map((n) => ({ value: n.id.toString(), label: n.name }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{locale === "ar" ? "الوصف" : "Description"}</label>
              <textarea name="description" rows={3} required value={formData.description} onChange={handleChange} className="w-full shadow-sm px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start resize-none transition-all" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/5">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
            <button type="submit" disabled={isEditLoading} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30">{isEditLoading ? "..." : (locale === "ar" ? "حفظ" : "Save")}</button>
          </div>
        </form>
      </Modal>

      <ConfirmAlert isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} isLoading={isDeleteLoading} title={locale === "ar" ? "تأكيد الحذف" : "Confirm Delete"} message={locale === "ar" ? "هل أنت متأكد من حذف هذا النشاط؟" : "Delete this activity?"} locale={locale} />
    </>
  );
}