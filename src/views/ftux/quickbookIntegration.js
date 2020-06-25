import React, { Component, Fragment } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import { APINETWORK } from "../../constants/constants";
import { getCurrentAuthToken } from "../../api/api";
import { triggerQbDataCopyDb } from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import Url from "url";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Root } from "@components";
Ionicons.loadFont();

class QuickbookIntegration extends Component {
  injectedJavaScripttt = `(function() {
        window.postMessage = function(data) {
          window.ReactNativeWebView.postMessage(data);
        };
      })()`;
  constructor(props) {
    super(props);
    this.state = {
      Authorization: "",
      isBodyLoaded: false,
      spinner: true,
      isExecutedTimes: 0,
    };
  }
  componentDidMount = async () => {
    const AuthorizationResponse = await getCurrentAuthToken();

    if (AuthorizationResponse.result == true) {
      this.setState({
        Authorization: AuthorizationResponse.Authorization,
        isBodyLoaded: true,
        spinner: false,
      });
    }
  };
  onMessageCalls = (e) => {};
  handleUrlResponses = async (nativeEvent) => {
    let { isExecutedTimes } = this.state;
    let currentExecutingUrl = nativeEvent.url;
    let currentExecutingUrlObjParse = Url.parse(currentExecutingUrl, true);
    let splitingUrl = currentExecutingUrl.split("?");
    let qbCallBackUrl = APINETWORK.qbCallBackUrl;
    if (splitingUrl[0] == qbCallBackUrl) {
      if (isExecutedTimes == 0) {
        this.setState({ spinner: true, isExecutedTimes: 1 }, () => {
          if (currentExecutingUrlObjParse.query.error == undefined) {
            setTimeout(async () => {
              if (this.props.navigation.getParam("createBankIntegration")) {
                this.props.navigation.getParam("createBankIntegration")();
              }
              if (this.props.navigation.getParam("reloadQuickbooks")) {
                this.props.navigation.getParam("reloadQuickbooks")();
              }
              this.setState({ spinner: false }, () => {
                this.props.navigation.navigate("QuickbookConnected", {
                  redirectTo: () => {
                    if (
                      this.props.navigation.getParam("createBankIntegration")
                    ) {
                      this.props.navigation.navigate("Setup");
                    }
                    if (this.props.navigation.getParam("reloadQuickbooks")) {
                      this.props.navigation.navigate("Contact");
                    }
                  },
                });
              });
            }, 6000);
          } else {
            this.setState(
              (prevState) => {
                return {
                  spinner: !prevState.spinner,
                };
              },
              () => {
                setTimeout(() => {
                  Alert.alert(
                    "Message",
                    "QuickBooks Connection Successfully Aborted",
                    [
                      {
                        text: "Okay",
                        onPress: () => {
                          this.props.navigation.goBack();
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }, 100);
              }
            );
          }
        });
      }
    }
  };
  render() {
    return (
      <Root headerColor={"#ECEEF1"} footerColor={"#ECEEF1"} barStyle={"dark"}>
        <View style={styles.container}>
          <Spinner visible={this.state.spinner} />
          {this.state.isBodyLoaded ? (
            <Fragment>
              <View style={styles.rootComponent}>
                <View style={styles.headerView}>
                  <View style={styles.backButtonView}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.goBack();
                      }}
                    >
                      <Ionicons name="md-close" size={25} color={"#000000"} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.centerheaderTextView}>
                    <Text
                      style={styles.textView}
                    >{`Quickbooks Integration`}</Text>
                  </View>
                </View>
                {/* <View style={{ paddingVertical:7,backgroundColor:"#ECEEF1" }}></View> */}

                <WebView
                  incognito={true}
                  source={{
                    uri: APINETWORK.quickbooks,
                    headers: { Authorization: this.state.Authorization },
                  }}
                  onNavigationStateChange={(navEvent) => {
                    this.handleUrlResponses(navEvent);
                  }}
                  onMessage={(e) => {
                    this.onMessageCalls(e);
                  }}

                  //  cacheEnabled={false}
                  //  sharedCookiesEnabled={false}
                  //  thirdPartyCookiesEnabled={false}
                />
              </View>
            </Fragment>
          ) : null}
        </View>
      </Root>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    // backgroundColor: "#F1F3F5",
  },
  rootComponent: {
    height: "100%",
    width: "100%",
    backgroundColor: "#ECEEF1",
  },
  headerView: {
    paddingVertical: 5,
    flexDirection: "row",
    width: "100%",
  },
  backButtonView: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  centerheaderTextView: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  textView: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
  },
};

export default QuickbookIntegration;
