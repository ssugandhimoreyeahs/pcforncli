import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

const MyWrapper = Platform.select({
  ios: SafeAreaView,
  android: View,
});
const Root = ({ children }) => {
  
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <MyWrapper style={style.customStatusBar} />
      <SafeAreaView style={style.body}>{children}</SafeAreaView>
    </Fragment>
  );
};

const style = StyleSheet.create({
  customStatusBar: {
    flex: 0,
    backgroundColor: "#F8F8F8",
  },
  body: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
});
export default Root;

/*
<StatusBar barStyle="dark-content" /> :
<SafeAreaView style={{ flex: 0,backgroundColor: 'darkgrey' }}/>
*/
