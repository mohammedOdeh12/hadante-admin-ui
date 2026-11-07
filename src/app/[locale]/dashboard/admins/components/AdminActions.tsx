"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmAlert from "../../components/ui/ConfirmAlert";
import CustomSelect from "../../components/ui/CustomSelect";

interface Role {
  id: number;
  name: string;
}

interface Admin {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role: Role;
}

export default function AdminActions({
  admin,
  locale,
}: {
  admin: Admin;
  locale: string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    is_active: admin.is_active,
    role_id: admin.role?.id || "",
  });

  useEffect(() => {
    if (isEditOpen) {
      const fetchRoles = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/roles`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setRoles(data.data || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchRoles();
    }
  }, [isEditOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    if (e.target.name === "is_active") {
      setFormData({ ...formData, is_active: e.target.value === "true" });
    } else {
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        role_id: parseInt(formData.role_id as string),
      };

      const response = await fetch(
        `https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/super-admins/${admin.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
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
        `https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/super-admins/${admin.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
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
        title={locale === "ar" ? "تعديل المدير" : "Edit Admin"}
        locale={locale}
      >
        <form onSubmit={handleEdit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "الاسم" : "Name"}
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "البريد" : "Email"}
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "الدور" : "Role"}
              </label>
              <CustomSelect
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                placeholder={locale === "ar" ? "اختر الدور..." : "Select Role..."}
                options={roles.map((r) => ({
                  value: r.id.toString(),
                  label: r.name,
                }))}
              />
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
                  { value: "false", label: locale === "ar" ? "غير نشط" : "Inactive" }
                ]}
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
        message={locale === "ar" ? `هل أنت متأكد من حذف المدير ؟` : `Are you sure you want to delete admin ?`}
        locale={locale}
      />
    </>
  );
}