import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, StyleSheet, InteractionManager, Text} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {localize} from '../../../assets/i18n/I18nConfig';

import {useThemeColor} from '../../../common/Themed';
import {white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import AssetItem from '../components/AssetItem';

interface Props {
  data?: any;
  onPress?: (token: string) => void;
  keyItem: string;
  isDisableOnChain?: boolean;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const ON_CHAIN = [
  {
    title: 'BEP20',
    subTitle: 'Binance Smart Chain',
    icon: Images.bnbIcon,
  },
  // {
  //   title: 'ERC20',
  //   subTitle: 'Ethereum',
  //   icon: Images.ethIcon,
  // },
  // {
  //   title: 'TRC20',
  //   subTitle: 'TRON',
  //   icon: Images.tronIcon,
  // },
  // {
  //   title: 'KRC20',
  //   subTitle: 'KardiaChain',
  //   icon: Images.kardiaIcon,
  // },
];

const NetworkModal: React.ForwardRefRenderFunction<Ref, Props> = (
  props,
  ref,
) => {
  const blackText = useThemeColor('blackText');
  const grayBg = useThemeColor('borderGray');
  const styles = getStyles(grayBg, blackText);
  const modal = useRef<Modalize>();

  useImperativeHandle(ref, () => {
    return {
      open: openModal,
      close: closeModal,
    };
  });

  const openModal = () => {
    if (modal.current) {
      modal.current.open();
    }
  };

  const closeModal = () => {
    if (modal.current) {
      modal.current.close();
    }
  };

  const onOpened = () => {
    InteractionManager.runAfterInteractions(() => {});
  };

  const onClosed = () => {
    InteractionManager.runAfterInteractions(() => {});
  };

  const handleOnPress = (token: string) => {
    if (props.onPress) {
      props?.onPress(token);
    }
    closeModal();
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      <View style={styles.networkWrapper}>
        <Text style={styles.networkTitle}>{localize('chooseANetwork')}</Text>
      </View>
      <AssetItem
        style={{borderBottomWidth: 0, marginVertical: responsiveHeight(30)}}
        title="Big Tech Global"
        subTitle="Big Tech Global (BTG)"
        icon={Images.btgIcon}
        onPress={() => handleOnPress('BTG')}
      />
      <View style={styles.onchainWrapper}>
        <Text style={styles.onchainTitle}>On-chain</Text>
      </View>
      {ON_CHAIN?.map(item => (
        <AssetItem
          disabled={props?.isDisableOnChain}
          key={item.title}
          title={item.title}
          subTitle={item.subTitle}
          icon={item.icon}
          onPress={() => handleOnPress(item.title)}
        />
      ))}
    </View>
  ));

  return (
    <Modalize
      ref={modal}
      onClosed={onClosed}
      onOpened={onOpened}
      disableScrollIfPossible
      adjustToContentHeight
      scrollViewProps={{
        contentContainerStyle: styles.container,
      }}
      modalStyle={{
        ...styles.container,
      }}>
      <ViewWithHoc />
    </Modalize>
  );
};

const getStyles = (borderGray: string, blackText: string) =>
  StyleSheet.create({
    container: {
      borderTopLeftRadius: responsiveWidth(10),
      borderTopRightRadius: responsiveWidth(10),
      paddingBottom: responsiveHeight(20),
      backgroundColor: borderGray,
    },
    contentContainer: {
      flex: 1,
      paddingBottom: 15,
      paddingHorizontal: 15,
      justifyContent: 'flex-start',
    },
    networkWrapper: {
      paddingVertical: responsiveHeight(20),
      borderBottomColor: blackText,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginHorizontal: -responsiveWidth(15),
      paddingHorizontal: responsiveWidth(15),
    },
    onchainWrapper: {
      marginHorizontal: -responsiveWidth(15),
      paddingHorizontal: responsiveWidth(15),
      backgroundColor: white,
      marginBottom: responsiveHeight(20),
      paddingVertical: responsiveHeight(10),
    },
    networkTitle: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: blackText,
    },
    onchainTitle: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      textTransform: 'uppercase',
    },
  });

export default forwardRef(NetworkModal);
