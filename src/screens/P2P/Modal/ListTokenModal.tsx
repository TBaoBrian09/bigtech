import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  TouchableOpacity,
} from 'react-native';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';

import {localize} from '../../../assets/i18n/I18nConfig';
import {useThemeColor} from '../../../common/Themed';
import Fonts from '../../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import {UserContext} from '../../../context/UserContext';
import {Assets} from '../../../models/assets';
import {TOKEN_ICON} from '../../../utils/Constants';
import AssetItem from '../../Assets/components/AssetItem';
import {P2P_TOKENS} from '../P2PConstants';

interface Props {
  data?: any;
  onPress?: (token?: Assets | string) => void;
  keyItem: string;
  hasAllType?: boolean;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const TokenModal: React.ForwardRefRenderFunction<Ref, Props> = (props, ref) => {
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

  const handleOnPress = (token?: string) => {
    if (props.onPress) {
      props?.onPress(token);
    }
    closeModal();
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      <View style={styles.networkWrapper}>
        <Text style={styles.networkTitle}>{localize('chooseToken')}</Text>
      </View>
      {props.hasAllType && (
        <TouchableOpacity onPress={() => handleOnPress('')}>
          <Text style={styles.title}>{localize('all')}</Text>
        </TouchableOpacity>
      )}
      {props?.listToken?.map(item => (
        <AssetItem
          key={item.symbol}
          title={item.symbol}
          // subTitle={item.subTitle}
          icon={TOKEN_ICON[item.symbol]?.icon}
          onPress={() => handleOnPress(item)}
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
    networkTitle: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: blackText,
    },
    title: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.subTitle,
      color: blackText,
      marginTop: responsiveHeight(15),
    },
  });

export default forwardRef(TokenModal);
