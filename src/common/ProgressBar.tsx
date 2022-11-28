import * as React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';

import {primary} from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Layout, {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../constants/Layout';
import {useThemeColor} from './Themed';

interface ProgressBarProps {
  step: number;
  totalStep?: number;
  paddingHorizontal?: number;
  labels?: Array<string>;
  styleStepIndicator?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const ProgressBar = (props: ProgressBarProps) => {
  const {style, step, totalStep = 4, paddingHorizontal = 30} = props;

  const ITEM_WIDTH = React.useMemo(
    () =>
      (Layout.window.width - responsiveWidth(paddingHorizontal)) / totalStep,
    [totalStep, paddingHorizontal],
  );

  const lightGray = useThemeColor('borderLightGray');
  const styles = getStyles(lightGray, paddingHorizontal);

  return (
    <View style={[styles.container, style]}>
      <View>
        <View
          style={[
            styles.borderStyle,
            {
              width: ITEM_WIDTH * step,
            },
          ]}
        />
      </View>
    </View>
  );
};

const getStyles = (lightGray: string, paddingHorizontal: number) =>
  StyleSheet.create({
    container: {
      width: Layout.window.width - responsiveWidth(paddingHorizontal),
      borderRadius: responsiveWidth(20),
      alignSelf: 'center',
      marginTop: responsiveHeight(5),
      backgroundColor: lightGray,
    },
    borderStyle: {
      height: responsiveHeight(3),
      borderRadius: responsiveWidth(20),
      backgroundColor: primary.color,
    },
    stepIndicator: {
      position: 'absolute',
      zIndex: 2,
      top: -responsiveHeight(5),
      bottom: 0,
      height: responsiveHeight(50),
      alignItems: 'center',
      justifyContent: 'center',
      width: responsiveWidth(80),
    },
    indicator: {
      width: responsiveWidth(16),
      height: responsiveWidth(16),
      borderRadius: responsiveWidth(10),
      backgroundColor: primary.color,
    },
    text: {
      fontSize: responsiveFont(14),
      fontFamily: Fonts.montserratSemiBold,
      marginTop: responsiveHeight(12),
    },
  });

export default ProgressBar;
