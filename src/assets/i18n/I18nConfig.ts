import I18n from 'i18n-js';
import en from './en.json';
import vn from './vn.json';

I18n.defaultLocale = 'vn';
I18n.locale = 'vn';
I18n.fallbacks = true;
I18n.translations = {
  vn,
  en,
};

export function setLocale(locale: string) {
  I18n.locale = locale;
}

export function localize(text: string) {
  return I18n.t(text);
}

export function localizeP(text: string, params: any) {
  return I18n.t(text, params);
}

export default I18n;
