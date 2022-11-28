import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import Fonts from '../constants/Fonts';
import typographies from '../constants/Typographies';
import RootStyles from '../utils/styles';
import {useThemeColor} from './Themed';

interface IProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  actionStyle?: TextStyle;
  titleStyle?: TextStyle;
  icon?: any;
}

const SectionHeader: React.FC<IProps> = props => {
  const textColor = useThemeColor('text');
  const s = getStyles(textColor);
  return (
    <View style={[s.container, props.style]}>
      <Text style={[s.sectionText, props.titleStyle]}>{props.title}</Text>

      {props.action && (
        <TouchableOpacity onPress={props.onActionPress}>
          <Text style={s.subText}>{props.action}</Text>
        </TouchableOpacity>
      )}
      {props.icon && (
        <TouchableOpacity onPress={props.onActionPress}>
          {props.icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

SectionHeader.defaultProps = {};

const getStyles = (textColor: string) =>
  StyleSheet.create({
    container: {
      ...RootStyles.rowSpaceStyle,
    },
    sectionText: {
      fontFamily: Fonts.montserratBold,
      fontSize: typographies.body,
      color: textColor,
    },
    subText: {
      fontFamily: Fonts.montserratMedium,
      fontSize: typographies.footnote,
    },
  });

export default SectionHeader;
