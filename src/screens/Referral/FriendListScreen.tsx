import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface FriendListScreenProps {}

const FriendListScreen = (props: FriendListScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>FriendListScreen</Text>
    </View>
  );
};

export default FriendListScreen;

const styles = StyleSheet.create({
  container: {},
});
