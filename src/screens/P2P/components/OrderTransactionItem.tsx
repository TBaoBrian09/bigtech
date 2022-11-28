import {format, formatDistance} from 'date-fns';
import {capitalize} from 'lodash';
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
  title?: string;
  icon?: string;
  createdAt?: any;
  total: number;
  type: string;
  token?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const OrderTransactionItem = (props: P2PItemProps) => {
  const {title, type, total, token, onPress, createdAt, style} = props;
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={[RootStyles.rowStyle, {flex: 1}]}>
        <Icon
          source={TOKEN_ICON[token]?.icon || Images.bdsIcon}
          size={responsiveWidth(35)}
          style={{marginRight: responsiveWidth(10), flex: 1}}
        />
        <View style={[RootStyles.rowSpaceStyle, {flex: 1}]}>
          <View>
            <Text style={styles.title}>
              {capitalize(type)} {title}
            </Text>
            <Text style={styles.text}>
              {format(new Date(createdAt), 'dd/MM/yyyy hh:mm:ss')}
            </Text>
          </View>
          <View>
            <Text style={[styles.title, {textAlign: 'right'}]}>
              {type === 'buy' ? '-' : '+'}
              {total?.toFixed(2)} USDT
            </Text>
            <Text style={[styles.success, {textAlign: 'right'}]}>
              {localize('success')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderTransactionItem;

const getStyles = (blackText: string) =>
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
    title: {
      color: blackText,
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subTitle,
      marginBottom: responsiveHeight(4),
    },
    buttonText: {
      color: 'white',
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
    },
    text: {
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      fontSize: typographies.footnote,
    },
    success: {
      color: primary.color,
      fontFamily: Fonts.montserratRegular,
      fontSize: typographies.footnote,
    },
  });
