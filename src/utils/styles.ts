import {StyleSheet} from 'react-native';
import {primary, white} from '../constants/Colors';
import Fonts from '../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';

const RootStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowStyle: {flexDirection: 'row', alignItems: 'center'},
  alignSelfEnd: {alignSelf: 'flex-end'},
  rowSpaceStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryButton: {
    marginVertical: responsiveHeight(40),
    minHeight: responsiveHeight(44),
    paddingVertical: responsiveHeight(5),
    borderRadius: responsiveWidth(6),
    backgroundColor: primary.color,
  },
  primaryButtonText: {
    fontSize: typographies.body,
    color: white,
    fontFamily: Fonts.montserratSemiBold,
  },
  header: {
    fontSize: typographies.h1,
    color: '#1C1C1C',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: typographies.subhead,
    color: '#ADADAD',
    lineHeight: responsiveHeight(21),
    textAlign: 'center',
  },
});

export default RootStyles;
