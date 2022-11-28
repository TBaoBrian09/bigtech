/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useQueryClient} from 'react-query';
import {localize, localizeP} from '../../assets/i18n/I18nConfig';

import Container from '../../common/Container';
import CustomInput from '../../common/CustomInput';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {FeeContext} from '../../context/FeeContext';
import {UserContext} from '../../context/UserContext';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useMutate} from '../../hooks/useQueries';
import {Assets} from '../../models/assets';
import {CreateOrderForm, CreateOrderFormInput} from '../../models/form';
import {createOrderBuy, createOrderSell} from '../../utils/Api/ApiManage';
import {
  customListTokens,
  P2P_FEE_RATE,
  TOKEN_ICON,
} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {
  calculateAsset,
  calculateSendAsset,
  formatDecimalNumber,
  formatNumber,
  sortTokensArray,
} from '../../utils/utils';
import TokenModal from '../Assets/Modal/TokenModal';
import {CREATE_ORDER_FORM} from './P2PConstants';

type IProps = {
  route?: any;
};

const CreateOrderScreen = (props: IProps) => {
  const {orderType} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const darkGray = useThemeColor('darkGray');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, darkGray);

  const {userData} = useContext(UserContext);
  const listToken = Object.values(userData?.priceToken);

  const [form, setForm] = useState<CreateOrderForm>({
    total: '0',
    fee: '0',
    subTotal: '0',
    amount: '',
    price: '',
    tokenId: '',
  });
  const [tokenSymbol, setTokenSymbol] = useState<string>('btg');
  const tokenRef = useRef<Modalize>();

  const queryClient = useQueryClient();
  const {mutate: onCreateOrder} = useMutate(
    orderType === 'buy' ? createOrderBuy : createOrderSell,
  );
  const {data: feeData} = useContext(FeeContext);

  // const {data: fee} = useQuery('transFee', getTransactionFee);
  // const transFee = fee?.data;

  const tokenBalance = useMemo(() => {
    const transformToken = tokenSymbol?.toUpperCase();
    const getBalance = userData?.privateWallet?.tokens?.find(
      item => item?.address === customListTokens[transformToken].address,
    )?.balance;
    const value = calculateAsset(
      +getBalance,
      customListTokens[transformToken]?.decimals,
    );
    return value;
  }, [tokenSymbol]);
  const feeBalance = useMemo(() => {
    const getBalance = userData?.privateWallet?.tokens?.find(
      item => item?.address === feeData?.feeToken?.address,
    )?.balance;
    const value = calculateAsset(+getBalance, feeData?.feeToken?.decimals);
    return value;
  }, [feeData]);
  const price = calculateAsset(
    +userData?.priceToken?.[
      customListTokens[tokenSymbol?.toUpperCase()].address
    ]?.price,
    customListTokens.USDT.decimals,
  );

  const usdtBalance = useMemo(() => {
    const getBalance = userData?.privateWallet?.tokens?.find(
      item => item?.address === customListTokens.USDT.address,
    )?.balance;
    const value = calculateAsset(+getBalance, customListTokens.USDT?.decimals);
    return value;
  }, [tokenSymbol]);

  // true is not valid, false is valid
  const validateBalance = () => {
    if (
      !form?.amount ||
      new BigNumber(form?.amount).isEqualTo(0) ||
      !handleGetValue({key: 'total'} as CreateOrderFormInput)
    ) {
      return true;
    }
    if (orderType === 'sell') {
      if (feeData?.feeToken?.symbol === tokenSymbol?.toUpperCase()) {
        return !(
          form?.amount &&
          form?.price &&
          parseFloat(form?.amount || '0') + (feeData?.p2pOrder || 0) <=
            tokenBalance
        );
      }
      const isTokenBalanceValid =
        form?.amount &&
        form?.price &&
        parseFloat(form?.amount || '0') <= tokenBalance;
      const isFeeBalanceValid = (feeData?.p2pOrder || 0) <= feeBalance;
      return !(isTokenBalanceValid && isFeeBalanceValid);
    } else {
      if (feeData?.feeToken?.symbol === 'USDT') {
        return !!(
          !form?.amount ||
          !form?.price ||
          +handleGetValue({key: 'total'} as CreateOrderFormInput) +
            (feeData?.p2pOrder || 0) >
            usdtBalance
        );
      }
      const isTokenBalanceValid =
        form?.amount &&
        form?.price &&
        +handleGetValue({key: 'total'} as CreateOrderFormInput) <= usdtBalance;
      const isFeeBalanceValid = (feeData?.p2pOrder || 0) <= feeBalance;

      return !(isTokenBalanceValid && isFeeBalanceValid);
    }
  };

  const handleGetMessage = useCallback(
    item => {
      if (item?.type === 'amount') {
        if (orderType === 'sell') {
          return localizeP('availableBalance:balance:symbol', {
            balance: tokenBalance,
            symbol: tokenSymbol?.toUpperCase(),
          });
        } else {
          return localizeP('availableBalance:balance:symbol', {
            balance: usdtBalance,
            symbol: 'USDT',
          });
        }
      }
      if (item?.type === 'price') {
        return localizeP('exchangeRate:balance1:symbol1:balance2:symbol2', {
          balance1: '1',
          symbol1: tokenSymbol?.toUpperCase(),
          balance2: price,
          symbol2: 'USDT',
        });
      }
      return;
    },
    [tokenBalance, tokenSymbol],
  );

  const hanldeOnChangeText = (key: string, v: string) => {
    setForm({...form, [key]: formatDecimalNumber(v)});
  };

  const handleSelectToken = (token: Assets) => {
    setTokenSymbol(token);
  };

  const handlePressMax = () => {
    setForm({...form, amount: tokenBalance?.toString()});
  };

  const handleGetValue = (item: CreateOrderFormInput) => {
    const subTotal = new BigNumber(form.amount).multipliedBy(
      new BigNumber(form?.price),
    );
    const calculateTotal = () => {
      const isFeeUsdt = feeData?.feeToken?.symbol === 'USDT';
      if (!subTotal) {
        return 0;
      }

      if (orderType === 'sell') {
        return isFeeUsdt
          ? Math.max(subTotal.minus(feeData?.p2pOrder || 0).toNumber(), 0)
          : subTotal.toNumber();
      } else {
        return isFeeUsdt
          ? subTotal.plus(feeData?.p2pOrder || 0).toNumber()
          : subTotal.toNumber();
      }
    };
    const total = calculateTotal();

    switch (item?.key) {
      case 'type':
        return localize('fixed');
      case 'fee':
        return formatNumber(feeData?.p2pOrder?.toString() || '0');
      case 'subTotal':
        return formatNumber(subTotal?.toString());
      case 'total':
        return formatNumber(total?.toString());
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

  const handleSubmit = () => {
    const transformToken = tokenSymbol?.toUpperCase();
    const totalAmount = calculateSendAsset(
      +form?.amount,
      customListTokens[transformToken]?.decimals,
    );
    const totalPrice = calculateSendAsset(
      +form?.price,
      customListTokens.USDT?.decimals,
    );
    const tokenId = userData?.privateWallet?.tokens?.find(
      item => item?.address === customListTokens[transformToken].address,
    )?.id;
    const body = {
      tokenId: tokenId,
      amount: new BigNumber(totalAmount?.toString()).toFixed(0),
      price: totalPrice?.toString(),
    };

    onCreateOrder(
      {
        ...body,
      } as unknown as void,
      {
        onSuccess: () => {
          queryClient.invalidateQueries('orderP2P');
          queryClient.invalidateQueries('wallet');
          ToastEmitter.success(localize('sendSuccess'));
          return navigation.navigate(
            RouteKey.P2PTradingScreen as never,
            {} as never,
          );
        },
      },
    );
  };

  const showRightIcon = (item: CreateOrderFormInput) => {
    if (item?.type === 'button') {
      return <Icon source={Images.polygonIcon} size={responsiveHeight(10)} />;
    }
    if (item?.type === 'amount') {
      return (
        <View style={RootStyles.rowStyle}>
          {item?.hasMax && (
            <TouchableOpacity
              onPress={handlePressMax}
              style={{marginLeft: responsiveWidth(10)}}>
              <Text style={styles.maxText}>Max</Text>
            </TouchableOpacity>
          )}
          <View style={[styles.iconStyle, {width: responsiveWidth(110)}]}>
            <TouchableOpacity
              style={RootStyles.rowStyle}
              onPress={() => tokenRef.current?.open()}>
              <Icon
                source={TOKEN_ICON[tokenSymbol?.toUpperCase()].icon}
                size={responsiveWidth(30)}
                style={{marginRight: responsiveWidth(5)}}
              />
              <Text style={styles.tokenSymbol}>{tokenSymbol}</Text>
              <Icon
                source={Images.arrowDownIcon}
                style={{
                  width: responsiveWidth(12),
                  height: responsiveHeight(7),
                }}
                color={blackText}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (item?.key === 'fee') {
      return (
        <View style={styles.iconStyle}>
          <Text style={styles.subTitle}>{feeData?.feeToken?.symbol}</Text>
        </View>
      );
    }
    return (
      <View style={styles.iconStyle}>
        <Text style={styles.subTitle}>{item?.rightLabel}</Text>
      </View>
    );
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <Header
        hasBackButton={false}
        title={
          orderType === 'buy'
            ? localize('createANewBuyOrder')
            : localize('createANewSellOrder')
        }
        rightStyle={{flex: 1}}
        rightComponent={
          <View style={[RootStyles.rowStyle, {alignSelf: 'flex-end'}]}>
            <Icon
              source={Images.closeIcon}
              size={responsiveWidth(14)}
              onPress={() => navigation.goBack()}
            />
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={{paddingHorizontal: responsiveWidth(15)}}>
        {CREATE_ORDER_FORM?.map(item => (
          <CustomInput
            keyboardType={item?.keyboardType}
            editable={item?.editable}
            key={item?.label}
            customLabelStyle={styles.label}
            value={showValue(handleGetValue(item))}
            customContainerStyle={styles.customContainerStyle}
            customInputContainerStyle={{height: responsiveHeight(44)}}
            label={localize(item.label)}
            onChangeText={(v: string) => hanldeOnChangeText(item.key, v)}
            errorStyle={{color: blackText}}
            errorMessage={handleGetMessage(item)}
            hasRightIcon
            disabled={item.disabled}
            maxLength={20}
            customRightIcon={showRightIcon(item)}
          />
        ))}
        <Button
          disabled={validateBalance()}
          onPress={handleSubmit}
          title={localize('createANewOrder')}
          buttonStyle={[
            RootStyles.primaryButton,
            {marginVertical: responsiveHeight(15)},
          ]}
          titleStyle={RootStyles.primaryButtonText}
        />
      </ScrollView>
      <Portal>
        <TokenModal
          // @ts-ignore
          ref={tokenRef}
          keyItem={'token'}
          onPress={handleSelectToken}
          // @ts-ignore
          listToken={sortTokensArray(listToken || [])?.filter(
            item => item?.symbol !== 'USDT',
          )}
        />
      </Portal>
    </Container>
  );
};

export default CreateOrderScreen;

const getStyles = (blackText: string, darkGray: string) =>
  StyleSheet.create({
    container: {},
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
    label: {
      fontWeight: '500',
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      marginBottom: responsiveHeight(8),
      textTransform: 'uppercase',
    },
    subTitle: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
    },
    maxText: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: primary.color,
      marginRight: responsiveWidth(10),
    },
    tokenSymbol: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      marginRight: responsiveWidth(5),
      textTransform: 'uppercase',
    },
  });
