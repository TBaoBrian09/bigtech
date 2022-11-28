import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';

import {useThemeColor} from '../../../common/Themed';
import {white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';

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
  maxLength?: number;
  keyboardType?: KeyboardType;
  errorMessage?: string;
  customLeftIconStyle?: StyleProp<ViewStyle>;
}

const CustomInput = (props: CustomInputProps) => {
  const {
    onChangeText,
    label,
    disabled,
    onPress,
    hasLeftIcon,
    leftIcon,
    customLeftIcon,
    hasRightIcon,
    customRightIcon,
    placeholder,
    secureTextEntry,
    errorMessage,
    value,
    maxLength,
    keyboardType,
    customLeftIconStyle,
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
          errorMessage={errorMessage}
          keyboardType={keyboardType}
          maxLength={maxLength}
          inputContainerStyle={styles.inputContainerStyle}
          onChangeText={onChangeText}
          autoCompleteType={false}
          autoCorrect={false}
          label={label}
          labelStyle={styles.labelStyle}
          value={value}
          disabled={disabled}
          autoCapitalize="none"
          inputStyle={styles.input}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          leftIcon={
            hasLeftIcon && (
              <View style={[styles.iconStyle, customLeftIconStyle]}>
                {customLeftIcon || (
                  <Icon
                    tvParallaxProperties={false}
                    name={leftIcon || 'lock'}
                    type="material"
                    color={white}
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
  });
