import {useNavigation} from '@react-navigation/native';
import {endOfDay, format, startOfDay} from 'date-fns';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {CalendarList} from 'react-native-calendars';
import {Button} from 'react-native-elements';
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
import {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import {UserContext} from '../../context/UserContext';
import {Assets} from '../../models/assets';
import {getTokenTransaction} from '../../utils/Api/ApiManage';
import {customListTokens, TOKEN_ICON} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {
  calculateAsset,
  findTokenByAddress,
  sortTokensArray,
} from '../../utils/utils';
import HistoryItem from './components/HistoryItem';
import TokenModal from './Modal/TokenModal';

interface TransactionHistoryScreenProps {
  route?: any;
}

const TransactionHistoryScreen = (props: TransactionHistoryScreenProps) => {
  const {token} = props?.route?.params ?? {};
  const navigation = useNavigation();

  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const [isCalendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [digital, setDigital] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState({
    from: '',
    to: '',
  });
  const [currentDate, setCurrentDate] = useState({
    from: format(new Date(), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
    currentDate: Date.now(),
  });

  const {userData} = React.useContext(UserContext);
  const listToken = sortTokensArray(Object.values(userData?.priceToken));
  const tokenModalRef = useRef();

  useEffect(() => {
    if (token) {
      setDigital(token);
    } else {
      setDigital(listToken[0]?.symbol);
    }
  }, [token]);

  const {
    data: transactionData,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ['transactions', digital, currentDate],
    ({pageParam = 0}) =>
      getTokenTransaction({
        tokenAddress: customListTokens[digital]?.address,
        pageNumber: pageParam,
        fromDate: format(
          startOfDay(new Date(currentDate?.from)),
          "yyyy-MM-dd'T'HH:mm:ss'Z'",
        ),
        toDate: format(
          endOfDay(new Date(currentDate?.to)),
          "yyyy-MM-dd'T'HH:mm:ss'Z'",
        ),
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages?.length < 3) {
          return pages?.length;
        }
        return undefined;
      },
      enabled: !!digital,
    },
  );

  const transactionList = React.useMemo(
    () =>
      transactionData?.pages?.reduce(
        (arr: any, cur: any) => [...arr, ...cur.data?.data],
        [],
      ) || [],
    [transactionData],
  );

  const handleGetTransType = (desc: string) => {
    if (desc?.includes('on-chain')) {
      return 'On-chain';
    }
    if (desc?.includes('off-chain')) {
      return 'Off-chain';
    }
    if (desc?.includes('p2p')) {
      return 'P2P';
    }
    return desc;
  };

  const handleSelectToken = (selectedToken: Assets) => {
    setDigital(selectedToken);
  };

  const formatDate = (date: any) => {
    return moment(date).format('YYYY-MM-DD');
  };

  const handleDatePress = (date: any) => {
    if (!!selectedDate?.from && !!selectedDate?.to) {
      return setSelectedDate({from: date?.dateString, to: ''});
    }
    if (date?.dateString < selectedDate?.from || !selectedDate?.from) {
      return setSelectedDate({from: date?.dateString, to: ''});
    }
    if (
      !!selectedDate?.from &&
      !selectedDate?.to &&
      date?.dateString > selectedDate?.from
    ) {
      setSelectedDate({...selectedDate, to: date?.dateString});
    }
  };

  const generateMarkedDates = () => {
    let markedDates = {};
    const from = moment(selectedDate?.from);
    const to = moment(selectedDate?.to);
    const diffDate = from.diff(to, 'days') * -1;
    if (!!selectedDate?.from && !selectedDate?.to) {
      markedDates = {
        ...markedDates,
        [formatDate(from)]: {
          startingDay: true,
          color: primary.color,
          textColor: white,
          fontFamily: Fonts.montserratMedium,
        },
      };
    }
    if (selectedDate?.from && selectedDate?.to) {
      markedDates = {
        ...markedDates,
        [formatDate(from)]: {
          startingDay: true,
          color: primary.color,
          textColor: white,
          fontFamily: Fonts.montserratMedium,
        },
      };
      for (let i = 0; i < diffDate; i++) {
        markedDates = {
          ...markedDates,
          [formatDate(from.add(1, 'days'))]: {
            color: i === diffDate - 1 ? primary.color : '#82A49A',
            textColor: white,
            endingDay: i === diffDate - 1,
            fontFamily: Fonts.montserratMedium,
          },
        };
      }
    }
    return markedDates;
  };

  const handleConfirmDate = () => {
    setCalendarVisible(false);
    if (selectedDate?.from && !selectedDate?.to) {
      return setCurrentDate({
        ...selectedDate,
        to: Date.now(),
        currentDate: Date.now(),
      });
    }
    if (!selectedDate?.from && !selectedDate?.to) {
      return setCurrentDate({from: '', to: '', currentDate: Date.now()});
    }
    setCurrentDate({...selectedDate, currentDate: Date.now()});
  };

  const showCalendar = () => {
    if (isCalendarVisible) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const minDate = format(new Date('2022-03-20'), 'yyyy-MM-dd');
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <CalendarList
              markingType="period"
              theme={{
                textMonthFontFamily: Fonts.montserratMedium,
              }}
              pastScrollRange={12}
              futureScrollRange={12}
              current={today}
              maxDate={today}
              minDate={minDate}
              scrollEnabled={true}
              showScrollIndicator={true}
              onDayPress={date => handleDatePress(date)}
              markedDates={generateMarkedDates()}
            />
          </View>
          <Button
            title={localize('confirm')}
            onPress={handleConfirmDate}
            buttonStyle={[
              RootStyles.primaryButton,
              {marginHorizontal: responsiveWidth(15)},
            ]}
            titleStyle={RootStyles.primaryButtonText}
          />
        </View>
      );
    }
  };

  const keyExtractor = React.useCallback(
    (item, index) => 'history' + index,
    [],
  );

  const renderHeader = () => {
    return (
      <View
        style={[
          RootStyles.rowSpaceStyle,
          {
            paddingHorizontal: responsiveWidth(15),
            paddingVertical: responsiveHeight(10),
          },
        ]}>
        <TouchableOpacity
          style={RootStyles.rowStyle}
          onPress={() => tokenModalRef?.current?.open()}>
          <Icon
            source={TOKEN_ICON[digital]?.icon}
            size={responsiveWidth(20)}
            style={{marginRight: responsiveWidth(10)}}
          />
          <Text style={styles.header}>{digital}</Text>
          <Icon source={Images.arrowDownIcon} size={responsiveWidth(8)} />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={[RootStyles.rowStyle, {alignSelf: 'flex-end'}]}
            onPress={() => setCalendarVisible(!isCalendarVisible)}>
            <Text style={styles.header}>{localize('time')}</Text>
            <Icon
              source={
                isCalendarVisible ? Images.arrowUpIcon : Images.arrowDownIcon
              }
              size={responsiveWidth(8)}
              color={primary.color}
            />
          </TouchableOpacity>
          {currentDate?.from && currentDate?.to ? (
            <Text style={styles.date}>
              {format(new Date(currentDate?.from), 'dd/MM/yy')} -{' '}
              {format(new Date(currentDate?.to), 'dd/MM/yy')}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyItemStyle}>
        <Icon source={Images.emptyAssetsIcon} size={responsiveWidth(250)} />
      </View>
    );
  };

  const renderItem = ({item}) => {
    // const type = handleGetTransType(item?.description?.toLowerCase());
    const checkBalance =
      item?.from?.address === userData?.privateWallet?.address ? '-' : '+';
    const matchedToken = findTokenByAddress(item?.tokenAddress);

    return (
      <HistoryItem
        type={item?.description}
        time={item?.createdAt}
        amount={
          checkBalance +
          calculateAsset(item?.amount, matchedToken?.decimals || 18)
        }
        status={item?.status}
        symbol={matchedToken?.symbol}
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
      <Header hasLeft={true} title={localize('transactions')} />
      {renderHeader()}
      {showCalendar()}
      {!isCalendarVisible && (
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          data={transactionList}
          keyExtractor={keyExtractor}
          refreshing={false}
          onRefresh={refetch}
          ListEmptyComponent={renderEmpty()}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={() => hasNextPage && fetchNextPage()}
        />
      )}
      <Portal>
        <TokenModal
          ref={tokenModalRef}
          keyItem={'token'}
          onPress={handleSelectToken}
          listToken={listToken}
        />
      </Portal>
    </Container>
  );
};

export default TransactionHistoryScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingBottom: responsiveHeight(30),
    },
    emptyItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(20),
    },
    header: {
      fontFamily: Fonts.montserratBold,
      fontSize: responsiveFont(9),
      color: blackText,
      marginRight: responsiveWidth(6),
      textTransform: 'uppercase',
    },
    date: {
      fontFamily: Fonts.montserratMedium,
      fontSize: responsiveFont(11),
      color: blackText,
      textAlign: 'right',
      marginTop: responsiveHeight(5),
    },
  });
