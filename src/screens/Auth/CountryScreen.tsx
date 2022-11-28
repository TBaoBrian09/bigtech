import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {Input} from 'react-native-elements';
import {verticalScale} from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';

import Container from '../../common/Container';
import Header from '../../common/Header';
import {white} from '../../constants/Colors';
import {countries} from '../../assets/country/countries';
import TitleComponent from '../../common/TitleComponent';
import {localize} from '../../assets/i18n/I18nConfig';
import {responsiveHeight, responsiveWidth} from '../../constants/Layout';
import typographies from '../../constants/Typographies';
import Fonts from '../../constants/Fonts';
import {useThemeColor} from '../../common/Themed';
import Icon from '../../common/Icon';
import Images from '../../constants/Images';
import RouteKey from '../../constants/RouteKey';

interface IProps {
  route?: any;
}

const CountryScreen = (props: IProps) => {
  const {onSelected} = props?.route?.params ?? {};
  const navigation = useNavigation();
  const blackText = useThemeColor('blackText');
  const grayBg = useThemeColor('grayBg');

  const styles = getStyles(blackText, grayBg);

  const [searchCountries, setSearchCountries] = useState<any>(countries);

  const keyExtractor = React.useCallback(
    (item, index) => 'countries' + index,
    [],
  );

  const handleOnChangeText = (value: string) => {
    if (!value) {
      setSearchCountries(countries);
    }
    const filterCountries = countries.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setSearchCountries(filterCountries);
  };

  const handleSelectCountry = (item: any) => {
    if (onSelected) {
      onSelected(item);
      return navigation.goBack();
    }
    navigation.navigate(RouteKey.Register, {
      country: item.code,
      dial: item.dial_code,
    });
  };

  const renderItem = ({item}: any) => {
    const uri = `https://raw.githubusercontent.com/Vihan/CountriesData/ver-0.1/countries_flags/${item.code}.png`;
    return (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => handleSelectCountry(item)}>
        <FastImage
          source={{uri}}
          style={styles.flagImage}
          resizeMode="contain"
        />
        <Text style={styles.countryName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft onPressLeft={() => navigation.goBack()} />
      <TitleComponent
        title={localize('selectCountry')}
        titleStyle={{marginLeft: responsiveWidth(16)}}
      />
      <Input
        containerStyle={{paddingHorizontal: 0}}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        autoCompleteType={false}
        placeholder={localize('search')}
        onChangeText={(value: string) => handleOnChangeText(value)}
        leftIcon={
          <Icon
            source={Images.searchIcon}
            size={15}
            style={{marginRight: responsiveWidth(5)}}
          />
        }
      />
      <FlatList
        contentContainerStyle={{paddingBottom: responsiveHeight(20)}}
        data={searchCountries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Container>
  );
};

export default CountryScreen;

const getStyles = (blackText: string, grayBg: string) =>
  StyleSheet.create({
    container: {},
    flagImage: {
      width: responsiveWidth(34),
      height: responsiveHeight(18),
      marginRight: verticalScale(7),
    },
    inputContainerStyle: {
      backgroundColor: grayBg,
      borderBottomWidth: 0,
      paddingLeft: responsiveWidth(12),
      borderRadius: responsiveWidth(7),
      marginHorizontal: responsiveWidth(16),
    },
    inputStyle: {
      fontSize: typographies.footnote,
      color: blackText,
      fontFamily: Fonts.montserratMedium,
    },
    countryItem: {
      minHeight: 44,
      paddingVertical: 6,
      borderBottomColor: blackText,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: responsiveWidth(16),
      marginBottom: 0,
    },
    flag: {
      fontSize: 20,
      marginRight: responsiveWidth(10),
      color: blackText,
    },
    countryName: {
      fontSize: typographies.body,
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      width: responsiveWidth(280),
    },
  });
