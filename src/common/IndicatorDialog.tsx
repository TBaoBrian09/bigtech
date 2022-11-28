import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {primary} from '../constants/Colors';
import Layout, {responsiveWidth} from '../constants/Layout';

export default class IndicatorDialog extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ActivityIndicator size="large" color={primary.bgColor} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: Layout.window.width,
    height: Layout.window.height,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: responsiveWidth(120),
    aspectRatio: 1,
  },
});
