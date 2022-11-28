/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from 'react-query';
import ImageCropPicker from 'react-native-image-crop-picker';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {useGetMe} from '../../hooks/useQueries';
import {User} from '../../models/user';
import RootStyles from '../../utils/styles';
import {
  formatDate,
  getGenericErrors,
  handleCheckCameraPermission,
} from '../../utils/utils';
import ProfileItem from './components/ProfileItem';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useShowError} from '../../hooks/useShowError';
import {ErrorMessage} from '../../utils/Constants';
import {LoadingContext} from '../../context/LoadingContext';
import {getFile, updateKYC} from '../../utils/Api/ApiManage';
import FastImage from 'react-native-fast-image';

const MyProfileScreen = () => {
  const lightGrayBg = useThemeColor('lightGrayBg');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, lightGrayBg);
  const {data} = useGetMe();
  const queryClient = useQueryClient();
  const profileData = data?.data as User;

  const navigation = useNavigation<any>();
  const {showError} = useShowError();
  const {setGlobalIndicator} = useContext(LoadingContext);

  const fileURL = getFile(profileData?.profile?.avatar);

  const handleNavigateVerifyPhoneOTP = () => {
    if (!profileData?.phoneNumber) {
      return navigation.navigate(RouteKey.UpdateEmailScreen, {
        phoneNumber: profileData?.phoneNumber,
        isPhoneNumber: true,
      });
    }
    if (profileData?.phoneNumber && !profileData?.isPhoneVerified) {
      return navigation.navigate(RouteKey.VerifyOTPScreen, {
        tempUsername:
          '+' +
          profileData?.phoneNumber?.callingCode +
          profileData?.phoneNumber?.number,
        isUseEmail: false,
      });
    }
    return;
  };

  const handleNavigateEmailOTP = () => {
    if (!profileData?.email) {
      return navigation.navigate(RouteKey.UpdateEmailScreen, {
        email: profileData?.email,
        isPhoneNumber: false,
      });
    }
    if (profileData?.email && !profileData?.isEmailVerified) {
      return navigation.navigate(RouteKey.VerifyOTPScreen, {
        tempUsername: profileData?.email,
        isUseEmail: true,
      });
    }
    return;
  };

  const listItems = [
    {
      title: localize('name'),
      content: profileData?.profile?.name,
    },
    {
      title: localize('userName'),
      content: profileData?.id,
      small: true,
      onPress: () => {
        Clipboard.setString(profileData?.id);
        ToastEmitter.success(localize('copied'));
      },
    },
    {
      title: localize('accountType'),
      content: localize('individual'),
      checked: true,
    },
    {
      title: localize('email'),
      content: profileData?.email,
      checked: !!profileData?.isEmailVerified,
      // hasArrowRight: !profileData?.isEmailVerified,
      hasArrowRight: !profileData?.email,
      onPress: handleNavigateEmailOTP,
    },
    {
      title: localize('phoneNumber'),
      content: profileData?.phoneNumber
        ? `+${profileData?.phoneNumber?.callingCode} ${profileData?.phoneNumber?.number}`
        : undefined,
      checked: !!profileData?.isPhoneVerified,
      hasArrowRight: !profileData?.phoneNumber,
      onPress: handleNavigateVerifyPhoneOTP,
    },
  ];

  const optionalItems = [
    {
      title: localize('joinedBTG'),
      content: !!profileData && formatDate(profileData?.createdAt),
      checked: true,
    },
  ];

  const handleUploadAvatar = async (file: any) => {
    try {
      const fileName =
        file?.filename || file?.modificationDate || `${Date.now()}`;
      const fileAnroidPath = 'file://';
      setGlobalIndicator(true);
      const formData = new FormData();
      formData.append('avatar', {
        name: fileName,
        type: file.mime || 'image/jpeg',
        uri: fileAnroidPath + file?.path,
      });
      await updateKYC(formData);
      queryClient.invalidateQueries('me');
    } catch (e) {
      console.log('avatar', e);
      showError(getGenericErrors(e), ErrorMessage);
    } finally {
      setGlobalIndicator(false);
    }
  };

  const handleUpdateProfile = async () => {
    const hasPermission = await handleCheckCameraPermission();
    if (hasPermission) {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        compressImageQuality: 0.6,
        compressImageMaxWidth: 600,
        compressImageMaxHeight: 600,
        forceJpg: true,
      })
        .then(async image => {
          handleUploadAvatar(image);
          console.log('image', image);
        })
        .catch(() => {});
    }
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('myProfile')} />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: responsiveWidth(16)}}>
        <TouchableOpacity
          style={[
            RootStyles.rowStyle,
            {
              marginBottom: responsiveHeight(16),
              borderBottomWidth: StyleSheet.hairlineWidth,
              paddingBottom: responsiveHeight(12),
            },
          ]}
          onPress={handleUpdateProfile}>
          <View style={styles.profileContentWrapper}>
            <Text style={styles.name}>{localize('avatar')}</Text>
          </View>
          {profileData?.profile?.avatar ? (
            <FastImage source={{uri: fileURL}} style={styles.avatar} />
          ) : (
            <Icon source={Images.profileIcon} style={styles.avatar} />
          )}
          <Icon
            source={Images.arrowRightBlackIcon}
            style={{
              width: responsiveWidth(12),
              height: responsiveHeight(21),
              marginLeft: responsiveWidth(20),
            }}
          />
        </TouchableOpacity>
        {listItems.map((item, index) => {
          return <ProfileItem key={'profile_' + index} {...item} />;
        })}
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: responsiveHeight(32),
          }}
        />
        {optionalItems.map((item, index) => {
          return <ProfileItem key={'profile_optional_' + index} {...item} />;
        })}
      </ScrollView>
    </Container>
  );
};

export default MyProfileScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    profileContentWrapper: {flex: 1},
    avatar: {
      width: responsiveWidth(72),
      height: responsiveWidth(72),
      borderRadius: responsiveWidth(40),
    },
    name: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subTitle,
    },
  });
