import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-elements';
import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import CustomInput from '../../common/CustomInput';
import Header from '../../common/Header';
import {useThemeColor} from '../../common/Themed';
import {primary, white} from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import typographies from '../../constants/Typographies';
import ToastEmitter from '../../helpers/ToastEmitter';
import {useMutate} from '../../hooks/useQueries';
import {forgotPassword} from '../../utils/Api/ApiManage';
import RootStyles from '../../utils/styles';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  const [input, setInput] = React.useState<string>('');

  const {mutate: handleForgot} = useMutate(forgotPassword);

  const handleConfirm = async () => {
    const parsed = input[0] === '0' ? input.replace('0', '') : input;
    handleForgot(
      {
        emailOrPhone: parsed,
      } as unknown as void,
      {
        onSuccess: () => {
          ToastEmitter.success(localize('sendSuccess'));
          return navigation.navigate(RouteKey.ResetPasswordScreen, {
            emailOrPhoneProps: input,
          });
        },
      },
    );
  };
  const hanldeOnChangeText = (v: string) => {
    setInput(v);
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: true}}
      backgroundColor={white}>
      <Header
        hasLeft
        iconLeftColor={primary.color}
        title={localize('forgotPassword')}
      />
      <View style={styles.container}>
        <Text style={styles.title}>
          {localize('pleaseEnterYourPhoneNumber')}
        </Text>
        <CustomInput
          customLabelStyle={styles.label}
          customContainerStyle={styles.customContainerStyle}
          customInputContainerStyle={{height: responsiveHeight(44)}}
          label={localize('phoneOrEmail')}
          placeholder={localize('inputEmailOrPhoneNumber')}
          onChangeText={(v: string) => hanldeOnChangeText(v)}
        />
        <Button
          disabled={!input?.length}
          title={localize('forgotPassword')}
          onPress={handleConfirm}
          buttonStyle={[
            RootStyles.primaryButton,
            {marginTop: responsiveHeight(10)},
          ]}
          titleStyle={RootStyles.primaryButtonText}
        />
      </View>
    </Container>
  );
};

export default ForgotPasswordScreen;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: responsiveWidth(15),
    },
    customContainerStyle: {
      paddingHorizontal: 0,
      marginTop: responsiveHeight(20),
    },
    label: {
      fontWeight: '500',
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      marginBottom: responsiveHeight(8),
      textTransform: 'capitalize',
    },
    title: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.subhead,
      color: blackText,
      marginTop: responsiveHeight(10),
    },
  });
