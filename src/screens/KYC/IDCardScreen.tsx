/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image as RNImage,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Portal} from 'react-native-portalize';
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
  isIOS,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import RootStyles from '../../utils/styles';
import {handleCheckCameraPermission} from '../../utils/utils';
import Progress from './components/Progress';
import CustomModal from './Modals/CustomModal';

const PASSPORT = [
  {title: localize('uploadPhoto')},
  {title: localize('takePhoto')},
];

interface IDCardScreenProps {
  route?: any;
}

const INITIAL = {
  passport: null,
  selfie: null,
};

const IDCardScreen = (props: IDCardScreenProps) => {
  const {forceRefresh, profile} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const passportRef = useRef<any>();
  const selfieRef = useRef<any>();
  const scrollViewRef = useRef<any>();
  const cameraRef = useRef<Camera>();
  const devices = useCameraDevices();
  const device = devices.front;

  const blackText = useThemeColor('blackText');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(blackText, borderGray);

  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [scrollIdx, setScrollIdx] = useState(0);
  const [photos, setPhotos] = useState<any>({
    passport: null,
    selfie: null,
  });
  const [photoKey, setPhotoKey] = useState<string>('passport');
  const [documentType, setDocumentType] = useState<string>('');

  useEffect(() => {
    setPhotos(INITIAL);
  }, [forceRefresh]);

  useEffect(() => {
    if (profile) setDocumentType(profile?.documentType);
  }, [profile]);

  useEffect(() => {
    if (photos?.passport && photos?.selfie) {
      handleNavigateRecordScreen();
    }
  }, [photos]);

  const handleGetDocumentType = (type: string) => {
    if (type === 'Passport') return 'passport';
    return 'idCard';
  };

  const handleNavigateRecordScreen = () => {
    navigation.navigate(RouteKey.RecordScreen, {
      photos,
      profile: {
        ...profile,
        documentType: handleGetDocumentType(profile?.documentType),
      },
    });
  };

  const handleSelectItem = (item: any, key: string) => {
    if (item?.title === localize('uploadPhoto')) {
      return handleOpenImagePicker(key);
    }
    return handleOpenCamera();
  };

  const takePhotos = async () => {
    try {
      const photo = await cameraRef?.current?.takePhoto({
        enableAutoRedEyeReduction: true,
      });
      setPhotos({...photos, [photoKey]: photo});
      setScrollIdx(0);
    } catch (e) {
      setPhotos({...photos, [photoKey]: null});
      console.log('error', e);
    }
  };

  const handleOpenCamera = async () => {
    const permission = await Camera.requestCameraPermission();
    console.log('permission', permission);
    if (permission === 'denied') {
      return Linking.openSettings();
    }
    const hasPermission = await handleCheckCameraPermission();
    if (hasPermission) {
      passportRef?.current?.close();
      setCameraVisible(true);
      setScrollIdx(1);
    }
  };

  const handleOpenImagePicker = async (key: string) => {
    const hasPermission = await handleCheckCameraPermission();
    if (hasPermission) {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.5,
        compressImageMaxWidth: 500,
        compressImageMaxHeight: 500,
        forceJpg: true,
      })
        .then(async image => {
          console.log('image', image);
          setPhotos({...photos, [key]: image});
        })
        .catch(() => {
          setPhotos({...photos, [key]: null});
        });
    }
  };

  const handleOpenModal = (key: string) => {
    setPhotoKey(key);
    if (key === 'passport') {
      return passportRef?.current?.open();
    }
    return selfieRef?.current?.open();
  };

  const handleGoBack = () => {
    if (scrollIdx) {
      setScrollIdx(scrollIdx - 1);
      return;
    }
    return navigation.goBack();
  };

  const showImagePicker = (title: string, keyItem: string) => {
    if (photos[keyItem]) {
      const fileAnroidPath = 'file://';
      const getPhotoURI = !isIOS()
        ? photos[keyItem]?.path?.includes('file://')
          ? photos[keyItem]?.path
          : fileAnroidPath + photos[keyItem]?.path
        : photos[keyItem]?.path;
      return (
        <TouchableOpacity onPress={() => handleOpenModal(keyItem)}>
          <View style={styles.retakeWrapper}>
            <RNImage
              source={{uri: getPhotoURI}}
              style={styles.uploadImage}
              resizeMode="stretch"
            />
          </View>
          <View style={styles.imagePickerWrapper}>
            <FastImage source={Images.cameraIcon} style={styles.cameraIcon} />
            <Text style={styles.retakeTitle}>{localize('retakePhoto')}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <View>
        <TouchableOpacity
          style={styles.uploadStyle}
          onPress={() => handleOpenModal(keyItem)}>
          <FastImage source={Images.cameraIcon} style={styles.cameraIcon} />
          <Text style={styles.tapToText}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showCamera = useCallback(() => {
    if (cameraVisible) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Camera
            style={styles.cameraStyle}
            ref={cameraRef}
            device={devices.back}
            isActive={true}
            photo={true}
            orientation="portrait"
          />
          <Text style={styles.cameraTitle}>
            {photoKey === 'selfie'
              ? localize('selfieStraight')
              : localize('documentFront')}
          </Text>
          <Text style={styles.cameraSubTitle}>
            {localize('positionYourPhoto')}
          </Text>
          <Icon
            source={Images.bandicamIcon}
            size={responsiveWidth(100)}
            style={{marginTop: responsiveHeight(15)}}
            onPress={takePhotos}
          />
        </View>
      );
    }
  }, [scrollIdx, cameraVisible, photoKey]);

  const renderFirstPage = useCallback(() => {
    return (
      <ScrollView contentContainerStyle={styles.pageContainerStyle}>
        <Progress
          step={2}
          title={localize('step2')}
          subTitle={localize('takeAPhotoOfYourInfo')}
        />
        <Text style={styles.title}>
          {localize('toBeginVerificationProcess')}
        </Text>
        {showImagePicker(localize(`document.${documentType}`), 'passport')}
        {showImagePicker(localize(`document.${documentType}2`), 'selfie')}
      </ScrollView>
    );
  }, [scrollIdx, photos]);

  const renderPage = () => {
    if (scrollIdx === 0) return renderFirstPage();
    return showCamera();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
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
      <Portal>
        <CustomModal
          ref={passportRef}
          data={PASSPORT}
          keyItem={'passport'}
          onPress={handleSelectItem}
        />
        <CustomModal
          ref={selfieRef}
          data={PASSPORT}
          keyItem={'selfie'}
          onPress={handleSelectItem}
        />
      </Portal>
    </Container>
  );
};

