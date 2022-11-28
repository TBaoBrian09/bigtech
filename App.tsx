/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {useColorScheme, LogBox} from 'react-native';
import {Host} from 'react-native-portalize';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CodePush from 'react-native-code-push';
import {QueryClient, QueryClientProvider} from 'react-query';

import Toast from './src/common/Toast';
import Navigation from './src/navigation';
import LanguageProvider from './src/utils/LanguageProvider';
import {codePushKey} from './src/utils/Constants';
import {buildEnv} from './src/utils/Api/Env';
import LocalNotificationService from './src/utils/Notification/LocalNotificationService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

const App = () => {
  const colorScheme = useColorScheme();
  // Text.defaultProps = Text.defaultProps || {};
  // Text.defaultProps.allowFontScaling = false;
  // Text.defaultProps.textBreakStrategy = 'simple';
  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'useNativeDriver',
    'RNFileSystem',
    'componentWillReceiveProps',
    'Warning: ...',
  ]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Host>
          <LanguageProvider>
            <Navigation colorScheme={colorScheme} />
          </LanguageProvider>
        </Host>
        <Toast />
        <LocalNotificationService />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  installMode: CodePush.InstallMode.IMMEDIATE,
  deploymentKey: codePushKey[buildEnv],
};

export default CodePush(codePushOptions)(App);
