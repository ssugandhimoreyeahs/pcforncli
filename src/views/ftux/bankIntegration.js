import React, { Component } from "react";
//import PlaidAuthenticator from "react-native-plaid-link";
import PlaidLink from "react-native-plaid-link-sdk";
import { PLAID } from "../../constants/constants";
import { sendPlaidToken } from "../../api/api";
import { BackHandler } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Root } from "@components";

class BankIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpinner: true,
    };
    this.plaidRef = React.createRef();
  }

  onSuccess = async (data) => {
    if (data.status === "connected") {
      try {
        this.setState({ isSpinner: true });
        const { getParam, navigate } = this.props.navigation;
        //console.log(data);
        public_token = data.public_token;
        institution = data.institution;
        accounts = [{ ...data.accounts[0] }];

        const triggerPlaidPublicToken = await sendPlaidToken(
          public_token,
          institution,
          accounts
          //this.props.navigation.getParam("userId")
        );
        console.log(
          "PLAID PACKAGE onSUCCESS - ",
          JSON.stringify({
            public_token,
            institution,
            accounts,
            //userId: this.props.navigation.getParam("userId"),
          })
        );
        console.log(
          "/plaid/getToken - RESPONSE >>> ",
          JSON.stringify(triggerPlaidPublicToken)
        );
        if (triggerPlaidPublicToken.result == true) {
          if (getParam("createBankIntegration")) {
            this.setState({ isSpinner: false }, () => {
              if (getParam("createBankIntegration")) {
                getParam("createBankIntegration")();
              }
              // navigate("AccountConnected", {
              //   redirectTo: () => {
              //     navigate("Setup");
              //   },
              // });
              setTimeout(() => {
                navigate("Setup");
              }, 200);
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
          this.setState({ isSpinner: false }, () => {
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
          });
        }
      } catch (error) {
        console.log("PLAID ERROR - ", error);
        this.setState({ isSpinner: false }, () => {
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
        });
      }
    }
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    setTimeout(() => {
      this.setState({ isSpinner: false }, () => {
        setTimeout(() => {
          this.plaidRef.current.onPress();
        }, 500);
      });
    }, 2500);
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
  onError = (error) => {
    console.log("PLAID onERROR - ", error);
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 200);
  };
  onExit = (exit) => {
    console.log("PLAID onExit - ", exit);
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 200);
  };
  render() {
    return (
      <Root headerColor={"#fff"} footerColor={"#fff"} barStyle={"dark"}>
        <Spinner visible={this.state.isSpinner} />
        <PlaidLink
          ref={this.plaidRef}
          clientName={PLAID.clientName}
          publicKey={PLAID.publicKey}
          product={[PLAID.product]}
          env={PLAID.env}
          onSuccess={this.onSuccess}
          onError={this.onError}
          onExit={this.onExit}
          language="en"
          countryCodes={["US"]}
        />
      </Root>
    );
  }
}
export default BankIntegration;
// const BankIntegration = (props) => {
//   const [spinner, setSpinner] = useState(true);
//   const plaidRef = useRef();
//   const onSuccess = (data) => {
//     try {
//       if (data.status === "connected") {
//         setSpinner(true);
//         const { getParam, navigate } = props.navigation;
//         const publicToken = data.public_token;
//         const institution = data.institution;
//         const accounts = data.accounts;

//         const triggerPlaidPublicToken = await sendPlaidToken(
//           publicToken,
//           institution,
//           accounts
//         );
//         console.log("Plaid onSUCCESS - ",{ publicToken,institution,accounts });
//         console.log("/plaid/getToken Response - ",triggerPlaidPublicToken);

//       } else {
//       }
//     } catch (error) {}
//   };
//   const onError = (error) => {
//     console.log("PLAID onERROR - ", error);
//     props.navigation.goBack();
//   };
//   const onExit = (exit) => {
//     console.log("PLAID onExit - ", exit);
//     props.navigation.goBack();
//   };
//   useEffect(() => {
//     setTimeout(() => {
//       setSpinner(false);
//       setTimeout(() => {
//         plaidRef.current.onPress();
//       }, 500);
//     }, 2000);
//   }, []);
//   return (
//     <Root headerColor={"#fff"} footerColor={"#fff"} barStyle={"dark"}>
//       <Spinner visible={spinner} />
//       <PlaidLink
//         ref={plaidRef}
//         clientName={PLAID.clientName}
//         publicKey={PLAID.publicKey}
//         product={[PLAID.product]}
//         env={PLAID.env}
//         onSuccess={onSuccess}
//         onError={onError}
//         onExit={onExit}
//         language="en"
//         countryCodes={["US"]}
//       />
//     </Root>
//   );
// };

// export default BankIntegration;
// import React, { Component } from "react";
// import PlaidAuthenticator from "react-native-plaid-link";
// import { PLAID } from "../../constants/constants";
// import { sendPlaidToken } from "../../api/api";
// import { BackHandler } from "react-native";
// import Spinner from "react-native-loading-spinner-overlay";
// import {Root} from '@components';

// export default class BankIntegration extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isSpinner: false,
//     };
//   }

//   onMessage = async (data, companyName) => {
//     if (data.action === "plaid_link-undefined::exit") {
//       this.props.navigation.goBack();
//       //console.log("inside if plaid link undefined");
//     } else if (data.action === "plaid_link-undefined::connected") {
//       try {
//         this.setState({ isSpinner: true });
//         const { getParam, navigate } = this.props.navigation;
//         //console.log(data);
//         publicToken = data.metadata.public_token;
//         institution = data.metadata.institution;
//         accounts = data.metadata.accounts;

//         const triggerPlaidPublicToken = await sendPlaidToken(
//           publicToken,
//           institution,
//           accounts
//         );
//         console.log("Send Plaid Details Response", triggerPlaidPublicToken);
//         if (triggerPlaidPublicToken.result == true) {
//           if (getParam("createBankIntegration")) {
//             this.setState({ isSpinner: false }, () => {
//               if (getParam("createBankIntegration")) {
//                 getParam("createBankIntegration")();
//               }
//               navigate("AccountConnected", {
//                 redirectTo: () => {
//                   navigate("Setup");
//                 },
//               });
//             });
//           } else if (getParam("comeFromTimeout")) {
//             this.setState({ isSpinner: false }, () => {
//               this.props.navigation.navigate("AccountConnected", {
//                 redirectTo: () => {
//                   this.setState({ isSpinner: true }, () => {
//                     setTimeout(() => {
//                       this.setState({ isSpinner: false }, () => {
//                         setTimeout(() => {
//                           getParam("reloadPlaid")();
//                         }, 50);
//                         navigate("Dashboard", {
//                           comeFromTheBank: true,
//                         });
//                       });
//                     }, 3000);
//                   });
//                 },
//               });
//             });
//           } else if (getParam("comeFromInnerIntegration")) {
//             this.setState({ isSpinner: false }, () => {
//               navigate("AccountConnected", {
//                 redirectTo: () => {
//                   this.setState({ isSpinner: true }, () => {
//                     setTimeout(() => {
//                       this.setState({ isSpinner: false }, () => {
//                         setTimeout(() => {
//                           getParam("reloadPlaid")();
//                         }, 50);
//                         navigate("Dashboard", {
//                           comeFromTheBank: true,
//                         });
//                       });
//                     }, 3000);
//                   });
//                 },
//               });
//             });
//           }
//         } else {
//           this.setState(
//             (prevState) => {
//               return { isSpinner: !prevState.isSpinner };
//             },
//             () => {
//               setTimeout(() => {
//                 this.props.navigation.navigate("OopsSorry", {
//                   executeOperation: () => {
//                     if (
//                       this.props.navigation.getParam("createBankIntegration")
//                     ) {
//                       // this.props.navigation.getParam("createBankIntegration")();
//                       this.props.navigation.navigate("Setup");
//                     }
//                     if (this.props.navigation.getParam("comeFromTimeout")) {
//                       this.props.navigation.navigate("Dashboard");
//                     }
//                     if (
//                       this.props.navigation.getParam("comeFromInnerIntegration")
//                     ) {
//                       this.props.navigation.navigate("Integration");
//                     }
//                   },
//                 });
//               }, 100);
//             }
//           );
//         }
//       } catch (error) {
//         console.log(error);
//         this.setState(
//           (prevState) => {
//             return { isSpinner: !prevState.isSpinner };
//           },
//           () => {
//             setTimeout(() => {
//               this.props.navigation.navigate("OopsSorry", {
//                 executeOperation: () => {
//                   if (this.props.navigation.getParam("createBankIntegration")) {
//                     // this.props.navigation.getParam("createBankIntegration")();
//                     this.props.navigation.navigate("Setup");
//                   }
//                   if (this.props.navigation.getParam("comeFromTimeout")) {
//                     this.props.navigation.navigate("Dashboard");
//                   }
//                   if (
//                     this.props.navigation.getParam("comeFromInnerIntegration")
//                   ) {
//                     this.props.navigation.navigate("Integration");
//                   }
//                 },
//               });
//             }, 100);
//           }
//         );
//       }
//     }
//   };

//   componentDidMount() {
//     BackHandler.addEventListener("hardwareBackPress", () =>
//       this.handleBackButton(this.props.navigation)
//     );
//   }

//   componentWillUnmount() {
//     BackHandler.removeEventListener("hardwareBackPress", () =>
//       this.handleBackButton(this.props.navigation)
//     );
//   }

//   handleBackButton = (nav) => {
//     if (!nav.isFocused()) {
//       BackHandler.removeEventListener("hardwareBackPress", () =>
//         this.handleBackButton(this.props.navigation)
//       );
//       return false;
//     } else {
//       nav.goBack();
//       return true;
//     }
//   };

//   render() {
//     return (
//       <Root headerColor={"#fff"} footerColor={"#fff"} barStyle={"dark"}>
//         <Spinner visible={this.state.isSpinner} />
//         <PlaidAuthenticator
//           onMessage={(data) => {
//             this.onMessage(data);
//           }}
//           publicKey={PLAID.publicKey}
//           env={PLAID.env}
//           product={PLAID.product}
//           clientName={PLAID.clientName}
//           selectAccount={PLAID.selectAccount}
//           //connected={console.log("Completed")}
//         />
//       </Root>
//     );
//   }
// }

// const styles = {
//   container: {
//     alignItems: "center",
//     backgroundColor: "#F1F3F5",
//     flex: 1,
//     justifyContent: "center",
//     paddingBottom: "20%",
//   },
//   header: {
//     fontSize: 17,
//     fontWeight: "bold",
//     marginBottom: "10%",
//   },
//   text: {
//     textAlign: "center",
//     marginBottom: "15%",
//   },
// };
