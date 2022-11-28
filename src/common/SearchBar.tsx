import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Input} from 'react-native-elements';
import {white} from '../constants/Colors';

import Fonts from '../constants/Fonts';
import Images from '../constants/Images';
import {responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';
import Icon from './Icon';
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
  customLabelStyle?: StyleProp<ViewStyle>;
  customInputStyle?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
}

const SearchBar = (props: CustomInputProps) => {
  const {
    onChangeText,
    label,
    disabled,
    onPress,
    leftIconColor,
    hasRightIcon,
    customRightIcon,
    placeholder,
    value,
    errorMessage,
    customInputContainerStyle,
    customLabelStyle,
    customInputStyle,
    placeholderTextColor,
  } = props;
  const darkGray = useThemeColor('darkGray');
  const styles = getStyles(darkGray);

  return (
    <TouchableOpacity
      disabled={!onPress || !disabled}
      style={styles.container}
      onPress={onPress}>
      <View pointerEvents={onPress && disabled ? 'none' : 'auto'}>
        <Input
          inputContainerStyle={[
            styles.inputContainerStyle,
            customInputContainerStyle,
          ]}
          onChangeText={onChangeText}
          autoCompleteType={false}
          autoCorrect={false}
          label={label}
          labelStyle={[styles.labelStyle, customLabelStyle]}
          value={value}
          disabled={disabled}
          autoCapitalize="none"
          inputStyle={[styles.input, customInputStyle]}
          errorMessage={errorMessage}
          placeholder={placeholder}
          selectTextOnFocus={true}
          placeholderTextColor={placeholderTextColor || white}
          leftIcon={
            <Icon
              source={Images.searchIcon}
              size={responsiveWidth(20)}
              color={leftIconColor || white}
            />
          }
          rightIcon={hasRightIcon && <View>{customRightIcon}</View>}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;

const getStyles = (darkGray: string) =>
  StyleSheet.create({
    container: {},
    inputContainerStyle: {
      backgroundColor: darkGray,
      borderBottomWidth: 0,
      borderRadius: responsiveWidth(8),
      paddingHorizontal: responsiveWidth(15),
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
      color: white,
      fontWeight: '500',
    },
    input: {
      fontSize: typographies.subhead,
      color: white,
      fontFamily: Fonts.montserratRegular,
      paddingLeft: responsiveWidth(10),
    },
  });
