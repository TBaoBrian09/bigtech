import React, {useContext} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import format from 'date-fns/format';
import NumberFormat from 'react-number-format';

import Container from '../../common/Container';
import Header from '../../common/Header';
import {primary, white} from '../../constants/Colors';
import Layout, {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import RootStyles from '../../utils/styles';
import {localize} from '../../assets/i18n/I18nConfig';
import typographies from '../../constants/Typographies';
import Fonts from '../../constants/Fonts';
import {calculateAsset, handleGetTransType} from '../../utils/utils';
import {listTokens} from '../../utils/Constants';
import {UserContext} from '../../context/UserContext';
import Images from '../../constants/Images';
import Icon from '../../common/Icon';

const HistoryDetailScreen = (props: any) => {
  const styles = getStyles();
  const {data} = props?.route?.params ?? {};
  const type = handleGetTransType(data?.description?.toLowerCase());
  const token = listTokens.find(o => o.address === data?.tokenAddress);
  const amount = calculateAsset(data?.amount, token?.decimals || 18);
  // const {userData} = useContext(UserContext);
  // const myAddress = userData?.privateWallet?.address;
  const isSuccess = data?.status?.toLowerCase() === 'success';

  const generateOnChainContent = () => {
    return (
      <>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('TxHash')}`}</Text>
          <Text style={styles.text}>{data?.transactionHash}</Text>
        </View>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('from')}`}</Text>
          <Text style={styles.text}>{data?.from?.address}</Text>
        </View>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('to')}`}</Text>
          <Text style={styles.text}>{data?.to?.address}</Text>
        </View>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('description')}`}</Text>
          <Text style={styles.text}>{data?.description}</Text>
        </View>
      </>
    );
  };

  const generateOffChainContent = () => {
    return (
      <>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('from')}`}</Text>
          <View style={styles.text}>
            <Text style={styles.name}>
              {generateAddress(data?.from?.user?.name)}
            </Text>
            {/* {myAddress === data?.from?.address && (
              <Text
                style={[styles.text, {textAlign: 'right', fontWeight: 'bold'}]}>
                {localize('(you)')}
              </Text>
            )} */}
          </View>
        </View>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('to')}`}</Text>
          <Text style={styles.name}>
            {generateAddress(data?.to?.user?.name)}
          </Text>
          {/* {myAddress === data?.to?.address && (
            <Text
              style={[styles.text, {textAlign: 'right', fontWeight: 'bold'}]}>
              {localize('(you)')}
            </Text>
          )} */}
        </View>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('description')}`}</Text>
          <Text style={styles.text}>{data?.description}</Text>
        </View>
      </>
    );
  };

  const generateAddress = (raw?: string) => {
    if (!raw) {
      return 'SYSTEM';
    }

    return raw;
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <Header
        hasLeft={true}
        centerComponent={
          <View style={[RootStyles.rowStyle, {alignSelf: 'center'}]}>
            <Text style={styles.titleHeader}>{localize('txDetail')}</Text>
          </View>
        }
        rightComponent={
          !!data?.transactionHash && (
            <Icon
              source={Images.bnbIcon}
              size={responsiveWidth(40)}
              onPress={() => {
                Linking.openURL(
                  `https://bscscan.com/tx/${data?.transactionHash}`,
                ).catch(err => console.error("Couldn't load page", err));
              }}
            />
          )
        }
      />
      <View style={styles.contentContainerStyle}>
        <Text>{type}</Text>
        <NumberFormat
          value={amount}
          renderText={formattedValue => (
            <Text style={styles.amount}>{formattedValue}</Text>
          )}
          suffix={` ${token?.symbol}`}
          displayType="text"
          type="text"
          thousandSeparator={true}
          decimalScale={8}
        />
        <Text style={isSuccess ? styles.status : styles.falseStatus}>
          {data?.status}
        </Text>
        <View style={styles.line} />
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('txId')}`}</Text>
          <Text style={styles.text}>{data?.id}</Text>
        </View>
        <View style={[RootStyles.rowStyle, styles.row]}>
          <Text style={styles.text}>{`${localize('time')}`}</Text>
          <Text style={styles.text}>
            {format(new Date(data?.createdAt), 'dd/MM/yyyy hh:mm')}
          </Text>
        </View>
        {type === 'On-chain'
          ? generateOnChainContent()
          : generateOffChainContent()}
      </View>
    </Container>
  );
};

export default HistoryDetailScreen;

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingVertical: responsiveHeight(30),
      flexDirection: 'column',
      alignItems: 'center',
    },
    titleHeader: {
      fontSize: typographies.h3,
      fontFamily: Fonts.montserratBold,
      color: '#000',
    },
    amount: {
      fontSize: typographies.title,
      fontFamily: Fonts.montserratRegular,
      color: '#000',
      marginVertical: responsiveHeight(20),
    },
    status: {
      fontSize: responsiveFont(12),
      fontFamily: Fonts.montserratMedium,
      color: primary.color,
      textTransform: 'capitalize',
    },
    falseStatus: {
      fontSize: responsiveFont(12),
      fontFamily: Fonts.montserratMedium,
      color: '#FE554A',
      textTransform: 'capitalize',
    },
    line: {
      height: 0.5,
      width: Layout.window.width - responsiveWidth(15) * 2,
      marginHorizontal: responsiveWidth(15),
      backgroundColor: 'black',
      marginVertical: responsiveHeight(20),
    },
    row: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: Layout.window.width - responsiveWidth(15) * 2,
      marginHorizontal: responsiveWidth(15),
      marginBottom: responsiveHeight(15),
    },
    text: {
      color: '#666666',
      fontWeight: '500',
      maxWidth: Layout.window.width / 2,
    },
    name: {
      color: '#000',
      fontWeight: '700',
      maxWidth: Layout.window.width / 2,
    },
  });
