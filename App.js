import React, { Component } from "react";
import { Text, View, Permission,Alert } from "react-native";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { Provider } from "react-redux";
import Store from "./src/reducers/store";
import { PCFONavigation } from "@navigation";
import { jsExceptionHandler } from "@utils";
import SplashScreen from "react-native-splash-screen";
import { ErrorBoundry } from "@components";
// import FirebaseApp from "@react-native-firebase/app";
// import messaging from "@react-native-firebase/messaging";
// import firebase from "react-native-firebase";

console.disableYellowBox = true;

setJSExceptionHandler((error, isFatal) => {
  jsExceptionHandler(error, isFatal);
}, true);

class App extends Component {
  componentDidMount = () => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 250);
  };

  render() {
    return (
      <Provider store={Store}>
        <ErrorBoundry>
          <PCFONavigation />
        </ErrorBoundry>
      </Provider>
    );
  }
}


export default App;
