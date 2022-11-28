import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {Modalize} from 'react-native-modalize';
import {useQueryClient} from 'react-query';
import Clipboard from '@react-native-clipboard/clipboard';
import {Button} from 'react-native-elements';
import {Portal} from 'react-native-portalize';

import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import {localize} from '../../assets/i18n/I18nConfig';
import RootStyles from '../../utils/styles';
import {cancelOrder} from '../../utils/Api/ApiManage';
import Fonts from '../../constants/Fonts';
import typographies from '../../constants/Typographies';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import ToastEmitter from '../../helpers/ToastEmitter';
import {calculateAsset} from '../../utils/utils';
import {customListTokens} from '../../utils/Constants';
import WarningModal from './Modal/WarningModal';
import SuccessModal from './Modal/SuccessModal';
import RouteKey from '../../constants/RouteKey';

type Params = {
  screen: {
    order?: any;
    price?: string;
    token: string;
    status?: any;
  };
};

interface MyOrderDetailScreenProps {
  route: RouteProp<Params, 'screen'>;
}

const MyOrderDetailScreen = ({route}: MyOrderDetailScreenProps) => {
  const {order, price, token, status} = route?.params ?? {};
  const queryClient = useQueryClient();
  const navigation = useNavigation<any>();
  const modalRef = useRef<Modalize | null>(null);
  const warningModalRef = useRef();
  const successModalRef = useRef();
  const isCompleted = ['cancelled', 'fulfilled'].includes(status);

  const blackText = useThemeColor('blackText');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(blackText, borderGray);

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
    navigation.goBack();
  };

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current?.open();
    }
  };

  const getAmount = () => {
    const calAmount = calculateAsset(
      +order?.amount,
      customListTokens[token].decimals,
    );
    return calAmount;
  };

  const copyToClipboard = () => {
    Clipboard.setString(order?.id);
    ToastEmitter.success(localize('copySuccess'));
  };

  const handleCancelOrder = async () => {
    await cancelOrder(order?.id);
    queryClient.invalidateQueries('myOrder');
    queryClient.invalidateQueries('wallet');
    successModalRef?.current?.open();
  };

  const handleConfirmlOrder = () => {
    onClosed();
  };

  return (
    <Modalize
      ref={modalRef}
      onClose={onClosed}
      withHandle={true}
      panGestureEnabled={true}
      closeOnOverlayTap={true}
      modalHeight={Layout.window.height * 0.6}
      scrollViewProps={{
        bounces: false,
        scrollEnabled: false,
        contentContainerStyle: {
          height: '100%',
        },
      }}>
      <View style={styles.wrapper}>
        <View style={styles.headerWrapper}>
          <Text style={styles.header}>{localize('orderDetail')}</Text>
        </View>
        <View style={RootStyles.rowSpaceStyle}>
          <View style={{flex: 3}}>
            <Text style={styles.label}>{localize('orderId')}</Text>
            <Text style={styles.text} numberOfLines={1}>
              {order?.id}
            </Text>
          </View>
          <TouchableOpacity
            onPress={copyToClipboard}
            style={styles.copyWrapper}>
            <Text style={styles.copy}>{localize('copy')}</Text>
          </TouchableOpacity>
        </View>

        <View style={[RootStyles.rowStyle, {marginTop: responsiveHeight(10)}]}>
          <View style={{flex: 0.6}}>
            <Text style={styles.label}>{localize('amount')}</Text>
            <Text style={styles.text}>{getAmount()}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>{localize('priceType')}</Text>
            <Text style={styles.text}>{localize('fixed')}</Text>
          </View>
        </View>

        <View style={[RootStyles.rowStyle, {marginTop: responsiveHeight(10)}]}>
          <View style={{flex: 0.6}}>
            <Text style={styles.label}>{localize('price')}</Text>
            <Text style={styles.text}>{price}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.label}>{localize('numberOfSales')}</Text>
            <Text style={styles.text}>{order?.allTransactionCount}</Text>
          </View>
        </View>

        {!isCompleted && (
          <Button
            onPress={() => warningModalRef.current?.open()}
            title={localize('closeOrder')}
            buttonStyle={[
              RootStyles.primaryButton,
              {marginVertical: responsiveHeight(15)},
            ]}
            titleStyle={RootStyles.primaryButtonText}
          />
        )}
        <TouchableOpacity
          style={isCompleted && {marginVertical: responsiveHeight(15)}}
          onPress={() =>
            navigation.navigate(RouteKey.OrderTransactionScreen, {
              // tokenId: order?.tokenId,
              orderId: order?.id,
            })
          }>
          <Text style={styles.orderHistory}>{localize('orderHistory')}</Text>
        </TouchableOpacity>
      </View>
      <Portal>
        <WarningModal
          ref={warningModalRef}
          keyItem={'warningModal'}
          onPress={handleCancelOrder}
        />
        <SuccessModal
          ref={successModalRef}
          keyItem={'successModal'}
          onPress={handleConfirmlOrder}
        />
      </Portal>
    </Modalize>
  );
};

export default MyOrderDetailScreen;

const getStyles = (blackText: string, borderGray: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper: {
      flex: 1,
      paddingVertical: responsiveHeight(20),
      paddingHorizontal: responsiveWidth(15),
    },
    headerWrapper: {
      paddingBottom: responsiveHeight(15),
      borderBottomWidth: 0.2,
      borderBottomColor: blackText,
      marginBottom: responsiveHeight(25),
      marginHorizontal: responsiveWidth(-15),
    },
    copyWrapper: {
      paddingHorizontal: responsiveWidth(10),
      paddingVertical: responsiveHeight(4),
      borderRadius: responsiveWidth(4),
      backgroundColor: primary.color,
      opacity: 0.6,
      marginLeft: responsiveWidth(20),
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.body,
      color: blackText,
      textAlign: 'center',
    },
    label: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
    },
    text: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      color: blackText,
    },
    orderHistory: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: primary.color,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    copy: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: white,
    },
  });