export default IDCardScreen;

const getStyles = (blackText: string, borderGray: string) =>
  StyleSheet.create({
    container: {},
    pageContainerStyle: {
      width: Layout.window.width,
      paddingHorizontal: responsiveWidth(15),
    },
    cameraStyle: {
      width: Layout.window.width - responsiveWidth(100),
      height: responsiveHeight(400),
      marginHorizontal: responsiveWidth(50),
      borderRadius: responsiveWidth(15),
    },
    contentWrapper: {
      marginLeft: responsiveWidth(10),
      marginTop: responsiveHeight(-15),
    },
    imagePickerWrapper: {
      ...RootStyles.rowStyle,
      justifyContent: 'center',
      marginBottom: responsiveHeight(15),
    },
    retakeWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginBottom: responsiveHeight(15),
      backgroundColor: borderGray,
    },
    contentContainerStyle: {paddingTop: responsiveHeight(20)},
    uploadImage: {
      width: responsiveWidth(120),
      height: responsiveHeight(180),
    },
    uploadStyle: {
      minHeight: responsiveHeight(145),
      paddingVertical: responsiveHeight(50),
      width: Layout.window.width - responsiveWidth(30),
      borderRadius: responsiveWidth(2),
      borderStyle: 'dashed',
      borderColor: primary.color,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: responsiveHeight(10),
      backgroundColor: 'rgba(80, 111, 225, 0.03)',
    },
    cameraIcon: {
      width: responsiveWidth(14),
      height: responsiveWidth(12),
      marginRight: responsiveWidth(6),
    },
    title: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.footnote,
      textAlign: 'center',
      marginBottom: responsiveHeight(45),
      marginTop: responsiveHeight(10),
    },
    tapToText: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subhead,
    },
    cameraTitle: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.body,
      textAlign: 'center',
      marginTop: responsiveHeight(60),
      marginBottom: responsiveHeight(10),
    },
    cameraSubTitle: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subhead,
      textAlign: 'center',
    },
    retakeTitle: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.footnote,
      textAlign: 'center',
    },
  });
