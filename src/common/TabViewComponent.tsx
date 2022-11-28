/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {primary, white} from '../constants/Colors';

import Fonts from '../constants/Fonts';
import Layout, {responsiveHeight} from '../constants/Layout';
import typographies from '../constants/Typographies';
import {useThemeColor} from './Themed';

interface TabViewComponentProps {
  data: Array<string>;
  onPress?: (tabIndex: number) => void;
  disabled?: boolean;
  selectedTab?: number;
  style?: StyleProp<ViewStyle>;
}

const TabViewComponent = (props: TabViewComponentProps) => {
  const {data, onPress, selectedTab, disabled, style} = props;
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText, data.length);

  const Item = useCallback(
    ({item, tabIndex}) => {
      return (
        <TouchableOpacity
          disabled={!onPress}
          style={[
            styles.item,
            selectedTab === tabIndex && {borderBottomColor: primary.color},
          ]}
          onPress={() => onPress && onPress(tabIndex)}>
          <Text
            style={
              selectedTab === tabIndex ? styles.activeTitle : styles.title
            }>
            {item}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedTab],
  );

  return (
    <View
      style={[styles.container, style]}
      pointerEvents={disabled ? 'none' : 'auto'}>
      {data?.map((item, index) => (
        <Item key={item} tabIndex={index} item={item} />
      ))}
    </View>
  );
};

const getStyles = (blackText: string, totalItem: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: Layout.window.width,
      paddingTop: responsiveHeight(17),
    },
    item: {
      width: Layout.window.width / totalItem,
      alignItems: 'center',
      borderBottomWidth: responsiveHeight(3),
      borderBottomColor: white,
      justifyContent: 'center',
      paddingVertical: responsiveHeight(8),
    },
    borderStyle: {
      width: Layout.window.width / totalItem,
      height: responsiveHeight(4),
      marginTop: responsiveHeight(15),
    },
    activeTitle: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratBold,
      color: blackText,
    },
    title: {
      fontSize: typographies.subhead,
      fontFamily: Fonts.montserratBold,
      color: '#606060',
    },
  });

export default TabViewComponent;
