import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useMutate} from '../../hooks/useQueries';
import {ChangePasswordForm} from '../../models/form';
import {changePassword} from '../../utils/Api/ApiManage';
import RootStyles from '../../utils/styles';
import {validatePassword} from '../../utils/utils';
import CustomInput from './components/CustomInput';

const FORM = [
  {
    label: localize('currentPassword'),
    key: 'password',
  },
  {
    label: localize('newPassword'),
    key: 'newPassword',
  },
  {
    label: localize('confirmPassword'),
    key: 'confirmPassword',
  },
];

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState<ChangePasswordForm>({
    password: '',
    confirmPassword: '',
    newPassword: '',
  });

  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const {mutate: handleChangePassword} = useMutate(changePassword);

  const validateConfirmPassword = () => {
    return (
      form.confirmPassword === form.newPassword &&
      form.password &&
      form.newPassword &&
      form.confirmPassword
    );
  };

  const checkPasswordValid = (key: string) => {
    if (!validatePassword(form[key]) && form[key])
      return localize('yourPassWordIsNotValid');
    return '';
  };

  const handleOnChangeText = (key: string) => (value: string) => {
    setForm({...form, [key]: value});
  };

  const handleSubmit = async () => {
    const body = {
      password: form.password,
      newPassword: form.newPassword,
    };
    handleChangePassword(body, {
      onSuccess: async () => {
        ToastEmitter.success(localize('changePasswordSuccess'));
        navigation.navigate(RouteKey.SettingScreen, {
          forceRefresh: Date.now(),
        });
      },
    });
  };

  // const checkSimilarPassword = (key: string) => {
  //   return (
  //     key === 'newPassword' &&
  //     form.newPassword === form.password &&
  //     form.newPassword &&
  //     form.password
  //   );
  // };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('changePassword')} />
      <ScrollView>
        <View style={{flex: 1, marginTop: responsiveHeight(20)}}>
          <Text style={styles.title}>{localize('toUpdateYourPassword')}</Text>
          {FORM?.map(item => (
            <CustomInput
              key={item.label}
              hasLeftIcon
              secureTextEntry
              label={item.label}
              value={form[item.key] || ''}
              placeholder={localize('inputPassword')}
              onChangeText={handleOnChangeText(item.key)}
              errorMessage={checkPasswordValid(item.key)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={{marginHorizontal: responsiveWidth(16)}}>
        <Button
          disabled={!validateConfirmPassword()}
          title={localize('changePassword')}
          onPress={handleSubmit}
          buttonStyle={[RootStyles.primaryButton, {marginBottom: 0}]}
          titleStyle={RootStyles.primaryButtonText}
        />
      </View>
    </Container>
  );
};

export default ChangePasswordScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {flex: 1},
    title: {
      fontSize: typographies.footnote,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      marginBottom: responsiveHeight(33),
      marginTop: responsiveHeight(15),
      marginHorizontal: responsiveWidth(15),
    },
  });
