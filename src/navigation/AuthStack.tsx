import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import * as Auth from '../screens/Auth';
import RouteKey from '../constants/RouteKey';

const AuthStack = createStackNavigator();

function AuthStackNavigation() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name={RouteKey.Login}
        component={Auth.LoginScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name={RouteKey.Register}
        component={Auth.RegisterScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name={RouteKey.VerifySuccessScreen}
        component={Auth.VerifySuccessScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name={RouteKey.RegisterOnboardScreen}
        component={Auth.RegisterOnboardScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name={RouteKey.ForgotPasswordScreen}
        component={Auth.ForgotPasswordScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <AuthStack.Screen
        name={RouteKey.ResetPasswordScreen}
        component={Auth.ResetPasswordScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthStackNavigation;
