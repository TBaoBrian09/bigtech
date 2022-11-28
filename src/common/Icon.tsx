/**
 * Icon Component
 *
 * @format
 *
 */

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type IProps = {
  source: ImageSourcePropType;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
  hitSlop?: any;
};

const Icon = ({
  source,
  size = 8,
  color,
  containerStyle,
  style,
  disabled,
  onPress,
  hitSlop,
}: IProps) => {
  return (
    <TouchableOpacity
      disabled={!onPress || disabled}
      onPress={onPress}
      style={containerStyle}
      hitSlop={hitSlop}>
      <Image
        source={source}
        style={{
          width: size,
          height: size,
          tintColor: color,
          ...style,
        }}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

export default React.memo(Icon);
