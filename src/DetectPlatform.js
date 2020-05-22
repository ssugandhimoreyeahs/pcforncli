import React, { Component, Fragment } from "react";
import { Platform, SafeAreaView, StatusBar, View, Text } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { connect } from "react-redux";

const NewComponent = (OriginalComponent, customStyle = {}) => {
  class DetectPlatform extends Component {
    statusBarHeightIOS = getStatusBarHeight(false);
    render() {
      return (
        <Fragment>
          {Platform.OS == "ios" ? (
            <Fragment>
              <SafeAreaView
                style={{
                  flex: 0,
                  height: this.statusBarHeightIOS,
                  backgroundColor: "#9c9a9a",
                }}
              />
              <SafeAreaView style={{ ...customStyle }}>
                <OriginalComponent {...this.props} />
              </SafeAreaView>
            </Fragment>
          ) : Platform.OS == "android" ? (
            <Fragment>
              {/* <View style={{ backgroundColor: '#9c9a9a', height: StatusBar.currentHeight, width:'100%' }} /> */}
              <View style={{ width: "100%" }} />
              <View style={{ ...customStyle }}>
                <OriginalComponent {...this.props} />
              </View>
            </Fragment>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Cannot Detect Platform!</Text>
            </View>
          )}
        </Fragment>
      );
    }
  }
  //Approach 1 Using Redux
  // const mapStateToProps = state => ({reduxState: state});
  // const mapDispatchToProps = dispatch => ({reduxDispatch: dispatch});

  // return connect(mapStateToProps,mapDispatchToProps)(DetectPlatform);
  //Approach 2 Import for the existing codes
  return DetectPlatform;
};

export default NewComponent;
