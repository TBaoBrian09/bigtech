import {RouteProp, useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';

import {localize} from '../../assets/i18n/I18nConfig';
import Container from '../../common/Container';
import Header from '../../common/Header';
import SearchBar from '../../common/SearchBar';
import {useThemeColor} from '../../common/Themed';
import {white} from '../../constants/Colors';
import Images from '../../constants/Images';
import {responsiveWidth} from '../../constants/Layout';
import RouteKey from '../../constants/RouteKey';
import {UserContext} from '../../context/UserContext';
import {Assets} from '../../models/assets';
import {TOKEN_ICON} from '../../utils/Constants';
import AssetItem from './components/AssetItem';

type Params = {
  screen: {};
};

interface ReceiveScreenProps {
  route: RouteProp<Params, 'screen'>;
  navigation: any;
}

const ReceiveScreen = ({}: ReceiveScreenProps) => {
  const navigation = useNavigation();
  const grayBg = useThemeColor('borderGray');
  const styles = getStyles(grayBg);

  const {userData} = React.useContext(UserContext);
  const listToken = Object.values(userData?.priceToken);
  const [listAssets, setListAssets] = React.useState<Assets[]>(listToken);

  const handleOnChangeText = (value: string) => {
    if (!value) {
      return setListAssets(listToken);
    }
    const filterList = listToken.filter(item =>
      item?.symbol?.toLowerCase()?.includes(value?.toLowerCase()),
    );
    setListAssets(filterList);
  };

  return (
    <Container
      safe
      forceInset={{top: true, bottom: false}}
      backgroundColor={white}
      style={styles.container}>
      <Header hasLeft={true} title={localize('receive')} />
      <ScrollView
        // style={{backgroundColor: grayBg}}
        contentContainerStyle={styles.contentContainerStyle}>
        <SearchBar
          placeholder={localize('search')}
          onChangeText={(value: string) => handleOnChangeText(value)}
        />
        <View style={{paddingHorizontal: responsiveWidth(15)}}>
          {listAssets.map(item => (
            <AssetItem
              key={item?.symbol}
              title={item?.symbol}
              icon={TOKEN_ICON[item?.symbol]?.icon}
              onPress={() =>
                navigation.navigate(RouteKey.ReceiveDigitalScreen, {
                  token: item?.symbol,
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default ReceiveScreen;

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
