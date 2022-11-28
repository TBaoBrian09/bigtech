import * as React from 'react';
import {Text, View, StyleSheet, Modal} from 'react-native';
import {Button} from 'react-native-elements';
import {localize} from '../assets/i18n/I18nConfig';
import {white} from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Images from '../constants/Images';
import Layout, {responsiveHeight, responsiveWidth} from '../constants/Layout';
import typographies from '../constants/Typographies';
import RootStyles from '../utils/styles';
import Icon from './Icon';
import {useThemeColor} from './Themed';

interface ToastModalProps {
  visible: boolean;
  title?: string;
  onClose?: () => void;
  icon?: any;
  iconStyle?: any;
}

const ToastModal = (props: ToastModalProps) => {
  const {visible, title, onClose, iconStyle, icon} = props;
  const blackText = useThemeColor('blackText');
  const styles = getStyles(blackText);

  return (
    <View>
      <View style={styles.centeredView}>
        <Modal visible={visible} animationType="fade" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.wrapperContent}>
                <Icon
                  source={icon || Images.emailVerifyIcon}
                  size={responsiveWidth(80)}
                  style={iconStyle}
                />
                <Text style={styles.text}>{title}</Text>
              </View>
              <Button
                title={localize('close')}
                onPress={onClose}
                buttonStyle={[
                  RootStyles.primaryButton,
                  {
                    width: Layout.window.width - responsiveWidth(64),
                  },
                ]}
                titleStyle={RootStyles.primaryButtonText}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default ToastModal;

const getStyles = (blackText: string) =>
  StyleSheet.create({
    container: {},
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    wrapperContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalView: {
      width: Layout.window.width - responsiveWidth(32),
      minHeight: responsiveHeight(320),
      borderRadius: responsiveWidth(30),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: white,
      marginBottom: responsiveHeight(70),
    },
    text: {
      fontFamily: Fonts.montserratMedium,
      color: blackText,
      fontSize: typographies.footnote,
      textAlign: 'center',
      width: responsiveWidth(300),
      marginTop: responsiveHeight(40),
    },
  });
