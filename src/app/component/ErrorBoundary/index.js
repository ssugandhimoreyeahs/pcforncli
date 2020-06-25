import React, { Component, Fragment, PureComponent } from "react";
import { Text, View, Button, Platform, Alert } from "react-native";
import SomethingWrong from "@views/ftux/somethingWrong";
// import crashlytics from "@react-native-firebase/crashlytics";

class ErrorBoundry extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    if (Platform.OS == "android") {
      //  console.log("Error occured - ",errorInfo);
      //  crashlytics().log('Error Occured!');
      //  crashlytics().recordError(new Error(error));
      //  crashlytics().crash();
    }
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <SomethingWrong errorBoundary={true} />;
    } else {
      return <Fragment>{this.props.children}</Fragment>;
    }
  }
}

export default ErrorBoundry;
