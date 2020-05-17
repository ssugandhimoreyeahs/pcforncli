import React, { Component, useContext, PureComponent } from "react";
import { Alert, BackHandler } from "react-native";
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

import Spinner from "react-native-loading-spinner-overlay";
import TryAgainScreen from "../../ftux/somethingWrong";
import { logger } from "../../../api/logger";
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

class Dashboard extends PureComponent {
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
    };

    this.popupInterval = null;
  }
  resetFlags = () => {
    this.showBankCredentialChangePopupFlag = false;
    this.showBankNotConnectedPopupFlag = false;
    this.showQuickBooksPopupFlag = false;
  };
  reloadPlaid = () => {
    this.resetFlags();

    getUserPromise()
      .then((userResponse) => {
        console.log("Dashboard user - ", userResponse);

        if (userResponse.result == true) {
          this.props.updateUserReduxTree(userResponse.userData);
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
            // this.props.fetchInsights();
            this.props.healthScoreAsyncCreator(
              userResponse.userData.qbIntegrationStatus
            );
            isValidTokenApiCalled = true;
          }
          this.setState({ userData: userResponse.userData }, () => {
            if (userResponse.userData.bankIntegrationStatus == true) {
              // this.props.fetchPlaidCategoryDispatch();
            }
          });
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
  fetchUser = (userResponse) => {
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
        // this.props.fetchInsights();
        this.props.healthScoreAsyncCreator(
          userResponse.userData.qbIntegrationStatus
        );
        isValidTokenApiCalled = true;
        validatePlaidTokenPromise()
          .then((triggerValidPlaidToken) => {
            if (triggerValidPlaidToken.result == true) {
              if (triggerValidPlaidToken.response.isValidPlaidToken == false) {
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
  };
  myDelayJob = async () => {
    try {
      const userResponse = await getUser();
      if(userResponse.result === true){
        console.log("user response recieved - ",userResponse);
        this.fetchUser(userResponse);
      }else{
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
    if (this.props.navigation.getParam("readyValuePropAfterLogout")) {
      this.props.navigation.getParam("readyValuePropAfterLogout")();
    }
    await AsyncStorage.setItem("isUserLoggedInStorage", "true");
    this.myDelayJob();
    // setTimeout(() => {
    //   //this.fetchUser();
    // }, 50000);
  };

  componentWillUnmount() {
    clearInterval(this.popupInterval);
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
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
    this.setState({ isSpinner: true });
    this.fetchUser();
  };

  callAgainForThePopup = () => {
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
  render() {
    const { isSpinner } = this.state;
    const { bankIntegrationStatus, qbIntegrationStatus } = this.state.userData;
    return (
      <React.Fragment>
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
          ) : (
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
          )
        ) : null}
      </React.Fragment>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

const styles = StyleSheet.create({
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
});
