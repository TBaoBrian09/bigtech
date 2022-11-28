import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {localize} from '../../../assets/i18n/I18nConfig';

import {useThemeColor} from '../../../common/Themed';
import {white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';

interface Props {
  data?: any;
  onPress?: () => void;
  keyItem: string;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const SuccessModal: React.ForwardRefRenderFunction<Ref, Props> = (
  props,
  ref,
) => {
  const blackText = useThemeColor('blackText');
  const grayBg = useThemeColor('borderGray');
  const grayText = useThemeColor('grayText');
  const styles = getStyles(grayBg, blackText, grayText);
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

  const handleOnPress = () => {
    closeModal();
    if (props.onPress) {
      props?.onPress();
    }
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      <FastImage source={Images.successIcon} style={styles.icon} />
      <Text style={styles.header}>{localize('closeOrderSuccess')}</Text>
      <TouchableOpacity
        style={[styles.buttonWrapper, {backgroundColor: grayText}]}
        onPress={handleOnPress}>
        <Text style={styles.text}>{localize('ok')}</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <Modalize
      ref={modal}
      onClosed={onClosed}
      onOpened={onOpened}
      disableScrollIfPossible
      modalHeight={responsiveHeight(300)}
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

const getStyles = (borderGray: string, blackText: string, grayText: string) =>
  StyleSheet.create({
    container: {
      borderTopLeftRadius: responsiveWidth(10),
      borderTopRightRadius: responsiveWidth(10),
      paddingBottom: responsiveHeight(20),
      backgroundColor: borderGray,
    },
    contentContainer: {
      flex: 1,
      paddingVertical: responsiveHeight(30),
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonWrapper: {
      paddingHorizontal: responsiveWidth(20),
      width: Layout.window.width - responsiveWidth(30),
      paddingVertical: responsiveHeight(10),
      borderRadius: responsiveWidth(5),
      backgroundColor: grayText,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: responsiveHeight(20),
    },
    icon: {
      width: responsiveWidth(80),
      height: responsiveWidth(80),
      marginBottom: responsiveHeight(25),
    },
    header: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.body,
      color: blackText,
    },
    text: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.subTitle,
      color: blackText,
    },
    confirm: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.subTitle,
      color: white,
    },
  });

export default forwardRef(SuccessModal);
