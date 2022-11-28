import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import {localize, localizeP} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../constants/Layout';
import typographies from '../../constants/Typographies';
import RootStyles from '../../utils/styles';
import {useThemeColor} from '../../common/Themed';
import {UserContext} from '../../context/UserContext';
import {TOKEN_ICON} from '../../utils/Constants';

interface ReceiveDigitalScreenProps {
  route: any;
}

const MIN_WIDTH = responsiveWidth(336);
const DROPDOWN_HEIGHT = responsiveHeight(40);
const DROPDOWN_ITEM = [
  // {
  //   key: 'bep20',
  //   title: 'BEP20',
  //   subTitlte: 'Binance Smart Chain',
  // },
  // {
  //   key: 'bds',
  //   title: 'BDS',
  //   subTitlte: 'Network',
  // },
  // {
  //   key: 'krc20',
  //   title: 'KRC20',
  //   subTitlte: 'KardiaChain',
  // },
  // {
  //   key: 'offchain',
  //   title: 'OFFCHAIN',
  //   subTitlte: 'ONUS Network',
  // },
  {
    key: 'bep20',
    title: 'BEP20',
    subTitlte: 'Binance Smart Chain',
  },
];

const ReceiveDigitalScreen = (props: ReceiveDigitalScreenProps) => {
  const {token} = props?.route?.params ?? {};
  const navigation = useNavigation();

  const blackText = useThemeColor('blackText');
  const grayBg = useThemeColor('borderGray');
  const styles = getStyles(blackText, grayBg);

  const [openDropdown, setOpenDropdown] = useState(false);

  const {userData} = useContext(UserContext);

  const [value, setValue] = useState({
    key: 'bep20',
    title: 'BEP20',
    subTitlte: 'Binance Smart Chain',
  });

  const handleNavigation = () => {
    navigation.goBack();
  };

  const handleSelectItem = (item: any) => {
    setValue(item);
    setOpenDropdown(false);
  };

  const copyToClipboard = () => {
    Clipboard.setString(userData?.privateWallet?.address);
  };

  const CustomText = ({title, subTitle}: any) => {
    return (
      <Text style={styles.dropdownText}>
        {title}
        <Text
          style={[styles.dropdownText, {fontFamily: Fonts.montserratRegular}]}>
          {' '}
          {subTitle}
        </Text>
      </Text>
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
        title={`${localize('receive')} ${token?.toUpperCase()}`}
      />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <TouchableWithoutFeedback
          style={{flex: 1}}
          onPress={() => setOpenDropdown(false)}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.dropdownWrapper}
              onPress={() => setOpenDropdown(!openDropdown)}>
              <CustomText title={value?.title} subTitle={value?.subTitlte} />
              <Icon
                source={Images.arrowDownIcon}
                size={responsiveWidth(12)}
                style={{
                  width: responsiveWidth(12),
                  height: responsiveHeight(8),
                }}
              />
            </TouchableOpacity>
            {openDropdown && (
              <View style={styles.dropdownContentWrapper}>
                {DROPDOWN_ITEM?.map((item, index) => (
                  <TouchableOpacity
                    key={item.title}
                    style={[
                      styles.dropdownItemStyle,
                      index === DROPDOWN_ITEM?.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                    onPress={() => handleSelectItem(item)}>
                    <CustomText title={item.title} subTitle={item.subTitlte} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.qrCodeWrapper}>
              <QRCode
                logoSize={responsiveWidth(80)}
                size={MIN_WIDTH}
                value={userData?.privateWallet?.address}
                logo={TOKEN_ICON[token?.toUpperCase()]?.icon}
              />
              <TouchableOpacity
                style={styles.addressWrapper}
                onPress={copyToClipboard}>
                <Text style={styles.address}>
                  {userData?.privateWallet?.address}
                </Text>
                <Icon
                  source={Images.copyIcon}
                  size={responsiveWidth(28)}
                  color={primary.color}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.footNote}>
              {localizeP('receiveDescription', {token: token?.toUpperCase()})}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <Button
          title={localize('done')}
          onPress={handleNavigation}
          buttonStyle={[
            RootStyles.primaryButton,
            {marginTop: responsiveHeight(10)},
          ]}
          titleStyle={RootStyles.primaryButtonText}
        />
      </ScrollView>
    </Container>
  );
};

export default ReceiveDigitalScreen;

const getStyles = (blackText: string, grayBg: string) =>
  StyleSheet.create({
    container: {},
    contentContainerStyle: {
      paddingHorizontal: responsiveWidth(30),
      flexGrow: 1,
    },
    addressWrapper: {
      ...RootStyles.rowSpaceStyle,
      marginTop: responsiveHeight(20),
      width: MIN_WIDTH,
    },
    qrCodeWrapper: {
      marginTop: responsiveHeight(20),
      alignItems: 'center',
      flex: 1,
    },
    dropdownWrapper: {
      ...RootStyles.rowSpaceStyle,
      borderWidth: 0.5,
      borderColor: blackText,
      paddingHorizontal: responsiveWidth(15),
      paddingVertical: responsiveHeight(10),
      borderRadius: responsiveWidth(5),
      alignSelf: 'center',
      width: Layout.window.width - responsiveWidth(30),
      height: DROPDOWN_HEIGHT,
      marginVertical: responsiveHeight(15),
      backgroundColor: white,
    },
    dropdownContentWrapper: {
      position: 'absolute',
      zIndex: 1000,
      top: DROPDOWN_HEIGHT + responsiveHeight(25),
      left: -responsiveWidth(15),
      right: 0,
      backgroundColor: grayBg,
      width: Layout.window.width - responsiveWidth(30),
      alignSelf: 'center',
      borderRadius: responsiveWidth(5),
    },
    dropdownItemStyle: {
      paddingVertical: responsiveHeight(12),
      marginHorizontal: responsiveWidth(15),
      borderBottomColor: blackText,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    dropdownText: {
      fontFamily: Fonts.montserratBold,
      color: blackText,
      fontSize: typographies.subTitle,
    },
    address: {
      fontFamily: Fonts.montserratMedium,
      color: primary.color,
      fontSize: typographies.footnote,
      width: responsiveWidth(220),
    },
    footNote: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.footnote,
      textAlign: 'center',
      width: MIN_WIDTH,
      alignSelf: 'center',
      marginBottom: responsiveHeight(10),
    },
    requiredText: {
      fontFamily: Fonts.montserratBold,
      color: blackText,
      fontSize: typographies.footnote,
    },
  });
