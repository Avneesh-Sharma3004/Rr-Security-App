import React from "react";
import { CommonActions, StackActions } from "@react-navigation/native";

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

function runIfReady(action) {
  if (isReadyRef.current && navigationRef.current) {
    action();
  }
}

function navigate(name, params) {
  runIfReady(() => {
    navigationRef.current.navigate(name, params);
  });
}

function goBack() {
  runIfReady(() => {
    if (navigationRef.current.canGoBack()) {
      navigationRef.current.goBack();
    }
  });
}

function push(name, params) {
  runIfReady(() => {
    navigationRef.current.dispatch(StackActions.push(name, params));
  });
}

function pop(count = 1) {
  runIfReady(() => {
    navigationRef.current.dispatch(StackActions.pop(count));
  });
}

function replace(name, params) {
  runIfReady(() => {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  });
}

function reset(state) {
  runIfReady(() => {
    navigationRef.current.dispatch(CommonActions.reset(state));
  });
}

function resetTo(routeName, params) {
  reset({
    index: 0,
    routes: [{ name: routeName, params }],
  });
}

// Use the actual registered route name for your active navigator.
function resetToTab(tabName, tabParams, navigatorName) {
  if (navigatorName) {
    reset({
      index: 0,
      routes: [
        {
          name: navigatorName,
          params: {
            screen: tabName,
            params: tabParams,
          },
        },
      ],
    });
    return;
  }

  navigate(tabName, tabParams);
}

const navigationServices = {
  navigate,
  goBack,
  push,
  pop,
  replace,
  reset,
  resetTo,
  resetToTab,
  getNavigator: () => navigationRef,
};

export default navigationServices;
