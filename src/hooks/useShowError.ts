import {localize} from '../assets/i18n/I18nConfig';
import ToastEmitter from '../helpers/ToastEmitter';

export const useShowError = () => {
  const showError = (genericErrors: string[], message: string) => {
    if (genericErrors.length !== 0) {
      genericErrors.forEach(error => {
        const erroMessage = localize(error?.message);
        ToastEmitter.error(erroMessage);
      });
    } else {
      ToastEmitter.error(message);
    }
  };
  return {showError};
};
