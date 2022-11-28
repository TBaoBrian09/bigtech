/* eslint-disable react-hooks/exhaustive-deps */
import {RouteProp, useNavigation} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useInfiniteQuery} from 'react-query';
import {localize} from '../../assets/i18n/I18nConfig';

import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {UserContext} from '../../context/UserContext';
import {OrderItem} from '../../models/order';
import {getOrderTransaction} from '../../utils/Api/ApiManage';
import {
  customListTokens,
  customListTokensByAddress,
} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {calculateAsset} from '../../utils/utils';
import OrderTransactionItem from './components/OrderTransactionItem';

type Params = {
  screen: {
    tokenId: string;
    orderId?: string;
  };
};

interface OrderTransactionScreenProps {
  route: RouteProp<Params, 'screen'>;
}

const OrderTransactionScreen = ({route}: OrderTransactionScreenProps) => {
  const {tokenId, orderId} = route?.params ?? {};
  const navigation = useNavigation();

  const darkGray = useThemeColor('darkGray');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(borderGray, darkGray);

  const {userData} = useContext(UserContext);

  const [currentTokenId, setCurrentTokenId] = useState<number>(0);

  useEffect(() => {
    if (tokenId) {
      setCurrentTokenId(tokenId);
    }
  }, [tokenId]);

  const {
    data: orderData,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['orderTransactionP2P', currentTokenId, orderId],
    ({pageParam = 0}) =>
      getOrderTransaction({
        orderId,
        page: pageParam,
        limit: 10,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages?.length < 10) {
          return pages?.length;
        }
        return undefined;
      },
    },
  );

  const orderList: OrderItem[] = useMemo(
    () =>
      orderData?.pages?.reduce(
        (arr: any, cur: any) => [...arr, ...cur.data?.data],
        [],
      ) || [],
    [orderData],
  );

  const renderItem = ({item}) => {
    const calPrice = calculateAsset(
      +item?.order?.price,
      customListTokens.USDT.decimals,
    );
    const calTotal = calculateAsset(
      +item?.total,
      customListTokens.USDT.decimals,
    );
    const findToken = userData?.privateWallet?.tokens?.find(
      token => token?.id === item?.order?.tokenId,
    );
    const getTokenSymbol = customListTokensByAddress[findToken?.address];
    const calAmount = calculateAsset(
      +item?.amount,
      customListTokens[getTokenSymbol].decimals,
    );
    const title = calAmount + ' ' + getTokenSymbol?.toUpperCase();
    return (
      <OrderTransactionItem
        style={{
          marginHorizontal: responsiveWidth(-15),
          paddingHorizontal: responsiveWidth(15),
        }}
        type={item?.order?.type}
        title={title}
        createdAt={item?.createdAt}
        token={getTokenSymbol}
        total={calTotal}
        onPress={() =>
          navigation.navigate(RouteKey.OrderTransactionDetailScreen, {
            orderDetail: item,
            price: calPrice,
            amount: calAmount,
            token: getTokenSymbol,
          })
        }
      />
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyItemStyle}>
        <Icon source={Images.emptyAssetsIcon} size={responsiveWidth(250)} />
      </View>
    );
  };

  const keyExtractor = useCallback((item, index) => 'order' + index, []);

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <Header
        hasBackButton={false}
        rightStyle={{flex: 1}}
        title={localize('orderHistory')}
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
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={orderList}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty()}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={() => hasNextPage && fetchNextPage()}
        refreshing={false}
        onRefresh={refetch}
      />
    </Container>
  );
};

export default OrderTransactionScreen;

const getStyles = (borderGray: string, darkGray: string) =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingBottom: responsiveHeight(30),
    },
    tabbarWrapper: {
      ...RootStyles.rowStyle,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: borderGray,
      flex: 1,
      height: responsiveHeight(33),
      borderRadius: responsiveWidth(20),
      marginTop: responsiveHeight(10),
      marginBottom: responsiveHeight(15),
    },
    selectedTabBarItem: {
      backgroundColor: darkGray,
    },
    emptyItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(20),
    },
    headerIcon: {
      marginLeft: responsiveWidth(4),
      width: responsiveWidth(12),
      height: responsiveHeight(7),
    },
    headerText: {
      fontFamily: Fonts.montserratMedium,
      color: 'black',
      fontSize: typographies.subTitle,
    },
  });
