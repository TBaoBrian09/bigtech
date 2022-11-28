import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet, FlatList, Linking} from 'react-native';
import NumberFormat from 'react-number-format';
import {useInfiniteQuery} from 'react-query';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import SectionHeader from '../../common/SectionHeader';
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
import {UserContext} from '../../context/UserContext';
import {getTokenTransaction} from '../../utils/Api/ApiManage';
import {
  customListTokens,
  DIGITAL_MENU,
  DIGITAL_OFFCHAIN_MENU,
  TOKEN_ICON,
} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {
  calculateAsset,
  findSymbolByAddress,
  formatNumber,
} from '../../utils/utils';
import HistoryItem from './components/HistoryItem';
import IconItem from './components/IconItem';

interface DigitalDetailScreenProps {
  route?: any;
}

const DigitalDetailScreen = (props: DigitalDetailScreenProps) => {
  const navigation = useNavigation();
  const {token, totalPrice, amount} = props?.route?.params ?? {};
  const blackText = useThemeColor('blackText');
  const grayBG = useThemeColor('borderGray');
  const styles = getStyles(blackText, grayBG);
  const {userData} = React.useContext(UserContext);

  const MENU =
    token?.type === 'offChain' ? DIGITAL_OFFCHAIN_MENU : DIGITAL_MENU;

  const {data: transactionData, refetch} = useInfiniteQuery(
    ['transactionsDetailToken'],
    ({pageParam = 0}) =>
      getTokenTransaction({
        tokenAddress: customListTokens[token?.symbol]?.address,
        pageNumber: pageParam,
        pageSize: 10,
      }),
    {},
  );

  const transactionList = React.useMemo(
    () =>
      transactionData?.pages?.reduce(
        (arr: any, cur: any) => [...arr, ...cur.data?.data],
        [],
      ) || [],
    [transactionData],
  );

  const handlePress = (key: string) => {
    console.log('token', token);
    switch (key) {
      case 'send':
        return navigation.navigate(RouteKey.SendScreen);
      case 'receive':
        return navigation.navigate(RouteKey.ReceiveDigitalScreen, {
          token: token?.symbol?.toLowerCase(),
        });
      case 'viewSMC':
        return Linking.openURL(
          `https://bscscan.com/token/${token?.address}`,
        ).catch(err => console.error("Couldn't load page", err));
      default:
        return;
    }
  };

  const handleGetTransType = (desc: string) => {
    if (desc?.includes('on-chain')) {
      return 'On-chain';
    }
    if (desc?.includes('off-chain')) {
      return 'Off-chain';
    }
    return desc;
  };

  const keyExtractor = React.useCallback((item, index) => 'trans' + index, []);

  const renderEmpty = () => {
    return (
      <View style={styles.emptyItemStyle}>
        <Icon source={Images.emptyAssetsIcon} size={responsiveWidth(250)} />
      </View>
    );
  };

  const renderHeaderFlatlist = () => {
    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <NumberFormat
            value={formatNumber(amount)}
            renderText={formattedValue => (
              <Text style={styles.amount}>{formattedValue}</Text>
            )}
            suffix={` ${token?.symbol}`}
            displayType="text"
            type="text"
            thousandSeparator={true}
            decimalScale={8}
          />
          <NumberFormat
            value={totalPrice || 0}
            renderText={formattedValue => (
              <Text style={styles.value}>{formattedValue}</Text>
            )}
            prefix={'$'}
            displayType="text"
            type="text"
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale
          />
          <View
            style={[RootStyles.rowStyle, {marginTop: responsiveHeight(25)}]}>
            {MENU?.map((item, index) => (
              <IconItem
                key={item?.title}
                style={index === 1 && {marginHorizontal: responsiveWidth(32)}}
                title={localize(item?.title)}
                icon={item?.icon}
                onPress={() => handlePress(item.title)}
              />
            ))}
          </View>
        </View>
        <SectionHeader
          style={{
            marginTop: responsiveHeight(30),
            marginBottom: responsiveHeight(20),
          }}
          title={localize('transactions')}
          action={localize('viewAll')}
          onActionPress={() =>
            navigation.navigate(RouteKey.TransactionHistoryScreen, {
              token: token?.symbol,
            })
          }
        />
      </View>
    );
  };

  const renderItem = ({item}: any) => {
    const checkBalance =
      item?.from?.address === userData?.privateWallet?.address ? '-' : '+';
    const symbol = findSymbolByAddress(item?.tokenAddress);
    return (
      <HistoryItem
        type={item?.description}
        time={item?.createdAt}
        amount={
          checkBalance +
          calculateAsset(item?.amount, customListTokens[symbol]?.decimals)
        }
        status={item?.status}
        symbol={symbol}
        onPress={() => {
          navigation.navigate(RouteKey.HistoryDetailScreen, {
            data: item,
          });
        }}
      />
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
        centerComponent={
          <View style={[RootStyles.rowStyle, {alignSelf: 'center'}]}>
            <Icon
              source={TOKEN_ICON[token?.symbol]?.icon}
              size={responsiveWidth(35)}
              style={{marginRight: responsiveWidth(5)}}
            />
            <Text style={styles.titleHeader}>{token?.symbol}</Text>
          </View>
        }
      />
      <FlatList
        ListHeaderComponent={renderHeaderFlatlist()}
        contentContainerStyle={styles.contentContainerStyle}
        data={transactionList}
        keyExtractor={keyExtractor}
        refreshing={false}
        onRefresh={refetch}
        ListEmptyComponent={renderEmpty()}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default DigitalDetailScreen;

const getStyles = (blackText: string, grayBG: string) =>
  StyleSheet.create({
    container: {flex: 1},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingBottom: responsiveHeight(30),
    },
    emptyItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(20),
    },
    creditLineWrapper: {
      ...RootStyles.rowStyle,
      backgroundColor: grayBG,
      borderRadius: responsiveWidth(8),
      padding: responsiveWidth(10),
      width: Layout.window.width - responsiveWidth(30),
      marginTop: responsiveHeight(20),
    },
    creditItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderRightColor: blackText,
    },
    creditText: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
    },
    titleHeader: {
      fontSize: typographies.h3,
      fontFamily: Fonts.montserratBold,
      color: blackText,
    },
    amount: {
      fontSize: typographies.title,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      marginTop: responsiveHeight(20),
    },
    value: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      marginTop: responsiveHeight(10),
    },
  });
