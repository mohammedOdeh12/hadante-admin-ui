import initTranslations from "../../i18n";
import Image from "next/image";
import LoginForm from "./LoginForm"; // استيراد الفورم التفاعلي

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // جلب الترجمة
  const { t } = await initTranslations(locale, ["common"]);
  
  const isRtl = locale === "ar";

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center  p-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      
      {/* الشعار (Logo) */}
      <div className="mb-8">
        <Image
          src="/logo.avif"
          alt="شعار هادانتي"
          width={300}
          height={110}
          priority
          className="object-contain drop-shadow-md"
        />
      </div>

      {/* حاوية الـ Card */}
      <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-xl p-8">
        
        {/* الترويسة (Header) */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("title")}
          </h1>
          <p className="text-foreground/70">
            {t("subtitle")}
          </p>
        </div>

        {/* استدعاء نموذج تسجيل الدخول وتمرير الترجمات واللغة له */}
        <LoginForm 
          locale={locale} // تمت إضافة المتغير هنا
          translations={{
            email: t("email"),
            password: t("password"),
            login_btn: t("login_btn")
          }}
        />

        {/* زر التبديل بين اللغات */}
        <div className="mt-6 text-center">
          <a 
            href={locale === "ar" ? "/en/login" : "/ar/login"} 
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            {locale === "ar" ? "Switch to English" : "التبديل للعربية"}
          </a>
        </div>

      </div>
    </div>
  );
}