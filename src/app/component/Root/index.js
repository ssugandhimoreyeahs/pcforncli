import React,{ Fragment } from "react";
import { View,StyleSheet, SafeAreaView, StatusBar, Platform } from "react-native";

const MyWrapper = Platform.select({
  ios: SafeAreaView,
  android: View,
});
const Root = ({ children }) => {
  return (
    <Fragment>
      <MyWrapper
        
        style={style.customStatusBar}
      />
      <SafeAreaView style={style.body} >
      { children }
      </SafeAreaView>
    </Fragment>
  );
};

const style = StyleSheet.create({
    customStatusBar : {
        flex: 0, 
        backgroundColor: "#9c9a9a"
    },
    body: { 
        flex: 1
    }
})
export default Root;

/*
<StatusBar barStyle="dark-content" /> :
<SafeAreaView style={{ flex: 0,backgroundColor: 'darkgrey' }}/>
*/
