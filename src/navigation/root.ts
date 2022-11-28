import {
  StackActions,
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import RouteKey from '../constants/RouteKey';

/**
 * ROOT NAVIGATION
 */
export const navigationRef = createNavigationContainerRef();
export const NavigationRoot = {
  navigate: function navigate(name: string, params?: any) {
    navigationRef.navigate(name, params);
  },

  push: function push(name: string, params?: any) {
    navigationRef.dispatch(StackActions.push(name, params));
  },

  replace: function replace(name: string, params: any) {
    const replaceAction = StackActions.replace(name, params);
    navigationRef.dispatch(replaceAction);
  },

  pop: function pop(count: number) {
    const popAction = StackActions.pop(count);
    navigationRef.dispatch(popAction);
  },

  reset: function reset(props: string) {
    navigationRef.reset(props);
  },

  logout: function reset(params?: any) {
    navigationRef?.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: RouteKey.AuthStack, params: params}],
      }),
    );
  },

  popToTop: function popToTop() {
    navigationRef.dispatch(StackActions.popToTop());
  },

  main: function main(params?: any, screen?: any) {
    if (screen) {
      navigationRef?.current?.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: RouteKey.Root, params: params}, screen],
        }),
      );
    } else {
      navigationRef?.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: RouteKey.Root, params: params}],
        }),
      );
    }
  },
};
