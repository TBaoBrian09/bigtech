/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';
import {useQueryClient} from 'react-query';
import {localize} from '../../assets/i18n/I18nConfig';

import CustomInput from '../../common/CustomInput';
import {useThemeColor} from '../../common/Themed';
import {primary} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {UserContext} from '../../context/UserContext';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useMutate} from '../../hooks/useQueries';
import {buyToSellOrder, sellToBuyOrder} from '../../utils/Api/ApiManage';
import {customListTokens, SOMETHING_WENT_WRONG} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {
  calculateAsset,
  calculateSendAsset,
  formatDecimalNumber,
  formatNumber,
} from '../../utils/utils';
import {BUY_SELL_FORM} from './P2PConstants';
import {useVerifyOTP} from '../../hooks/useVerifyOTP';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';
import {useShowError} from '../../hooks/useShowError';
import {FeeContext} from '../../context/FeeContext';
import TouchID from 'react-native-touch-id';

type IProps = {
  route?: any;
};

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: '', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

const BuySellScreen = (props: IProps) => {
  const {orderType, order, token, amount, price, refetchList} =
    props?.route?.params ?? {};
  const navigation = useNavigation();
  const modalRef = useRef<Modalize | null>(null);
  const blackText = useThemeColor('blackText');
  const borderGray = useThemeColor('borderGray');
  const darkGray = useThemeColor('darkGray');
  const styles = getStyles(blackText, borderGray, darkGray);
  const {showError} = useShowError();
  const {data: feeData} = useContext(FeeContext);

  // @ts-ignore
  const {userData} = useContext(UserContext);
  const {verifyOTP} = useVerifyOTP();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    amount: '0',
  });

  const {mutate: onAction} = useMutate(
    orderType === 'sell' ? sellToBuyOrder : buyToSellOrder,
  );

  const tokenBalance = useMemo(() => {
    const getBalance = userData?.privateWallet?.tokens?.find(
      (item: any) => item?.address === customListTokens[token].address,
    )?.balance;
    const value = calculateAsset(+getBalance, customListTokens[token].decimals);
    return value;
  }, [token]);
  const usdtBalance = useMemo(() => {
    const getBalance = userData?.privateWallet?.tokens?.find(
      (item: any) => item?.address === customListTokens.USDT.address,
    )?.balance;
    const value = calculateAsset(+getBalance, customListTokens.USDT.decimals);
    return value;
  }, [token]);
  const feeBalance = useMemo(() => {
    const getBalance = userData?.privateWallet?.tokens?.find(
      item => item?.address === feeData?.feeToken?.address,
    )?.balance;
    const value = calculateAsset(+getBalance, feeData?.feeToken?.decimals);
    return value;
  }, [feeData]);

  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      openModal();
    }
    return () => {
      isSubscribed = false;
    };
  }, []);

  const onClosed = () => {
    InteractionManager.runAfterInteractions(() => {
      navigation.goBack();
    });
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current?.open();
    }
  };

  const hanldeOnChangeText = (key: string, v: string) => {
    setForm({...form, [key]: formatDecimalNumber(v)});
  };

  const handlePressMax = () => {
    setForm({amount: amount?.toString()});
  };

  const handleGetValue = (item: any) => {
    const subTotal = new BigNumber(form.amount).multipliedBy(
      new BigNumber(price),
    );
    // const calFee = subTotal.multipliedBy(new BigNumber(P2P_FEE_RATE));
    const calculateTotal = () => {
      const isFeeUsdt = feeData?.feeToken?.symbol === 'USDT';
      if (!subTotal) {
        return 0;
      }

      if (orderType === 'sell') {
        return isFeeUsdt
          ? Math.max(subTotal.minus(feeData?.p2pTransaction || 0).toNumber(), 0)
          : subTotal.toNumber();
      } else {
        return isFeeUsdt
          ? subTotal.plus(feeData?.p2pTransaction || 0).toNumber()
          : subTotal.toNumber();
      }
    };
    const total = calculateTotal();
    switch (item?.key) {
      case 'fee':
        return formatNumber(feeData?.p2pTransaction?.toString() || '0');
      case 'subTotal':
        return formatNumber(subTotal?.toString());
      case 'total':
        return formatNumber(total.toString());
      default:
        return form[item?.key];
    }
  };

  const showValue = (raw: any) => {
    const tmp = raw?.toString();
    if (tmp === 'NaN') {
      return '';
    }
    return tmp;
  };

  // true is valid, false is invalid
  const validateOrder = () => {
    if (+form.amount > amount || !handleGetValue({key: 'total'})) {
      return false;
    }
    if (orderType === 'buy') {
      if (feeData?.feeToken?.symbol === 'USDT') {
        if (
          handleGetValue({key: 'total'}) + (feeData?.p2pTransaction || 0) >
          usdtBalance
        ) {
          return false;
        }
        return true;
      }
      if (
        handleGetValue({key: 'total'}) > usdtBalance ||
        (feeData?.p2pTransaction || 0) > feeBalance
      ) {
        return false;
      }
      return true;
    } else {
      if (feeData?.feeToken?.symbol === token) {
        if (+form.amount + (feeData?.p2pTransaction || 0) > tokenBalance) {
          return false;
        }
        return true;
      }
      if (
        +form.amount > tokenBalance ||
        (feeData?.p2pTransaction || 0) > feeBalance
      ) {
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async () => {
    try {
      const resBiometric = await TouchID.authenticate('', optionalConfigObject);
      console.log('resBiometric', resBiometric);
      if (!resBiometric) {
        return;
      }
      const totalAmount = calculateSendAsset(
        +form?.amount,
        customListTokens[token].decimals,
      );

      const body = {
        orderId: order?.id,
        amount: new BigNumber(totalAmount?.toString()).toFixed(0),
      };

      onAction(
        {
          ...body,
        } as unknown as void,
        {
          onSuccess: () => {
            queryClient.invalidateQueries('wallet');
            refetchList?.();
            ToastEmitter.success(localize('sendSuccess'));
            return navigation.navigate(
              RouteKey.P2PTradingScreen as never,
              {} as never,
            );
          },
          onError: (e: any) => {
            console.log('e?.message', e?.message);
            showError([localize(e?.message)], SOMETHING_WENT_WRONG);
          },
        },
      );
    } catch (e) {
      console.log('Rejected');
    }
  };

  return (
    <Modalize
      ref={modalRef}
      onClosed={onClosed}
      modalHeight={Layout.window.height * 0.9}
      modalStyle={{flex: 1}}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        contentContainerStyle: {flexGrow: 1},
        keyboardShouldPersistTaps: 'handled',
      }}>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text style={styles.header}>
            {orderType === 'buy' ? localize('buy') : localize('sell')} Crypto
          </Text>
        </View>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>
            {localize('remaining')}:{' '}
            <NumberFormat
              value={amount}
              renderText={formattedValue => (
                <Text style={styles.subTitle}>
                  {formattedValue} {token}
                </Text>
              )}
              displayType="text"
              type="text"
              thousandSeparator={true}
              decimalScale={4}
            />
          </Text>
          <Text style={styles.title}>
            {localize('price')}:{' '}
            <Text style={styles.subTitle}>{`1 ${token} = ${price} USDT`}</Text>
          </Text>
          <Text style={styles.title}>
            {localize('availableBalance')}:{' '}
            <NumberFormat
              value={orderType === 'buy' ? usdtBalance : tokenBalance}
              renderText={formattedValue => (
                <Text style={styles.subTitle}>
                  {formattedValue} {orderType === 'buy' ? 'USDT' : token}
                </Text>
              )}
              displayType="text"
              type="text"
              thousandSeparator={true}
              decimalScale={4}
            />
          </Text>
          {BUY_SELL_FORM?.map(item => (
            <CustomInput
              keyboardType={item.keyboardType}
              editable={item.editable}
              key={item?.label}
              customLabelStyle={styles.label}
              customContainerStyle={styles.customContainerStyle}
              customInputContainerStyle={{height: responsiveHeight(44)}}
              value={showValue(handleGetValue(item))}
              label={localize(item.label)}
              onChangeText={(v: string) => hanldeOnChangeText('amount', v)}
              hasRightIcon
              customRightIcon={
                <View style={RootStyles.rowStyle}>
                  {item?.hasMax && (
                    <TouchableOpacity
                      onPress={handlePressMax}
                      style={{marginLeft: responsiveWidth(10)}}>
                      <Text style={styles.pasteText}>Max</Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.iconStyle}>
                    <Text style={styles.subTitle}>
                      {item.rightLabel === 'token'
                        ? token
                        : item.rightLabel === 'fee'
                        ? feeData?.feeToken?.symbol
                        : item.rightLabel}
                    </Text>
                  </View>
                </View>
              }
            />
          ))}
        </View>
        <Button
          disabled={!validateOrder()}
          title={localize(orderType || 'buy')}
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
      </View>
    </Modalize>
  );
};

export default BuySellScreen;

const getStyles = (blackText: string, borderGray: string, darkGray: string) =>
  StyleSheet.create({
    container: {},
    wrapper: {
      flex: 1,
      paddingVertical: responsiveHeight(20),
    },
    contentWrapper: {
      flex: 1,
      paddingVertical: responsiveHeight(20),
      paddingHorizontal: responsiveWidth(15),
    },
    headerWrapper: {
      paddingVertical: responsiveHeight(15),
      borderBottomWidth: 1,
      borderBottomColor: borderGray,
    },
    header: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: blackText,
      textAlign: 'center',
    },
    customContainerStyle: {
      paddingHorizontal: 0,
      marginTop: responsiveHeight(20),
    },
    iconStyle: {
      backgroundColor: darkGray,
      borderRadius: responsiveWidth(7),
      minHeight: responsiveHeight(44),
      alignItems: 'center',
      justifyContent: 'center',
      width: responsiveHeight(64),
      marginRight: -responsiveWidth(8),
    },
    title: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.footnote,
      color: blackText,
      marginVertical: 2,
    },
    subTitle: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
    },
    label: {
      fontWeight: '500',
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      marginBottom: responsiveHeight(8),
      textTransform: 'uppercase',
    },
    pasteText: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: primary.color,
      marginRight: responsiveWidth(10),
    },
  });
