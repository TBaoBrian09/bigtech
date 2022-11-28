import EventRegister from './Emitter';

const ToastEmitter = {
  success: (text: string) => {
    EventRegister.emit('SHOW_TOAST_SUCCESS', {message: text, type: 'success'});
  },
  error: (text: string) => {
    EventRegister.emit('SHOW_TOAST_ERROR', {message: text, type: 'error'});
  },
  info: (text: string) => {
    EventRegister.emit('SHOW_TOAST_INFO', {message: text, type: 'info'});
  },
  modal: ({title, icon, onPress, iconStyle, style}: any) => {
    EventRegister.emit('SHOW_TOAST_MODAL', {
      title,
      icon,
      iconStyle,
      onPress,
      style,
      type: 'modal',
    });
  },
};

export default ToastEmitter;
