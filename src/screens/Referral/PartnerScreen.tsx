import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface PartnerScreenProps {}

const PartnerScreen = (props: PartnerScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>PartnerScreen</Text>
    </View>
  );
};

export default PartnerScreen;

const styles = StyleSheet.create({
  container: {},
});
