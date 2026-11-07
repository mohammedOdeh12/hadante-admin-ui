"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import ConfirmAlert from "../../components/ui/ConfirmAlert";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
}

export default function RoleActions({
  role,
  locale,
}: {
  role: Role;
  locale: string;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // حالات الصلاحيات
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    role.permissions ? role.permissions.map((p) => p.id) : []
  );

  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description || "",
  });

  // جلب الصلاحيات عند فتح نافذة التعديل
  useEffect(() => {
    if (isEditOpen) {
      const fetchPermissions = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/permissions", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setAvailablePermissions(data.data || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchPermissions();
    }
  }, [isEditOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        ...formData,
        permissionIds: selectedPermissions,
      };

      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/roles/${role.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/roles/${role.id}`, {
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
        <button
          onClick={() => setIsEditOpen(true)}
          className="text-secondary hover:text-primary transition-all transform hover:scale-110"
          title={locale === "ar" ? "تعديل" : "Edit"}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110"
          title={locale === "ar" ? "حذف" : "Delete"}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={locale === "ar" ? "تعديل الدور" : "Edit Role"}
        locale={locale}
      >
        <form onSubmit={handleEdit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {locale === "ar" ? "اسم الدور *" : "Role Name *"}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start"
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
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none text-start resize-none"
              />
            </div>

            {/* الصلاحيات بنفس التصميم المطلوب */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {locale === "ar" ? "الصلاحيات الممنوحة *" : "Assigned Permissions *"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 border border-border rounded-lg bg-secondary/5">
                {availablePermissions.length === 0 ? (
                  <p className="text-sm text-foreground/50 col-span-2">
                    {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                  </p>
                ) : (
                  availablePermissions.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-start gap-2 cursor-pointer p-2 hover:bg-background rounded-md border border-transparent hover:border-border transition-all"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => handlePermissionToggle(perm.id)}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{perm.name}</p>
                        <p className="text-xs text-foreground/60 line-clamp-1">{perm.description}</p>
                      </div>
                    </label>
                  ))
                )}
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
              disabled={isEditLoading || selectedPermissions.length === 0}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30"
            >
              {isEditLoading ? "..." : locale === "ar" ? "حفظ التعديلات" : "Save"}
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
        message={locale === "ar" ? `سيتم حذف الدور نهائياً.` : `Role will be deleted.`}
        locale={locale}
      />
    </>
  );
}