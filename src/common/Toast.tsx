import React, {useEffect, useRef, useState} from 'react';
import {Text, StyleSheet, Animated} from 'react-native';

import {primary, white} from '../constants/Colors';
import Fonts from '../constants/Fonts';
import {isIOS, responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';
import EventRegister from '../helpers/Emitter';
import {getStatusBarHeight} from '../utils/utils';
import ToastModal from './ToastModal';

const HEIGHT =
  (getStatusBarHeight() || 0) +
  (isIOS() ? responsiveHeight(40) : responsiveHeight(45));

const colors: any = {
  info: '#343a40',
  success: primary.bgColor,
  error: '#FE554A',
};

type Message = {
  message: string;
  type: string;
};

const Toast = () => {
  const [messageType, setMessageType] = useState<string>('success');
  const [message, setMessage] = useState<string | undefined>();
  const [modalData, setModalData] = useState<any>();
  const opacity = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(-HEIGHT)).current;
  const frameRef = useRef<any>();

  const displayMessage = (data: Message) => {
    cancelAnimationFrame(frameRef.current);
    setMessage(data.message);
    setMessageType(data.type);

    offset.setValue(HEIGHT * -1);
    frameRef.current = requestAnimationFrame(() => {
      Animated.sequence([
        Animated.delay(100),
        // Fade In
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(offset, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),

        Animated.delay(3000),
        // Fade Out
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(offset, {
            toValue: HEIGHT * -1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  };

  const displayModal = (data: any) => {
    const {title, icon, iconStyle, onPress, style} = data;
    setModalData({title, icon, onPress, iconStyle, style, visible: true});
    setMessageType(data.type);
  };

  const handleCloseModal = () => {
    setModalData({...modalData, visible: false});
  };

  useEffect(() => {
    EventRegister.on('SHOW_TOAST_SUCCESS', displayMessage);
    EventRegister.on('SHOW_TOAST_ERROR', displayMessage);
    EventRegister.on('SHOW_TOAST_INFO', displayMessage);
    EventRegister.on('SHOW_TOAST_MODAL', displayModal);

    return () => {
      EventRegister.rm('SHOW_TOAST_SUCCESS');
      EventRegister.rm('SHOW_TOAST_ERROR');
      EventRegister.rm('SHOW_TOAST_INFO');
      EventRegister.rm('SHOW_TOAST_MODAL');
      setMessage('');
      setModalData({...modalData, visible: false});
    };
  }, []);

  if (!messageType) return null;
  
  if (messageType === 'modal') {
    return (
      <ToastModal
        visible={modalData.visible}
        title={modalData.title}
        icon={modalData.icon}
        iconStyle={modalData.iconStyle}
        onClose={handleCloseModal}
      />
    );
  }
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY: offset}],
          opacity,
          backgroundColor: colors[messageType],
        },
      ]}
      pointerEvents="none">
      <Text style={styles.textStyle}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    minHeight: HEIGHT,
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: responsiveHeight(40),
    paddingHorizontal: responsiveWidth(10),
  },
  textStyle: {
    fontSize: typographies.subhead,
    color: white,
    fontFamily: Fonts.montserratMedium,
    marginBottom: responsiveHeight(12),
    textAlign: 'center',
  },
});
