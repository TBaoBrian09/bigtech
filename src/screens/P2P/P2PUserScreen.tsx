/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useInfiniteQuery} from 'react-query';
import {localize} from '../../assets/i18n/I18nConfig';

import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {UserContext} from '../../context/UserContext';
import {useGetMe} from '../../hooks/useQueries';
import {Assets} from '../../models/assets';
import {OrderItem} from '../../models/order';
import {User} from '../../models/user';
import {
  getAllOrders,
  getAllOrdersByUserId,
  getFile,
} from '../../utils/Api/ApiManage';
import {customListTokens, TOKEN_ICON} from '../../utils/Constants';
import LocalStorage from '../../utils/LocalStorage';
import RootStyles from '../../utils/styles';
import {
  calculateAsset,
  generatePhoneNumber,
  sortTokensArray,
} from '../../utils/utils';
import KYCRequireModal from '../Assets/Modal/KYCRequireModal';
import P2PItem from './components/P2PItem';
import ListTokenModal from './Modal/ListTokenModal';

interface P2PUserScreenProps {
  route?: any;
}

const P2PUserScreen = (props: P2PUserScreenProps) => {
  const navigation = useNavigation();
  const {
    user,
  }: {
    user: {
      name: string;
      id: string;
    };
  } = props?.route?.params ?? {};

  const darkGray = useThemeColor('darkGray');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(borderGray, darkGray);
  const [tokenSymbol, setTokenSymbol] = useState<string>('BTG');

  const tokenRef = useRef<Modalize>();
  const kycVerifyRef = React.useRef<Modalize>();
  // @ts-ignore
  const {userData} = useContext(UserContext);
  const {data} = useGetMe();
  const profileData = data?.data as User;
  const listToken = Object.values(userData?.priceToken);
  const tokenId = useMemo(
    () =>
      userData?.privateWallet?.tokens?.find(
        item =>
          item?.address ===
          customListTokens[tokenSymbol?.toUpperCase()].address,
      )?.id,
    [tokenSymbol],
  );

  const {
    data: orderData,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['orderP2P', user?.id, tokenId],
    ({pageParam = 0}) => {
      return getAllOrdersByUserId({
        userId: user?.id,
        page: pageParam,
        tokenId: tokenId,
      });
    },
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

  const handleSelectToken = (token: Assets) => {
    setTokenSymbol(token?.symbol);
  };

  const renderItem = ({item}) => {
    const isYou = profileData?.id === item?.user?.id;
    const calPrice = calculateAsset(
      +item?.price,
      customListTokens.USDT.decimals,
    );
    const calAmount = calculateAsset(
      +item?.amount,
      customListTokens[tokenSymbol?.toUpperCase()].decimals,
    );
    const orderType = item.type === 'sell' ? 'buy' : 'sell';

    return (
      <P2PItem
        disabled={isYou}
        style={{
          marginHorizontal: responsiveWidth(-15),
          paddingHorizontal: responsiveWidth(15),
        }}
        name={`${item?.user?.name} ${isYou ? localize('(you)') : ''}`}
        price={calPrice}
        type={orderType}
        amount={calAmount}
        token={tokenSymbol?.toUpperCase()}
        createdAt={item?.createdAt}
        onBgPress={
          isYou
            ? () =>
                navigation.navigate(RouteKey.MyOrderDetailScreen, {
                  order: item,
                  price: calPrice,
                  token: tokenSymbol?.toUpperCase(),
                  status: item?.status,
                })
            : undefined
        }
        onPress={async () => {
          const userProfile = await LocalStorage.getData('user');
          if (userProfile?.profile?.verifyStatus !== 'verified') {
            return kycVerifyRef.current?.open();
          }

          navigation.navigate(RouteKey.BuySellScreen, {
            orderType,
            order: item,
            amount: calAmount,
            price: calPrice,
            token: tokenSymbol?.toUpperCase(),
            refetchList: refetch,
          });
        }}
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
        hasBackButton={true}
        rightStyle={{flex: 1}}
        title={localize('p2pUserInfo')}
      />
      <View style={styles.topContainer}>
        <View style={RootStyles.rowStyle}>
          <Icon
            source={Images.profileIcon}
            size={responsiveWidth(28)}
            style={{marginRight: responsiveWidth(10)}}
          />
          <View>
            <View style={RootStyles.rowStyle}>
              <Text style={styles.textItem}>{user?.name}</Text>
              <Icon source={Images.checkSuccess} size={responsiveWidth(18)} />
            </View>
            <Text style={styles.subText} t>
              {user?.id}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.line} />
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={orderList}
        renderItem={renderItem}
        ListHeaderComponent={() => {
          return (
            <View>
              <TouchableOpacity
                style={RootStyles.rowStyle}
                onPress={() => tokenRef.current?.open()}>
                <Icon
                  source={TOKEN_ICON[tokenSymbol].icon}
                  size={responsiveWidth(30)}
                  style={{marginRight: responsiveWidth(5)}}
                />
                <Icon
                  source={Images.arrowDownIcon}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveHeight(7),
                  }}
                />
              </TouchableOpacity>
            </View>
          );
        }}
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
          // @ts-ignore
          listToken={sortTokensArray(listToken)?.filter(
            item => item?.symbol !== 'USDT',
          )}
        />
      </Portal>
    </Container>
  );
};

export default P2PUserScreen;

const getStyles = (borderGray: string, darkGray: string) =>
  StyleSheet.create({
    container: {},
    topContainer: {
      paddingTop: responsiveHeight(15),
      paddingHorizontal: responsiveWidth(15),
      paddingBottom: responsiveHeight(25),
    },
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(30),
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
    tabBarItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: responsiveHeight(33),
      borderRadius: responsiveWidth(20),
    },
    emptyItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(20),
    },
    plusIcon: {
      position: 'absolute',
      zIndex: 1,
      bottom: responsiveHeight(0),
      right: responsiveWidth(20),
    },
    tabBarText: {
      color: primary.color,
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratMedium,
      textTransform: 'capitalize',
    },
    line: {
      height: 0.5,
      width: Layout.window.width,
      backgroundColor: 'black',
      marginBottom: responsiveHeight(15),
    },
    textItem: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      color: 'black',
      marginRight: responsiveWidth(5),
    },
    subText: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.label,
      color: '#aaa',
      marginTop: responsiveWidth(2),
    },
  });
