import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import {primary} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';

interface IconTemProps {
  icon: string;
  iconSize?: number;
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const IconItem = (props: IconTemProps) => {
  const {icon, iconSize, title, onPress, style} = props;

  const blackText = useThemeColor('blackText');
  const grayBG = useThemeColor('borderGray');
  const styles = getStyles(blackText, grayBG);

  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[styles.container, style]}
      onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon
          source={icon || Images.sendIcon}
          size={iconSize || responsiveWidth(13)}
          color={primary.color}
        />
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default IconItem;

const getStyles = (blackText: string, grayBG: string) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    iconWrapper: {
      width: responsiveWidth(48),
      height: responsiveWidth(48),
      borderRadius: responsiveWidth(25),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: grayBG,
    },
    title: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      marginTop: responsiveHeight(4),
      textAlign: 'center',
    },
  });
