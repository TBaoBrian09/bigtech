/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Text, StyleSheet, ScrollView, View, Linking} from 'react-native';
import {Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {LoadingContext} from '../../context/LoadingContext';
import {useShowError} from '../../hooks/useShowError';
import {updateKYC, uploadFileS3} from '../../utils/Api/ApiManage';
import {ErrorMessage} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {getGenericErrors, getPathFile} from '../../utils/utils';
import DotItem from './components/DotItem';
import Progress from './components/Progress';

interface RecordScreenProps {
  route?: any;
}

const DETAIL = [
  localize('noFilter'),
  localize('dontRecord'),
  localize('dontWearHat'),
];

const TIME = 5;

const RecordScreen = (props: RecordScreenProps) => {
  const {profile, photos} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const scrollViewRef = useRef<any>();
  const cameraRef = useRef<Camera>();
  const blackText = useThemeColor('blackText');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(blackText);

  const devices = useCameraDevices();
  const device = devices.front;

  const [scrollIdx, setScrollIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [videoRecord, setVideoRecord] = useState<any>();

  const {setGlobalIndicator} = useContext(LoadingContext);
  const {showError} = useShowError();

  const format = React.useMemo(() => {
    const desiredWidth = 720;
    const desiredHeight = 480;
    if (device) {
      for (let index = 0; index < device.formats.length; index++) {
        const formats = device.formats[index];
        console.log('h: ' + formats.videoHeight);
        console.log('w: ' + formats.videoWidth);
        if (
          formats.videoWidth === desiredWidth &&
          formats.videoHeight === desiredHeight
        ) {
          console.log('select format: ' + formats);
          return formats;
        }
      }
    }
    return undefined;
  }, [device?.formats]);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    handleCameraPermission();
  }, []);

  const handleCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      return Linking.openSettings();
    }
  };

  const handleNextPage = (page: number) => setScrollIdx(page);

  const handleRecording = () => {
    setTimeLeft(TIME);

    cameraRef?.current?.startRecording({
      fileType: 'mp4',
      flash: 'off',

      onRecordingFinished: video => setVideoRecord(video),
      onRecordingError: error => console.error(error),
    });
    setTimeout(() => {
      cameraRef?.current?.stopRecording();
      setScrollIdx(2);
    }, 5000);
  };

  const handleGoBack = () => {
    if (scrollIdx) {
      handleNextPage(scrollIdx - 1);
      return;
    }
    return navigation.navigate(RouteKey.IDCardScreen, {
      forceRefresh: Date.now(),
      profile,
    });
  };

  const handleGetFileName = (file: any) => {
    return file?.filename || file?.modificationDate || `${Date.now()}`;
  };

  const handleSubmitKYC = async () => {
    try {
      setGlobalIndicator(true);
      const fileAnroidPath = 'file://';
      const photo1Key = await uploadFileS3(
        photos.passport.mime || 'image/jpeg',
        handleGetFileName(photos?.passport),
        fileAnroidPath + photos?.passport?.path,
      );
      const photo2Key = await uploadFileS3(
        photos.selfie.mime || 'image/jpeg',
        handleGetFileName(photos?.selfie),
        fileAnroidPath + photos?.selfie?.path,
      );
      const videoKey = await uploadFileS3(
        'video/mp4',
        `${Date.now()}`,
        getPathFile(videoRecord?.path),
      );
      const formData = new FormData();
      Object.keys(profile).forEach(key =>
        formData.append(`profile[${key}]`, profile[key]),
      );
      formData.append('profile[kycPhoto1]', photo1Key);
      formData.append('profile[kycPhoto2]', photo2Key);
      formData.append('profile[kycVideo]', videoKey);
      await updateKYC(formData);
      navigation.navigate(RouteKey.KYCPendingScreen);
    } catch (e) {
      showError(getGenericErrors(e), ErrorMessage);
      setGlobalIndicator(false);
    } finally {
      setGlobalIndicator(false);
    }
  };

  const renderFirstPage = () => {
    return (
      <ScrollView contentContainerStyle={styles.pageContainerStyle}>
        <Progress
          step={3}
          title={localize('step3')}
          subTitle={localize('recordStep3')}
        />
        <FastImage source={Images.recordIlluIcon} style={styles.image} />
        <Text style={styles.title}>{localize('importantNotes')}</Text>
        {DETAIL?.map(item => (
          <DotItem key={item} title={item} />
        ))}
        <Text style={styles.subTitle}>{localize('recordInstruction')}</Text>
        <Button
          title={localize('start')}
          onPress={() => handleNextPage(1)}
          buttonStyle={RootStyles.primaryButton}
          titleStyle={RootStyles.primaryButtonText}
        />
      </ScrollView>
    );
  };

  const renderSecondPage = () => {
    return (
      <View>
        {device && (
          <Camera
            style={styles.cameraStyle}
            ref={cameraRef}
            format={format}
            device={device}
            isActive={true}
            video={true}
            frameProcessorFps={1}
            hdr={false}
            preset="iframe-960x540"
          />
        )}
        <View style={styles.bottomRecordWrapper}>
          <Text style={styles.cameraTitle}>{localize('positionYourFace')}</Text>
          <Text style={styles.cameraSubTitle}>
            {localize('andKeepIn')} {timeLeft || TIME} {localize('sec')}
          </Text>
          <Icon
            source={Images.bandicamIcon}
            size={responsiveWidth(100)}
            style={{marginTop: responsiveHeight(15)}}
            onPress={handleRecording}
          />
        </View>
      </View>
    );
  };
  const renderSuccessPage = () => {
    return (
      <View style={styles.pageContainerStyle}>
        <View style={styles.successWrapper}>
          <FastImage
            source={Images.registerSuccessIcon}
            style={styles.successIcon}
            resizeMode="contain"
          />
          <Text style={styles.completed}>{localize('completed')}</Text>
        </View>
        <Button
          title={localize('next')}
          onPress={handleSubmitKYC}
          buttonStyle={[
            RootStyles.primaryButton,
            {marginBottom: responsiveHeight(12)},
          ]}
          titleStyle={RootStyles.primaryButtonText}
        />
        <Button
          title={localize('recordAgain')}
          onPress={handleGoBack}
          buttonStyle={[
            RootStyles.primaryButton,
            {backgroundColor: borderGray, marginTop: 0},
          ]}
          titleStyle={[RootStyles.primaryButtonText, {color: primary.color}]}
        />
      </View>
    );
  };

  const renderPage = () => {
    if (scrollIdx === 0) return renderFirstPage();
    if (scrollIdx === 1) return renderSecondPage();
    return renderSuccessPage();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <Header
        hasLeft
        iconLeftColor={primary.color}
        onPressLeft={handleGoBack}
        title={localize('accountVerification')}
      />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEventThrottle={200}
        contentContainerStyle={styles.contentContainerStyle}
        decelerationRate={0}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={false}>
        {renderPage()}
      </ScrollView>
    </Container>
  );
};

