import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Switch} from 'react-native';

import {localize} from '../../../assets/i18n/I18nConfig';
import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import {primary, white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface SettingItemProps {
  icon?: string;
  title?: string;
  hasArrowRight?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  hasToggle?: boolean;
  hasShowCurrency?: boolean;
  currentCurrency?: string;
  isEnabled?: boolean;
  onToggle?: () => void;
  isHotline?: boolean;
}

const SettingItem = (props: SettingItemProps) => {
  const {
    icon,
    title,
    hasArrowRight,
    disabled,
    onPress,
    hasToggle,
    hasShowCurrency,
    currentCurrency,
    isEnabled,
    onToggle,
    isHotline,
  } = props;

  const blackText = useThemeColor('blackText');
  const blueText = useThemeColor('blueText');
  const lightGray = useThemeColor('lightGray');
  const styles = getStyles(blackText, blueText);

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      onPress={onPress}>
      <View style={styles.wrapper}>
        <Icon
          source={icon || Images.profileIcon}
          size={responsiveWidth(16)}
          style={{marginRight: responsiveWidth(10)}}
        />
        {!!title && <Text style={styles.title}>{title}</Text>}
        {isHotline && <Text style={styles.hotline}>{localize('hotline')}</Text>}
      </View>
      <View
        style={[RootStyles.rowStyle, {flex: 0.3, justifyContent: 'flex-end'}]}>
        {hasShowCurrency && (
          <Text style={styles.currency}>{currentCurrency}</Text>
        )}
        {hasArrowRight && (
          <Icon source={Images.arrowRightIcon} style={styles.icon} />
        )}
      </View>
      {hasToggle && (
        <Switch
          style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
          value={isEnabled}
          trackColor={{false: lightGray, true: primary.color}}
          thumbColor={white}
          ios_backgroundColor={lightGray}
          onValueChange={onToggle}
        />
      )}
    </TouchableOpacity>
  );
};

export default SettingItem;

const getStyles = (blackText: string, blueText: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      ...RootStyles.rowSpaceStyle,
      paddingVertical: responsiveHeight(16),
      borderBottomWidth: StyleSheet.hairlineWidth,
      color: blackText,
    },
    wrapper: {...RootStyles.rowStyle, flex: 1},
    title: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      flex: 4,
    },
    currency: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      marginRight: responsiveWidth(15),
    },
    icon: {
      width: responsiveWidth(8),
      height: responsiveHeight(14),
      marginLeft: -responsiveWidth(10),
    },
    hotline: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blueText,
    },
  });
