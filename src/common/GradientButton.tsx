import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';

interface GradientButtonProps {
  colors: any;
  style: any;
  titleStyle: any;
  title: string;
  onPress: () => void;
}

const GradientButton = ({
  colors,
  style,
  titleStyle,
  title,
  onPress,
}: GradientButtonProps) => {
  const styles = getStyles();

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.gradient}>
        <Text style={[styles.btn, titleStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const getStyles = () =>
  StyleSheet.create({
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: responsiveWidth(12),
    },
    btn: {
      color: '#ffffff',
    },
  });

export default GradientButton;
