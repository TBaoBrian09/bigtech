/* eslint-disable react-hooks/exhaustive-deps */
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {white} from '../../constants/Colors';
import Images from '../../constants/Images';
import {responsiveWidth} from '../../constants/Layout';
import {BottomBarContext} from '../../context/BottomBarContext';
import {LanguageContext} from '../../context/LanguageContext';
import {webviewUrl} from '../../utils/Api/Env';
import LocalStorage from '../../utils/LocalStorage';
import RootStyles from '../../utils/styles';

const DefiScreen = () => {
  const webviewRef = useRef();
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const {languageState} = useContext(LanguageContext);
  const {time} = useContext(BottomBarContext);

  useEffect(() => {
    getUserInfo();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCurrentUrl(baseUrl);
      webviewRef?.current?.reload();
    }, []),
  );

  useEffect(() => {
    if (time) {
      setCurrentUrl(baseUrl);
      webviewRef?.current?.reload();
    }
  }, [time]);

  const getUserInfo = async () => {
    const token = await LocalStorage.getValue('token');
    const url = `${webviewUrl}?newToken=${token}&lang=${languageState}`;
    setBaseUrl(url);
    setCurrentUrl(url);
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        hasBackButton={false}
        leftComponent={<View />}
        hasLeft={true}
        title={'Defi'}
        rightComponent={
          <View style={RootStyles.rowStyle}>
            <Icon
              source={Images.arrowLeft}
              size={responsiveWidth(20)}
              onPress={() => webviewRef?.current?.goBack()}
              style={{marginRight: responsiveWidth(10)}}
              color={'black'}
            />
            <Icon
              source={Images.arrowRightIcon}
              size={responsiveWidth(17)}
              onPress={() => webviewRef?.current?.goForward()}
              color={'black'}
            />
          </View>
        }
      />
      <WebView
        ref={webviewRef}
        source={{
          uri: currentUrl || baseUrl,
        }}
        allowsBackForwardNavigationGestures
        onLoad={e => {
          // Update the state so url changes could be detected by React and we could load the mainUrl.
          setCurrentUrl(e.nativeEvent.url);
        }}
      />
    </Container>
  );
};

export default DefiScreen;

const styles = StyleSheet.create({
  container: {},
});
