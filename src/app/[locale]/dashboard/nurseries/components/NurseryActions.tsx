"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "../../components/ui/Modal";
import ConfirmAlert from "../../components/ui/ConfirmAlert";
import CustomSelect from "../../components/ui/CustomSelect";

interface Subscription {
  status?: string;
  plan?: { name: string };
  billing_cycle?: string;
}

interface Nursery {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  main_color?: string;
  logo?: { id: number; file_url: string; file_name: string } | null;
  is_active: boolean;
  subscriptions?: Subscription[];
}

interface UpdateNurseryPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  main_color: string;
  is_active: boolean;
  logo_id?: number | null;
  subscription_status?: string; // أضفنا حقل حالة الاشتراك هنا
}

export default function NurseryActions({ nursery, locale }: { nursery: Nursery; locale: string; }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  
  const [fileName, setFileName] = useState("");
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("data:image") || url.startsWith("blob:")) return url;
    const cleanApiUrl = apiUrl.replace(/\/+$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanApiUrl}${cleanPath}`;
  };

  const [logoPreview, setLogoPreview] = useState<string | null>(nursery.logo?.file_url ? getImageUrl(nursery.logo.file_url) : null); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // استخراج حالة الاشتراك الحالية، وإذا لم تكن موجودة نجعلها pending
  const currentSubStatus = nursery.subscriptions?.[0]?.status || "pending";

  const [formData, setFormData] = useState({
    name: nursery.name,
    email: nursery.email,
    plan_id: "",
    billing_cycle: "Monthly",
    billing_start_date: "",
    address: nursery.address || "",
    phone: nursery.phone || "",
    main_color: nursery.main_color || "",
    is_active: nursery.is_active ? "true" : "false",
    subscription_status: currentSubStatus, // تعيين الحالة في الـ state
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setFileName("");
    setLogoPreview(null);
    setSelectedFile(null);
    const fileInput = document.getElementById(`logo-upload-edit-${nursery.id}`) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const uploadMediaFile = async (token: string, apiUrl: string) => {
    if (!selectedFile) return null;
    const mediaFormData = new FormData();
    mediaFormData.append("file", selectedFile);
    const response = await fetch(`${apiUrl}/api/admin/media`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
        body: mediaFormData,
    });
    const data = await response.json();
    if (!response.ok || data.success === false) { throw new Error(data.message || "فشل في رفع الصورة"); }
    return data.data.id;
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);

    try {
      const token = localStorage.getItem("token");

      let uploadedLogoId: number | null | undefined = undefined;
      if (selectedFile && token) {
          uploadedLogoId = await uploadMediaFile(token, apiUrl);
      } else if (logoPreview === null && nursery.logo) {
          uploadedLogoId = null; 
      }

      const payload: UpdateNurseryPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        main_color: formData.main_color,
        is_active: formData.is_active === "true",
        subscription_status: formData.subscription_status // إرسال الحالة للباك إند
      };
      
      if (uploadedLogoId !== undefined) {
          payload.logo_id = uploadedLogoId;
      }

      const response = await fetch(`${apiUrl}/api/admin/nurseries/${nursery.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "فشل في تعديل الحضانة");
      }

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
    // ... (كود الحذف يبقى كما هو)
    setIsDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/admin/nurseries/${nursery.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.message || "فشل في حذف الحضانة");
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
        {/* أزرار الإجراءات */}
        <button className="text-cyan-500 hover:text-cyan-700 transition-all transform hover:scale-110" title={locale === "ar" ? "عرض" : "View"}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
        <button onClick={() => setIsEditOpen(true)} className="text-secondary hover:text-primary transition-all transform hover:scale-110" title={locale === "ar" ? "تعديل" : "Edit"}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button onClick={() => setIsDeleteOpen(true)} className="text-red-500 hover:text-red-700 transition-all transform hover:scale-110" title={locale === "ar" ? "حذف" : "Delete"}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={locale === "ar" ? "تعديل بيانات الحضانة" : "Edit Nursery Details"} locale={locale}>
        <form onSubmit={handleEdit} className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-5">
            {/* الحقول السابقة */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "اسم الحضانة *" : "Nursery Name *"}</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "البريد الإلكتروني *" : "Email *"}</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" />
            </div>
            
            {/* حقل حالة الاشتراك الجديد */}
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <label className="block text-sm font-semibold text-primary mb-2 text-start">
                {locale === "ar" ? "حالة الاشتراك الحالية" : "Subscription Status"}
              </label>
              <CustomSelect 
                name="subscription_status" 
                value={formData.subscription_status} 
                onChange={handleChange} 
                options={[
                  { value: "pending", label: locale === "ar" ? "قيد الانتظار (Pending)" : "Pending" },
                  { value: "active", label: locale === "ar" ? "فعال ومسدد (Active / Paid)" : "Active / Paid" },
                  { value: "cancelled", label: locale === "ar" ? "ملغي (Cancelled)" : "Cancelled" },
                  { value: "expired", label: locale === "ar" ? "منتهي الصلاحية (Expired)" : "Expired" }
                ]} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "خطة الاشتراك *" : "Subscription Plan *"}</label>
              <CustomSelect name="plan_id" value={formData.plan_id} onChange={handleChange} options={[{ value: "", label: locale === "ar" ? "اختر خطة" : "Select a plan" }, { value: "1", label: "Free Plan" }, { value: "2", label: "Basic Plan" }]} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "دورة دفع الاشتراك *" : "Subscription billing cycle *"}</label>
              <CustomSelect name="billing_cycle" value={formData.billing_cycle} onChange={handleChange} options={[{ value: "Monthly", label: locale === "ar" ? "شهري" : "Monthly" }, { value: "Yearly", label: locale === "ar" ? "سنوي" : "Yearly" }]} />
            </div>
            
            {/* رفع الشعار */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "الشعار" : "Logo"}</label>
              <input type="file" id={`logo-upload-edit-${nursery.id}`} accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml" className="hidden" onChange={handleFileChange} />
              <div className="flex flex-col gap-3">
                {logoPreview && (
                  <div className="flex items-center gap-4 p-3 border border-border rounded-lg bg-secondary/5">
                    <div className="relative w-12 h-12 shrink-0 border border-border/50 rounded-full overflow-hidden bg-background">
                      <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" unoptimized onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/70 mb-0.5">{locale === "ar" ? "الشعار الحالي" : "Current Logo"}</p>
                      {nursery.logo && !selectedFile && (
                        <>
                           <p className="text-xs font-medium truncate">Media ID: {nursery.logo.id}</p>
                           <a href={getImageUrl(nursery.logo.file_url) || "#"} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline truncate block w-full">{getImageUrl(nursery.logo.file_url)}</a>
                        </>
                      )}
                      {selectedFile && <p className="text-xs font-medium text-primary truncate">{selectedFile.name}</p>}
                    </div>
                    <button onClick={handleRemoveImage} className="shrink-0 p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title={locale === "ar" ? "إزالة" : "Remove"}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
                <label htmlFor={`logo-upload-edit-${nursery.id}`} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary text-primary font-medium cursor-pointer hover:bg-primary/5 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  {fileName ? (locale === "ar" ? "تغيير الصورة" : "Change Image") : (logoPreview ? (locale === "ar" ? "تغيير الشعار" : "Change Logo") : (locale === "ar" ? "رفع الشعار" : "Upload Logo"))}
                </label>
              </div>
            </div>

            {/* باقي الحقول */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "العنوان *" : "Address *"}</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "رقم الهاتف *" : "Phone *"}</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} dir="ltr" className={`w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all ${locale === "ar" ? "text-end" : "text-start"}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">{locale === "ar" ? "الحالة" : "Status"}</label>
              <CustomSelect name="is_active" value={formData.is_active} onChange={handleChange} options={[{ value: "true", label: locale === "ar" ? "نشط" : "Active" }, { value: "false", label: locale === "ar" ? "غير نشط" : "Inactive" }]} />
            </div>
          </div>
          
          {/* أزرار الحفظ والإلغاء */}
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/5">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors">
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={isEditLoading} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30">
              {isEditLoading ? "..." : locale === "ar" ? "حفظ التعديلات" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmAlert isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} isLoading={isDeleteLoading} title={locale === "ar" ? "تأكيد الحذف" : "Confirm Delete"} message={locale === "ar" ? `سيتم حذف حضانة نهائياً.` : `Nursery will be deleted permanently.`} locale={locale} />
    </>
  );
}