import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import {primary, white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface AssetItemProps {
  icon?: string;
  title?: string;
  subTitle?: string;
  hasToggle?: boolean;
  isEnabled?: boolean;
  onPress?: () => void;
  onToggle?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const AssetItem = (props: AssetItemProps) => {
  const {
    icon,
    title,
    subTitle,
    onPress,
    hasToggle,
    isEnabled,
    onToggle,
    style,
    disabled,
  } = props;
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  return (
    <TouchableOpacity
      disabled={disabled || !onPress}
      style={[styles.container, style]}
      onPress={onPress}>
      <View style={[styles.item, disabled && {opacity: 0.3}]}>
        <Icon
          source={icon || Images?.bdsIcon}
          size={responsiveWidth(40)}
          style={styles.icon}
        />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
      {hasToggle && (
        <Switch
          style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
          value={isEnabled}
          trackColor={{false: '#808EA1', true: primary.color}}
          thumbColor={white}
          ios_backgroundColor={'#808EA1'}
          onValueChange={onToggle}
        />
      )}
    </TouchableOpacity>
  );
};

export default AssetItem;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {
      ...RootStyles.rowSpaceStyle,
      minHeight: responsiveHeight(60),
      paddingVertical: responsiveHeight(12),
      // borderBottomColor: blackText,
      // borderBottomWidth: 0.2,
    },
    item: {
      ...RootStyles.rowStyle,
    },
    icon: {marginRight: responsiveWidth(10)},
    title: {
      color: blackText,
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratBold,
    },
    subTitle: {
      color: blackText,
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
    },
  });
