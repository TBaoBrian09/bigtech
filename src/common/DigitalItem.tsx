import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import NumberFormat from 'react-number-format';

import Fonts from '../constants/Fonts';
import Images from '../constants/Images';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';
import RootStyles from '../utils/styles';
import {formatNumber} from '../utils/utils';
import Icon from './Icon';
import {useThemeColor} from './Themed';

interface DigitalItemProps {
  onPress?: () => void;
  icon?: string;
  title?: string;
  subTitle?: string;
  isUsdt?: boolean;
  style?: StyleProp<ViewStyle>;
  amount?: number | string | any;
  price?: number | string | any;
  token?: string;
}

const DigitalItem = (props: DigitalItemProps) => {
  const {
    onPress,
    icon,
    title,
    subTitle,
    isUsdt,
    style,
    token,
    amount = 0,
    price = 0,
  } = props;
  const blackText = useThemeColor('blackText');
  const grayBg = useThemeColor('borderGray');
  const styles = getStyles(blackText, grayBg);
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <View style={RootStyles.rowStyle}>
        <Icon
          source={icon || Images.bdsIcon}
          size={responsiveWidth(40)}
          style={{marginRight: responsiveWidth(10)}}
        />
        <View>
          <Text style={styles.itemAmount}>{title}</Text>
          <NumberFormat
            value={price}
            renderText={formattedValue => (
              <Text style={styles.itemToUsdt}>{formattedValue} USDT</Text>
            )}
            displayType="text"
            type="text"
            thousandSeparator={true}
            decimalScale={4}
          />
        </View>
      </View>
      <View>
        <NumberFormat
          value={formatNumber(amount)}
          renderText={formattedValue => (
            <Text style={[styles.itemAmount, {textAlign: 'right'}]}>
              {formattedValue}
            </Text>
          )}
          displayType="text"
          type="text"
          thousandSeparator={true}
          decimalScale={3}
        />
        <NumberFormat
          value={price * amount}
          renderText={formattedValue => (
            <Text style={styles.value}>{formattedValue} USDT</Text>
          )}
          displayType="text"
          type="text"
          thousandSeparator={true}
          decimalScale={3}
        />
      </View>
    </TouchableOpacity>
  );
};

export default DigitalItem;

const getStyles = (blackText: string, grayBg: string) =>
  StyleSheet.create({
    container: {
      ...RootStyles.rowSpaceStyle,
      backgroundColor: grayBg,
      borderRadius: responsiveWidth(10),
      minHeight: responsiveHeight(60),
      marginBottom: responsiveHeight(10),
      paddingHorizontal: responsiveWidth(10),
      paddingVertical: responsiveHeight(5),
    },
    amount: {
      fontSize: typographies.title,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
    },
    itemSubTitle: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
    },
    itemAmount: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratBold,
      color: blackText,
    },
    itemToUsdt: {
      fontSize: typographies.label,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      textAlign: 'right',
    },
    value: {
      fontSize: typographies.label,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      textAlign: 'right',
      fontWeight: '500',
    },
  });
