import {formatDistance} from 'date-fns';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {localize} from '../../../assets/i18n/I18nConfig';
import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import {primary} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import {TOKEN_ICON} from '../../../utils/Constants';
import RootStyles from '../../../utils/styles';

interface P2PItemProps {
  style?: StyleProp<ViewStyle>;
  name?: string;
  icon?: string;
  createdAt?: any;
  price?: number;
  amount?: number;
  status: string;
  token?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const MyOrderItem = (props: P2PItemProps) => {
  const {name, status, price, amount, token, onPress, createdAt, style} = props;
  const blackText = useThemeColor('blackText');
  const yellow = useThemeColor('yellow');
  const styles = getStyles(blackText, yellow);
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={RootStyles.rowSpaceStyle}>
        <View style={RootStyles.rowStyle}>
          <Icon
            source={TOKEN_ICON[token]?.icon || Images.bdsIcon}
            size={responsiveWidth(35)}
            style={{marginRight: responsiveWidth(10)}}
          />
          <Text style={styles.title}>{name}</Text>
        </View>
        <Text style={styles.text}>
          {formatDistance(new Date(createdAt), Date.now(), {addSuffix: true})}
        </Text>
      </View>
      <View style={styles.wrapper}>
        <View style={{flex: 0.5}}>
          <Text style={styles.text}>{localize('price')}</Text>
          {/* <Text style={styles.text}>{localize('amount')}</Text> */}
          <Text style={styles.text}>{localize('remaining')}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.title, {fontSize: typographies.footnote}]}>
            {price} USDT
          </Text>
          {/* <Text style={styles.text}>
            {amount} {token}
          </Text> */}
          <Text style={styles.text}>
            {amount} {token}
          </Text>
        </View>
        <View style={status === 'active' ? styles.buyStyle : styles.sellStyle}>
          <Text style={styles.buttonText}>{localize(status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyOrderItem;

const getStyles = (blackText: string, yellow: string) =>
  StyleSheet.create({
    container: {
      paddingVertical: responsiveHeight(20),
      borderBottomWidth: 0.2,
      borderBottomColor: blackText,
    },
    wrapper: {
      ...RootStyles.rowSpaceStyle,
      marginTop: responsiveHeight(13),
    },
    buyStyle: {
      minWidth: responsiveWidth(110),
      height: responsiveHeight(28),
      borderRadius: responsiveWidth(5),
      backgroundColor: primary.color,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sellStyle: {
      minWidth: responsiveWidth(110),
      height: responsiveHeight(28),
      borderRadius: responsiveWidth(5),
      backgroundColor: yellow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: blackText,
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.footnote,
    },
    buttonText: {
      color: 'white',
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.footnote,
    },
    text: {
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      fontSize: typographies.footnote,
    },
  });
