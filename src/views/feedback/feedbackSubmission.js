import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import logo7g from "../../assets/img_email.png";
import { Button } from "react-native-paper";

class FeedbackSubmission extends Component {
  componentDidMount() {
    //console.log("Contact componentDidMount()");
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  componentWillUnmount() {
    //console.log("Contact componentWillUnmount()");
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  handleBackButton = (nav) => {
    if (!nav.isFocused()) {
      BackHandler.removeEventListener("hardwareBackPress", () =>
        this.handleBackButton(this.props.navigation)
      );
      return false;
    } else {
      nav.goBack();
      return true;
    }
  };

  render() {
    return (
      <View style={styles.views}>
        {/* <View style={{ backgroundColor: '#070640', height: StatusBar.currentHeight, width:'100%' }} />
      <View style={styles.views}> */}
        <View
          style={{
            width: 205,
            height: 125,
            marginTop: "35%",
            alignSelf: "center",
          }}
        >
          <Image source={logo7g} style={{ alignSelf: "flex-end" }} />
        </View>

        <View
          style={{
            width: "100%",
            height: 114,
            marginTop: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 17, color: "#000000", fontWeight: "bold" }}>
            Thank you!
          </Text>
          <Text
            style={{
              marginTop: 26,
              fontSize: 17,
              color: "#000000",
              fontWeight: "bold",
            }}
          >
            Your feedback has been submitted.
          </Text>
          {/* <TouchableOpacity style={styles.Buttondesign1}>
                <Text style={styles.buttontxt}>Back</Text></TouchableOpacity> */}
          <Button
            mode="contained"
            style={{
              marginTop: "5%",
              padding: 3,
              borderRadius: 20,
              backgroundColor: "#007AFF",
            }}
            onPress={() => this.props.navigation.goBack()}
          >
            Back
          </Button>
        </View>
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  views: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignContent: "center",
  },
  buttontxt: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    marginTop: 8,
  },
  Buttondesign1: {
    width: 101,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    marginTop: 32,
  },
});

export default FeedbackSubmission;
