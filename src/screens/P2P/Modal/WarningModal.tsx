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
import {primary, white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface Props {
  data?: any;
  onPress?: () => void;
  keyItem: string;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const WarningModal: React.ForwardRefRenderFunction<Ref, Props> = (
  props,
  ref,
) => {
  const blackText = useThemeColor('blackText');
  const grayBg = useThemeColor('borderGray');
  const grayText = useThemeColor('grayText');
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

  const handleOnPress = () => {
    closeModal();
    if (props.onPress) {
      props?.onPress();
    }
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      <FastImage source={Images.warningIcon} style={styles.icon} />
      <Text style={styles.header}>
        {localize('areYouSureToCloseThisOrder')}
      </Text>
      <View style={[RootStyles.rowStyle, {marginTop: responsiveHeight(25)}]}>
        <TouchableOpacity
          style={[styles.buttonWrapper, {marginRight: responsiveWidth(10)}]}
          onPress={handleOnPress}>
          <Text style={styles.confirm}>{localize('close')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonWrapper,
            {backgroundColor: grayText, maringLeft: responsiveWidth(10)},
          ]}
          onPress={() => closeModal()}>
          <Text style={styles.text}>{localize('cancel')}</Text>
        </TouchableOpacity>
      </View>
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
      paddingVertical: responsiveHeight(30),
      paddingHorizontal: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonWrapper: {
      paddingHorizontal: responsiveWidth(20),
      width: responsiveWidth(120),
      paddingVertical: responsiveHeight(10),
      borderRadius: responsiveWidth(5),
      backgroundColor: primary.color,
      alignItems: 'center',
      justifyContent: 'center',
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

export default forwardRef(WarningModal);
