/* eslint-disable react-native/no-inline-styles */
/**
 * Container
 *
 * @format
 *
 */
import * as React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  StatusBar,
  LayoutChangeEvent,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {isIOS} from '../constants/Layout';

type ForceInset = {
  top: boolean;
  bottom: boolean;
};

type IProps = {
  backgroundColor?: string;
  padding?: boolean;
  style?: ViewStyle;
  safe?: boolean;
  forceInset?: ForceInset;
  children?: any;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  onLayout?: (event: LayoutChangeEvent) => void;
  edgeTop?: boolean;
  edgeBottom?: boolean;
};

const Container: React.FC<IProps> = props => {
  const insets = useSafeAreaInsets();
  if (props.safe) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: props.backgroundColor,
          paddingTop: props.forceInset?.top ? insets.top : 0,
          paddingBottom: props.forceInset?.bottom ? insets.bottom : 0,
          ...props.style,
        }}>
        <StatusBar barStyle={isIOS() ? 'dark-content' : 'light-content'} />
        {props.children}
      </View>
    );
  }

  return (
    <View
      style={[s.container, props.padding ? s.padding : null, props.style]}
      onLayout={props.onLayout}>
      <StatusBar barStyle={isIOS() ? 'dark-content' : 'light-content'} />
      {props.children}
    </View>
  );
};

Container.defaultProps = {
  safe: true,
  padding: false,
  forceInset: {top: false, bottom: false},
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  padding: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default Container;
