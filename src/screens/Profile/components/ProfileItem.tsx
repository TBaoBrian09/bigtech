import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {localize} from '../../../assets/i18n/I18nConfig';

import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface ProfileItemProps {
  title?: string;
  content?: string;
  hasArrowRight?: boolean;
  checked?: boolean;
  onPress?: () => void;
  small?: boolean;
}

const ProfileItem = (props: ProfileItemProps) => {
  const {content, title, hasArrowRight, onPress, checked, small} = props;
  const blackText = useThemeColor('blackText');
  const blueText = useThemeColor('blueText');
  const styles = getStyles(blackText, blueText);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.wrapper}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
      <View
        style={[RootStyles.rowStyle, {flex: 0.5, justifyContent: 'flex-end'}]}>
        {content ? (
          <Text style={small ? styles.smallContent : styles.content}>
            {content}
          </Text>
        ) : (
          <Text style={styles.placeholder}>{localize('settings')}</Text>
        )}
        {checked && (
          <Icon
            source={Images.checked}
            style={{
              width: responsiveWidth(16),
              height: responsiveHeight(16),
            }}
          />
        )}
        {hasArrowRight && (
          <Icon
            source={Images.arrowRightIcon}
            style={{
              width: responsiveWidth(8),
              height: responsiveHeight(14),
              marginLeft: responsiveWidth(10),
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileItem;

const getStyles = (blackText: string, blueText: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      ...RootStyles.rowSpaceStyle,
      marginBottom: responsiveHeight(14),
      color: blackText,
    },
    wrapper: {...RootStyles.rowStyle, flex: 0.5},
    title: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      flex: 2,
    },
    content: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      marginRight: responsiveWidth(10),
      textAlign: 'right',
      flex: 1,
    },
    smallContent: {
      fontSize: typographies.label,
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      marginRight: responsiveWidth(10),
      textAlign: 'left',
    },
    placeholder: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: '#C3C3C3',
      marginRight: responsiveWidth(10),
    },
    hotline: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratRegular,
      color: blueText,
    },
  });
