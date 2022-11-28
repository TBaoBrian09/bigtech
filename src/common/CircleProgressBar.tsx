import React, {useMemo} from 'react';
import {Text, View, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
// import Animated, {
//   useSharedValue,
//   withTiming,
//   useAnimatedProps,
// } from 'react-native-reanimated';

import {primary, white} from '../constants/Colors';
import Fonts from '../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';
import {useThemeColor} from './Themed';

interface CircleProgressBarProps {
  size: number;
  title?: string;
  subTitle?: string;
  style?: StyleProp<ViewStyle>;
  totalStep?: number;
  currentStep?: number;
  isAnimated?: boolean;
}

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleProgressBar = (props: CircleProgressBarProps) => {
  const {size, title, style, subTitle, currentStep = 0, totalStep} = props;

  const strokeWidth = responsiveWidth(8);
  const radius = useMemo(() => (size - strokeWidth) / 2, [size]);
  const center = useMemo(() => size / 2, [size]);
  const circumference = useMemo(() => radius * 2 * Math.PI, [radius]);

  const borderGray = useThemeColor('borderGray');
  const textColor = useThemeColor('text');
  const styles = getStyles(textColor);

  return (
    <View style={[styles.container, style]}>
      <Svg width={size + 10} height={size + 10}>
        <G rotation="-90" origin={center}>
          <Circle
            stroke={borderGray}
            fill={white}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {totalStep && (
            <Circle
              stroke={primary.color}
              cx={center}
              cy={center}
              r={radius}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (circumference * currentStep) / totalStep
              }
            />
          )}
        </G>
      </Svg>
      {title && (
        <View
          style={[
            styles.titleWrapper,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}>
          <Text
            style={[
              styles.title,
              !subTitle && {marginTop: responsiveHeight(6)},
            ]}>
            {title}
          </Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      )}
    </View>
  );
};

export default CircleProgressBar;

const getStyles = (textColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleWrapper: {
      flex: 1,
      position: 'absolute',
      zIndex: 3,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    title: {
      marginTop: responsiveHeight(5),
      marginLeft: -responsiveWidth(8),
      fontSize: typographies.footnote,
      color: textColor,
      fontFamily: Fonts.montserratMedium,
    },
    subTitle: {
      fontSize: typographies.footnote,
      color: textColor,
      fontFamily: Fonts.montserratMedium,
    },
  });
