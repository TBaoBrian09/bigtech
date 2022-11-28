import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Text,
  TouchableOpacity,
} from 'react-native';
import Button from 'react-native-elements/dist/buttons/Button';
import {Modalize} from 'react-native-modalize';

import {localize} from '../../../assets/i18n/I18nConfig';
import Icon from '../../../common/Icon';
import {useThemeColor} from '../../../common/Themed';
import Colors, {white} from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import Images from '../../../constants/Images';
import Layout, {
  responsiveHeight,
  responsiveWidth,
} from '../../../constants/Layout';
import typographies from '../../../constants/Typographies';
import RootStyles from '../../../utils/styles';

interface Props {
  onOther: () => void;
  onHistory: () => void;
}

type Ref = {
  open: () => void;
  close: () => void;
};

const SentModal: React.ForwardRefRenderFunction<Ref, Props> = (props, ref) => {
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

  const handleNavigateOtherTransaction = () => {
    closeModal();
    return props.onOther();
  };

  const handleNavigateHistory = () => {
    closeModal();
    return props.onHistory();
  };

  const ViewWithHoc = () => (
    <View style={styles.contentContainer}>
      <Icon source={Images.checkSuccess} size={responsiveWidth(68)} />
      <Text style={styles.title}>{localize('txSuccess')}</Text>
      <Text style={styles.title}>{localize('checkTxInfoInYourHistory')}</Text>
      <View>
        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={handleNavigateHistory}>
          <Text style={styles.btnText}>{localize('viewTxHistory')}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Button
          title={localize('otherTx')}
          buttonStyle={[
            RootStyles.primaryButton,
            {
              marginHorizontal: responsiveWidth(15),
              width: Layout.window.width - responsiveWidth(15) * 2,
            },
          ]}
          onPress={handleNavigateOtherTransaction}
          titleStyle={RootStyles.primaryButtonText}
        />
      </View>
    </View>
  );

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
      tapGestureEnabled={false}
      panGestureComponentEnabled={false}
      closeOnOverlayTap={false}
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    onchainWrapper: {
      marginHorizontal: -responsiveWidth(15),
      paddingHorizontal: responsiveWidth(15),
      backgroundColor: white,
      marginBottom: responsiveHeight(20),
      paddingVertical: responsiveHeight(10),
    },
    title: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.subTitle,
      color: blackText,
      marginTop: responsiveHeight(10),
      textAlign: 'center',
    },
    onchainTitle: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
      color: blackText,
      textTransform: 'uppercase',
    },
    btnText: {
      color: Colors.light.activeTintColor,
      fontFamily: Fonts.montserratMedium,
    },
    btnWrapper: {
      marginTop: responsiveHeight(25),
    },
  });

export default forwardRef(SentModal);
