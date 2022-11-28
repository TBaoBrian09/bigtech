import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {ScrollView, Appearance} from 'react-native';
import {Button} from 'react-native-elements';
import {Portal} from 'react-native-portalize';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format, formatISO, toDate} from 'date-fns';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import Icon from '../../common/Icon';
import {primary, white} from '../../constants/Colors';
import Images from '../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import RootStyles from '../../utils/styles';
import CustomModal from './Modals/CustomModal';
import CustomInput from '../../common/CustomInput';
import Progress from './components/Progress';

const PASSPORT = [
  {title: 'Passport', value: 'passport'},
  {title: 'ID Card', value: 'idCard'},
];
const GENDER = [
  {title: localize('male'), value: 'male'},
  {title: localize('female'), value: 'female'},
];

const FORM = [
  {
    hasRightIcon: true,
    disabled: true,
    label: localize('personal.country'),
    key: 'country',
    hasCustomRightIcon: true,
  },
  {
    hasRightIcon: false,
    disabled: false,
    label: localize('personal.name'),
    key: 'name',
  },
  {
    hasRightIcon: true,
    disabled: true,
    label: localize('personal.passport'),
    key: 'documentType',
    hasCustomRightIcon: true,
  },
  {
    hasRightIcon: false,
    disabled: false,
    label: localize('personal.documentNumber'),
    key: 'documentNumber',
  },
  {
    hasRightIcon: false,
    disabled: true,
    label: localize('personal.birthday'),
    key: 'birthday',
  },
  {
    label: localize('personal.gender'),
    key: 'gender',
    hasRightIcon: true,
    disabled: true,
    hasCustomRightIcon: true,
  },
];

const PersonalInformationScreen = () => {
  const navigation = useNavigation();
  const colorScheme = Appearance.getColorScheme();
  const isDarkModePreferred = colorScheme === 'dark';

  const documentTypeRef = useRef<any>();
  const genderRef = useRef<any>();
  const [personalForm, setPersonalForm] = useState<any>({
    country: __DEV__ ? 'VN' : '',
    documentType: __DEV__ ? 'passport' : '',
    name: __DEV__ ? 'aaaaa' : '',
    documentNumber: __DEV__ ? '111211' : '',
    birthday: __DEV__ ? Date.now() : '',
    gender: __DEV__ ? 'male' : '',
  });
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const selectCountry = (country: any) => {
    setPersonalForm({...personalForm, country: country.name});
  };

  const handleSelectCountry = () => {
    navigation.navigate(RouteKey.CountryScreen, {onSelected: selectCountry});
  };

  const handleOnChangeText = (key: string) => (value: string) => {
    setPersonalForm({...personalForm, [key]: value});
  };

  const handleSelectDateConfirm = (date: Date) => {
    hideDatePicker();
    setPersonalForm({...personalForm, birthday: date});
  };

  const handleSelectItem = (value: string, key: string) => {
    console.log('value', value);
    setPersonalForm({...personalForm, [key]: value});
  };

  const handleOnPress = (key: string) => () => {
    switch (key) {
      case 'country':
        return handleSelectCountry();
      case 'documentType':
        return documentTypeRef?.current?.open();
      case 'birthday':
        return showDatePicker();
      case 'gender':
        return genderRef?.current?.open();
      default:
        return;
    }
  };

  const handleNavigation = () => {
    navigation.navigate(RouteKey.IDCardScreen, {
      profile: {
        ...personalForm,
        documentType: personalForm?.documentType?.value,
        gender: personalForm?.gender?.value,
        birthday: formatISO(new Date(personalForm?.birthday)),
      },
    });
  };

  const handleValidateField = () => {
    const isEmpty = Object.values(personalForm).some(
      x => x === null || x === '',
    );
    return isEmpty;
  };

  const handleValueInput = (key: string) => {
    if (key === 'birthday' && personalForm?.birthday) {
      const newDate = format(personalForm?.birthday, 'dd/MM/yyyy');
      return newDate?.toString();
    }
    if (key === 'documentType') {
      return personalForm?.[key]?.title;
    }
    if (key === 'gender') {
      return personalForm?.[key]?.title;
    }
    return personalForm?.[key]?.toString();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}>
      <Header
        hasLeft
        iconLeftColor={primary.color}
        title={localize('accountVerification')}
      />

      <ScrollView>
        <Progress
          style={{marginLeft: responsiveWidth(15)}}
          step={1}
          title={localize('step1')}
          subTitle={localize('personalInformation')}
        />
        {FORM.map(item => (
          <CustomInput
            key={item.label}
            hasRightIcon={item.hasRightIcon}
            disabled={item.disabled}
            label={item.label}
            value={handleValueInput(item?.key)}
            onPress={handleOnPress(item.key)}
            customRightIcon={
              item.hasCustomRightIcon && (
                <Icon source={Images.polygonIcon} size={responsiveHeight(10)} />
              )
            }
            onChangeText={handleOnChangeText(item?.key)}
          />
        ))}

        <Button
          disabled={handleValidateField()}
          title={localize('next')}
          onPress={handleNavigation}
          buttonStyle={[
            RootStyles.primaryButton,
            {marginHorizontal: responsiveWidth(15)},
          ]}
          titleStyle={RootStyles.primaryButtonText}
        />
      </ScrollView>

      <DateTimePickerModal
        isDarkModeEnabled={isDarkModePreferred}
        isVisible={isDatePickerVisible}
        mode="date"
        date={
          !!personalForm?.birthday
            ? toDate(new Date(personalForm?.birthday))
            : new Date()
        }
        maximumDate={new Date()}
        onConfirm={handleSelectDateConfirm}
        onCancel={hideDatePicker}
      />
      <Portal>
        <CustomModal
          ref={documentTypeRef}
          data={PASSPORT}
          keyItem={'documentType'}
          onPress={handleSelectItem}
        />
        <CustomModal
          ref={genderRef}
          data={GENDER}
          keyItem={'gender'}
          onPress={handleSelectItem}
        />
      </Portal>
    </Container>
  );
};

export default PersonalInformationScreen;
