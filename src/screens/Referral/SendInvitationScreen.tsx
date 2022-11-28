import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface SendInvitationScreenProps {}

const SendInvitationScreen = (props: SendInvitationScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>SendInvitationScreen</Text>
    </View>
  );
};

export default SendInvitationScreen;

const styles = StyleSheet.create({
  container: {},
});
