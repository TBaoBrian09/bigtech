/* eslint-disable react-hooks/exhaustive-deps */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, TextInput} from 'react-native';
import {useQueryClient} from 'react-query';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import SearchBar from '../../common/SearchBar';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Images from '../../constants/Images';
import {responsiveWidth} from '../../constants/Layout';
import {Assets} from '../../models/assets';
import LocalStorage from '../../utils/LocalStorage';
import AssetItem from './components/AssetItem';
import {ASSETS} from './components/Constants';

const DigitalAssetScreen = () => {
  const navigation = useNavigation();
  const grayBg = useThemeColor('borderGray');
  const styles = getStyles(grayBg);
  const queryClient = useQueryClient();
  const [digitalAssets, setDigitalAssets] = useState<Assets[]>(ASSETS);
  const [initalDigital, setInitalDigital] = useState<Assets[]>(ASSETS);

  useEffect(() => {
    handleGetCurrentDigitalAsset();
  }, []);

  useEffect(() => {
    handleSaveData();
  }, [initalDigital]);

  const handleOnChangeText = (value: string) => {
    if (!value) {
      return setDigitalAssets(initalDigital);
    }
    const filterList = initalDigital.filter(
      item =>
        item?.title?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.subTitle?.toLowerCase()?.includes(value?.toLowerCase()),
    );
    setDigitalAssets(filterList);
  };

  const handleSaveData = async () => {
    await LocalStorage.storeData('currentDigital', initalDigital);
    queryClient.prefetchQuery('digitalAsset');
  };

  const handleGetCurrentDigitalAsset = async () => {
    const currentDigitalAsset = await LocalStorage.getData('currentDigital');
    if (currentDigitalAsset) {
      setDigitalAssets(currentDigitalAsset);
      setInitalDigital(currentDigitalAsset);
    }
  };

  const findDigitalAvailable = (token: string) => {
    const findIdx = digitalAssets.findIndex(
      (item: Assets) => item.token === token,
    );
    return findIdx;
  };

  const findInitialDigitalAvailable = (token: string) => {
    const findIdx = initalDigital.findIndex(
      (item: Assets) => item.token === token,
    );
    return findIdx;
  };

  const handleToggle = async (digital: Assets) => {
    const digitalIdx = findDigitalAvailable(digital?.token);
    const initialDigitalIdx = findInitialDigitalAvailable(digital?.token);
    const filterAssets = digitalAssets.map((item, index) =>
      index === digitalIdx ? {...item, isActive: !item.isActive} : item,
    );
    const filterInitalAssets = initalDigital.map((item, index) =>
      index === initialDigitalIdx ? {...item, isActive: !item.isActive} : item,
    );
    setDigitalAssets(filterAssets);
    setInitalDigital(filterInitalAssets);
  };

  const handleOnClose = () => {
    setDigitalAssets(initalDigital);
    handleSaveData();
    navigation.goBack();
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header
        containerStyle={styles.header}
        isTransparent
        hasLeft={true}
        iconLeftSource={Images.closeIcon}
        iconLeftSize={responsiveWidth(11)}
        title={localize('language')}
        onPressLeft={handleOnClose}
      />
      <ScrollView
        style={{backgroundColor: grayBg}}
        contentContainerStyle={styles.contentContainerStyle}>
        <TextInput placeholder="asdasjdlkas" contextMenuHidden={false} />
        <SearchBar
          placeholder="Search"
          onChangeText={(value: string) => handleOnChangeText(value)}
        />
        <View style={{paddingHorizontal: responsiveWidth(15)}}>
          {digitalAssets?.map(item => (
            <AssetItem
              key={item.title}
              title={item.title}
              subTitle={item.subTitle}
              icon={item.icon}
              hasToggle
              isEnabled={item?.isActive}
              onToggle={() => handleToggle(item)}
            />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default DigitalAssetScreen;

const getStyles = (grayBg: string) =>
  StyleSheet.create({
    container: {},
    header: {
      backgroundColor: grayBg,
      borderTopLeftRadius: responsiveWidth(12),
      borderTopRightRadius: responsiveWidth(12),
    },
    contentContainerStyle: {
      flexGrow: 1,
    },
  });
