/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import NumberFormat from 'react-number-format';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import typographies from '../../constants/Typographies';
import RootStyles from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';
import RouteKey from '../../constants/RouteKey';
import {UserContext} from '../../context/UserContext';
import {calculateTokenBalance} from '../../utils/utils';
import {TOKEN_ICON} from '../../utils/Constants';

interface SendScreenProps {
  route?: any;
}

const OpacityLooping = () => {
  const opacity = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(opacity.value),
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, {
        duration: 800,
      }),
      Infinity,
    );
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {width: 3, height: 64, backgroundColor: primary.color},
        animatedStyles,
      ]}
    />
  );
};

const SendDigitalScreen = (props: SendScreenProps) => {
  const navigation = useNavigation();
  const {token, network} = props?.route?.params ?? {};
  const blackText = useThemeColor('blackText');
  const grayBG = useThemeColor('borderGray');
  const styles = getStyles(blackText, grayBG);

  const {userData, setUserData} = useContext(UserContext);

  const [amount, setAmount] = useState('0');

  const getTokenBalance = useMemo(
    () => calculateTokenBalance(token?.symbol, userData?.privateWallet?.tokens),
    [userData, token],
  );

  const handleChangeAmount = (value: string) => () => {
    setAmount(oldAmount => {
      if (oldAmount === '0' && value !== '.') {
        return value === '0' ? '0' : value;
      }
      const newValue = oldAmount + value;

      return newValue;
    });
  };

  const handleRemoveAmount = () => {
    setAmount(oldAmount => {
      return oldAmount.slice(0, -1);
    });
  };

  const handleSubmit = () => {
    setUserData({
      ...userData,
      sendData: {
        ...token,
        network,
        amount,
      },
    });
    navigation.navigate(RouteKey.ToAddressScreen);
  };

  const handlePressMax = () => {
    setAmount(getTokenBalance?.toString());
  };

  const showPhonePad = () => {
    return (
      <View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          numColumns={3}
          keyExtractor={item => item.toString()}
          scrollEnabled={false}
          renderItem={({item}) => {
            return (
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={handleChangeAmount(item.toString())}
                  hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
                  <Text style={styles.buttonLabel}>{item}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        <View style={RootStyles.rowStyle}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={handleChangeAmount('.')}
              hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
              <Text style={styles.buttonLabel}>.</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity onPress={handleChangeAmount('0')}>
              <Text style={styles.buttonLabel}>0</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={handleRemoveAmount}
              hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
              <Icon
                source={Images.removeNumbIcon}
                style={{
                  width: responsiveWidth(21),
                  height: responsiveHeight(12),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const showTotalAmount = () => {
    return (
      <View style={styles.totalAmountWrapper}>
        <View style={RootStyles.rowStyle}>
          <Icon
            source={TOKEN_ICON[token?.symbol]?.icon}
            size={responsiveWidth(43)}
            style={{marginRight: responsiveWidth(8)}}
          />
          <Text style={styles.itemAmount}>{token?.symbol}</Text>
        </View>
        <NumberFormat
          value={calculateTokenBalance(
            token?.symbol,
            userData?.privateWallet?.tokens,
          )}
          renderText={formattedValue => (
            <Text style={styles.itemAmount}>{formattedValue}</Text>
          )}
          suffix={` ${token?.symbol}`}
          displayType="text"
          type="text"
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale
        />
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
        title={localize('send')}
        rightStyle={{flex: 1}}
        rightComponent={
          <View>
            <Text style={styles.network}>{network}</Text>
          </View>
        }
      />
      <View style={styles.wrapper}>
        <Text style={styles.title}>{token?.token || 'token'}</Text>
        <View style={styles.amountWrapper}>
          <NumberFormat
            placeholder="0"
            displayType={'text'}
            renderText={formattedValue => (
              <Text
                style={styles.number}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {formattedValue}
              </Text>
            )}
            thousandSeparator={true}
            value={amount}
          />
          <OpacityLooping />
        </View>
        <TouchableOpacity style={styles.maxButton} onPress={handlePressMax}>
          <Text style={styles.maxButtonLabel}>MAX</Text>
        </TouchableOpacity>
        {showTotalAmount()}
        {showPhonePad()}
      </View>

      <Button
        disabled={+amount <= 0 || +amount > +getTokenBalance}
        title={localize('next')}
        onPress={handleSubmit}
        buttonStyle={[
          RootStyles.primaryButton,
          {
            marginTop: responsiveHeight(10),
            marginHorizontal: responsiveWidth(15),
          },
        ]}
        titleStyle={RootStyles.primaryButtonText}
      />
    </Container>
  );
};

export default SendDigitalScreen;

const getStyles = (blackText: string, grayBG: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper: {
      flex: 1,
      paddingTop: responsiveHeight(48),
    },
    headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    amountWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    totalAmountWrapper: {
      ...RootStyles.rowSpaceStyle,
      backgroundColor: grayBG,
      paddingHorizontal: responsiveWidth(10),
      minHeight: responsiveHeight(60),
      borderRadius: responsiveWidth(5),
      marginHorizontal: responsiveWidth(15),
    },
    maxButton: {
      backgroundColor: primary.color,
      borderRadius: responsiveWidth(50),
      paddingHorizontal: responsiveWidth(23),
      paddingVertical: responsiveHeight(12),
      width: responsiveWidth(90),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: responsiveHeight(25),
    },
    button: {
      width: '33.333333333%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonLabel: {
      padding: responsiveWidth(20),
      fontFamily: Fonts.montserratMedium,
      textAlign: 'center',
      fontSize: responsiveFont(20),
      color: blackText,
    },
    maxButtonLabel: {
      textAlign: 'center',
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: white,
      textTransform: 'uppercase',
    },
    title: {
      textAlign: 'center',
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: blackText,
      textTransform: 'uppercase',
    },
    number: {
      textAlign: 'center',
      fontFamily: Fonts.montserratBold,
      fontSize: responsiveFont(60),
      color: blackText,
    },
    itemAmount: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
    },
    network: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      textAlign: 'right',
    },
  });
