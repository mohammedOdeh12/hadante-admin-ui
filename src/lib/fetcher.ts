import { cookies } from 'next/headers';
import Cookies from 'js-cookie';

export async function customFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  let token = '';

  // التحقق مما إذا كان الكود يعمل في السيرفر أو المتصفح لجلب التوكن بشكل صحيح
  if (typeof window === 'undefined') {
    // Server-side (استخدام next/headers)
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value || '';
  } else {
    // Client-side (استخدام js-cookie)
    token = Cookies.get('token') || '';
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  // معالجة أخطاء الـ HTTP
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'حدث خطأ أثناء الاتصال بالخادم');
  }

  // إذا كان الطلب ناجحاً ولا يحتوي على بيانات (مثل حالة الحذف 204)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}