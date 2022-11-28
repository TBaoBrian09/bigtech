/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import RouteKey from '../constants/RouteKey';
import Home from '../screens/Home';
import CustomTabBar from './CustomTabBar';
import P2P from '../screens/P2P';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const shadow = {
  shadowColor: '#000',
  shadowRadius: 2,
  elevation: 2,
  shadowOpacity: 0.2,
  shadowOffset: {width: 0, height: -2},
};

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={RouteKey.HomeScreen}
        component={Home.HomeScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function DefiStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={RouteKey.DefiScreen}
        component={Home.DefiScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function P2PStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={RouteKey.P2PTradingScreen}
        component={P2P.P2PTradingScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      initialRouteName={RouteKey.HomeTab}
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        lazy: true,
        tabBarActiveTintColor: Colors[colorScheme].activeTintColor,
        tabBarInactiveTintColor: Colors[colorScheme].inacttiveTinColor,
        headerShown: false,
        tabBarStyle: {
          ...shadow,
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen name={RouteKey.HomeTab} component={HomeStack} />
      {/* <Tab.Screen name={RouteKey.ProjectTab} component={ProjectStack} /> */}
      <Tab.Screen name={RouteKey.P2PTab} component={P2PStack} />
      <Tab.Screen name={RouteKey.DefiTab} component={DefiStack} />
      {/* <Tab.Screen name={RouteKey.PartnerTab} component={ProjectStack} /> */}
    </Tab.Navigator>
  );
}
