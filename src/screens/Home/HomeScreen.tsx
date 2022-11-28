/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import NumberFormat from 'react-number-format';

import Container from '../../common/Container';
import Header from '../../common/Header';
import RouteKey from '../../constants/RouteKey';
import {primary, white} from '../../constants/Colors';
import Icon from '../../common/Icon';
import Images from '../../constants/Images';
import Layout, {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import {useThemeColor} from '../../common/Themed';
import typographies from '../../constants/Typographies';
import Fonts from '../../constants/Fonts';
import RootStyles from '../../utils/styles';
import {useGetFee, useGetPrice, useGetWallet} from '../../hooks/useQueries';
import DigitalItem from '../../common/DigitalItem';
import {localize} from '../../assets/i18n/I18nConfig';
import {UserContext} from '../../context/UserContext';
import {calculateAsset} from '../../utils/utils';
import {
  bot_section,
  customListTokens,
  customListTokensByAddress,
  TOKEN_ICON,
  top_section,
} from '../../utils/Constants';
import {UserData} from '../../models/user';
import {FeeContext} from '../../context/FeeContext';

const HomeScreen = () => {
  const navigation = useNavigation();

  const yellow = useThemeColor('yellow');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, yellow);

  const {data: wallet} = useGetWallet();
  const {data: priceData} = useGetPrice();
  const {data: feeResponse} = useGetFee();
  const {userData, setUserData} = useContext(UserContext);
  const {setData} = useContext(FeeContext);
  const userWallet = wallet?.data as UserData;
  const price = priceData?.data;
  const fee = feeResponse?.data;

  useEffect(() => {
    if (userWallet || price) {
      const priceToken = price?.reduce(
        (obj: any, cur: any) => ({...obj, [cur?.address]: cur}),
        {},
      );
      setUserData({...userData, ...userWallet, priceToken});
    }
  }, [userWallet, price]);

  useEffect(() => {
    if (price && fee) {
      const feeToken = price.find(o => o.isFeeToken);
      const onchainWithdraw = parseFloat(
        fee.find(o => o.key === 'onchain_withdraw')?.value || 0,
      );
      const p2pOrder = parseFloat(
        fee.find(o => o.key === 'p2p_order')?.value || 0,
      );
      const p2pTransaction = parseFloat(
        fee.find(o => o.key === 'p2p_transaction')?.value || 0,
      );
      setData?.({
        feeToken,
        onchainWithdraw,
        p2pOrder,
        p2pTransaction,
      });
    }
  }, [price, fee]);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  const backAction = () => {
    return true;
  };

  const calculateTokenAmount = (token: string) => {
    const findAddress = userWallet?.privateWallet?.tokens?.find(
      item =>
        item?.address?.toLowerCase() ===
        customListTokens[token]?.address?.toLowerCase(),
    );
    const balance = findAddress?.balance || 0;
    const value = calculateAsset(+balance, customListTokens[token]?.decimals);

    return value;
  };

  const totalPrice = useMemo(
    () =>
      userWallet?.privateWallet?.tokens?.reduce((res: any, item: any) => {
        const isUsdt = item.address === customListTokens.USDT.address;

        return (
          res +
          calculateTokenAmount(customListTokensByAddress[item?.address]) *
            (isUsdt
              ? 1
              : calculateAsset(
                  +userData?.priceToken?.[item?.address]?.price || 0,
                  customListTokens.USDT.decimals,
                ))
        );
      }, 0),
    [userData],
  );

  const onDigitalPress = (item: any) => {
    const calPrice =
      item?.symbol === 'USDT'
        ? 1
        : calculateAsset(
            userData?.priceToken?.[item?.address]?.price,
            customListTokens.USDT.decimals,
          );
    const total = calPrice * calculateTokenAmount(item?.symbol);
    navigation.navigate(RouteKey.DigitalDetailScreen, {
      token: item,
      totalPrice: total,
      amount: calculateTokenAmount(item?.symbol),
    });
  };

  const tokensArr = Object.values(userData?.priceToken || []);

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <ScrollView>
        <Header
          hasBackButton={false}
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  RouteKey.SettingScreen as never,
                  {} as never,
                )
              }>
              <Icon
                source={Images.profileIcon}
                style={{
                  width: responsiveWidth(24),
                  height: responsiveWidth(24),
                }}
              />
            </TouchableOpacity>
          }
          rightStyle={{flex: 1}}
          rightComponent={
            <View style={[RootStyles.rowStyle, {alignSelf: 'flex-end'}]}>
              <Icon
                source={Images.historyIcon}
                size={responsiveWidth(20)}
                onPress={() =>
                  navigation.navigate(
                    RouteKey.TransactionHistoryScreen as never,
                    {} as never,
                  )
                }
              />
            </View>
          }
        />
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <Text style={styles.asset}>{localize('home')}</Text>
            <Text style={styles.title}>{localize('totalAssets')}</Text>
            <NumberFormat
              value={totalPrice || 0}
              renderText={formattedValue => (
                <Text style={styles.amount}>{formattedValue} USDT</Text>
              )}
              displayType="text"
              type="text"
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale
            />
            <View style={styles.menuWrapper}>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    backgroundColor: primary.color,
                  },
                ]}
                onPress={() =>
                  navigation.navigate(
                    RouteKey.ReceiveScreen as never,
                    {} as never,
                  )
                }>
                <Text style={[styles.title, {color: white}]}>
                  {localize('receiveAssets')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuItem, {marginRight: 0}]}
                onPress={() =>
                  navigation.navigate(RouteKey.SendScreen as never, {} as never)
                }>
                <Text style={[styles.title, {color: white}]}>
                  {localize('sendAssets')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />
          <Text style={styles.getStarted}>{localize('coreAssets')}</Text>
          {top_section.map((o: any) => {
            const item = tokensArr.find((i: any) => i.symbol === o.symbol);
            return (
              <DigitalItem
                style={styles.customItem}
                key={item?.symbol}
                title={item?.symbol}
                // subTitle={item.subTitle}
                amount={calculateTokenAmount(item?.symbol)?.toString()}
                icon={TOKEN_ICON[item?.symbol]?.icon}
                token={item?.symbol}
                price={
                  item?.symbol === 'USDT'
                    ? 1
                    : calculateAsset(
                        userData?.priceToken?.[item?.address]?.price,
                        customListTokens.USDT.decimals,
                      )
                }
                onPress={() => onDigitalPress(item)}
              />
            );
          })}
          <Text style={styles.getStarted}>{localize('projectAssets')}</Text>
          {bot_section.map((o: any) => {
            const item = tokensArr.find((i: any) => i.symbol === o.symbol);
            return (
              <DigitalItem
                style={styles.customItem}
                key={item?.symbol}
                title={item?.symbol}
                // subTitle={item.subTitle}
                amount={calculateTokenAmount(item?.symbol)?.toString()}
                icon={TOKEN_ICON[item?.symbol]?.icon}
                token={item?.symbol}
                price={
                  item?.symbol === 'USDT'
                    ? 1
                    : calculateAsset(
                        userData?.priceToken?.[item?.address]?.price,
                        customListTokens.USDT.decimals,
                      )
                }
                onPress={() => onDigitalPress(item)}
              />
            );
          })}
        </View>
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;

const getStyles = (blackText: string, yellow: string) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: responsiveWidth(15)},
    headerWrapper: {alignItems: 'center', justifyContent: 'center'},
    menuWrapper: {
      ...RootStyles.rowStyle,
      marginTop: responsiveHeight(25),
      marginBottom: responsiveHeight(15),
    },
    customItem: {
      backgroundColor: white,
      marginBottom: responsiveHeight(5),
      borderBottomWidth: 0.2,
      borderBottomColor: blackText,
    },
    menuItem: {
      minWidth: responsiveWidth(130),
      alignItems: 'center',
      justifyContent: 'center',
      height: responsiveHeight(34),
      backgroundColor: yellow,
      borderRadius: responsiveWidth(5),
      marginRight: responsiveHeight(7),
    },
    line: {
      height: 0.2,
      width: Layout.window.width - responsiveWidth(15),
      backgroundColor: blackText,
      marginBottom: responsiveHeight(7),
    },
    getStarted: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.footnote,
      alignSelf: 'center',
      marginTop: responsiveHeight(15),
      marginBottom: responsiveHeight(12),
      textTransform: 'uppercase',
      color: blackText,
    },
    menuBorder: {
      borderLeftWidth: 0.5,
      borderRightWidth: 0.5,
      borderLeftColor: white,
      borderRightColor: white,
    },
    asset: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratBold,
      color: blackText,
      marginBottom: responsiveHeight(25),
    },
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: '#606060',
    },
    buy: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
    },
    amount: {
      fontSize: responsiveFont(25),
      fontFamily: Fonts.montserratBold,
      color: primary.color,
      marginTop: responsiveHeight(10),
    },
    assetTitle: {
      fontSize: typographies.h3,
      fontFamily: Fonts.montserratBold,
      color: blackText,
      marginTop: responsiveHeight(30),
      marginBottom: responsiveHeight(15),
    },
  });
