import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Text, Icon } from "react-native-elements";
import { createUser } from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import { CONNECTION_ABORTED, USER_EXIST, TRY_AGAIN } from "../../api/message";
import { Root } from "@components";

import { APP_VERSION } from "../../constants/constants";

import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";

FontAwesome.loadFont();
AntDesign.loadFont();

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      err: "",
      loading: false,
      hasUpperCase: false,
      hasNumber: false,
      hasMinimumLength: false,
      isSpinner: false,
    };
  }

  showAlert(heading = "", content = "") {
    Alert.alert(
      heading,
      content,
      [
        {
          text: "Okay",
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
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
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    if (this.props.navigation.getParam("setEmailClickButtonEnabled"))
      this.props.navigation.getParam("setEmailClickButtonEnabled")();
  }
  handleCreateAccount = async () => {
    // this.setState({ loading: true });
    Keyboard.dismiss();
    this.setState({ isSpinner: true });
    const firstName = this.props.navigation.getParam("firstName", "");
    const lastName = this.props.navigation.getParam("lastName", "");
    const title = this.props.navigation.getParam("title", "");
    const email = this.props.navigation.getParam("email", "");
    const password = this.state.password.trim();
    const body = {
      firstname: firstName,
      lastname: lastName,
      title,
      username: email,
      password,
      company: " ",
      platform: Platform.OS,
      timezoneOffset: new Date().getTimezoneOffset(),
      buildversion: APP_VERSION,
    };

    const user = await createUser(body);

    if (user.result === true) {
      this.props.navigation.navigate("Setup", {
        firstName: user.response.user.firstname,
        userId: user.response.user._id,
      });
      this.setState({ isSpinner: false });
    } else if (user.result === false) {
      this.setState(
        (prevState) => {
          return { isSpinner: !prevState.isSpinner };
        },
        () => {
          setTimeout(() => {
            this.showAlert("Something went wrong", user.response.message);
          }, 100);
        }
      );
    } else {
      if (user.error.code != undefined && user.error.code == "ECONNABORTED") {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              this.showAlert("Something went wrong", "Please try again.");
            }, 100);
          }
        );
      } else {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              this.showAlert("Something went wrong", "Please try again.");
            }, 100);
          }
        );
      }
    }
  };

  handleChangeText = (text) => {
    const upperCaseRegEx = new RegExp(/[A-Z]+/);
    const numberRegEx = new RegExp(/[0-9]+/);
    this.setState({
      password: text,
      hasUpperCase: upperCaseRegEx.test(text),
      hasNumber: numberRegEx.test(text),
      hasMinimumLength: text.length >= 10,
    });
  };

  fetchIcon = (meetsCondition) => {
    return meetsCondition ? "check-circle" : "circle-thin";
  };

  render() {
    return (
      <Root headerColor={"#FFFFFF"} footerColor={"#FFFFFF"} barStyle={"dark"}>
        <View style={styles.container}>
          {/* <View style={{ backgroundColor: '#070640', height: StatusBar.currentHeight, width:'100%' }} />
      <View style={styles.container}> */}

          <Spinner
            visible={this.state.isSpinner}
            textStyle={styles.spinnerTextStyle}
          />
          {/* {this.state.err ? (
          <Text style={styles.err}>{this.state.err}</Text>
        ) : (
          undefined
        )} */}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <AntDesign
              size={30}
              name="left"
              style={{ alignSelf: "flex-start", marginLeft: 10, marginTop: 5 }}
            />
          </TouchableOpacity>
          <Text style={styles.text1}>Create a strong password</Text>
          <Input
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            placeholder={"Password"}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(text) => this.handleChangeText(text)}
          />
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <View style={{ flexDirection: "row" }}>
              <Icon
                name={this.fetchIcon(this.state.hasUpperCase)}
                size={15}
                type="font-awesome"
                color="gray"
              />
              <Text style={styles.text}>1 capital letter*</Text>
            </View>
            <View style={{ flexDirection: "row", marginHorizontal: "4%" }}>
              <Icon
                name={this.fetchIcon(this.state.hasNumber)}
                size={15}
                type="font-awesome"
                color="gray"
              />
              <Text style={styles.text}>1 number*</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon
                name={this.fetchIcon(this.state.hasMinimumLength)}
                size={15}
                type="font-awesome"
                color="gray"
              />
              <Text style={styles.text}>Min. 10 characters*</Text>
            </View>
          </View>
          <Button
            disabled={
              !this.state.hasUpperCase ||
              !this.state.hasNumber ||
              !this.state.hasMinimumLength ||
              this.state.loading
            }
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
            disabledStyle={{ backgroundColor: "#7FBDFF" }}
            title="Create Account"
            onPress={this.handleCreateAccount}
          />
          {/* </View> */}
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height: 48,
    backgroundColor: "#007AFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: "21%",
  },
  text: {
    fontSize: 12,
    color: "gray",
    marginLeft: "2%",
  },
  text1: {
    alignSelf: "center",
    marginTop: "20%",
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "bold",
  },
  err: {
    fontSize: 12,
    color: "red",
    marginLeft: "2%",
  },
  buttonContainer: {
    marginTop: 30,
    width: "75%",
    alignSelf: "center",
  },
  inputContainer: {
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    marginVertical: "5%",
    width: "75%",
  },
  input: {
    marginVertical: "5%",
    textAlign: "center",
  },
});

export default Password;
