/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text, Alert, Linking} from 'react-native';
import {Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import TouchID from 'react-native-touch-id';

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
import {UserContext} from '../../context/UserContext';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useGetMe} from '../../hooks/useQueries';
import {User} from '../../models/user';
import {NavigationRoot} from '../../navigation/root';
import {getFile} from '../../utils/Api/ApiManage';
import RootStyles from '../../utils/styles';
import {
  BASIC_SETTING,
  GROUP_EXCLUSIVE,
  OTHERS,
  SECURITY,
} from './components/Constants';
import SettingItem from './components/SettingItem';

interface ChangePasswordScreenProps {
  route?: any;
}

const SettingScreen = (props: ChangePasswordScreenProps) => {
  const {forceRefresh} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const lightGrayBg = useThemeColor('lightGrayBg');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, lightGrayBg);

  // const [userData, setUserData] = useState<any>();
  const [hasBiometric, setBiometric] = useState<boolean>(false);
  const [notification, setNotification] = useState<boolean>(false);

  const {setUserData} = useContext(UserContext);
  const {data, refetch} = useGetMe();
  const userData = data?.data as User;
  const fileURL = getFile(userData?.profile?.avatar);

  useEffect(() => {
    handleGetBiometric();
    refetch();
  }, [forceRefresh]);

  const handleGetBiometric = async () => {
    const savedAccount = await AsyncStorage.getItem('savedAccount');
    if (savedAccount) setBiometric(true);
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
    setUserData({});
    NavigationRoot.logout();
  };

  const handleNavigationGoBack = () => {
    navigation.navigate(RouteKey.HomeScreen);
  };

  const handleRemoveBiometric = async () => {
    await AsyncStorage.removeItem('password');
    setBiometric(false);
  };

  const checkTouchIDIsSupported = async () => {
    try {
      const check = await TouchID.isSupported();
      if (!check) {
        ToastEmitter.error(localize('notSupportedOnYourDevice'));
        return false;
      }
      return true;
    } catch (e) {
      ToastEmitter.error(localize('notSupportedOnYourDevice'));
      return false;
    }
  };

  const handleToggle = async (item: any) => {
    if (item.title === 'touchID') {
      const checkIsSupport = await checkTouchIDIsSupported();
      if (!checkIsSupport) return;
      if (!hasBiometric) return navigation.navigate(RouteKey.TouchIDScreen);
      return Alert.alert(
        localize('areYouSureToTurnOffFaceId'),
        localize('allSavedDataWillBeDeleted'),
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: handleRemoveBiometric},
        ],
      );
    }
  };
  const hanleSecurityPress = (title: string, route: any) => {
    if (title === 'accountVerificationKYC') {
      if (userData?.profile?.verifyStatus === 'rejected') {
        return navigation.navigate(RouteKey.RejectedScreen, {
          rejectedReson: userData?.profile?.rejectReason,
        });
      }
      if (userData?.profile?.verifyStatus === 'uploaded') {
        return navigation.navigate(RouteKey.KYCPendingScreen as never);
      }
      if (userData?.profile?.verifyStatus === 'verified') {
        return navigation.navigate(RouteKey.KYCSuccessScreen as never);
      }
      return navigation.navigate(route);
    }
    return navigation.navigate(route);
  };

  const handleOtherPress = (title?: string, route?: any, params?: any) => {
    if (!title) {
      return Linking.openURL(`tel://0911888842`);
    }
    return navigation.navigate(route, {params});
  };

  /**
   * =============================================
   * Render UI
   * =============================================
   */

  const showProfile = () => {
    return (
      <View style={[RootStyles.rowStyle, {marginBottom: responsiveHeight(16)}]}>
        {userData?.profile?.avatar ? (
          <FastImage source={{uri: fileURL}} style={styles.avatar} />
        ) : (
          <Icon source={Images.profileIcon} style={styles.avatar} />
        )}
        <View style={styles.profileContentWrapper}>
          <Text style={styles.name}>{userData?.profile?.name}</Text>
        </View>
      </View>
    );
  };

  const SectionHeader = React.useCallback(({title}) => {
    return <Text style={styles.sectionHeader}>{title}</Text>;
  }, []);

  const showBasicSetting = () => {
    return (
      <View style={styles.wrapper}>
        {BASIC_SETTING?.map((item, index) => (
          <SettingItem
            key={item.title + index}
            icon={item.icon}
            title={localize(item.title)}
            hasArrowRight={item.hasArrowRight}
            hasShowCurrency={item.hasShowCurrency}
            currentCurrency={item.currentCurrency}
            onPress={() => item.route && navigation.navigate(item.route)}
          />
        ))}
      </View>
    );
  };

  const showSecuritySetting = () => {
    return (
      <View style={styles.wrapper}>
        {SECURITY?.map((item, index) => (
          <SettingItem
            key={item.title + index}
            disabled={item.disabled}
            icon={item.icon}
            title={localize(item.title)}
            hasArrowRight={item.hasArrowRight}
            hasToggle={item.hasToggle}
            isEnabled={item.title === 'touchID' ? hasBiometric : notification}
            onToggle={() => handleToggle(item)}
            onPress={() => hanleSecurityPress(item.title, item.route)}
          />
        ))}
      </View>
    );
  };

  const showOtherSetting = () => {
    return (
      <View style={styles.wrapper}>
        {OTHERS?.map((item, index) => (
          <SettingItem
            key={item?.title + index}
            icon={item.icon}
            title={item.title ? localize(item.title) : ''}
            hasArrowRight={item.hasArrowRight}
            isHotline={item.isHotline}
            onPress={() =>
              handleOtherPress(item?.title, item.route, item.params)
            }
          />
        ))}
      </View>
    );
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        hasLeft={true}
        title={localize('settings')}
        onPressLeft={handleNavigationGoBack}
      />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: responsiveWidth(16)}}>
        {showProfile()}
        {showBasicSetting()}
        <SectionHeader title={localize('security')} />
        {showSecuritySetting()}
        <SectionHeader title={localize('other')} />
        {showOtherSetting()}
        <Text style={styles.exclusiveText}>
          {localize('joinTheExclusiveGroups')}
        </Text>
        <View style={styles.exclusiveWrapper}>
          {GROUP_EXCLUSIVE.map((item, index) => (
            <Icon
              key={'exclusive' + index}
              source={item.icon}
              size={responsiveWidth(57)}
              style={{
                marginRight:
                  index === GROUP_EXCLUSIVE.length - 1
                    ? 0
                    : responsiveWidth(20),
              }}
              onPress={() => {}}
            />
          ))}
        </View>
        <Button
          title={localize('signOut')}
          onPress={handleLogout}
          buttonStyle={RootStyles.primaryButton}
          titleStyle={RootStyles.primaryButtonText}
        />
      </ScrollView>
    </Container>
  );
};

export default SettingScreen;

const getStyles = (blackText: string, lightGrayBg: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {
      paddingTop: responsiveHeight(16),
      paddingBottom: responsiveWidth(30),
      paddingHorizontal: responsiveWidth(20),
      borderRadius: responsiveWidth(30),
      backgroundColor: lightGrayBg,
    },
    avatar: {
      width: responsiveWidth(50),
      height: responsiveWidth(50),
      borderRadius: responsiveWidth(25),
    },
    profileContentWrapper: {flex: 1, marginLeft: responsiveWidth(10)},
    exclusiveWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(23),
    },
    sectionHeader: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.subhead,
      marginVertical: responsiveHeight(20),
    },
    exclusiveText: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subTitle,
      textAlign: 'center',
      marginTop: responsiveHeight(33),
    },
    name: {
      fontFamily: Fonts.montserratSemiBold,
      color: blackText,
      fontSize: typographies.subTitle,
      marginBottom: responsiveHeight(10),
    },
    subTitle: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.footnote,
    },
  });