export default RecordScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    successWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomRecordWrapper: {
      marginHorizontal: -responsiveWidth(15),
      backgroundColor: blackText,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginTop: responsiveHeight(15),
      paddingBottom: responsiveHeight(30),
    },
    cameraStyle: {
      width: Layout.window.width - responsiveWidth(30),
      height: responsiveHeight(450),
      marginHorizontal: responsiveWidth(15),
      borderRadius: responsiveWidth(15),
    },
    pageContainerStyle: {
      width: Layout.window.width,
      paddingHorizontal: responsiveWidth(15),
    },
    contentContainerStyle: {paddingTop: responsiveHeight(20)},
    contentWrapper: {
      marginLeft: responsiveWidth(10),
      marginTop: responsiveHeight(-15),
    },
    successIcon: {
      width: responsiveWidth(250),
      height: responsiveHeight(300),
      marginTop: responsiveHeight(20),
    },
    image: {
      marginTop: responsiveHeight(30),
      width: responsiveWidth(160),
      height: responsiveWidth(160),
      alignSelf: 'center',
      marginBottom: responsiveHeight(26),
    },
    circleProgressWrapper: {
      ...RootStyles.rowStyle,
      alignSelf: 'flex-start',
      marginBottom: responsiveHeight(6),
    },
    tapToText: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subhead,
    },
    text: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subTitle,
    },
    title: {
      fontSize: typographies.body,
      color: blackText,
      fontFamily: Fonts.montserratSemiBold,
      textAlign: 'left',
      marginBottom: responsiveHeight(20),
    },
    subTitle: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      textAlign: 'left',
      lineHeight: responsiveHeight(20),
      marginTop: responsiveHeight(30),
    },
    cameraTitle: {
      fontFamily: Fonts.montserratRegular,
      color: white,
      fontSize: typographies.body,
      textAlign: 'center',
      marginTop: responsiveHeight(60),
      marginBottom: responsiveHeight(10),
    },
    cameraSubTitle: {
      fontFamily: Fonts.montserratMedium,
      color: white,
      fontSize: typographies.subhead,
      textAlign: 'center',
    },
    completed: {
      fontFamily: Fonts.montserratSemiBold,
      color: blackText,
      fontSize: typographies.body,
      textAlign: 'center',
      marginTop: responsiveHeight(20),
      marginBottom: responsiveHeight(50),
    },
  });
