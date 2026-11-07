import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

export default async function initTranslations(
  locale: string,
  namespaces: string[]
) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: locale,
      fallbackLng: 'ar',
      supportedLngs: ['ar', 'en'],
      defaultNS: namespaces[0],
      ns: namespaces,
      resources: {
        ar: { common: (await import(`../locales/ar/common.json`)).default },
        en: { common: (await import(`../locales/en/common.json`)).default }
      }
    });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t
  };
}