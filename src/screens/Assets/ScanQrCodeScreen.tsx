import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, Linking} from 'react-native';
import {Button} from 'react-native-elements';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import {white} from '../../constants/Colors';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RootStyles from '../../utils/styles';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Icon from '../../common/Icon';
import RouteKey from '../../constants/RouteKey';

const ScanQRCodeScreen = () => {
  const navigation = useNavigation();
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

  useEffect(() => {
    handleGetCameraPermission();
  }, []);

  useEffect(() => {
    if (barcodes?.length) {
      handleNavigate(barcodes[0]?.displayValue);
    }
  }, [barcodes]);

  const handleGetCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      return Linking.openSettings();
    }
  };

  const handleNavigate = (address: string) => {
    if (address?.includes('ethereum:')) {
      let subAdd = address.substring(9);
      subAdd = subAdd.split('@')[0];
      return navigation.navigate(RouteKey.ConfirmSendScreen, {
        recipient: subAdd,
      });
    }
    navigation.navigate(RouteKey.ConfirmSendScreen, {recipient: address});
  };

  const handleOnClose = () => {
    navigation.goBack();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        isTransparent
        hasLeft={true}
        iconLeftSource={Images.closeIcon}
        iconLeftSize={responsiveWidth(11)}
        title="Scan QrCode"
        onPressLeft={handleOnClose}
      />
      <View style={styles.cameraWrapper}>
        {device && (
          <View>
            <Camera
              style={styles.cameraStyle}
              device={device}
              isActive={true}
              photo={true}
              orientation="portrait"
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
            <View style={styles.iconWrapper}>
              <Icon
                source={Images.qrCodeBorderIcon}
                size={responsiveHeight(298)}
              />
            </View>
          </View>
        )}
      </View>
      <Button
        title={localize('enterReceivingAccount')}
        buttonStyle={[
          RootStyles.primaryButton,
          {marginHorizontal: responsiveWidth(15)},
        ]}
        onPress={() => navigation.goBack()}
        titleStyle={RootStyles.primaryButtonText}
      />
    </Container>
  );
};

export default ScanQRCodeScreen;

const styles = StyleSheet.create({
  container: {},
  cameraStyle: {
    width: responsiveHeight(297),
    height: responsiveHeight(297),
    marginHorizontal: responsiveWidth(50),
    alignSelf: 'center',
  },
  cameraWrapper: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  iconWrapper: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignSelf: 'center',
    marginHorizontal: responsiveWidth(50),
  },
});
