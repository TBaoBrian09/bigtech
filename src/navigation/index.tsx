import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName} from 'react-native';

import {RootStackParamList} from '../models/navigation';
import {navigationRef} from './root';
import IndicatorDialog from '../common/IndicatorDialog';
import {LoadingContext} from '../context/LoadingContext';
import AuthStackNavigation from './AuthStack';
import {SplashScreen} from '../screens/Auth';
import BottomTabNavigator from './BottomTabNavigator';
import Profile from '../screens/Profile';
import RouteKey from '../constants/RouteKey';
import KYC from '../screens/KYC';
import * as Auth from '../screens/Auth';
import Assets from '../screens/Assets';
import {UserContext} from '../context/UserContext';
import {UserData} from '../models/user';
import P2P from '../screens/P2P';
import {BottomBarContext} from '../context/BottomBarContext';
import {FeeContext, FeeContextData, FeeData} from '../context/FeeContext';

const tutorialOptions = {
  headerShown: false,
  headerTitle: '',
  headerStyle: {shadowColor: 'transparent'},
  headerBackTitleVisible: false,
  cardOverlayEnabled: false,
  cardStyle: {backgroundColor: 'transparent'},
  gestureEnabled: false,
};

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [showGlobalIndicator, setGlobalIndicator] =
    React.useState<boolean>(false);

  const [time, setTime] = React.useState<any>('');

  const [userData, setUserData] = React.useState<UserData>({
    privateWallet: {},
    publicWallet: {},
  });
  const [feeData, setFeeData] = React.useState<FeeData>({
    feeToken: undefined,
    onchainWithdraw: undefined,
    p2pOrder: undefined,
    p2pTransaction: undefined,
  });

  const loadingValue = React.useMemo(
    () => ({showGlobalIndicator, setGlobalIndicator}),
    [showGlobalIndicator, setGlobalIndicator],
  );

  const userValue = React.useMemo(
    () => ({userData, setUserData}),
    [userData, setUserData],
  );
  const feeContextValue = React.useMemo(
    () => ({data: feeData, setData: setFeeData}),
    [feeData, setFeeData],
  );

  const bottomValue = React.useMemo(() => ({time, setTime}), [time, setTime]);

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      ref={navigationRef}>
      <LoadingContext.Provider value={loadingValue}>
        <UserContext.Provider value={userValue}>
          <FeeContext.Provider value={feeContextValue}>
            <BottomBarContext.Provider value={bottomValue}>
              <RootNavigator />
            </BottomBarContext.Provider>
          </FeeContext.Provider>
        </UserContext.Provider>
        {showGlobalIndicator && <IndicatorDialog />}
      </LoadingContext.Provider>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const CommonStack = () => {
  return (
    <>
      <Stack.Screen
        name={RouteKey.SettingScreen as keyof RootStackParamList}
        component={Profile.SettingScreen}
        options={{
          gestureDirection: 'horizontal-inverted',
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.LanguageScreen as keyof RootStackParamList}
        component={Profile.LanguageScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.VerifyOTPScreen as keyof RootStackParamList}
        component={Profile.VerifyOTPScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.P2PUserScreen as keyof RootStackParamList}
        component={P2P.P2PUserScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.ChangePasswordScreen as keyof RootStackParamList}
        component={Profile.ChangePasswordScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.MyProfileScreen as keyof RootStackParamList}
        component={Profile.MyProfileScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.UpdateEmailScreen as keyof RootStackParamList}
        component={Profile.UpdateEmailScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.TouchIDScreen as keyof RootStackParamList}
        component={Profile.TouchIdScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.KYCOnboardingScreen as keyof RootStackParamList}
        component={KYC.KYCOnboardingScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.PersonalInformationScreen as keyof RootStackParamList}
        component={KYC.PersonalInformationScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.CountryScreen as keyof RootStackParamList}
        component={Auth.CountryScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={RouteKey.IDCardScreen as keyof RootStackParamList}
        component={KYC.IDCardScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={RouteKey.RecordScreen as keyof RootStackParamList}
        component={KYC.RecordScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={RouteKey.KYCPendingScreen as keyof RootStackParamList}
        component={KYC.KYCPendingScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={RouteKey.KYCSuccessScreen as keyof RootStackParamList}
        component={KYC.KYCSuccessScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={RouteKey.RejectedScreen as keyof RootStackParamList}
        component={KYC.RejectedScreen}
        options={{
          headerShown: false,
          headerTitle: '',
          headerStyle: {shadowColor: 'transparent'},
          headerBackTitleVisible: false,
          gestureEnabled: false,
        }}
      />
    </>
  );
};

const AssetStack = () => {
  return (
    <>
      <Stack.Screen
        name={RouteKey.ReceiveScreen as keyof RootStackParamList}
        component={Assets.ReceiveScreen}
        options={{
          ...tutorialOptions,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={RouteKey.ReceiveDigitalScreen as keyof RootStackParamList}
        component={Assets.ReceiveDigitalScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.DigitalAssetScreen as keyof RootStackParamList}
        component={Assets.DigitalAssetScreen}
        options={{
          ...tutorialOptions,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={RouteKey.DigitalDetailScreen as keyof RootStackParamList}
        component={Assets.DigitalDetailScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.HistoryDetailScreen as keyof RootStackParamList}
        component={Assets.HistoryDetailScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.SendScreen as keyof RootStackParamList}
        component={Assets.SendScreen}
        options={{
          ...tutorialOptions,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={RouteKey.SendDigitalScreen as keyof RootStackParamList}
        component={Assets.SendDigitalScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.ToAddressScreen as keyof RootStackParamList}
        component={Assets.ToAddressScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.ScanQRCodeScreen as keyof RootStackParamList}
        component={Assets.ScanQRCodeScreen}
        options={{
          ...tutorialOptions,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={RouteKey.ConfirmSendScreen as keyof RootStackParamList}
        component={Assets.ConfirmSendScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.TransactionHistoryScreen as keyof RootStackParamList}
        component={Assets.TransactionHistoryScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
    </>
  );
};

const P2PStack = () => {
  return (
    <>
      <Stack.Screen
        name={RouteKey.BuySellScreen as keyof RootStackParamList}
        component={P2P.BuySellScreen}
        options={{
          ...tutorialOptions,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name={RouteKey.CreateOrderScreen as keyof RootStackParamList}
        component={P2P.CreateOrderScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={RouteKey.MyOrderScreen as keyof RootStackParamList}
        component={P2P.MyOrderScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
          cardOverlayEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
        }}
      />
      <Stack.Screen
        name={RouteKey.MyOrderDetailScreen as keyof RootStackParamList}
        component={P2P.MyOrderDetailScreen}
        options={{
          ...tutorialOptions,
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name={RouteKey.OrderTransactionScreen as keyof RootStackParamList}
        component={P2P.OrderTransactionScreen}
        options={{
          ...tutorialOptions,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name={RouteKey.OrderTransactionDetailScreen as keyof RootStackParamList}
        component={P2P.OrderTransactionDetailScreen}
        options={{
          ...tutorialOptions,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </>
  );
};

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="AuthStack" component={AuthStackNavigation} />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      {CommonStack()}
      {AssetStack()}
      {P2PStack()}
    </Stack.Navigator>
  );
}
