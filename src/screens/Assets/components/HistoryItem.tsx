import {format} from 'date-fns';
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import NumberFormat from 'react-number-format';

import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import {primary} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface HistoryItemProps {
  icon?: string;
  type?: string;
  time?: any;
  amount?: string | number;
  status?: string;
  hasBorder?: boolean;
  symbol?: string;
  onPress: () => void;
}

const HistoryItem = (props: HistoryItemProps) => {
  const {icon, type, time, amount, status, hasBorder, symbol, onPress} = props;
  const blackText = useThemeColor('blackText');
  const grayBG = useThemeColor('borderGray');
  const styles = getStyles(blackText, grayBG);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, hasBorder && styles.border]}>
        <View style={styles.contentWrapper}>
          <View style={styles.iconWrapper}>
            <Icon source={icon || Images.sendIcon} size={responsiveWidth(12)} />
          </View>
          <View>
            <Text style={styles.title}>{type}</Text>
            <Text style={styles.subTitle}>
              {format(new Date(time), 'dd/MM/yyyy HH:mm')}
            </Text>
          </View>
        </View>
        <View>
          <Text style={[styles.title, {textAlign: 'right'}]}>
            <NumberFormat
              value={amount}
              renderText={formattedValue => (
                <>
                  {formattedValue} {symbol}
                </>
              )}
              displayType="text"
              type="text"
              thousandSeparator={true}
              decimalScale={6}
            />
          </Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryItem;

const getStyles = (blackText: string, grayBG: string) =>
  StyleSheet.create({
    container: {
      ...RootStyles.rowSpaceStyle,
      paddingVertical: responsiveHeight(10),
    },
    border: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: blackText,
      paddingBottom: responsiveHeight(15),
    },
    iconWrapper: {
      backgroundColor: grayBG,
      width: responsiveWidth(43),
      height: responsiveWidth(43),
      borderRadius: responsiveWidth(40),
      marginRight: responsiveWidth(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentWrapper: {
      ...RootStyles.rowStyle,
    },
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      marginBottom: responsiveHeight(4),
    },
    subTitle: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
    },
    status: {
      fontSize: responsiveFont(10),
      fontFamily: Fonts.montserratMedium,
      color: primary.color,
      textAlign: 'right',
      textTransform: 'capitalize',
    },
  });
