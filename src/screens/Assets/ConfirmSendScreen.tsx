import {useNavigation} from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import React, {useContext, useEffect, useRef} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements/dist/buttons/Button';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import NumberFormat from 'react-number-format';
import {useQuery, useQueryClient} from 'react-query';
import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {FeeContext} from '../../context/FeeContext';
import {LoadingContext} from '../../context/LoadingContext';
import {UserContext} from '../../context/UserContext';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useMutate} from '../../hooks/useQueries';
import {useVerifyOTP} from '../../hooks/useVerifyOTP';
import {
  getFile,
  getTransactionFee,
  withdrawalOffChain,
  withdrawalOnChain,
} from '../../utils/Api/ApiManage';
import {customListTokens} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {calculateAsset, calculateSendAsset} from '../../utils/utils';
import SentModal from './Modal/SentModal';

interface ConfirmSendScreenProps {
  route?: any;
}

const ConfirmSendScreen = (props: ConfirmSendScreenProps) => {
  const {recipient, name, avatar} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const grayBg = useThemeColor('borderGray');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, grayBg);

  const queryClient = useQueryClient();
  const {userData} = useContext(UserContext);
  const {data: feeData} = useContext(FeeContext);
  const {setGlobalIndicator} = useContext(LoadingContext);
  const {verifyOTP} = useVerifyOTP();
  const sentModalRef = useRef<Modalize>();

  const sendData = userData?.sendData;
  const userWallet = userData?.privateWallet;
  const isOffChain = sendData?.network === 'BTG';

  const {mutate: onWithdraw} = useMutate(
    userData?.sendData?.network === 'BTG'
      ? withdrawalOffChain
      : withdrawalOnChain,
  );

  // true: invalid, false: valid
  const checkValidTransaction = () => {
    const findAddress = userWallet?.tokens?.find(
      item => item?.address === customListTokens[sendData?.symbol]?.address,
    );
    const balance = findAddress?.balance || 0;
    const value = calculateAsset(
      +balance,
      customListTokens[sendData?.symbol]?.decimals,
    );

    const getFeeBalance = userData?.privateWallet?.tokens?.find(
      item => item?.address === feeData?.feeToken?.address,
    )?.balance;
    const feeBalanceRemain = calculateAsset(
      +getFeeBalance,
      feeData?.feeToken?.decimal,
    );

    const countFee = isOffChain ? 0 : feeData?.onchainWithdraw || 0;

    if (sendData?.symbol !== feeData?.feeToken?.symbol) {
      return (
        feeBalanceRemain - countFee < 0 ||
        value - userData?.sendData?.amount < 0
      );
    }

    return value - userData?.sendData?.amount - countFee < 0;
  };

  const handleOnVerifySuccess = async (otp: string) => {
    setGlobalIndicator(true);
    const totalAmount = calculateSendAsset(
      sendData?.amount,
      customListTokens[sendData?.symbol]?.decimals,
    );

    const body = {
      tokenAddress: customListTokens[sendData?.symbol]?.address,
      amount: new BigNumber(totalAmount?.toString()).toFixed(0),
      recipient,
      otp,
    };

    onWithdraw(
      {
        ...body,
      } as unknown as void,
      {
        onSuccess: () => {
          queryClient.invalidateQueries('wallet');
          // ToastEmitter.success(localize('sendSuccess'));
          sentModalRef.current?.open();
          // return navigation.navigate(RouteKey.HomeScreen);
        },
      },
    );
  };

  useEffect(() => {
    sentModalRef.current?.open();
  }, []);

  const handleNavigateOtherTransaction = () => {
    return navigation.navigate(RouteKey.SendScreen as never, {} as never);
  };

  const handleNavigateHistory = () => {
    return navigation.navigate(
      RouteKey.TransactionHistoryScreen as never,
      {} as never,
    );
  };

  const handleConfirm = async () => {
    verifyOTP(handleOnVerifySuccess);
  };

  const additionalInfo = () => {
    return (
      <View style={{marginTop: responsiveHeight(15)}}>
        <View style={styles.additionalWrapper}>
          <Text style={styles.network}>{localize('network')}</Text>
          <Text style={styles.network}>{sendData?.network}</Text>
        </View>
        <View style={styles.additionalWrapper}>
          <Text style={styles.network}>{localize('fee')}</Text>
          <Text style={styles.network}>
            {isOffChain ? '0' : feeData?.onchainWithdraw}{' '}
            {feeData?.feeToken?.symbol}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('confirm')} />
      <View style={{flex: 1}}>
        <View style={styles.confirmContentWrapper}>
          <Text style={styles.send}>{localize('send')}</Text>
          <NumberFormat
            value={userData?.sendData?.amount}
            renderText={formattedValue => (
              <Text style={styles.amount}>{formattedValue}</Text>
            )}
            suffix={` ${userData?.sendData?.symbol}`}
            displayType="text"
            type="text"
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale
          />
          <Text style={styles.send}>{localize('to')}</Text>
          <View style={styles.toWrapper}>
            {avatar ? (
              <FastImage
                source={{uri: getFile(avatar)}}
                style={{
                  marginRight: responsiveWidth(10),
                  width: responsiveWidth(35),
                  height: responsiveWidth(35),
                  borderRadius: responsiveWidth(25),
                }}
              />
            ) : (
              <Icon
                source={isOffChain ? Images.profileIcon : Images.walletIcon}
                size={responsiveWidth(35)}
                style={{marginRight: responsiveWidth(10)}}
              />
            )}
            <View>
              <Text style={styles.address}>{recipient}</Text>
              {!!name && <Text style={styles.name}>{name}</Text>}
              <Text
                style={[styles.network, {fontFamily: Fonts.montserratRegular}]}>
                {sendData?.network}
              </Text>
            </View>
          </View>
          <View style={styles.line} />
          {additionalInfo()}
        </View>
      </View>
      {checkValidTransaction() && (
        <Text style={styles.invalid}>
          {localize('theBalanceIsNotEnoughToPayTheFee')}{' '}
        </Text>
      )}
      <Button
        disabled={checkValidTransaction()}
        disabledStyle={{backgroundColor: grayBg}}
        title={localize('send')}
        buttonStyle={[
          RootStyles.primaryButton,
          {marginHorizontal: responsiveWidth(15)},
        ]}
        onPress={handleConfirm}
        titleStyle={RootStyles.primaryButtonText}
      />
      <Portal>
        <SentModal
          ref={sentModalRef}
          onOther={handleNavigateOtherTransaction}
          onHistory={handleNavigateHistory}
        />
      </Portal>
    </Container>
  );
};

