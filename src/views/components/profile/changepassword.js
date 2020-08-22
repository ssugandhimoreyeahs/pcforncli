import React, { Component, Fragment } from "react";
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
import { Button, Input, Text, Icon } from "react-native-elements";
import { createUser } from "../../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import {Root} from '@components'; 
import { updateUserPassword } from "../../../api/api";
import {
  PASSWORD_UPDATED,
  INVALID_OLD_PASSWORD,
  CONNECTION_ABORTED,
  TRY_AGAIN,
} from "../../../api/message";
import AntDesign from "react-native-vector-icons/AntDesign";

AntDesign.loadFont();

class Changepassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      password: "",
      confirmNewPassword: "",
      err: "",
      loading: false,
      hasUpperCase: false,
      hasNumber: false,
      hasMinimumLength: false,
      isSpinner: false,
    };
  }

  //   static navigationOptions=({navigation})=>{
  //     return{
  //      headerTitleStyle: { marginRight:5,width:160, height:22, fontSize:17},
  //       headerLeft:
  //       <TouchableOpacity onPress={()=> navigation.goBack()}>
  //          <AntDesign name='left' size={25} style={{marginLeft:10}}/>
  //          </TouchableOpacity>,
  //       title:'Change Password',
  //      }
  //  }

  componentDidMount() {
    //console.log("businessproEdit componentDidMount()");
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  componentWillUnmount() {
    //console.log("Businessproedit componentWillUnmount()");
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

  showAlert(heading = "", content = "") {
    Alert.alert(
      heading,
      content,
      [
        {
          text: "OK",
          //onPress: () => console.log('Cancel Pressed'),
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  }
  handleConfirmPassword = async () => {
    // this.setState({ loading: true });
    Keyboard.dismiss();

    if (this.state.password != this.state.confirmNewPassword) {
      this.showAlert("Message", "Confirm Password Does Not Matches");
    } else {
      this.setState({ isSpinner: !this.state.isSpinner });
      const { oldPassword, password: newPassword } = this.state;
      const body = { oldPassword, newPassword };
      const isPasswordUpdated = await updateUserPassword(body);
      console.log("Mongo Change Password ", isPasswordUpdated);

      if (isPasswordUpdated.result == true) {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              Alert.alert(
                "Message",
                PASSWORD_UPDATED,
                [
                  {
                    text: "OK",
                    onPress: () => {
                      this.props.navigation.goBack();
                    },
                    style: "cancel",
                  },
                ],
                {
                  cancelable: false,
                }
              );
            }, 100);
          }
        );
      } else if (isPasswordUpdated.result == false) {
        this.setState(
          (prevState) => {
            return {
              isSpinner: !prevState.isSpinner,
              isButtonEnabled: !prevState.isButtonEnabled,
            };
          },
          () => {
            setTimeout(() => {
              this.showAlert("Error", isPasswordUpdated.response.message);
            }, 200);
          }
        );
      } else {
        if (
          isPasswordUpdated.error &&
          isPasswordUpdated.error.code == "ECONNABORTED"
        ) {
          this.setState(
            (prevState) => {
              return { isSpinner: !prevState.isSpinner };
            },
            () => {
              setTimeout(() => {
                this.showAlert("", CONNECTION_ABORTED);
              }, 200);
            }
          );
        } else if (
          isPasswordUpdated.error.response != undefined &&
          isPasswordUpdated.error.response.status == 401
        ) {
          this.setState(
            (prevState) => {
              return { isSpinner: !prevState.isSpinner };
            },
            () => {
              setTimeout(() => {
                this.showAlert("Error", INVALID_OLD_PASSWORD);
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
                this.showAlert("Error", TRY_AGAIN);
              }, 200);
            }
          );
        }
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
      <Root headerColor={"#FFF"} footerColor={"#FFF"} barStyle={"dark"}>
      <View style={styles.container}>
        <Spinner
          visible={this.state.isSpinner}
          textStyle={styles.spinnerTextStyle}
        />
        {/* {this.state.err ? (
          <Text style={styles.err}>{this.state.err}</Text>
        ) : (
          undefined
        )} */}
        <View
          style={{
            flexDirection: "row",
            width: "70%",
            marginTop: "1%",
            alignSelf: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <AntDesign
              size={30}
              name="left"
              style={{ alignSelf: "flex-start", marginLeft: 10 }}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Change Password</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignSelf: "center", marginTop: 40 }}
        >
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
        <Input
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholder={"Current Password"}
          secureTextEntry={true}
          value={this.state.oldPassword}
          onChangeText={(oldPassword) => this.setState({ oldPassword })}
        />
        <Input
          inputContainerStyle={styles.inputContainer2}
          inputStyle={styles.input}
          placeholder={"New Password"}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(text) => this.handleChangeText(text)}
        />
        <Input
          inputContainerStyle={styles.inputContainer2}
          inputStyle={styles.input}
          placeholder={"Confirm Password"}
          secureTextEntry={true}
          value={this.state.confirmNewPassword}
          onChangeText={(confirmNewPassword) =>
            this.setState({ confirmNewPassword })
          }
        />

        <Button
          disabled={
            !this.state.hasUpperCase ||
            !this.state.hasNumber ||
            !this.state.hasMinimumLength ||
            this.state.loading ||
            !this.state.confirmNewPassword ||
            !this.state.oldPassword
          }
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          disabledStyle={{ backgroundColor: "#7FBDFF" }}
          title="Save"
          onPress={this.handleConfirmPassword}
        />
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
    marginTop: "10%",
    width: "75%",
  },
  inputContainer2: {
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    //marginVertical: "2%",
    width: "75%",
  },
  input: {
    marginVertical: "5%",
    textAlign: "center",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default Changepassword;
