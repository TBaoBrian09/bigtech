import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import Icon from './Icon';
import Images from '../constants/Images';
import Fonts from '../constants/Fonts';
import typographies from '../constants/Typographies';
import {white} from '../constants/Colors';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';
import {useThemeColor} from './Themed';

interface IProps {
  title?: string;
  subTitle?: string;
  titleColor?: string;
  iconLeft?: string;
  iconLeftSize?: number;
  iconRight?: string;
  iconLeftColor?: string;
  iconRightSize?: number;
  onPressLeft?: () => void;
  centerComponent?: any;
  leftComponent?: any;
  headerStyle?: ViewStyle;
  onPressRight?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  rightStyle?: StyleProp<ViewStyle>;
  leftStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  rightAction?: string;
  isTransparent?: boolean;
  hasLeft?: boolean;
  disabled?: boolean;
  rightComponent?: any;
  showBottomData?: any;
  hasBackButton?: boolean;
  iconLeftSource?: string;
}

function Header(props: IProps) {
  const {
    title,
    containerStyle = {},
    hasBackButton = true,
    leftComponent,
    iconLeftColor,
    iconLeftSource,
    centerComponent,
    rightComponent,
    titleColor = 'black',
    titleStyle,
    onPressLeft,
    rightStyle,
    leftStyle,
    isTransparent = false,
    hasLeft = true,
    showBottomData,
    wrapperStyle,
    iconLeftSize,
  } = props;
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);
  return (
    <SafeAreaView edges={['left', 'right']}>
      <View
        style={[
          wrapperStyle,
          {backgroundColor: isTransparent ? 'transparent' : white},
        ]}>
        <View style={[styles.headerStyle, containerStyle]}>
          {hasLeft && (
            <View style={[styles.sideStyle, leftStyle]}>
              {hasBackButton && (
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => {
                    if (onPressLeft) {
                      onPressLeft();
                    } else {
                      navigation.goBack();
                    }
                  }}>
                  <Icon
                    source={iconLeftSource || Images.arrowLeft}
                    size={iconLeftSize || responsiveWidth(24)}
                    color={iconLeftColor || blackText}
                  />
                </TouchableOpacity>
              )}
              {!!leftComponent && leftComponent}
            </View>
          )}

          <Animated.View style={styles.titleStyle}>
            {!!title && (
              <Text
                style={[styles.textTitle, {color: titleColor}, titleStyle]}
                numberOfLines={1}>
                {title}
              </Text>
            )}
            {!!centerComponent && <View>{centerComponent}</View>}
          </Animated.View>

          <View style={[styles.sideStyle, rightStyle]}>
            {!!rightComponent && rightComponent}
          </View>
        </View>
        {!!showBottomData && showBottomData}
      </View>
    </SafeAreaView>
  );
}

export default Header;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    textTitle: {
      fontSize: typographies.subTitle,
      fontFamily: Fonts.montserratSemiBold,
      color: blackText,
      textAlign: 'center',
    },
    sideStyle: {flex: 0.8, justifyContent: 'center'},
    headerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: responsiveWidth(16),
      height: responsiveHeight(44),
      minHeight: responsiveHeight(4),
    },
    titleStyle: {
      flex: 4,
      justifyContent: 'center',
    },
  });
