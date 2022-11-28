import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, StyleSheet, InteractionManager, Text} from 'react-native';
import {Button} from 'react-native-elements';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {localize} from '../../../assets/i18n/I18nConfig';

import {useThemeColor} from '../../../common/Themed';
import Fonts from '../../../constants/Fonts';
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

const KYCRequireModal: React.ForwardRefRenderFunction<Ref, Props> = (
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

  const handleVerifyNow = () => {
    closeModal();
    if (props.onPress) {
      props?.onPress();
    }
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{localize('youNeedToVerifyAccount')}</Text>
      <Button
        title={localize('verifyNow')}
        onPress={handleVerifyNow}
        buttonStyle={[
          RootStyles.primaryButton,
          {marginHorizontal: responsiveWidth(15)},
        ]}
        titleStyle={RootStyles.primaryButtonText}
      />
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
      paddingTop: responsiveHeight(40),
      paddingHorizontal: responsiveWidth(15),
      justifyContent: 'flex-start',
    },
    title: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.body,
      color: blackText,
      textAlign: 'center',
    },
  });

export default forwardRef(KYCRequireModal);