export default ConfirmSendScreen;

const getStyles = (blackText: string, grayBg: string) =>
  StyleSheet.create({
    container: {},
    confirmContentWrapper: {
      marginTop: responsiveHeight(30),
      width: Layout.window.width - responsiveWidth(30),
      backgroundColor: grayBg,
      paddingVertical: responsiveHeight(15),
      paddingHorizontal: responsiveWidth(20),
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: responsiveWidth(8),
    },
    line: {
      width: Layout.window.width - responsiveWidth(30),
      height: 0.2,
      backgroundColor: blackText,
      alignSelf: 'center',
    },
    additionalWrapper: {
      ...RootStyles.rowSpaceStyle,
      marginVertical: responsiveHeight(5),
    },
    toWrapper: {
      ...RootStyles.rowStyle,
      marginVertical: responsiveHeight(15),
    },
    send: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.body,
      color: blackText,
    },
    name: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      color: blackText,
      fontWeight: 'bold',
      width: Layout.window.width - responsiveWidth(120),
      marginBottom: responsiveHeight(6),
    },
    address: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.label,
      color: blackText,
      width: Layout.window.width - responsiveWidth(120),
      marginBottom: responsiveHeight(6),
    },
    network: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
    },
    amount: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.h2,
      color: blackText,
      marginVertical: responsiveHeight(15),
    },
    invalid: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      color: blackText,
      textAlign: 'center',
      marginHorizontal: responsiveWidth(15),
    },
  });
