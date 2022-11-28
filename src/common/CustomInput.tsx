import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
  KeyboardType,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {white} from '../constants/Colors';

import Fonts from '../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';
import {useThemeColor} from './Themed';

interface CustomInputProps {
  onChangeText?: any;
  label?: string;
  value?: string;
  disabled?: boolean;
  onPress?: () => void;
  hasLeftIcon?: boolean;
  customLeftIcon?: any;
  leftIcon?: string;
  hasRightIcon?: boolean;
  customRightIcon?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
  errorMessage?: string;
  leftIconColor?: string;
  customInputContainerStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ViewStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  customLabelStyle?: StyleProp<TextStyle>;
  maxLength?: number;
  keyboardType?: KeyboardType;
  errorStyle?: StyleProp<TextStyle>;
  editable?: boolean;
}

const CustomInput = (props: CustomInputProps) => {
  const {
    onChangeText,
    label,
    disabled,
    onPress,
    hasLeftIcon,
    leftIcon,
    leftIconColor,
    customLeftIcon,
    hasRightIcon,
    customRightIcon,
    placeholder,
    secureTextEntry,
    value,
    errorMessage,
    customInputContainerStyle,
    leftIconStyle,
    customContainerStyle,
    customLabelStyle,
    maxLength,
    keyboardType,
    errorStyle,
    editable,
  } = props;
  const borderGray = useThemeColor('borderGray');
  const darkGray = useThemeColor('darkGray');
  const blackText = useThemeColor('blackText');
  const styles = getStyles(darkGray, borderGray, blackText);

  return (
    <TouchableOpacity
      disabled={!onPress || !disabled}
      style={styles.container}
      onPress={onPress}>
      <View pointerEvents={onPress && disabled ? 'none' : 'auto'}>
        <Input
          editable={editable}
          containerStyle={customContainerStyle}
          inputContainerStyle={[
            styles.inputContainerStyle,
            customInputContainerStyle,
          ]}
          keyboardType={keyboardType}
          labelStyle={customLabelStyle}
          errorStyle={errorStyle}
          maxLength={maxLength}
          onChangeText={onChangeText}
          autoCompleteType={false}
          autoCorrect={false}
          label={label}
          value={value}
          disabled={disabled}
          autoCapitalize="none"
          inputStyle={styles.input}
          secureTextEntry={secureTextEntry}
          errorMessage={errorMessage}
          placeholder={placeholder}
          leftIcon={
            hasLeftIcon && (
              <View style={[styles.iconStyle, leftIconStyle]}>
                {customLeftIcon || (
                  <Icon
                    tvParallaxProperties={false}
                    name={leftIcon || 'lock'}
                    type="material"
                    color={leftIconColor || white}
                  />
                )}
              </View>
            )
          }
          rightIcon={hasRightIcon && <View>{customRightIcon}</View>}
        />
      </View>
    </TouchableOpacity>
  );
};

export default CustomInput;

const getStyles = (darkGray: string, borderGray: string, blackText: string) =>
  StyleSheet.create({
    container: {},
    inputContainerStyle: {
      backgroundColor: borderGray,
      borderBottomWidth: 0,
      borderRadius: responsiveWidth(8),
    },
    iconStyle: {
      backgroundColor: darkGray,
      borderRadius: responsiveWidth(7),
      minHeight: responsiveHeight(44),
      alignItems: 'center',
      justifyContent: 'center',
      width: responsiveHeight(44),
    },
    labelStyle: {
      marginBottom: responsiveHeight(7),
      fontFamily: Fonts.montserratRegular,
      fontSize: typographies.footnote,
      color: blackText,
      fontWeight: '500',
    },
    input: {
      fontSize: typographies.subhead,
      color: blackText,
      fontFamily: Fonts.montserratRegular,
      paddingLeft: responsiveWidth(10),
    },
    text: {
      fontSize: typographies.footnote,
      color: 'black',
      fontFamily: Fonts.montserratMedium,
    },
  });
