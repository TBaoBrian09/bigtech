/* eslint-disable react-hooks/exhaustive-deps */
import Clipboard from '@react-native-clipboard/clipboard';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import React, {useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {localize} from '../../assets/i18n/I18nConfig';

import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import typographies from '../../constants/Typographies';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useGetMe} from '../../hooks/useQueries';
import {User} from '../../models/user';
import {customListTokens} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {calculateAsset} from '../../utils/utils';

type Params = {
  screen: {
    orderDetail: any;
    price: number;
    amount: number;
    token: string;
  };
};

interface OrderTransactionDetailScreenProps {
  route: RouteProp<Params, 'screen'>;
}

const FORM = [
  {label: 'orderId', key: 'id', isCustom: true},
  {label: 'time', key: 'time'},
  {label: 'price', key: 'price'},
  {label: 'amountReceive', key: 'total'},
  {label: 'buyer', key: 'buyer', isCustom: true},
  {label: 'seller', key: 'seller', isCustom: true},
];

const OrderTransactionDetailScreen = ({
  route,
}: OrderTransactionDetailScreenProps) => {
  const {orderDetail, price, amount, token} = route?.params ?? {};
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const grayText = useThemeColor('grayText');
  const styles = getStyles(blackText, grayText);

  const {data} = useGetMe();
  const profileData = data?.data as User;

  const calTotal = useMemo(
    () => calculateAsset(+orderDetail?.total, customListTokens.USDT.decimals),
    [],
  );

  const copyToClipboard = () => {
    Clipboard.setString(orderDetail?.id);
    ToastEmitter.success(localize('copySuccess'));
  };

  const handleCustomValue = (keyItem: string) => {
    const userType = orderDetail?.order?.type === 'sell' ? 'seller' : 'buyer';

    switch (keyItem) {
      case 'id':
        return (
          <View style={[RootStyles.rowStyle, {flex: 2}]}>
            <Text style={styles.idText} numberOfLines={1}>
              {orderDetail?.id}
            </Text>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.copyWrapper}>
              <Text style={styles.copy}>{localize('copy')}</Text>
            </TouchableOpacity>
          </View>
        );
      case 'buyer':
      case 'seller':
        return (
          <View style={{flex: 1}}>
            <Text style={styles.title}>
              {userType === keyItem ? profileData?.profile?.name : ''}
            </Text>
            <Text style={styles.subTitle}>
              {userType === keyItem ? profileData?.id : ''}
            </Text>
          </View>
        );
    }
  };

  const handleRightValue = (keyItem: string) => {
    switch (keyItem) {
      case 'time':
        return format(new Date(orderDetail?.createdAt), 'dd/MM/yyyy hh:mm:ss');
      case 'price':
        return price;
      case 'total':
        return calTotal?.toFixed(2) + ' ' + 'USDT';
    }
  };

  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.label}>{localize(item?.label)}</Text>
        {item?.isCustom ? (
          handleCustomValue(item?.key)
        ) : (
          <View style={{flex: 1}}>
            <Text style={styles.title}>{handleRightValue(item?.key)}</Text>
          </View>
        )}
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
        rightStyle={{flex: 1}}
        title={localize('orderTransactionDetail')}
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
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.headerWrapper}>
          <Text style={styles.type}>{localize(orderDetail?.order?.type)}</Text>
          <Text style={styles.header}>
            {orderDetail?.order?.type === 'buy' ? '-' : '-'}
            {amount} {token}
          </Text>
          <Text style={styles.success}>{localize('success')}</Text>
        </View>

        {FORM.map(item => (
          <View key={item?.label}>{renderItem(item)}</View>
        ))}
      </ScrollView>
    </Container>
  );
};

export default OrderTransactionDetailScreen;

const getStyles = (blackText: string, grayText: string) =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingBottom: responsiveHeight(30),
    },
    headerWrapper: {
      paddingBottom: responsiveHeight(20),
      borderBottomColor: blackText,
      borderBottomWidth: 0.2,
      marginBottom: responsiveHeight(15),
    },
    copyWrapper: {
      paddingHorizontal: responsiveWidth(10),
      paddingVertical: responsiveHeight(4),
      borderRadius: responsiveWidth(4),
      backgroundColor: primary.color,
      opacity: 0.6,
      marginLeft: responsiveWidth(20),
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      color: blackText,
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.h2,
      marginVertical: responsiveHeight(15),
      textAlign: 'center',
    },
    item: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingVertical: responsiveHeight(15),
    },
    type: {
      color: blackText,
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subhead,
      textAlign: 'center',
      textTransform: 'capitalize',
    },
    success: {
      color: primary.color,
      fontFamily: Fonts.montserratRegular,
      fontSize: typographies.footnote,
      textAlign: 'center',
    },
    label: {
      flex: 1,
      color: blackText,
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
    },
    copy: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: white,
    },
    title: {
      color: blackText,
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subhead,
      textAlign: 'right',
    },
    subTitle: {
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      fontSize: typographies.footnote,
      marginTop: responsiveHeight(10),
      textAlign: 'right',
    },
    idText: {
      color: blackText,
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subhead,
      textAlign: 'right',
      flex: 2,
    },
  });
