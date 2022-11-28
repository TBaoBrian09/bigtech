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

import {useThemeColor} from '../../../common/Themed';
import {white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import {responsiveFont, responsiveHeight} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface Props {
  data?: any;
  onPress?: (title?: any, key?: any) => void;
  keyItem: string;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const CustomModal: React.ForwardRefRenderFunction<Ref, Props> = (
  props,
  ref,
) => {
  const blackText = useThemeColor('blackText');
  const placeHolderColor = useThemeColor('placeHolder');
  const styles = getStyles(placeHolderColor, blackText);
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

  const handleOnPress = (title: string) => {
    if (props.onPress) {
      props?.onPress(title, props.keyItem);
    }
    closeModal();
  };

  const ViewWithHoc = gestureHandlerRootHOC(() => (
    <View style={styles.contentContainer}>
      <View style={{flex: 1}}>
        {props?.data?.map(item => (
          <TouchableOpacity
            key={item.title}
            style={styles.item}
            onPress={() => handleOnPress(item)}>
            <Text style={styles.textItem}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ));

  return (
    <Modalize
      ref={modal}
      onClosed={onClosed}
      onOpened={onOpened}
      disableScrollIfPossible
      adjustToContentHeight
      //   modalHeight={responsiveHeight(200)}
      scrollViewProps={{
        contentContainerStyle: {
          paddingVertical: responsiveHeight(20),
          flexGrow: 1,
        },
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
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    contentContainer: {
      flex: 1,
      paddingBottom: 15,
      paddingHorizontal: 15,
      justifyContent: 'flex-start',
    },
    wrapper: {
      ...RootStyles.rowStyle,
      justifyContent: 'center',
      marginTop: responsiveHeight(52),
      marginBottom: responsiveHeight(46),
    },
    item: {
      paddingVertical: responsiveHeight(15),
      borderBottomWidth: 1,
      borderBottomColor: borderGray,
    },
    buttomWrapper: {
      justifyContent: 'flex-end',
      flex: 0.5,
    },
    labelStyle: {
      fontSize: responsiveFont(typographies.label),
      color: blackText,
    },
    subHeader: {
      fontSize: responsiveFont(12),
      color: white,
    },
    textItem: {
      fontSize: typographies.subTitle,
      color: blackText,
      fontFamily: Fonts.montserratMedium,
    },
  });

export default forwardRef(CustomModal);
