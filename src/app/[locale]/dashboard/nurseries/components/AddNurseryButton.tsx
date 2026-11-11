"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "../../components/ui/Modal";
import CustomSelect from "../../components/ui/CustomSelect";

export default function AddNurseryButton({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [fileName, setFileName] = useState(""); 
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan_id: "",
    billing_cycle: "Monthly",
    billing_start_date: "",
    address: "",
    phone: "",
    main_color: "",
    is_active: "true",
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
    const fileInput = document.getElementById("logo-upload-add") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // دالة مساعدة لرفع الصورة لمسار الميديا
  const uploadMediaFile = async (token: string, apiUrl: string) => {
    if (!selectedFile) return null;
    
    const mediaFormData = new FormData();
    mediaFormData.append("file", selectedFile);
    
    const response = await fetch(`${apiUrl}/api/admin/media`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
        },
        body: mediaFormData,
    });
    
    const data = await response.json();
    if (!response.ok || data.success === false) {
        throw new Error(data.message || "فشل في رفع الصورة");
    }
    return data.data.id; // نرجع الـ id الخاص بالميديا
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://epidural-anointer-shrunk.ngrok-free.dev";

      // 1. رفع الصورة أولاً إذا تم اختيارها
      let uploadedLogoId = null;
      if (selectedFile && token) {
          uploadedLogoId = await uploadMediaFile(token, apiUrl);
      }

      // 2. تجهيز البيانات كـ JSON عادي (تراجعنا عن الـ FormData هنا)
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        main_color: formData.main_color,
        is_active: formData.is_active === "true",
        logo_id: uploadedLogoId // إرسال הـ id الخاص بالصورة المرفوعة
      };

      const response = await fetch(`${apiUrl}/api/admin/nurseries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload), 
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "فشل في إضافة الحضانة");
      }

      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setIsLoading(false);
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-secondary text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
      >
        {locale === "ar" ? "إضافة حضانة" : "Add Nursery"}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={locale === "ar" ? "إنشاء حضانة جديدة" : "Create New Nursery"}
        locale={locale}
      >
        <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "اسم الحضانة *" : "Nursery Name *"}
              </label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" placeholder={locale === "ar" ? "أدخل اسم الحضانة" : "Enter nursery name"} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "البريد الإلكتروني *" : "Email *"}
              </label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" placeholder="info@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "خطة الاشتراك *" : "Subscription Plan *"}
              </label>
              <CustomSelect
                name="plan_id"
                value={formData.plan_id}
                onChange={handleChange}
                options={[
                  { value: "", label: locale === "ar" ? "اختر خطة" : "Select a plan" },
                  { value: "1", label: "Free Plan" },
                  { value: "2", label: "Basic Plan" }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "دورة دفع الاشتراك *" : "Subscription billing cycle *"}
              </label>
              <CustomSelect
                name="billing_cycle"
                value={formData.billing_cycle}
                onChange={handleChange}
                options={[
                  { value: "Monthly", label: locale === "ar" ? "شهري" : "Monthly" },
                  { value: "Yearly", label: locale === "ar" ? "سنوي" : "Yearly" }
                ]}
              />
              <p className="text-xs text-foreground/50 mt-1.5 text-start">
                {locale === "ar" ? "الشهري: فترات شهر تقويمي متجددة. السنوي: سنة كاملة من تاريخ الاستحقاق." : "Monthly: rolling one-calendar-month periods. Yearly: full year from anchor date."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "تاريخ بدء الفوترة (اختياري)" : "Billing start date (optional)"}
              </label>
              <input type="date" name="billing_start_date" value={formData.billing_start_date} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" />
              <p className="text-xs text-foreground/50 mt-1.5 text-start">
                {locale === "ar" ? "اتركه فارغاً لتبدأ الفترات من اليوم على الخادم." : "YYYY-MM-DD. Leave empty: periods start from today on the server."}
              </p>
            </div>

            {/* حقل رفع الشعار مع المعاينة */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "الشعار" : "Logo"}
              </label>
              
              <input 
                type="file" 
                id="logo-upload-add" 
                accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="relative w-16 h-16 shrink-0 border border-border rounded-lg overflow-hidden bg-secondary/5">
                    <Image 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      fill
                      className="object-contain p-1"
                      unoptimized 
                    />
                    <button 
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 transform scale-75 hover:scale-90 transition-transform"
                      title={locale === "ar" ? "إزالة" : "Remove"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
                
                <label 
                  htmlFor="logo-upload-add"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary text-primary font-medium cursor-pointer hover:bg-primary/5 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {fileName ? (locale === "ar" ? "تغيير الصورة" : "Change Image") : (locale === "ar" ? "رفع الشعار" : "Upload Logo")}
                </label>
              </div>

              {fileName && <p className="text-xs font-medium text-primary mt-1.5 text-start truncate">{fileName}</p>}
              
              <p className="text-xs text-foreground/50 mt-1.5 text-start">
                Supported formats: JPEG, PNG, GIF, WebP, SVG (Max: 10MB)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "العنوان" : "Address"}
              </label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all text-start" placeholder={locale === "ar" ? "أدخل عنوان الحضانة" : "Enter nursery address"} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "رقم الهاتف" : "Phone"}
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} dir="ltr" className={`w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all ${locale === "ar" ? "text-end" : "text-start"}`} placeholder={locale === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "اللون الرئيسي (Hex)" : "Main Color (Hex)"}
              </label>
              <input type="text" name="main_color" value={formData.main_color} onChange={handleChange} dir="ltr" className={`w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/40 outline-none transition-all ${locale === "ar" ? "text-end" : "text-start"}`} placeholder="#FF5733" />
              <p className="text-xs text-foreground/50 mt-1.5 text-start">
                {locale === "ar" ? "تنسيق اللون السداسي (مثال: #FF5733)" : "Hex color format (e.g., #FF5733)"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 text-start">
                {locale === "ar" ? "الحالة" : "Status"}
              </label>
              <CustomSelect
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                options={[
                  { value: "true", label: locale === "ar" ? "نشط" : "Active" },
                  { value: "false", label: locale === "ar" ? "غير نشط" : "Inactive" }
                ]}
              />
            </div>

          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-secondary/5">
            <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-foreground/5 transition-colors">
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-30">
              {isLoading ? "..." : locale === "ar" ? "إضافة حضانة" : "Add Nursery"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}