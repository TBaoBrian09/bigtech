/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {isValidPhoneNumber} from 'libphonenumber-js';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {useInfiniteQuery} from 'react-query';
import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import CustomInput from '../../common/CustomInput';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {UserContext} from '../../context/UserContext';
import ToastEmitter from '../../helpers/ToastEmitter';
import {
  getFile,
  getTokenTransaction,
  searchUser,
} from '../../utils/Api/ApiManage';
import {customListTokens} from '../../utils/Constants';
import RootStyles from '../../utils/styles';
import {checkValidAddress, generatePhoneNumber} from '../../utils/utils';

interface ToAddressScreenProps {
  route?: any;
}

const OFFCHAIN_NETWORK = 'BTG';

const ToAddressScreen = (props: ToAddressScreenProps) => {
  const navigation = useNavigation();
  const {address} = props?.route?.params ?? {};
  const styles = getStyles();

  const {userData} = useContext(UserContext);
  const transactionType =
    userData?.sendData?.network === OFFCHAIN_NETWORK ? 'offChain' : 'onChain';

  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (address) {
      setInput(address);
    }
  }, [address]);

  const {data: transactionData, refetch} = useInfiniteQuery(
    ['transactionToAddress', transactionType],
    ({pageParam = 0}) =>
      getTokenTransaction({
        tokenAddress: customListTokens[userData?.sendData?.token]?.address,
        pageNumber: pageParam,
        pageSize: 5,
        transactionType,
      }),
    {enabled: !input},
  );

  const {data: user, refetch: refetchUser} = useInfiniteQuery(
    ['userToken', input],
    ({pageParam = 0}) => {
      const parsed =
        input?.length && input[0] === '0' ? input.replace('0', '') : input;
      return searchUser({
        keyword: parsed,
        pageNumber: pageParam,
      });
    },
    {
      enabled: !!(
        userData?.sendData?.network === OFFCHAIN_NETWORK &&
        input &&
        input?.length >= 3
      ),
    },
  );

  const groupByKey = (array: any) => {
    return array.reduce((arr: any, obj: any) => {
      if (obj?.to?.address === undefined) return arr;
      return Object.assign(arr, {
        [obj?.to?.address]: (arr[obj?.to?.address] || []).concat(obj),
      });
    }, {});
  };

  const transactionList = useMemo(
    () =>
      transactionData?.pages?.reduce(
        (arr: any, cur: any) => [...arr, ...cur.data?.data],
        [],
      ) || [],
    [transactionData],
  );

  const userList = useMemo(
    () =>
      user?.pages?.reduce(
        (arr: any, cur: any) => [...arr, ...cur.data?.data],
        [],
      ) || [],
    [user],
  );

  const hanldeOnChangeText = (value: string) => {
    setInput(value);
  };

  const handlePressItem = (
    recipient: string,
    name?: string,
    avatar?: string,
  ) => {
    if (
      userData?.sendData?.network !== OFFCHAIN_NETWORK &&
      recipient?.toLowerCase() ===
        userData?.privateWallet?.address?.toLowerCase()
    ) {
      ToastEmitter.error(localize('error.cannot_send_to_yourself'));
      return null;
    }
    navigation.navigate(RouteKey.ConfirmSendScreen, {recipient, name, avatar});
  };

  const handlePaste = async () => {
    const text = await Clipboard.getString();
    setInput(text);
    // const mockToken = '0x54b1CE2777A5C4A3f48CFBF27603f131e8Db2f15';
    if (text) {
      if (
        userData?.sendData?.network !== OFFCHAIN_NETWORK &&
        !checkValidAddress(text, userData?.sendData?.network?.toLowerCase())
      ) {
        return;
      }
      handlePressItem(text);
    }
  };

  const renderItem = useCallback(({item}) => {
    return (
      <TouchableOpacity
        style={styles.transactionWrapper}
        onPress={() => handlePressItem(item)}>
        <Icon
          source={Images.walletIcon}
          size={responsiveWidth(28)}
          style={{marginRight: responsiveWidth(10)}}
        />
        <View>
          <Text style={styles.textItem}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderUserItem = useCallback(({item}) => {
    const fileURL = getFile(item?.profile?.avatar);

    return (
      <TouchableOpacity
        style={styles.userWrapper}
        onPress={() =>
          handlePressItem(item?.id, item?.profile?.name, item?.profile?.avatar)
        }>
        <View style={RootStyles.rowStyle}>
          {item?.profile?.avatar ? (
            <FastImage
              source={{uri: fileURL}}
              style={{
                marginRight: responsiveWidth(10),
                width: responsiveWidth(28),
                height: responsiveWidth(28),
                borderRadius: responsiveWidth(25),
              }}
            />
          ) : (
            <Icon
              source={item?.profile?.avatar ? fileURL : Images.profileIcon}
              size={responsiveWidth(28)}
              style={{marginRight: responsiveWidth(10)}}
            />
          )}
          <View>
            <Text style={styles.textItem}>{item?.profile?.name}</Text>
            <View style={RootStyles.rowStyle}>
              <Text style={styles.pasteText}>
                {item?.phoneNumber
                  ? generatePhoneNumber(item.phoneNumber)
                  : item?.email}
              </Text>
              <Icon source={Images.checkSuccess} size={responsiveWidth(18)} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const renderEmpty = () => {
    return (
      <View style={styles.emptyItemStyle}>
        <Icon source={Images.emptyAssetsIcon} size={responsiveWidth(250)} />
      </View>
    );
  };

  const renderFlatListType = () => {
    if (!input)
      return (
        <FlatList
          key={'trans'}
          contentContainerStyle={styles.contentContainerStyle}
          data={Object.keys(groupByKey(transactionList))}
          keyExtractor={(item, index) => 'list' + index}
          refreshing={false}
          onRefresh={refetch}
          ListEmptyComponent={renderEmpty()}
          renderItem={renderItem}
        />
      );
    if (input && userData?.sendData?.network === OFFCHAIN_NETWORK)
      return (
        <FlatList
          key={'user'}
          contentContainerStyle={styles.contentContainerStyle}
          data={userList}
          keyExtractor={(item, index) => 'user' + index}
          refreshing={false}
          onRefresh={refetchUser}
          ListEmptyComponent={renderEmpty()}
          renderItem={renderUserItem}
        />
      );
    return renderEmpty();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        hasLeft={true}
        title={localize('to')}
        rightComponent={
          userData?.sendData?.network !== OFFCHAIN_NETWORK && (
            <Icon
              source={Images.qrCodeIcon}
              size={responsiveWidth(20)}
              style={{alignSelf: 'flex-end'}}
              onPress={() => navigation.navigate(RouteKey.ScanQRCodeScreen)}
            />
          )
        }
      />
      <CustomInput
        placeholder={
          userData?.sendData?.network === OFFCHAIN_NETWORK
            ? 'Email, Phone, Account'
            : 'Address'
        }
        value={input}
        onChangeText={(v: string) => hanldeOnChangeText(v)}
        hasRightIcon
        customRightIcon={
          <TouchableOpacity
            onPress={handlePaste}
            style={{marginLeft: responsiveWidth(10)}}>
            <Text style={styles.pasteText}>Paste</Text>
          </TouchableOpacity>
        }
      />
      {userData?.sendData?.network !== OFFCHAIN_NETWORK && (
        <View style={styles.dexWalletContainer}>
          <TouchableOpacity
            onPress={() => setInput(userData?.publicWallet?.address)}>
            <Text style={styles.pasteText}>{localize('to_dex_wallet')}</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.recentlyText}>{localize('recently')}</Text>

      {renderFlatListType()}
      {userData?.sendData?.network !== OFFCHAIN_NETWORK && (
        <Button
          disabled={
            !input ||
            !checkValidAddress(
              input,
              userData?.sendData?.network?.toLowerCase(),
            )
          }
          title={localize('confirm')}
          onPress={() => handlePressItem(input)}
          buttonStyle={[
            RootStyles.primaryButton,
            {
              marginTop: responsiveHeight(10),
              marginHorizontal: responsiveWidth(15),
            },
          ]}
          titleStyle={RootStyles.primaryButtonText}
        />
      )}
    </Container>
  );
};

export default ToAddressScreen;

const getStyles = () =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(15),
      paddingTop: responsiveHeight(10),
    },
    emptyItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(20),
    },
    dexWalletContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: responsiveHeight(-20),
      marginBottom: responsiveHeight(20),
      paddingHorizontal: responsiveWidth(15),
    },
    transactionWrapper: {
      borderBottomWidth: 0.2,
      borderBottomColor: 'black',
      paddingHorizontal: responsiveWidth(10),
      paddingVertical: responsiveHeight(15),
      ...RootStyles.rowStyle,
      flex: 1,
    },
    userWrapper: {
      borderBottomWidth: 0.2,
      borderBottomColor: 'black',
      paddingHorizontal: responsiveWidth(10),
      paddingVertical: responsiveHeight(15),
    },
    textItem: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      color: 'black',
      marginRight: responsiveWidth(5),
      width: responsiveWidth(280),
    },
    recentlyText: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      color: primary.color,
      marginLeft: responsiveWidth(15),
    },
    pasteText: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: primary.color,
      marginRight: responsiveWidth(10),
    },
  });
