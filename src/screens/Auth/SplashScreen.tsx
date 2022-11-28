import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, ImageBackground, Text} from 'react-native';
import CodePush from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import TouchID from 'react-native-touch-id';
import Icon from '../../common/Icon';

import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {
  isFoldable,
  isIOS,
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import {UserContext} from '../../context/UserContext';
import {NavigationRoot} from '../../navigation/root';
import {initAxios} from '../../utils/Api/ApiManage';
import {buildEnv} from '../../utils/Api/Env';
import {codePushKey, optionalConfigObject} from '../../utils/Constants';
import LocalStorage from '../../utils/LocalStorage';

const codePushOptions = {
  installMode: CodePush.InstallMode.IMMEDIATE,
  deploymentKey: codePushKey[buildEnv],
};

const SplashScreen = () => {
  const [receivedBytes, setReceivedBytes] = React.useState<number>(0);
  const total = React.useRef<number>(0);
  const {setUserData} = React.useContext(UserContext);

  useEffect(() => {
    checkCodePushVersion();
  }, []);

  const loading = () => {
    setTimeout(() => handleLoading(), 500);
  };

  const checkCodePushVersion = () => {
    CodePush.sync(
      codePushOptions,
      status => {
        switch (status) {
          case CodePush.SyncStatus.UP_TO_DATE:
          case CodePush.SyncStatus.UNKNOWN_ERROR:
            loading();
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        total.current = totalBytes;
        setReceivedBytes(receivedBytes);
      },
    );
  };

  const handleLoading = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      const savedAccount = await LocalStorage.getData('savedAccount');
      if (token && user) {
        if (isIOS() && savedAccount) {
          return verifyBiometric();
        }
      }
      NavigationRoot.navigate(RouteKey.AuthStack);
    } catch (e) {
      console.log(e);
      NavigationRoot.navigate(RouteKey.AuthStack);
    }
  };

  const verifyBiometric = async () => {
    try {
      const resBiometric = await TouchID.authenticate('', optionalConfigObject);
      if (!resBiometric) {
        NavigationRoot.navigate(RouteKey.AuthStack);
      }
      NavigationRoot.main();
    } catch (e) {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
      NavigationRoot.navigate(RouteKey.AuthStack);
    }
  };

  const handleLogout = React.useCallback(() => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('user');
    setUserData({});
    NavigationRoot.logout();
  }, [setUserData]);

  useEffect(() => {
    initAxios(handleLogout);
  }, [handleLogout]);

  return (
    <ImageBackground
      source={isFoldable() ? Images.backgroundTablet : Images.background}
      style={{width: '101%', height: '100%'}}>
      <View style={styles.wrapper}>
        <Icon source={Images.icon} style={styles.icon} />
        <Text style={styles.text}>BIG TECH GLOBAL</Text>
        <Text style={styles.subText}>
          Giving investment opportunities to everyone
        </Text>
        {!!total.current && (
          <Progress.Circle
            size={40}
            progress={receivedBytes / total.current}
            color={white}
            showsText
            style={{marginTop: responsiveHeight(15)}}
          />
        )}
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    marginBottom: responsiveHeight(10),
  },
  wrapper: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: white,
    fontFamily: Fonts.montserratBlack,
    fontSize: responsiveFont(21),
    textTransform: 'uppercase',
  },
  subText: {
    color: white,
    fontFamily: Fonts.montserratMedium,
    fontSize: responsiveFont(13),
    textAlign: 'center',
    marginTop: responsiveHeight(5),
  },
});
