"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal"; 

interface Permission {
  id: number;
  name: string;
  description: string;
}

export default function AddRoleButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // حالات الصلاحيات
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // جلب الصلاحيات عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        ...formData,
        permissionIds: selectedPermissions,
      };

      const response = await fetch(`https://epidural-anointer-shrunk.ngrok-free.dev/api/admin/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "فشل في إضافة الدور");
      }

      setIsOpen(false);
      setFormData({ name: "", description: "" });
      setSelectedPermissions([]); // تفريغ التحديد
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
        {locale === "ar" ? "إضافة دور" : "Add Role"}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={locale === "ar" ? "إضافة دور جديد" : "Add New Role"}
        locale={locale}
      >
        <form onSubmit={handleSubmit}>
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
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40  outline-none transition-all text-start"
                placeholder={locale === "ar" ? "مثال: مدير فرعي" : "e.g. Sub Admin"}
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
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40  outline-none transition-all text-start resize-none"
                placeholder={locale === "ar" ? "وصف لصلاحيات هذا الدور..." : "Role description..."}
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
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors">
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={isLoading || selectedPermissions.length === 0} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30">
              {isLoading ? "..." : (locale === "ar" ? "حفظ الدور" : "Save Role")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}