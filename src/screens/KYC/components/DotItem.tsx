import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useThemeColor} from '../../../common/Themed';
import {primary} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface DotItemProps {
  title: string;
}

const DotItem = (props: DotItemProps) => {
  const {title} = props;
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);
  return (
    <View style={[RootStyles.rowStyle, {marginTop: responsiveHeight(10)}]}>
      <View style={styles.dotItem} />
      <Text style={styles.subTitle}>{title}</Text>
    </View>
  );
};

export default DotItem;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    dotItem: {
      width: responsiveWidth(8),
      height: responsiveWidth(8),
      borderRadius: responsiveWidth(5),
      backgroundColor: primary.color,
      marginRight: responsiveWidth(10),
    },
    subTitle: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      textAlign: 'left',
      lineHeight: responsiveHeight(20),
    },
  });
