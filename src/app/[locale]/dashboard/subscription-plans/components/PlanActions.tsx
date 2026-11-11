"use client";

import { useState } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmAlert from "../../components/ui/ConfirmAlert";
import CustomSelect from "../../components/ui/CustomSelect";

// تحديث الـ Interface 
interface SubscriptionPlan {
  id: number;
  name: string;
  monthly_price: string | number;
  yearly_price: string | number;
  max_children: number;
  ai_reports_enabled: boolean;
  description: string;
  is_active: boolean;
}

export default function PlanActions({
  plan,
  locale,
}: {
  plan: SubscriptionPlan;
  locale: string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: plan.name,
    monthly_price: plan.monthly_price.toString(),
    yearly_price: plan.yearly_price.toString(),
    max_children: plan.max_children.toString(),
    ai_reports_enabled: plan.ai_reports_enabled,
    description: plan.description || "",
    is_active: plan.is_active,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    // معالجة الـ Select المنطقي (boolean)
    if (e.target.name === "is_active" || e.target.name === "ai_reports_enabled") {
      setFormData({ ...formData, [e.target.name]: e.target.value === "true" });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";

      const payload = {
        ...formData,
        monthly_price: parseFloat(formData.monthly_price),
        yearly_price: parseFloat(formData.yearly_price),
        max_children: parseInt(formData.max_children),
      };

      const response = await fetch(
        `${apiUrl}/api/admin/subscription-plans/${plan.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(payload),
        },
      );

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";
      
      const response = await fetch(
        `${apiUrl}/api/admin/subscription-plans/${plan.id}`,
        {
          method: "DELETE",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          },
        },
      );
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
        <button
          onClick={() => setIsEditOpen(true)}
          className="text-secondary hover:text-primary transition-all transform hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={locale === "ar" ? "تعديل الباقة" : "Edit Plan"}
        locale={locale}
      >
        <form onSubmit={handleEdit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "الاسم *" : "Name *"}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "السعر الشهري *" : "Monthly Price *"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="monthly_price"
                  required
                  value={formData.monthly_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "السعر السنوي *" : "Yearly Price *"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="yearly_price"
                  required
                  value={formData.yearly_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "أقصى عدد أطفال *" : "Max Children *"}
                </label>
                <input
                  type="number"
                  name="max_children"
                  required
                  value={formData.max_children}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "تقارير الذكاء الاصطناعي" : "AI Reports"}
                </label>
                <CustomSelect
                  name="ai_reports_enabled"
                  value={formData.ai_reports_enabled ? "true" : "false"}
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
                {locale === "ar" ? "الحالة" : "Status"}
              </label>
              <CustomSelect
                name="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={handleChange}
                options={[
                  { value: "true", label: locale === "ar" ? "نشط" : "Active" },
                  { value: "false", label: locale === "ar" ? "غير نشط" : "Inactive" },
                ]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "الوصف" : "Description"}
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start resize-none transition-all"
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/5">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors"
            >
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isEditLoading}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30"
            >
              {isEditLoading ? "..." : locale === "ar" ? "حفظ" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmAlert
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title={locale === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
        message={
          locale === "ar"
            ? `سيتم حذف الخطة نهائياً.`
            : `Plan will be deleted permanently.`
        }
        locale={locale}
      />
    </>
  );
}