import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import FCMServices from './FCMServices';

const LocalNotificationService = () => {
  const configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.log(err.message, err);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  useEffect(() => {
    configure();
    const unsubscribe = FCMServices.onReceiveNotification();
    return () => {
      FCMServices.removeNotification();
      unsubscribe;
    };
  }, []);

  return null;
};

export default LocalNotificationService;
