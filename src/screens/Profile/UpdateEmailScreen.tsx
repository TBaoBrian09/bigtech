/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {verticalScale} from 'react-native-size-matters';
import {useQueryClient} from 'react-query';
import * as RNLocalize from 'react-native-localize';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {isIOS, responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import {useMutate} from '../../hooks/useQueries';
import {updateUser} from '../../utils/Api/ApiManage';
import RootStyles from '../../utils/styles';
import {validateEmail} from '../../utils/utils';
import CustomInput from './components/CustomInput';
import {countries} from '../../assets/country/countries';
import {isValidPhoneNumber} from 'libphonenumber-js';

const UpdateEmailScreen = (props: any) => {
  const locales = RNLocalize.getLocales()[0];
  const {isPhoneNumber} = props?.route?.params ?? {};
  const [form, setForm] = useState<string>('');
  const [selectedCountry, setCountry] = useState<any>();
  const {mutate: onUpdateUser} = useMutate(updateUser);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handleUpdateEmail = async () => {
    let body = isPhoneNumber
      ? {
          phoneNumber:
            (selectedCountry?.dial_code ||
              findCurrentCountryDialCode?.dial_code) + form,
        }
      : {email: form};
    onUpdateUser(
      {
        ...body,
      } as unknown as void,
      {
        onSuccess: () => {
          queryClient.invalidateQueries('me');
          let tempUsername = isPhoneNumber
            ? (selectedCountry?.dial_code ||
                findCurrentCountryDialCode?.dial_code) + form
            : form;
          return navigation.navigate(RouteKey.VerifyOTPScreen, {
            tempUsername,
            isUseEmail: !isPhoneNumber,
          });
        },
      },
    );
  };

  const checkFormValid = useMemo<string>(() => {
    if (form && !isPhoneNumber && !validateEmail(form)) {
      return localize('yourEmailIsNotValid');
    }
    if (
      form &&
      !isValidPhoneNumber(
        form,
        selectedCountry?.code || locales?.countryCode,
      ) &&
      isPhoneNumber
    ) {
      return localize('yourPhoneNumberIsNotValid');
    }
    return '';
  }, [form]);

  const findCurrentCountryDialCode = useMemo(
    () => countries.find(item => item.code === locales?.countryCode),
    [],
  );

  const selectCountry = (country: any) => {
    setCountry(country);
  };

  const handleSelectCountry = () => {
    navigation.navigate(RouteKey.CountryScreen, {onSelected: selectCountry});
  };

  const handleShowFlagIcon = () => {
    const uri = `https://raw.githubusercontent.com/Vihan/CountriesData/ver-0.1/countries_flags/${
      selectedCountry?.code || locales?.countryCode
    }.png`;

    return (
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={handleSelectCountry}
        hitSlop={{top: 20, bottom: 20, left: 10, right: 10}}>
        <FastImage
          source={{uri}}
          style={styles.flagImage}
          resizeMode="contain"
        />
        <Text style={styles.countryName}>
          {selectedCountry?.dial_code || findCurrentCountryDialCode?.dial_code}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        hasLeft={true}
        title={isPhoneNumber ? localize('phoneNumber') : localize('email')}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={isIOS() ? 'padding' : undefined}>
        <View style={{flex: 1, marginTop: responsiveHeight(20)}}>
          <CustomInput
            maxLength={isPhoneNumber ? 16 : 40}
            placeholder={
              isPhoneNumber
                ? localize('enterThePhoneNumber')
                : localize('enterEmail')
            }
            keyboardType={isPhoneNumber ? 'number-pad' : 'email-address'}
            value={form}
            onChangeText={setForm}
            errorMessage={checkFormValid}
            hasLeftIcon={isPhoneNumber}
            customLeftIconStyle={{
              minWidth: responsiveWidth(90),
              paddingHorizontal: responsiveWidth(10),
            }}
            customLeftIcon={handleShowFlagIcon()}
          />
        </View>
        <View style={{marginHorizontal: responsiveWidth(16)}}>
          <Button
            disabled={!form || !!checkFormValid}
            title={localize('save')}
            onPress={handleUpdateEmail}
            buttonStyle={[
              RootStyles.primaryButton,
              {marginBottom: responsiveHeight(10)},
            ]}
            titleStyle={RootStyles.primaryButtonText}
          />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default UpdateEmailScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  flagImage: {
    width: responsiveWidth(34),
    height: responsiveHeight(18),
    marginRight: verticalScale(2),
  },
  countryName: {
    fontSize: typographies.subhead,
    fontFamily: Fonts.montserratMedium,
    color: 'black',
  },
});
