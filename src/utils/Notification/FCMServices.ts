import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import {isIOS} from '../../constants/Layout';

type Notification = {
  /**
   * The notification title.
   */
  title?: string;

  /**
   * The native localization key for the notification title.
   */
  titleLocKey?: string;

  /**
   * Any arguments that should be formatted into the resource specified by titleLocKey.
   */
  titleLocArgs?: string[];

  /**
   * The notification body content.
   */
  body?: string;
};

async function androidRequestPermission() {
  PushNotification.requestPermissions();
}

async function requestPermission() {
  messaging().registerDeviceForRemoteMessages();

  const authStatus = await messaging().requestPermission();
  console.log(authStatus, messaging.AuthorizationStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

async function hasPermission() {
  messaging().registerDeviceForRemoteMessages;
  const authStatus = await messaging().hasPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

async function getToken() {
  const fcmToken = await messaging().getToken();
  return fcmToken;
}

const showNotification = (notification: Notification | undefined) => {
  PushNotification.localNotification({
    title: notification?.title, // (optional)
    message: notification?.body || '',
  });
};

const onReceiveNotification = () => {
  //When app is running but in background
  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   if (remoteMessage) {
  //     const notification = remoteMessage.notification;
  //     showNotification(notification);
  //   }
  // });

  //When app is opened from a quit state
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage) {
      console.log(remoteMessage);
    }
  });

  messaging().onMessage(remoteMessage => {
    console.log('%c NotificationService', 'color:#4AF82F', remoteMessage);
    if (remoteMessage) {
      const notification = remoteMessage.notification;
      showNotification(notification);
    }
  });
};

const unRegister = () => {
  PushNotification.unregister();
  if (isIOS()) {
    PushNotificationIOS.removeAllPendingNotificationRequests();
    PushNotificationIOS.removeAllDeliveredNotifications();
  } else {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.removeAllDeliveredNotifications();
  }
};

const removeNotification = () => {
  unRegister();
  // if (isIOS()) PushNotificationIOS.removeAllDeliveredNotifications();
  // else PushNotification.cancelAllLocalNotifications();
};

export default {
  requestPermission,
  androidRequestPermission,
  hasPermission,
  getToken,
  onReceiveNotification,
  removeNotification,
};
