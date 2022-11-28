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
import {getAllOrders} from '../../utils/Api/ApiManage';
import {customListTokens, TOKEN_ICON} from '../../utils/Constants';
import LocalStorage from '../../utils/LocalStorage';
import RootStyles from '../../utils/styles';
import {calculateAsset, sortTokensArray} from '../../utils/utils';
import KYCRequireModal from '../Assets/Modal/KYCRequireModal';
import P2PItem from './components/P2PItem';
import ListTokenModal from './Modal/ListTokenModal';

const TAB = ['buy', 'sell'];

const P2PTradingScreen = () => {
  const navigation = useNavigation();

  const darkGray = useThemeColor('darkGray');
  const borderGray = useThemeColor('borderGray');
  const styles = getStyles(borderGray, darkGray);

  const [tabBar, setTabBar] = useState<string>('buy');
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
    ['orderP2P', tabBar, tokenId],
    ({pageParam = 0}) => {
      const type = tabBar === 'buy' ? 'sell' : 'buy'; // contrast for buyer

      return getAllOrders({
        tokenId: tokenId,
        page: pageParam,
        sortOrder: tabBar === 'buy' ? 'ASC' : 'DESC',
        type,
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

  const orderList: OrderItem[] = useMemo(() => {
    const tmp =
      orderData?.pages?.reduce(
        (arr: any, cur: any) => [...arr, ...cur.data?.data],
        [],
      ) || [];

    tmp.sort((a, b) => {
      return tabBar === 'buy'
        ? calculateAsset(a.price, customListTokens.USDT.decimals) -
            calculateAsset(b.price, customListTokens.USDT.decimals)
        : calculateAsset(b.price, customListTokens.USDT.decimals) -
            calculateAsset(a.price, customListTokens.USDT.decimals);
    });
    return tmp;
  }, [orderData]);

  const handleSelectToken = (token: Assets) => {
    setTokenSymbol(token?.symbol);
  };

  const navigationKYCProfile = async () => {
    const userProfile = await LocalStorage.getData('user');

    if (userProfile?.profile?.verifyStatus === 'rejected') {
      return navigation.navigate(RouteKey.RejectedScreen, {
        rejectedReson: userData?.profile?.rejectReason,
      });
    }
    if (userData?.profile?.verifyStatus === 'uploaded') {
      return navigation.navigate(RouteKey.KYCPendingScreen);
    }

    return navigation.navigate(RouteKey.KYCOnboardingScreen);
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

    return (
      <P2PItem
        disabled={isYou}
        style={{
          marginHorizontal: responsiveWidth(-15),
          paddingHorizontal: responsiveWidth(15),
        }}
        name={`${item?.user?.name} ${isYou ? localize('(you)') : ''}`}
        price={calPrice}
        type={tabBar}
        amount={calAmount}
        token={tokenSymbol?.toUpperCase()}
        createdAt={item?.createdAt}
        onUserPress={
          !isYou
            ? () => {
                navigation.navigate(RouteKey.P2PUserScreen, {
                  user: item?.user,
                });
              }
            : undefined
        }
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
            orderType: tabBar,
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

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.tabbarWrapper}>
          {TAB.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tabBarItem,
                item === tabBar && styles.selectedTabBarItem,
              ]}
              onPress={() => setTabBar(item)}>
              <Text style={styles.tabBarText}>{localize(item)}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
            style={{width: responsiveWidth(12), height: responsiveHeight(7)}}
          />
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
        hasBackButton={false}
        rightStyle={{flex: 1}}
        title="P2P Trading"
        rightComponent={
          <View style={[RootStyles.rowStyle, {alignSelf: 'flex-end'}]}>
            <Icon
              source={Images.profileOutlineIcon}
              size={responsiveWidth(20)}
              onPress={() =>
                navigation.navigate(
                  RouteKey.MyOrderScreen as never,
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
      <View style={styles.menuWrapper}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            {
              backgroundColor: primary.color,
            },
          ]}
          onPress={async () => {
            const userProfile = await LocalStorage.getData('user');
            if (userProfile?.profile?.verifyStatus !== 'verified') {
              return kycVerifyRef.current?.open();
            }

            navigation.navigate(RouteKey.CreateOrderScreen, {
              orderType: 'buy',
              refetchList: refetch,
            });
          }}>
          <Text style={[styles.title, {color: white}]}>{localize('buy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, {marginRight: 0}]}
          onPress={async () => {
            const userProfile = await LocalStorage.getData('user');
            if (userProfile?.profile?.verifyStatus !== 'verified') {
              return kycVerifyRef.current?.open();
            }

            navigation.navigate(RouteKey.CreateOrderScreen, {
              orderType: 'sell',
              refetchList: refetch,
            });
          }}>
          <Text style={[styles.title, {color: white}]}>{localize('sell')}</Text>
        </TouchableOpacity>
      </View>
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
        <KYCRequireModal
          ref={kycVerifyRef}
          keyItem={'kyc'}
          onPress={navigationKYCProfile}
        />
      </Portal>
    </Container>
  );
};

export default P2PTradingScreen;

const getStyles = (borderGray: string, darkGray: string) =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingBottom: responsiveHeight(50),
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
    menuWrapper: {
      position: 'absolute',
      zIndex: 1,
      paddingVertical: responsiveHeight(10),
      bottom: responsiveHeight(0),
      left: responsiveWidth(0),
      width: Layout.window.width,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderTopColor: '#000',
      borderTopWidth: 0.2,
    },
    tabBarText: {
      color: primary.color,
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratMedium,
      textTransform: 'capitalize',
    },
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: '#606060',
    },
    menuItem: {
      minWidth: responsiveWidth(130),
      alignItems: 'center',
      justifyContent: 'center',
      height: responsiveHeight(34),
      backgroundColor: '#FFAE58',
      borderRadius: responsiveWidth(5),
      marginRight: responsiveHeight(7),
    },
  });
