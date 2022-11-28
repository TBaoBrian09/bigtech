import * as React from 'react';
import {Text, View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {localize} from '../../../assets/i18n/I18nConfig';
import CircleProgressBar from '../../../common/CircleProgressBar';
import {useThemeColor} from '../../../common/Themed';
import Fonts from '../../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface ProgressProps {
  step?: number;
  title: string;
  subTitle: string;
  style?: StyleProp<ViewStyle>;
}

const Progress = (props: ProgressProps) => {
  const {step, title, subTitle, style} = props;

  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  return (
    <View style={[styles.circleProgressWrapper, style]}>
      <View>
        <CircleProgressBar
          size={responsiveWidth(60)}
          title={`${step}/3`}
          totalStep={3}
          currentStep={step}
        />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text}>{subTitle}</Text>
      </View>
    </View>
  );
};

export default Progress;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    circleProgressWrapper: {
      ...RootStyles.rowStyle,
      alignSelf: 'flex-start',
      marginBottom: responsiveHeight(6),
    },
    contentWrapper: {
      marginLeft: responsiveWidth(10),
      marginTop: responsiveHeight(-15),
    },
    text: {
      fontFamily: Fonts.montserratRegular,
      color: blackText,
      fontSize: typographies.subTitle,
    },
  });
