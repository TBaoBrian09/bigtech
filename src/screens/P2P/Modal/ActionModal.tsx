import React, {forwardRef, useImperativeHandle, useRef} from 'react';
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
import {white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import {responsiveHeight, responsiveWidth} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import {ACTIONS} from '../P2PConstants';

interface Props {
  data?: any;
  onPress?: (type: string) => void;
  keyItem: string;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const ActionModal: React.ForwardRefRenderFunction<Ref, Props> = (
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

  const handleOnPress = (type: string) => {
    if (props.onPress) {
      props?.onPress(type);
    }
    closeModal();
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      {ACTIONS?.map(item => (
        <TouchableOpacity key={item} onPress={() => handleOnPress(item)}>
          <Text style={styles.title}>{localize(item)}</Text>
        </TouchableOpacity>
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
      paddingVertical: responsiveHeight(30),
      paddingHorizontal: 15,
      justifyContent: 'flex-start',
    },
    title: {
      fontFamily: Fonts.montserratSemiBold,
      fontSize: typographies.subTitle,
      color: blackText,
      marginVertical: responsiveHeight(10),
    },
  });

export default forwardRef(ActionModal);
