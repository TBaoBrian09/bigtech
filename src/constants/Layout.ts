import {Dimensions, Platform} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const shadow = {
  shadowColor: '#000',
  shadowRadius: 5,
  elevation: 5,
  shadowOpacity: 0.2,
  shadowOffset: {width: 0, height: 3},
};

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

export function isFoldable() {
  return width > 480;
}

export function responsiveWidth(value = 0) {
  if (isFoldable()) return value;
  return (width * value) / DESIGN_WIDTH;
}

export function responsiveHeight(value = 0) {
  if (isFoldable()) return value;
  return (height * value) / DESIGN_HEIGHT;
}

export function responsiveFont(value = 0) {
  if (isFoldable()) return value;
  return (width * value) / DESIGN_WIDTH;
}

function calculateHeaderHeight(customWidth: number, customHeight: number) {
  const isLandscape = customWidth > customHeight;
  let headerHeight = responsiveHeight(56);

  if (Platform.OS === 'android') {
    headerHeight = responsiveHeight(56);
  } else if (isLandscape) {
    headerHeight = responsiveHeight(36);
  }

  return headerHeight;
}

export function isIOS() {
  return Platform.OS === 'ios';
}

export default {
  window: {
    width,
    height,
  },
  header: {
    height: calculateHeaderHeight(width, height),
  },
  shadow,
  isSmallDevice: width < 375,
};
