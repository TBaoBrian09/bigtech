import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationState} from '@react-navigation/core';

import Fonts from '../constants/Fonts';
import {white} from '../constants/Colors';
import {
  responsiveFont,
  responsiveHeight,
  responsiveWidth,
} from '../constants/Layout';
import Images from '../constants/Images';
import Icon from '../common/Icon';
import {localize} from '../assets/i18n/I18nConfig';
import {BottomBarContext} from '../context/BottomBarContext';

interface CustomTabBar {
  navigation: any;
  state: NavigationState;
}

const LABEL: {[index: number]: string} = {
  0: localize('home'),
  // 1: localize('projects'),
  1: 'P2P',
  2: 'DeFi',
  // 4: 'Thành viên',
};

function CustomTabBar(props: CustomTabBar) {
  const {navigation, state} = props;
  const {setTime} = React.useContext(BottomBarContext);

  const handleGetIcon = (index: number) => {
    switch (index) {
      case 0:
        return Images.homeIcon2;
      // case 1:
      //   return Images.projectIcon;
      case 1:
        return Images.p2pBarIcon;
      case 2:
        return Images.dexIcon;
      default:
        return Images.partnerIcon;
    }
  };

  const handleIconSize = (idx: number) => {
    if (idx === 1) return responsiveWidth(40);
    return responsiveWidth(25);
  };

  function renderItem(route: any, index: number) {
    const label = LABEL[index];

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        // The `merge: true` option makes sure that the params inside the tab screen are preserved
        navigation.navigate({name: route.name, merge: true});
      }
    };

    const onPressDefi = () => {
      setTime(Date.now());
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        // The `merge: true` option makes sure that the params inside the tab screen are preserved
        navigation.navigate({name: route.name, merge: true});
      }
    };

    return (
      <TouchableOpacity
        key={label}
        style={[
          styles.itemContainer,
          isFocused && {borderTopColor: '#189B91'},
          index === 1 && {paddingTop: responsiveHeight(20)},
        ]}
        onPress={index === 2 ? onPressDefi : onPress}>
        <Icon source={handleGetIcon(index)} size={handleIconSize(index)} />
        <Text
          style={[styles.title, {color: isFocused ? '#189B91' : '#606060'}]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <View style={styles.wrapper}>
        {state.routes.map((route, index) => renderItem(route, index))}
      </View>
    </SafeAreaView>
  );
}

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: white,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingTop: responsiveHeight(7),
    fontSize: responsiveFont(11),
    fontFamily: Fonts.montserratRegular,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: white,
    paddingTop: responsiveHeight(15),
  },
});
