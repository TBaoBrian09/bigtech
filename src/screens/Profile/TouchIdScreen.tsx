import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-elements';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import {white} from '../../constants/Colors';
import {isIOS, responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import {useLogin} from '../../hooks/useQueries';
import {UserLoginAPI} from '../../models/user';
import LocalStorage from '../../utils/LocalStorage';
import RootStyles from '../../utils/styles';
import CustomInput from './components/CustomInput';

const TouchIdScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState<string>('');

  const {mutate: handleLoginMutate} = useLogin();

  const handleOnChangeText = (value: string) => {
    setPassword(value);
  };

  const handleSavePassword = async () => {
    const user = await LocalStorage.getData('user');
    const phoneNumber =
      '+' + user?.phoneNumber?.callingCode + user?.phoneNumber?.number;
    let body: UserLoginAPI = {
      password,
    };
    if (user?.email) {
      body = {...body, email: user?.email};
    } else {
      body = {...body, phoneNumber};
    }
    handleLoginMutate(body, {
      onSuccess: async () => {
        const savedAccount = {
          id: user?.id,
          email: user?.email,
          phoneNumber,
          password,
        };
        await AsyncStorage.setItem(
          'savedAccount',
          JSON.stringify(savedAccount),
        );
        navigation.navigate(RouteKey.SettingScreen, {forceRefresh: Date.now()});
      },
    });
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('touchID')} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={isIOS() ? 'padding' : undefined}>
        <View style={{flex: 1, marginTop: responsiveHeight(20)}}>
          <CustomInput
            hasLeftIcon
            secureTextEntry
            value={password}
            placeholder={localize('inputPassword')}
            onChangeText={handleOnChangeText}
          />
        </View>
        <View style={{marginHorizontal: responsiveWidth(16)}}>
          <Button
            title={localize('confirm')}
            onPress={handleSavePassword}
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

export default TouchIdScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
});
