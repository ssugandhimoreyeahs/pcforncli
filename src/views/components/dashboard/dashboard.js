import React, { PureComponent, Fragment, Component } from "react";
import {
  Alert,
  BackHandler,
  View,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Overlay } from "react-native-elements";
import { Observable, interval, timer } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NavigationEvents } from "react-navigation";
import { StyleSheet } from "react-native";
import IncomingAR from "../charts/incomingAR";
import BottomNavLayout from "../../../controls/bottom-nav-layout";
import HealthScore from "../charts/healthScore";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import CashOnHand from "./cashOnHand";
import ChangeInCash from "./changeInCash";
import Sales from "./sales";
import { fetchUserSuccess } from "../../../reducers/getUser";
import {
  userLoginCounter,
  validatePlaidTokenPromise,
  getUserPromise,
  getUser,
} from "../../../api/api";
import {Root} from '@components';
import Spinner from "react-native-loading-spinner-overlay";
import TryAgainScreen from "../../ftux/somethingWrong";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
import ExpenseByCategory from "./expenseByCategory";
import { fetchExpensesAsyncCreator } from "../../../reducers/expensecategory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
import { cicAsynCreator } from "../../../reducers/cashinchange";
import { fetchArAsyncCreator } from "../../../reducers/incommingar";
import { fetchInsightsAsyncCreator } from "../../../reducers/insights";
import { fetchForecastAsyncCreator } from "../../../reducers/forecast";
import { salesAsyncCreator } from "../../../reducers/sales";
import { cohAsyncCreator } from "../../../reducers/cashonhand";
import { outOfCashDateAsyncCreator } from "../../../reducers/outofcashdate";
import { healthScoreAsyncCreator } from "../../../reducers/healthscore";
import {
  BANK_CONNECTION,
  BANK_CREDENTIALS_CHANGE,
  QUICKBOOKS_ERROR,
  EXIT_APP,
} from "../../../api/message";
import { Circle } from "react-native-progress";
import NoPlaidView from "./noPlaidView";
import { heightPercentageToDP } from "react-native-responsive-screen";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.onDashBoardFocused = true;
    this.showQuickBooksPopupFlag = false;
    this.showBankNotConnectedPopupFlag = false;
    this.showBankCredentialChangePopupFlag = false;

    this.state = {
      userData: {},
      isSpinner: true,
      tryAgainScreen: false,
      isCountApiTriggered: false,
      isBodyLoaded: false,

      isInnerIntegrationStarted: false,
    };

    this.isCronRegisterOneTime = false;
    this.isStuffCompleted = false;
    this.obsInstance = { assigned: false, instance: null };

    this.isMyCronWorkDone = false;
    this.popupInterval = null;
  }
  handleBackButton = (nav) => {
    if (!nav.isFocused()) {
      //nav.goBack();
      clearInterval(this.popupInterval);
      return true;
    } else {
      Alert.alert(
        EXIT_APP.title,
        EXIT_APP.message,
        [
          {
            text: EXIT_APP.button1,
            style: "cancel",
          },
          {
            text: EXIT_APP.button2,
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {
          cancelable: false,
        }
      );
      return true;
    }
  };
  handleTryAgainButton = () => {
    this.setState(
      {
        isBodyLoaded: false,
        tryAgainScreen: false,
        isSpinner: true,
      },
      () => {
        this.fetchUserServer();
      }
    );
  };
  callAgainForThePopup = () => {
    const { getParam } = this.props.navigation;
    if (
      getParam("comeFromTheBank") != undefined &&
      getParam("comeFromTheBank") === true
    ) {
      return;
    }
    if (this.showQuickBooksPopupFlag) {
      setTimeout(() => {
        this.showQBPopup();
      }, 500);
      this.showQuickBooksPopupFlag = false;
    } else if (this.showBankNotConnectedPopupFlag) {
      setTimeout(() => {
        this.showConnectBankPopup();
      }, 500);
    }
  };
  showQBPopup = () => {
    Alert.alert(
      QUICKBOOKS_ERROR.title,
      QUICKBOOKS_ERROR.message,
      [
        { text: QUICKBOOKS_ERROR.button1 },
        {
          text: QUICKBOOKS_ERROR.button2,
          onPress: () => {
            this.props.navigation.navigate("Integration", {
              reloadPlaid: () => {
                this.reloadPlaid();
              },
              reloadQuickbooks: () => {
                this.reloadQuickbooks();
              },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };
  showBankCredentialChangePopup = (isShowQBPopup = false) => {
    Alert.alert(
      BANK_CREDENTIALS_CHANGE.title,
      BANK_CREDENTIALS_CHANGE.message,
      [
        {
          text: BANK_CREDENTIALS_CHANGE.button1,
          onPress: () => {
            if (isShowQBPopup) {
              setTimeout(() => {
                this.showQBPopup();
              }, 100);
            }
          },
        },
        {
          text: BANK_CREDENTIALS_CHANGE.button2,
          onPress: () => {
            if (isShowQBPopup) {
              this.showQuickBooksPopupFlag = true;
            }
            this.props.navigation.navigate("Integration", {
              reloadPlaid: () => {
                this.reloadPlaid();
              },
              reloadQuickbooks: () => {
                this.reloadQuickbooks();
              },
            });
          },
        },
      ],
      { cancelable: false }
    );
  };
  showConnectBankPopup = (isShowQBPopup = false) => {
    Alert.alert(BANK_CONNECTION.title, BANK_CONNECTION.message, [
      {
        text: BANK_CONNECTION.button1,
        onPress: () => {
          if (isShowQBPopup) {
            setTimeout(() => {
              this.showQBPopup();
            }, 100);
          }
        },
      },
      {
        text: BANK_CONNECTION.button2,
        onPress: () => {
          if (isShowQBPopup) {
            this.showQuickBooksPopupFlag = true;
          }
          this.props.navigation.navigate("Integration", {
            reloadPlaid: () => {
              this.reloadPlaid();
            },
            reloadQuickbooks: () => {
              this.reloadQuickbooks();
            },
          });
        },
      },
    ]);
  };
  resetFlags = () => {
    this.showBankCredentialChangePopupFlag = false;
    this.showBankNotConnectedPopupFlag = false;
    this.showQuickBooksPopupFlag = false;
  };
  reloadQuickbooks = () => {
    this.resetFlags();

    getUserPromise()
      .then((userResponse) => {
        console.log("Dashboard user - ", userResponse);
        if (userResponse.result == true) {
          this.props.updateUserReduxTree(userResponse.userData);
          if (userResponse.userData.bankIntegrationStatus == false) {
            this.showBankNotConnectedPopupFlag = true;
            this.setState(
              { showCOHChartLoader: false, healthScoreIndicator: false },
              () => {}
            );
          }
          if (userResponse.userData.qbIntegrationStatus == false) {
            //this.setState({ salesData:[],showSalesChartLoader:false });
          }
          if (userResponse.userData.qbIntegrationStatus == true) {
            this.props.fetchSales();
            this.props.fetchIncommingAr();
          }

          this.setState({ userData: userResponse.userData });
        } else {
          this.setState({
            isSpinner: false,
            tryAgainScreen: true,
            isBodyLoaded: true,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isSpinner: false,
          tryAgainScreen: true,
          isBodyLoaded: true,
        });
      });
  };
  registerMyCronJob = () => {
    console.log("cron job registration started");
    const JOB_TIMER = 300000;
    let currentDT = new Date();
    let tillDT = new Date();
    tillDT.setMilliseconds(currentDT.getMilliseconds() + JOB_TIMER);
    const timer$ = timer(JOB_TIMER);
    this.jobObservable = new Observable((obs) => {
      if (!this.obsInstance.assigned) {
        this.obsInstance.assigned = true;
        this.obsInstance.instance = obs;
      }
      this.jobInterval = interval(12000)
        .pipe(takeUntil(timer$))
        .subscribe(
          (intervalObs) => {
            if (this.isStuffCompleted === true) {
              this.jobInterval.unsubscribe();
              obs.complete();
              return;
            } else {
              this.reloadPlaid(true);
              obs.next(`Request Number - ${intervalObs + 1} - 
            Job Registered At = ${currentDT.toLocaleString()} 
            Job Run Till = ${tillDT.toLocaleString()}
            Total Time Elapsed = ${(tillDT - new Date()) / 1000 / 60} Min 
          `);
            }
          },
          (error) => {
            console.log("Error for the Job Interval");
          },
          () => {
            this.jobInterval.unsubscribe();
            obs.complete();
            console.log("Interval Job Completed");
          }
        );
    });
    this.jobObservable.subscribe(
      (next) => {
        console.log(next);
      },
      (error) => {
        console.log("job error");
      },
      () => {
        console.log("Observable Job Completed");
      }
    );
  };
  reloadPlaid = async (fromJob = false) => {
    if (!this.state.isInnerIntegrationStarted) {
      this.setState({
        isInnerIntegrationStarted: true,
      });
      console.log("State set Here");
    }
    try {
      let userResponse = await getUser();
      console.log("Response recieve - ", userResponse);
      if (userResponse.result === true) {
        if (
          userResponse.userData.bankIntegrationStatus === true &&
          userResponse.userData.isStuffCompleted === true
        ) {
          //case 1 where all thing are working fine user connected to the bank and in the backend all the data and balances had been loaded
          this.isStuffCompleted = true;
          console.log("Here--------------------- ", this.obsInstance.assigned);
          console.log("is jobinterval   - ", this.jobInterval);
          if (this.obsInstance.assigned) {
            this.jobInterval.unsubscribe();
            setTimeout(() => {
              this.obsInstance.instance.complete();
              this.isCronRegisterOneTime = false;
              this.isStuffCompleted = false;
              this.obsInstance = { assigned: false, instance: null };
            }, 500);
          }
          this.isMyCronWorkDone = true;
          setTimeout(() => {
            this.setState(
              {
                isBodyLoaded: false,
                isInnerIntegrationStarted: false,
              },
              () => {
                setTimeout(() => {
                  // this.props.navigation.navigate("Dashboard", {
                  //   userResponse,
                  //   fromSetup: true,
                  // });
                  this.setState(
                    (prevState) => {
                      return { isSpinner: true };
                    },
                    () => {
                      setTimeout(() => {
                        this.fetchUser(userResponse);
                      }, 1500);
                    }
                  );
                }, 50);
              }
            );
          }, 1000);
        } else if (
          userResponse.userData.bankIntegrationStatus === true &&
          userResponse.userData.isStuffCompleted === false
        ) {
          console.log("First Time i will be here- ");
          //case 2 where bank integrated but the backend is not ready for the data
          if (!this.isCronRegisterOneTime) {
            console.log("But i will be only one time here");
            console.log("Cron register here - ");
            this.isCronRegisterOneTime = true;
            this.registerMyCronJob();
          }
          this.isStuffCompleted = false;
          //case ends here
        }
      } else {
        //if there is an error
        // if (this.jobInterval.unsubscribe) {
        //   //this.jobObservable.unsubscribe();
        //   this.jobInterval.unsubscribe();
        // }
      }
    } catch (error) {
      console.log("Job error - ", error);
    }
  };
  fetchUser = (userResponse) => {
    try {
      this.resetFlags();
      let isValidTokenApiCalled = false;
      if (userResponse.result == true) {
        this.props.updateUserReduxTree(userResponse.userData);
        //userResponse.userData.bankIntegrationStatus = false;
        if (userResponse.userData.bankIntegrationStatus == false) {
          this.showBankNotConnectedPopupFlag = true;
        }

        if (userResponse.userData.bankIntegrationStatus == true) {
          this.showBankNotConnectedPopupFlag = false;

          this.props.fetchPlaidCategoryDispatch();
          this.props.outOfCashDateAsyncCreator();
          this.props.fetchCashOnHand(3, true);
          this.props.fetchCashInChange(3);
          this.props.fetchExpenseByCategory(3);
          this.props.fetchMainExepenseByCategory(0);
          this.props.fetchInsights();
          this.props.healthScoreAsyncCreator(
            userResponse.userData.qbIntegrationStatus
          );
          isValidTokenApiCalled = true;
          validatePlaidTokenPromise()
            .then((triggerValidPlaidToken) => {
              if (triggerValidPlaidToken.result == true) {
                if (
                  triggerValidPlaidToken.response.isValidPlaidToken == false
                ) {
                  //this.showBankCredentialChangePopupFlag = true;
                  let isshowQBPopupFlag =
                    userResponse.userData.qbIntegrationStatus == true &&
                    triggerValidPlaidToken.response.IsQuickbookToken == false
                      ? true
                      : false;
                  if (this.onDashBoardFocused) {
                    this.showBankCredentialChangePopup(isshowQBPopupFlag);
                  }
                } else {
                  if (
                    userResponse.userData.qbIntegrationStatus == true &&
                    triggerValidPlaidToken.response.IsQuickbookToken == false
                  ) {
                    //this.showQuickBooksPopupFlag = true;
                    if (this.onDashBoardFocused) {
                      this.showQBPopup();
                    }
                  }
                }
              }
            })
            .catch((error) => {
              console.log("Validate Plaid Token Promise error 1 - ", error);
            });
        }
        if (userResponse.userData.qbIntegrationStatus == true) {
          this.props.fetchSales();
          this.props.fetchIncommingAr();
        }

        this.setState(
          {
            userData: userResponse.userData,
            isSpinner: false,
            tryAgainScreen: false,
            isBodyLoaded: true,
          },
          () => {
            if (userResponse.userData.bankIntegrationStatus == true) {
              // this.props.fetchPlaidCategoryDispatch();
            }
            if (this.state.isCountApiTriggered == false) {
              if (userResponse.userData.bankIntegrationStatus == false) {
                if (userResponse.userData.qbIntegrationStatus == true) {
                  validatePlaidTokenPromise()
                    .then((triggerValidPlaidToken) => {
                      if (triggerValidPlaidToken.result == true) {
                        let isShowQBPopup =
                          triggerValidPlaidToken.response.IsQuickbookToken ==
                          false
                            ? true
                            : false;
                        setTimeout(() => {
                          if (this.onDashBoardFocused) {
                            this.showConnectBankPopup(isShowQBPopup);
                          }
                        }, 300);
                      } else {
                        setTimeout(() => {
                          if (this.onDashBoardFocused) {
                            this.showConnectBankPopup(false);
                          }
                        }, 300);
                      }
                    })
                    .catch((error) => {
                      setTimeout(() => {
                        if (this.onDashBoardFocused) {
                          this.showConnectBankPopup(false);
                        }
                      }, 300);
                    });
                } else {
                  setTimeout(() => {
                    if (this.onDashBoardFocused) {
                      this.showConnectBankPopup(false);
                    }
                  }, 300);
                }
              }

              this.setState({ isCountApiTriggered: true });
              setTimeout(() => {
                userLoginCounter();
              }, 6000);
            }
          }
        );
      } else {
        this.setState({
          isSpinner: false,
          tryAgainScreen: true,
          isBodyLoaded: true,
        });
      }
    } catch (error) {
      console.log("Error on Dashboard on Catch - ");
      this.setState({
        isSpinner: false,
        tryAgainScreen: true,
        isBodyLoaded: true,
      });
    }
  };
  fetchUserServer = async (fromJob = false) => {
    try {
      let userResponse = await getUser();
      console.log("Heres - ", userResponse);
      if (userResponse.result === true) {
        this.fetchUser(userResponse);
      } else {
        this.setState({
          isSpinner: false,
          tryAgainScreen: true,
          isBodyLoaded: true,
        });
      }
    } catch (error) {
      this.setState({
        isSpinner: false,
        tryAgainScreen: true,
        isBodyLoaded: true,
      });
    }
  };
  componentDidMount = async () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    const { getParam } = this.props.navigation;
    if (getParam("readyValuePropAfterLogout")) {
      getParam("readyValuePropAfterLogout")();
    }

    if (getParam("fromSetup")) {
      setTimeout(() => {
        this.fetchUser(getParam("userResponse"));
      }, 2000);
    } else if (getParam("fromValueProp")) {
      this.fetchUserServer();
    } else if (getParam("fromLogin")) {
      this.fetchUser(getParam("userResponse"));
    }
    await AsyncStorage.setItem("isUserLoggedInStorage", "true");
  };
  componentWillUnmount() {
    clearInterval(this.popupInterval);
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }
  renderDashboard = React.memo(
    ({ bankIntegrationStatus, qbIntegrationStatus }) => {
      return (
        <BottomNavLayout navigation={this.props.navigation}>
          <HealthScore
            navigation={this.props.navigation}
            reloadPlaid={() => {
              this.reloadPlaid();
            }}
            reloadQuickbooks={() => {
              this.reloadQuickbooks();
            }}
          />
          {bankIntegrationStatus == true ? (
            <CashOnHand navigation={this.props.navigation} />
          ) : null}
          {bankIntegrationStatus == true ? (
            <ChangeInCash navigation={this.props.navigation} />
          ) : null}
          {bankIntegrationStatus == true ? (
            <ExpenseByCategory navigation={this.props.navigation} />
          ) : null}
          {qbIntegrationStatus == true ? (
            <Sales navigation={this.props.navigation} />
          ) : null}
          {qbIntegrationStatus == true ? (
            <IncomingAR
              style={styles.incomingAR}
              navigation={this.props.navigation}
            />
          ) : null}
        </BottomNavLayout>
      );
    }
  );
  renderOverlay = () => {
    const { userData } = this.state;
    console.log("User datahere - ", userData);
    return (
      <Overlay
        overlayStyle={{
          height: "100%",
          width: "100%",
          flex: 1,
        }}
        windowBackgroundColor="rgba(0, 0, 0, 0.7)"
        overlayBackgroundColor="rgba(0, 0, 0, 0)"
        isVisible={this.state.isInnerIntegrationStarted}
        //isVisible={true}
      >
        <View style={{ marginTop: heightPercentageToDP(18) }}>
          <Text style={styles.onBoardingTextStyle}>
            Sit Tight {`${userData.firstname}`}
          </Text>
          <Text style={{ ...styles.onBoardingTextStyle, marginTop: 15 }}>
            We're Building Your Dashboard
          </Text>

          <View
            style={{ marginTop: heightPercentageToDP(8), alignSelf: "center" }}
          >
            <Circle
              //borderColor={"rgba(0, 0, 0, 0)"}
              size={heightPercentageToDP(10)}
              color={"#FFFFFF"}
              unfilledColor={"#4A4A4B"}
              indeterminateAnimationDuration={1500}
              indeterminate={true}
              borderWidth={7}
            />
          </View>
        </View>
      </Overlay>
    );
  };
  renderNoPlaidDashboard = () => {
    return (
      <BottomNavLayout navigation={this.props.navigation}>
        <this.renderOverlay />
        <HealthScore
          navigation={this.props.navigation}
          reloadPlaid={() => {
            this.reloadPlaid();
          }}
          reloadQuickbooks={() => {
            this.reloadQuickbooks();
          }}
        />

        <NoPlaidView />
      </BottomNavLayout>
    );
  };
  render() {
    const { isSpinner } = this.state;
    const { bankIntegrationStatus, qbIntegrationStatus } = this.state.userData;
    return (
      <Root headerColor={"#070640"} footerColor={"#FFF"} barStyle={"light"}>
        <NavigationEvents
          onWillFocus={(payload) => {
            this.onDashBoardFocused = true;
            if (this.state.isBodyLoaded == true) {
              this.callAgainForThePopup();
            }
          }}
          onWillBlur={(payload) => {
            this.onDashBoardFocused = false;
          }}
        />
        <Spinner visible={isSpinner} textStyle={styles.spinnerTextStyle} />
        {this.state.isBodyLoaded == true ? (
          this.state.tryAgainScreen ? (
            <TryAgainScreen
              navigation={this.props.navigation}
              handleButton={this.handleTryAgainButton}
              showLoggedOutButton={true}
            />
          ) : bankIntegrationStatus === false ? (
            <this.renderNoPlaidDashboard />
          ) : (
            <this.renderDashboard
              bankIntegrationStatus={bankIntegrationStatus}
              qbIntegrationStatus={qbIntegrationStatus}
            />
          )
        ) : null}
      </Root>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    reduxUserData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    healthScoreAsyncCreator: (isPlaidConnected) => {
      dispatch(healthScoreAsyncCreator(isPlaidConnected));
    },
    outOfCashDateAsyncCreator: () => {
      dispatch(outOfCashDateAsyncCreator());
    },
    fetchCashOnHand: (cohCurrentRange = 3, isInitialRequest = false) => {
      dispatch(cohAsyncCreator(cohCurrentRange, isInitialRequest));
    },
    fetchPlaidCategoryDispatch: () => {
      dispatch(triggerPlaidCategoryAsync());
    },
    updateUserReduxTree: (userData) => {
      dispatch(fetchUserSuccess(userData));
    },
    fetchExpenseByCategory: (type = 1) => {
      dispatch(fetchExpensesAsyncCreator(type));
    },
    fetchMainExepenseByCategory: (type = 0) => {
      dispatch(fetchMainExpenseAsyncCreator(type));
    },
    fetchCashInChange: (cicCurrentRange = 0) => {
      dispatch(cicAsynCreator(cicCurrentRange));
    },
    fetchIncommingAr: () => {
      dispatch(fetchArAsyncCreator());
    },
    fetchInsights: () => {
      dispatch(fetchInsightsAsyncCreator());
    },
    fetchForecast: () => {
      dispatch(fetchForecastAsyncCreator());
    },
    fetchSales: (salesCurrentRange = 3, isMultiple = false) => {
      dispatch(salesAsyncCreator(salesCurrentRange, isMultiple));
    },
  };
};
const styles = StyleSheet.create({
  jobViewCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groundUp: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#F8F9FA",
  },
  menu: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  onBoardingTextStyle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 22,
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

/*
Do not remove it until it work

// onDidFocus={() => {
          //   const { getParam } = this.props.navigation;
          //   console.log("onDidFocus() - demo ", getParam("comeFromTheBank"));
          //   // if (this.state.isInnerIntegrationStarted) {
          //   //   this.setState({
          //   //     userData: { ...this.state.userData },
          //   //     isInnerIntegrationStarted: true,
          //   //   });
          //   //   return;
          //   // }
          //   if (
          //     getParam("comeFromTheBank") != undefined &&
          //     getParam("comeFromTheBank") == true &&
          //     this.state.isInnerIntegrationStarted === false
          //   ) {
          //     if (!this.isMyCronWorkDone) {
          //       this.reloadPlaid();
          //     }
          //   }
          // }}
*/
