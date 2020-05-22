import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { isUserAlreadyExist } from "../../api/api";
import { CONNECTION_ABORTED, TRY_AGAIN } from "../../api/message";
import Spinner from "react-native-loading-spinner-overlay";
//import {  } from "react-native-gesture-handler";
//import {AntDesign} from "@expo/vector-icons"

import AntDesign from "react-native-vector-icons/AntDesign";

AntDesign.loadFont();

class Email extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      isButtonEnabled: false,
      isUserExistFlag: false,
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
          //onPress: () => console.log('Cancel Pressed'),
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

  componentWillUnmount() {
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
  handlePress = async () => {
    Keyboard.dismiss();
    this.setState({ isSpinner: true, isButtonEnabled: false });
    //check email first is exist or not
    const isUserExist = await isUserAlreadyExist(
      this.state.email.trim().toLowerCase()
    );

    if (isUserExist.result === true) {
      this.setState({ isSpinner: false, isUserExistFlag: true });
    } else if (isUserExist.result === false) {
      this.setState({ isSpinner: false, isUserExistFlag: false });
      this.props.navigation.navigate("Password", {
        firstName: this.props.navigation.getParam("firstName", ""),
        lastName: this.props.navigation.getParam("lastName", ""),
        title: this.props.navigation.getParam("title", ""),
        email: this.state.email.trim().toLowerCase(),
        setEmailClickButtonEnabled: () => {
          this.setState({ isButtonEnabled: true });
        },
      });
    } else if (isUserExist.result == "error") {
      if (isUserExist.error && isUserExist.error.code == "ECONNABORTED") {
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
            return {
              isSpinner: !prevState.isSpinner,
              isButtonEnabled: !prevState.isButtonEnabled,
            };
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
    if (this.state.isUserExistFlag) {
      this.setState({ isUserExistFlag: false });
    }
    this.setState({ email: text });
    this.validateEmail(text);
  };

  validateEmail = (text) => {
    const emailRegEx = new RegExp(/\w+@\w+\.\w+/);
    const isValidEmail = emailRegEx.test(text);
    this.setState({ isButtonEnabled: isValidEmail });
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isSpinner}
          textStyle={styles.spinnerTextStyle}
        />
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
        <Text style={styles.text}>What's your business email address?</Text>
        <Input
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholder={"Business email address"}
          value={this.state.email}
          onChangeText={(text) => this.handleChangeText(text)}
        />
        {this.state.isUserExistFlag && (
          <Text style={{ color: "red", alignSelf: "center" }}>
            Sorry, that username already exists!
          </Text>
        )}
        <Button
          disabled={!this.state.isButtonEnabled}
          buttonStyle={styles.button}
          disabledStyle={{ backgroundColor: "#7FBDFF" }}
          containerStyle={styles.buttonContainer}
          title="Continue"
          onPress={this.handlePress}
        />
      </View>
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
    marginBottom: "25%",
  },
  text: {
    alignSelf: "center",
    marginTop: "13%",
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 50,
    width: "75%",
    alignSelf: "center",
  },
  inputContainer: {
    marginTop: 60,
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    marginVertical: "2%",
    width: "75%",
  },
  input: {
    marginVertical: "2%",
    textAlign: "center",
  },
});
export default Email;
