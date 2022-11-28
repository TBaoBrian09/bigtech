/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
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
import {Assets} from '../../models/assets';
import {OrderItem} from '../../models/order';
import {getMyOrders} from '../../utils/Api/ApiManage';
import {
  customListTokens,
  customListTokensByAddress,
} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {calculateAsset, sortTokensArray} from '../../utils/utils';
import MyOrderItem from './components/MyOrderItem';
import ActionModal from './Modal/ActionModal';
import ListTokenModal from './Modal/ListTokenModal';

const MyOrderScreen = () => {
  const navigation = useNavigation();

  const darkGray = useThemeColor('darkGray');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(borderGray, darkGray);

  const [orderType, setOrderType] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenId, setTokenId] = useState<number | undefined>(0);

  const tokenRef = useRef<Modalize>();
  const actionModalRef = useRef();
  const {userData} = useContext(UserContext);
  const listToken = Object.values(userData?.priceToken);

  const {
    data: orderData,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['myOrder', orderType, tokenId],
    ({pageParam = 0}) =>
      getMyOrders({
        page: pageParam,
        type: orderType,
        tokenId,
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

  const handleSelectToken = (token: Assets | any) => {
    if (!token) {
      setTokenSymbol('');
      setTokenId(0);
      return;
    }
    setTokenSymbol(token?.symbol?.toUpperCase());
    setTokenId(token?.id);
  };

  const handleSelectAction = (type: string) => {
    if (type === 'all') return setOrderType('');
    setOrderType(type);
  };

  const renderItem = ({item}) => {
    const calPrice = calculateAsset(
      +item?.price,
      customListTokens.USDT.decimals,
    );
    const findToken = userData?.privateWallet?.tokens?.find(
      token => token?.id === item?.tokenId,
    );
    const getTokenSymbol = customListTokensByAddress[findToken?.address];
    const calAmount = calculateAsset(
      +item?.amount,
      customListTokens[getTokenSymbol].decimals,
    );
    const name = `${localize(
      item.type === 'buy' ? 'buy' : 'sell',
    )} ${getTokenSymbol}`;

    return (
      <MyOrderItem
        style={{
          marginHorizontal: responsiveWidth(-15),
          paddingHorizontal: responsiveWidth(15),
        }}
        name={name}
        price={calPrice}
        status={item?.status}
        amount={calAmount}
        createdAt={item?.createdAt}
        token={getTokenSymbol}
        onPress={() =>
          navigation.navigate(RouteKey.MyOrderDetailScreen, {
            order: item,
            price: calPrice,
            token: getTokenSymbol,
            status: item?.status,
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

  const renderHeader = () => {
    return (
      <View style={[RootStyles.rowStyle, {marginTop: responsiveHeight(15)}]}>
        <TouchableOpacity
          style={[RootStyles.rowStyle, {marginRight: responsiveWidth(15)}]}
          onPress={() => tokenRef?.current?.open()}>
          <Text style={styles.headerText}>
            {tokenSymbol || localize('all')}
          </Text>
          <Icon source={Images.arrowDownIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={RootStyles.rowStyle}
          onPress={() => actionModalRef?.current?.open()}>
          <Text style={styles.headerText}>
            {orderType ? localize(orderType) : localize('all')}
          </Text>
          <Icon source={Images.arrowDownIcon} style={styles.headerIcon} />
        </TouchableOpacity>
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
        hasBackButton={true}
        rightStyle={{flex: 1}}
        title={localize('myOrder')}
        rightComponent={
          <View style={[RootStyles.rowStyle, {alignSelf: 'flex-end'}]}>
            <Icon
              source={Images.historyIcon}
              size={responsiveWidth(20)}
              onPress={() =>
                navigation.navigate(
                  RouteKey.OrderTransactionScreen as never,
                  {} as never,
                )
              }
            />
          </View>
        }
      />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={orderList}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty()}
        keyExtractor={keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={() => hasNextPage && fetchNextPage()}
        refreshing={false}
        onRefresh={refetch}
      />
      <Portal>
        <ListTokenModal
          ref={tokenRef}
          keyItem={'token'}
          onPress={handleSelectToken}
          hasAllType={true}
          // @ts-ignore
          listToken={sortTokensArray(listToken)?.filter(
            item => item?.symbol !== 'USDT',
          )}
        />
        <ActionModal
          ref={actionModalRef}
          keyItem={'actionModal'}
          onPress={handleSelectAction}
        />
      </Portal>
    </Container>
  );
};

export default MyOrderScreen;

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
