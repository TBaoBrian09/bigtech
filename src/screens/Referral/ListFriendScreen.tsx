import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface ListFriendScreenProps {}

const ListFriendScreen = (props: ListFriendScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>ListFriendScreen</Text>
    </View>
  );
};

export default ListFriendScreen;

const styles = StyleSheet.create({
  container: {},
});
