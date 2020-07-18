import React, { Component } from "react";
import { Text } from "react-native";
import PlaidLink from "react-native-plaid-link-sdk";
import PlaidAuthenticator from "react-native-plaid-link";
import { PLAID } from "../../constants/constants";
import { sendPlaidToken } from "../../api/api";
import { BackHandler } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Root } from "@components";

export default class BankIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpinner: false,
    };
  }

  onMessage = async (data, companyName) => {
    if (data.action === "plaid_link-undefined::exit") {
      this.props.navigation.goBack();
      //console.log("inside if plaid link undefined");
    } else if (data.action === "plaid_link-undefined::connected") {
      try {
        this.setState({ isSpinner: true });
        const { getParam, navigate } = this.props.navigation;
        //console.log(data);
        publicToken = data.metadata.public_token;
        institution = data.metadata.institution;
        accounts = data.metadata.accounts;
        console.log("Plaid Information - ", data.metadata);
        console.log("Plaid Data Information - ", {
          publicToken,
          institution,
          accounts,
        });
        const triggerPlaidPublicToken = await sendPlaidToken(
          publicToken,
          institution,
          accounts
        );
        console.log("Send Plaid Details Response", triggerPlaidPublicToken);
        if (triggerPlaidPublicToken.result == true) {
          if (getParam("createBankIntegration")) {
            this.setState({ isSpinner: false }, () => {
              if (getParam("createBankIntegration")) {
                getParam("createBankIntegration")();
              }
              navigate("AccountConnected", {
                redirectTo: () => {
                  navigate("Setup");
                },
              });
            });
          } else if (getParam("comeFromTimeout")) {
            this.setState({ isSpinner: false }, () => {
              this.props.navigation.navigate("AccountConnected", {
                redirectTo: () => {
                  this.setState({ isSpinner: true }, () => {
                    setTimeout(() => {
                      this.setState({ isSpinner: false }, () => {
                        setTimeout(() => {
                          getParam("reloadPlaid")();
                        }, 50);
                        navigate("Dashboard", {
                          comeFromTheBank: true,
                        });
                      });
                    }, 3000);
                  });
                },
              });
            });
          } else if (getParam("comeFromInnerIntegration")) {
            this.setState({ isSpinner: false }, () => {
              navigate("AccountConnected", {
                redirectTo: () => {
                  this.setState({ isSpinner: true }, () => {
                    setTimeout(() => {
                      this.setState({ isSpinner: false }, () => {
                        setTimeout(() => {
                          getParam("reloadPlaid")();
                        }, 50);
                        navigate("Dashboard", {
                          comeFromTheBank: true,
                        });
                      });
                    }, 3000);
                  });
                },
              });
            });
          }
        } else {
          this.setState(
            (prevState) => {
              return { isSpinner: !prevState.isSpinner };
            },
            () => {
              setTimeout(() => {
                this.props.navigation.navigate("OopsSorry", {
                  executeOperation: () => {
                    if (
                      this.props.navigation.getParam("createBankIntegration")
                    ) {
                      // this.props.navigation.getParam("createBankIntegration")();
                      this.props.navigation.navigate("Setup");
                    }
                    if (this.props.navigation.getParam("comeFromTimeout")) {
                      this.props.navigation.navigate("Dashboard");
                    }
                    if (
                      this.props.navigation.getParam("comeFromInnerIntegration")
                    ) {
                      this.props.navigation.navigate("Integration");
                    }
                  },
                });
              }, 100);
            }
          );
        }
      } catch (error) {
        console.log(error);
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              this.props.navigation.navigate("OopsSorry", {
                executeOperation: () => {
                  if (this.props.navigation.getParam("createBankIntegration")) {
                    // this.props.navigation.getParam("createBankIntegration")();
                    this.props.navigation.navigate("Setup");
                  }
                  if (this.props.navigation.getParam("comeFromTimeout")) {
                    this.props.navigation.navigate("Dashboard");
                  }
                  if (
                    this.props.navigation.getParam("comeFromInnerIntegration")
                  ) {
                    this.props.navigation.navigate("Integration");
                  }
                },
              });
            }, 100);
          }
        );
      }
    } else {
      console.log("I am here for the Plaid Error - ", data);
    }
  };

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

  render() {
    return (
      <Root headerColor={"#fff"} footerColor={"#fff"} barStyle={"dark"}>
        <Spinner visible={this.state.isSpinner} /> 
        <PlaidAuthenticator
          onMessage={(data) => {
            this.onMessage(data);
          }}
          publicKey={PLAID.publicKey}
          env={PLAID.env}
          product={PLAID.product}
          clientName={PLAID.clientName}
          selectAccount={PLAID.selectAccount}
          //connected={console.log("Completed")}
        />
        {/* <PlaidLink
          title="Add Account"
          // Replace any of the following <#VARIABLE#>s according to your setup,
          // for details see https://plaid.com/docs/quickstart/#client-side-link-configuration

          publicKey={PLAID.publicKey}
          clientName={PLAID.clientName}
          env={PLAID.env}
          onSuccess={(e) => console.log("success: ", e)}
          product={PLAID.product}
          // webviewRedirectUri="yourAppName://redirect"
          // // Optional props
          // countryCodes={["<# Country Code #>"]}
          // language="<# Language #>"
          // onExit={(e) => console.log("exit: ", e)}
          // userEmailAddress="<# User Email #>"
          // userLegalName="<# User Legal Name #>"
          // userPhoneNumber="<# User Phone Number #>"
          // webhook="<# Webhook URL #>"
        /> */}
      </Root>
    );
  }
}

const styles = {
  container: {
    alignItems: "center",
    backgroundColor: "#F1F3F5",
    flex: 1,
    justifyContent: "center",
    paddingBottom: "20%",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: "10%",
  },
  text: {
    textAlign: "center",
    marginBottom: "15%",
  },
};
