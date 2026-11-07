import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Hadante Admin",
    default: "Hadante Admin",
  },
  description: "نظام إدارة الحضانات الذكي - لوحة تحكم المشرف العام",
  robots: {
    index: false, 
    follow: false,
  },
};

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

// استخدام Promise<any> لتخطي خطأ التحقق من Next.js
type Props = {
  children: React.ReactNode;
params: Promise<Record<string, string | undefined>>;};

export default async function RootLayout({
  children,
  params,
}: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "ar"; // قيمة افتراضية لتجنب الأخطاء
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}