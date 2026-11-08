"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  translations: {
    email: string;
    password: string;
    login_btn: string;
  };
  // إضافة locale اختياري للتوجيه بعد النجاح بدون تخريب الكود القديم
  locale?: string;
}

export default function LoginForm({ translations, locale = "ar" }: LoginFormProps) {
  const router = useRouter();

  // حالة التحكم بإظهار أو إخفاء كلمة المرور
  const [showPassword, setShowPassword] = useState(false);

  // حالات ربط البيانات مع الباك إند
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // دالة إرسال البيانات للباك إند
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      //تم تعديل الرابط ليطابق مسار Postman بالضبط
      const response = await fetch("https://epidural-anointer-shrunk.ngrok-free.dev/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // تم إضافة فحص data.success بناءً على استجابة الباك إند
      if (!response.ok || data.success === false) {
        throw new Error(data.message || "فشل تسجيل الدخول، تأكد من صحة البيانات.");
      }

      // 1. حفظ التوكن
      localStorage.setItem("token", data.data.token);

      // 2. التعديل الجديد: حفظ اسم المستخدم في الـ localStorage ليعرضه الـ Header
      // يتم البحث عن الاسم داخل استجابة الباك إند (admin أو user أو name مباشر)
      const currentName = data.data.admin?.name || data.data.user?.name || data.data.name || "Admin";
      localStorage.setItem("userName", currentName);

      // التوجيه إلى لوحة التحكم
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ غير متوقع.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* رسالة الخطأ تظهر فقط عند فشل الدخول بتصميم بسيط لا يؤثر على الكلاسات الأساسية */}
      {error && (
        <div className="text-red-500 text-sm font-semibold text-start px-2">
          {error}
        </div>
      )}

      {/* حقل البريد الإلكتروني */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-2"
        >
          {translations.email}
        </label>
        <div className="relative">
          {/* أيقونة الإيميل */}
          <div className="absolute inset-y-0 inset-s-0 flex items-center ps-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full ps-11 pe-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-start"
            placeholder={translations.email}
          />
        </div>
      </div>

      {/* حقل كلمة المرور */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground mb-2"
        >
          {translations.password}
        </label>
        <div className="relative">
          {/* زر أيقونة القفل (قابل للنقر ويغير شكله) */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 inset-s-0 flex items-center ps-4 cursor-pointer text-foreground/50 hover:text-primary transition-colors z-10"
            title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          >
            {showPassword ? (
              // أيقونة القفل المفتوح
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
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            ) : (
              // أيقونة القفل المغلق
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </button>

          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full ps-11 pe-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-start"
            placeholder={translations.password}
          />
        </div>
      </div>

      {/* زر تسجيل الدخول */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-secondary text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "..." : translations.login_btn}
      </button>
    </form>
  );
}