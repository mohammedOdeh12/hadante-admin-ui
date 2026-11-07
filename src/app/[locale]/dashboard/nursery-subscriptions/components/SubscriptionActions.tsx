"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmAlert from "../../components/ui/ConfirmAlert";
import CustomSelect from "../../components/ui/CustomSelect";

interface Nursery {
  id: number;
  name: string;
}
interface Plan {
  id: number;
  name: string;
}

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  amount_paid: string;
  status: string;
  nursery: Nursery;
  plan: Plan;
}

export default function SubscriptionActions({
  sub,
  locale,
}: {
  sub: Subscription;
  locale: string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [nurseries, setNurseries] = useState<Nursery[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  // استخراج الـ ID من الكائنات المتداخلة
  const [formData, setFormData] = useState({
    nursery_id: sub.nursery?.id?.toString() || "",
    plan_id: sub.plan?.id?.toString() || "",
    start_date: sub.start_date || "",
    end_date: sub.end_date || "",
    amount_paid: sub.amount_paid || "",
    status: sub.status || "active",
  });

  useEffect(() => {
    if (isEditOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("token");
          const [nurseriesRes, plansRes] = await Promise.all([
            fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/nurseries`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/subscription-plans`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          setNurseries((await nurseriesRes.json()).data || []);
          setPlans((await plansRes.json()).data || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
  }, [isEditOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        nursery_id: parseInt(formData.nursery_id),
        plan_id: parseInt(formData.plan_id),
        amount_paid: parseFloat(formData.amount_paid),
      };

      const response = await fetch(
        `https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/nursery-subscriptions/${sub.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
      const response = await fetch(
        `https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/nursery-subscriptions/${sub.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
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
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={locale === "ar" ? "تعديل الاشتراك" : "Edit Subscription"}
        locale={locale}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleEdit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "الحضانة *" : "Nursery *"}
                </label>
                <CustomSelect
                  name="nursery_id"
                  value={formData.nursery_id}
                  onChange={handleChange}
                  options={nurseries.map((n) => ({
                    value: n.id.toString(),
                    label: n.name,
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "الباقة *" : "Plan *"}
                </label>
                <CustomSelect
                  name="plan_id"
                  value={formData.plan_id}
                  onChange={handleChange}
                  options={plans.map((p) => ({
                    value: p.id.toString(),
                    label: p.name,
                  }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "تاريخ البداية *" : "Start Date *"}
                </label>
                <input
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border shadow-sm focus:ring-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "تاريخ النهاية *" : "End Date *"}
                </label>
                <input
                  type="date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border  shadow-sm focus:ring-2 outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "المبلغ المدفوع *" : "Amount Paid *"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount_paid"
                  required
                  value={formData.amount_paid}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border shadow-sm focus:ring-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {locale === "ar" ? "الحالة *" : "Status *"}
                </label>
                <CustomSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    {
                      value: "active",
                      label: locale === "ar" ? "نشط" : "Active",
                    },
                    {
                      value: "expired",
                      label: locale === "ar" ? "منتهي" : "Expired",
                    },
                    {
                      value: "cancelled",
                      label: locale === "ar" ? "ملغى" : "Cancelled",
                    },
                  ]}
                />
              </div>
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
            ? "هل أنت متأكد من حذف هذا الاشتراك؟"
            : "Delete this subscription?"
        }
        locale={locale}
      />
    </>
  );
}
