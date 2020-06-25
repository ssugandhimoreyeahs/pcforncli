import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Overlay, Input } from "react-native-elements";
import { LEDGERS, network } from "../../constants/constants";
//import { TouchableOpacity } from "react-native-gesture-handler";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

// import {Ionicons, AntDesign} from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import DialogInput from "react-native-dialog-input";
import { triggerNoQbForm } from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import BenchLogo from "../../assets/bench_updated.jpeg";
import { Root } from "@components";

AntDesign.loadFont();
Ionicons.loadFont();
class LedgerIntegration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPleaseEnter: false,
      isModalVisible: false,
      isDialogVisible: false,
      otherSoftware: "",
      isButton: null,
      xero: false,
      sage: false,
      bench: false,
      wave: false,
      isSpinner: false,
    };
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
  async handleIntegrationPress(integration) {
    const redirectUrl = network.redirectUrl;
    const quickBooksId = network.quickbooksClientId;
    let userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      userId = 1;
    }
    switch (integration) {
      case "Quickbooks":
        Linking.getInitialURL()
          .then((url) => {
            if (url.includes("exp://") || url.includes("pcfo://")) {
              this.props.navigation.getParam("stateFunction")();
              this.props.navigation.navigate("Setup");
            }
          })
          .catch((err) => console.error("An error occurred", err));
        Linking.openURL(
          `https://appcenter.intuit.com/connect/oauth2?client_id=${quickBooksId}&redirect_uri=${redirectUrl}&scope=com.intuit.quickbooks.accounting&response_type=code&state=${userId}`
        );
        break;
      default:
        break;
    }
  }

  showAlert1() {
    Alert.alert(
      "OUT OF CASH DATE",
      <TextInput mode="outlined" label="Name of the software" />,
      [
        {
          text: "Back",

          style: "cancel",
        },
        {
          text: "Submit",

          style: "submit",
        },
      ]
    );
  }

  handleOtherPress = (param) => {
    if (param != "") {
      this.setState(
        { isSpinner: true, isDialogVisible: false, isShowPleaseEnter: false },
        async () => {
          const noQbFormResponse = await triggerNoQbForm(param);
          if (noQbFormResponse.result == true) {
            this.setState({ isSpinner: false }, () => {
              setTimeout(() => {
                Alert.alert(
                  "Thank you",
                  "We have saved your answer. Thanks for letting us know.",
                  [
                    {
                      text: "Done",
                      onPress: () => {
                        this.props.navigation.getParam(
                          "createLedgerIntegration"
                        )();
                        this.props.navigation.getParam(
                          "hasSuccessfullyExecutedNoQb"
                        )();
                        this.props.navigation.navigate("Setup");
                      },
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              }, 100);
            });
          } else {
            this.setState({ isSpinner: false }, () => {
              setTimeout(() => {
                Alert.alert("Error", "Error Try Again!");
              }, 110);
            });
          }
        }
      );
    } else {
      this.setState({ isDialogVisible: true, isShowPleaseEnter: true });
    }
  };
  handleNoQbButton = async () => {
    this.setState({ isSpinner: true }, async () => {
      const { xero, sage, bench, wave } = this.state;

      let readyParam = "";
      if (xero == true) {
        readyParam = "Xero";
      } else if (sage == true) {
        readyParam = "Sage";
      } else if (bench == true) {
        readyParam = "Bench";
      } else if (wave == true) {
        readyParam = "Wave";
      }

      const noQbFormResponse = await triggerNoQbForm(readyParam);
      if (noQbFormResponse.result == true) {
        this.setState({ isSpinner: false }, () => {
          setTimeout(() => {
            Alert.alert(
              "Success",
              "Your Information Successfully Saved",
              [
                {
                  text: "Ok",
                  onPress: () => {
                    this.props.navigation.getParam("createLedgerIntegration")();
                    this.props.navigation.getParam(
                      "hasSuccessfullyExecutedNoQb"
                    )();
                    this.props.navigation.navigate("Setup");
                  },
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          }, 100);
        });
      } else {
        this.setState(
          {
            isSpinner: false,
          },
          () => {
            setTimeout(() => {
              Alert.alert("Error", "Error Try Again!");
            }, 100);
          }
        );
      }
    });
  };
  handleQuickBookIntegration = () => {
    this.props.navigation.navigate("QuickbookIntegration", {
      createBankIntegration: () => {
        this.props.navigation.getParam("createLedgerIntegration")();
      },
    });
  };
  render() {
    const { isShowPleaseEnter } = this.state;
    const notQuickbooks = [{ name: "Not Quickbooks? Tell us what you have." }];
    const buttonCondition =
      (this.state.bench ||
        this.state.sage ||
        this.state.wave ||
        this.state.xero) &&
      !this.props.navigation.getParam("isOneTimeNoQbSend");
    return (
      <Root headerColor={"#F1F3F5"} footerColor={"#F1F3F5"} barStyle={"dark"}>
        <View style={styles.container}>
          <Spinner visible={this.state.isSpinner} />
          <View
            style={{
              flexDirection: "row",
              width: "73%",
              marginTop: "1%",
              alignSelf: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons
                size={30}
                name="md-close"
                style={{ alignSelf: "flex-start", marginLeft: 10 }}
              />
            </TouchableOpacity>
            <Text style={styles.header}>Accounting Integration</Text>
          </View>
          <Text style={styles.text}>
            {
              "We get data from your accounting software to\n provide insights on your incoming cash."
            }
          </Text>

          {!this.props.navigation.getParam("isOneTimeNoQbSend") && (
            <View
              style={{
                flexDirection: "column",
                alignSelf: "center",
                justifyContent: "center",
                width: "85%",
              }}
            >
              {LEDGERS.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      this.handleQuickBookIntegration();
                    }}
                  >
                    <Card
                      containerStyle={{
                        borderRadius: 5,
                        borderWidth: 0,
                        width: "92%",
                        shadowOpacity: 0,
                      }}
                    >
                      {item.name === "Quickbooks" ? (
                        <Image
                          source={{
                            uri:
                              "https://www.intuit.com/content/dam/intuit/intuitcom/company/images/logo-intuit-quickbooks-preferred.jpg",
                          }}
                          style={{
                            alignSelf: "center",
                            height: 25,
                            width: 150,
                          }}
                        />
                      ) : (
                        undefined
                      )}
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              marginTop: "7%",
              height: 34,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                fontFamily: "System",
                fontSize: 15,
                fontWeight: "bold",
                height: 30,
              }}
            >
              {"---Not Quickbooks? Tell us what you have.---"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => ({
                  xero: !prevState.xero,
                  sage: false,
                  bench: false,
                  wave: false,
                }));
              }}
            >
              <Card
                containerStyle={{
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 120,
                  height: 60,
                  shadowOpacity: 0,
                  borderColor: this.state.xero ? "#007AFF" : "#ffffff",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/logo_xero.png")}
                  style={{ alignSelf: "center", width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => ({
                  sage: !prevState.sage,
                  xero: false,
                  bench: false,
                  wave: false,
                }));
              }}
            >
              <Card
                containerStyle={{
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 120,
                  height: 60,
                  shadowOpacity: 0,
                  borderColor: this.state.sage ? "#007AFF" : "#ffffff",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/logo_sage.png")}
                  style={{ alignItems: "center", width: 80, height: 30 }}
                  resizeMode="contain"
                />
              </Card>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              justifyContent: "space-between",
              width: "85%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => ({
                  xero: false,
                  sage: false,
                  bench: !prevState.bench,
                  wave: false,
                }));
              }}
            >
              <Card
                containerStyle={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: this.state.bench ? "#007AFF" : "#ffffff",
                  width: 120,
                  height: 60,
                  shadowOpacity: 0,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={BenchLogo}
                  style={{ alignSelf: "center", width: 100, height: 50 }}
                  resizeMode="center"
                />
              </Card>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => ({
                  xero: false,
                  sage: false,
                  bench: false,
                  wave: !prevState.wave,
                }));
              }}
            >
              <Card
                containerStyle={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: this.state.wave ? "#007AFF" : "#ffffff",
                  width: 120,
                  height: 60,
                  shadowOpacity: 0,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/logo_wave.png")}
                  style={{ alignSelf: "center", width: 80, height: 30 }}
                  resizeMode="contain"
                />
              </Card>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignSelf: "center",
              justifyContent: "center",
              marginTop: "10%",
              width: "85%",
              height: "15%",
            }}
          >
            {!this.props.navigation.getParam("isOneTimeNoQbSend") && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isDialogVisible: true });
                }}
              >
                <Card
                  containerStyle={{
                    borderRadius: 5,
                    borderWidth: 0,
                    width: "92%",
                    shadowOpacity: 0,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "System",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    Other
                  </Text>
                </Card>
              </TouchableOpacity>
            )}

            {buttonCondition && (
              <Button
                containerStyle={{
                  width: "92%",
                  alignSelf: "center",
                  marginTop: "8%",
                }}
                buttonStyle={{ backgroundColor: "#007AFF", borderRadius: 20 }}
                title="Continue"
                type="solid"
                onPress={this.handleNoQbButton}
              />
            )}
          </View>
          <DialogInput
            isDialogVisible={this.state.isDialogVisible}
            title={"Other"}
            message={
              <Fragment>
                <Text>
                  Please tell us which accounting software you are using for
                  your business.
                </Text>
                {isShowPleaseEnter == true ? (
                  <Text
                    style={{ color: "red" }}
                  >{`\n\nPlease Enter Software Name`}</Text>
                ) : null}
              </Fragment>
            }
            hintInput={"Name of the software"}
            submitInput={(inputText) => {
              this.handleOtherPress(inputText);
            }}
            closeDialog={() => {
              this.setState({
                isDialogVisible: false,
                isShowPleaseEnter: false,
              });
            }}
            disabled={!this.state.otherSoftware}
          />
          <Overlay
            width={"75%"}
            height={"33%"}
            isVisible={this.state.isModalVisible}
            onBackdropPress={() => {
              this.setState({ isModalVisible: false });
            }}
          >
            <View
              style={{
                flexDirection: "column",
                borderWidth: 1,
                borderColor: "#000",
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Other
              </Text>
              <Text style={{ textAlign: "center", paddingVertical: "5%" }}>
                Please tell us which accounting software you are using for your
                business.
              </Text>
              <Input
                placeholder="Name of the software"
                containerStyle={{ paddingVertical: 40, alignSelf: "center" }}
                onChange={(text) => this.setState({ otherSoftware: text })}
              />
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: -10,
                }}
              >
                <Button
                  containerStyle={{ width: "48%", alignSelf: "center" }}
                  title="back"
                  type="outline"
                  onPress={() => {
                    this.setState({ isModalVisible: false });
                  }}
                />
                <Button
                  containerStyle={{ width: "48%", alignSelf: "center" }}
                  title="submit"
                  type="outline"
                  titleStyle={{ color: "#000" }}
                  disabled={!this.state.otherSoftware}
                  onPress={() => {
                    this.setState({ isModalVisible: false, otherSoftware: "" });
                    this.props.navigation.navigate("Setup");
                  }}
                />
              </View>
              {/* <View style={{ flexDirection: "row", width: "100%", justifyContent:'space-between', backgroundColor:'#fff',marginTop:"-4.5%" }}>
              <Button
                containerStyle={{ width: "50%", alignSelf:'flex-start' }}
                title="back"
                type="outline"
                onPress={() => {
                  this.setState({ isModalVisible: false });
                }}
              />
              <Button
                containerStyle={{ width: "50%", alignSelf:'flex-end' }}
                title="submit"
                type="outline"
                titleStyle={{color:'#000'}}
                disabled={!this.state.otherSoftware}
                onPress={() => {
                  this.setState({ isModalVisible: false,  otherSoftware: "" });
                  this.props.navigation.navigate("Setup")
                }}
              />
              <Text></Text>
            </View> */}
            </View>
          </Overlay>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F5",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
  },
  image: {
    width: 50,
    height: 75,
    resizeMode: "contain",
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    marginVertical: "8%",
  },
});

export default LedgerIntegration;

//  <Card
//     containerStyle={{
//     borderRadius: 5,
//     borderWidth: 0,
//     width: 296,
//     shadowOpacity: 0
//     }}
//     ></Card>

// onPress={async () => {
//   this.setState({ isModalVisible: false });
//   let url = `mailto:support@pocketcfo.com`;
//   const query = qs.stringify({
//     subject: "Accounting Integration From App",
//     body: this.state.otherSoftware
//   });
//   if (query.length) {
//     url += `?${query}`;
//   }
//   Linking.openURL(url);
//   this.props.navigation.getParam("stateFunction")();
//   this.props.navigation.navigate("Setup");
// }}
