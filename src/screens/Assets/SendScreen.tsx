import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import DigitalItem from '../../common/DigitalItem';
import Header from '../../common/Header';
import SearchBar from '../../common/SearchBar';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {UserContext} from '../../context/UserContext';
import {Token} from '../../models/assets';
import {customListTokens, TOKEN_ICON} from '../../utils/Constants';
import LocalStorage from '../../utils/LocalStorage';
import {calculateAsset, calculateTokenBalance} from '../../utils/utils';
import KYCRequireModal from './Modal/KYCRequireModal';
import NetworkModal from './Modal/NetworkModal';

const SendScreen = () => {
  const navigation = useNavigation();
  const grayBg = useThemeColor('borderGray');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, grayBg);

  const networkRef = useRef<Modalize>();
  const kycVerifyRef = useRef<Modalize>();
  const [token, setToken] = useState<Token>();
  const [digitalList, setDigitalList] = useState<Token[]>([]);
  const [isDisableOnChain, setDisableOnChain] = useState<boolean>(false);

  const {userData} = useContext(UserContext);
  const listToken = Object.values(userData?.priceToken);

  useEffect(() => {
    setDigitalList(listToken);
  }, []);

  const handleOnChangeText = (value: string) => {
    if (!value) {
      return setDigitalList(listToken);
    }
    const filterList = digitalList.filter(item =>
      item.symbol.toLowerCase().includes(value.toLowerCase()),
    );
    setDigitalList(filterList);
  };

  const handleSelectNetwork = (network: string) => {
    navigation.navigate(RouteKey.SendDigitalScreen, {token, network});
  };

  const navigationKYCProfile = async () => {
    const userProfile = await LocalStorage.getData('user');

    if (userProfile?.profile?.verifyStatus === 'rejected') {
      return navigation.navigate(RouteKey.RejectedScreen, {
        rejectedReson: userData?.profile?.rejectReason,
      });
    }
    if (userData?.profile?.verifyStatus === 'uploaded') {
      return navigation.navigate(RouteKey.KYCPendingScreen as never);
    }

    return navigation.navigate(RouteKey.KYCOnboardingScreen as never);
  };

  const handleSelectToken = async (digital: Token) => {
    const userProfile = await LocalStorage.getData('user');
    if (userProfile?.profile?.verifyStatus !== 'verified') {
      return kycVerifyRef.current?.open();
    }
    setToken(digital);
    setDisableOnChain(false);
    if (userData?.priceToken?.[digital?.address]?.type === 'offChain') {
      setDisableOnChain(true);
    }
    networkRef.current?.open();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('send')} />
      <SearchBar
        customInputContainerStyle={{backgroundColor: grayBg}}
        leftIconColor={'#909090'}
        placeholderTextColor={'#909090'}
        customInputStyle={{color: blackText}}
        placeholder={localize('search')}
        onChangeText={(value: string) => handleOnChangeText(value)}
      />
      {digitalList?.map(item => (
        <DigitalItem
          key={item.symbol}
          style={{backgroundColor: white}}
          title={item.symbol}
          amount={calculateTokenBalance(
            item?.symbol,
            userData?.privateWallet?.tokens,
          )}
          icon={TOKEN_ICON[item?.symbol]?.icon}
          token={item?.symbol}
          price={
            item?.symbol === 'USDT'
              ? 1
              : calculateAsset(
                  +userData?.priceToken?.[item?.address]?.price,
                  customListTokens.USDT.decimals,
                )
          }
          onPress={() => handleSelectToken(item)}
        />
      ))}
      <Portal>
        <NetworkModal
          ref={networkRef}
          keyItem={'network'}
          isDisableOnChain={isDisableOnChain}
          onPress={handleSelectNetwork}
        />
        <KYCRequireModal
          ref={kycVerifyRef}
          keyItem={'kyc'}
          onPress={navigationKYCProfile}
        />
      </Portal>
    </Container>
  );
};

export default SendScreen;

const getStyles = (blackText: string, grayBg: string) =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      backgroundColor: grayBg,
      borderTopRightRadius: responsiveWidth(10),
      borderTopLeftRadius: responsiveWidth(10),
      paddingHorizontal: responsiveWidth(15),
      flexGrow: 1,
    },
    networkWrapper: {
      paddingVertical: responsiveHeight(20),
      borderBottomColor: blackText,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginHorizontal: -responsiveWidth(15),
      paddingHorizontal: responsiveWidth(15),
    },
    onchainWrapper: {
      marginHorizontal: -responsiveWidth(15),
      paddingHorizontal: responsiveWidth(15),
      backgroundColor: white,
      marginBottom: responsiveHeight(20),
      paddingVertical: responsiveHeight(10),
    },
    networkTitle: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: blackText,
    },
    onchainTitle: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      textTransform: 'uppercase',
    },
  });
