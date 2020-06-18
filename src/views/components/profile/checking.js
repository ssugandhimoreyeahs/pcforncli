import React, {
  PureComponent,
  Fragment,
  Component,
  useRef,
  createRef,
} from "react";
import {
  Text,
  View,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { Root } from "@components";
import Spinner from "react-native-loading-spinner-overlay";
import Timeout from "./timeout";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  numberWithCommas,
  firstLetterCapital,
  PLAID_EXPENSE_CATEGORIES,
} from "../../../api/common";
import {
  getUserTransactions,
  getUser,
  fetchCurrentBalance,
  getUserOutFlowTransactions,
  getUserInflowTransactions,
} from "../../../api/api";
import { CustomTabs, TransactionComponentWithDate } from "@components";
import { Spinner as NativeBaseSpinner } from "native-base";
import { extendWith } from "lodash";
AntDesign.loadFont();
class TransactionScreen extends PureComponent {
  getInitialState = () => {
    return {
      spinner: true,
      accountType: "",
      all: {
        loader: true,
        transactionsRender: [],
        transactionsResponse: [],
      },
      outflow: {
        loader: true,
        transactionsRender: [],
        transactionsResponse: [],
      },
      inflow: {
        loader: true,
        transactionsRender: [],
        transactionsResponse: [],
      },
    };
  };
  resetAllDataMembers = () => {
    this.fetchTransactionPerScroll = 25;
    this.all = {
      skipPoint: 0,
      limitPoint: 25,
      process: true,
    };

    this.outflow = {
      skipPoint: 0,
      limitPoint: 25,
      process: true,
      onTimeRun: false,
    };

    this.inflow = {
      skipPoint: 0,
      limitPoint: 25,
      process: true,
      onTimeRun: false,
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      ...this.getInitialState(),
    };
    this.fetchTransactionPerScroll = 25;
    this.all = {
      skipPoint: 0,
      limitPoint: 25,
      process: true,
    };

    this.outflow = {
      skipPoint: 0,
      limitPoint: 25,
      process: true,
      onTimeRun: false,
    };

    this.inflow = {
      skipPoint: 0,
      limitPoint: 25,
      process: true,
      onTimeRun: false,
    };
    this.tabs = [
      {
        heading: "All",
        component: this.allTabNavigator,
      },
      {
        heading: "Outflow",
        component: this.outflowTabNavigator,
      },
      {
        heading: "Inflow",
        component: this.inflowTabNavigator,
      },
    ];
    // this.allRef = createRef();
    // this.updateAll = {
    //   skipPoint: this.all.skipPoint,
    //   limitPoint: this.all.limitPoint,
    // };
  }
  splitTransactions = (transactionsResponse) => {
    let allDatesArray = [];
    transactionsResponse.map((singleTransaction, index) => {
      allDatesArray.push(singleTransaction.date);
    });
    var uniqueDatesArray = [];
    for (i = 0; i < allDatesArray.length; i++) {
      if (uniqueDatesArray.indexOf(allDatesArray[i]) === -1) {
        uniqueDatesArray.push(allDatesArray[i]);
      }
    }
    let updatedTransactionsRender = [];
    uniqueDatesArray.map((singleUniqueDate, index) => {
      let obj = {};
      obj.id = index + 1;
      obj.date = singleUniqueDate;
      obj.transactions = transactionsResponse.filter((singleFilter, index) => {
        return singleFilter.date === singleUniqueDate;
      });
      updatedTransactionsRender.push(obj);
    });
    return updatedTransactionsRender;
  };
  transactionStore = async (requestType = false, transactionType = "All") => {
    try {
      if (transactionType === "All") {
        const {
          all: { transactionsResponse, transactionsRender, loader },
          accountType,
        } = this.state;
        let updatedAccountType = accountType;
        if (this.all.process) {
          let transactionAPIResponse = await getUserTransactions(
            this.all.skipPoint,
            this.all.limitPoint
          );
          if (requestType) {
            updatedAccountType = transactionAPIResponse.accountType;
          }
          this.all.skipPoint =
            this.all.skipPoint + this.fetchTransactionPerScroll;
          if (
            transactionAPIResponse.transactions.length === 0 ||
            transactionAPIResponse.transactions.length < 25
          ) {
            this.all.process = false;
            this.setState((prevState) => {
              return {
                all: {
                  ...prevState.all,
                  loader: false,
                },
              };
            });
          }
          if (transactionAPIResponse.transactions.length > 0) {
            const updatedTransactionsRender = this.splitTransactions([
              ...transactionsResponse,
              ...transactionAPIResponse.transactions,
            ]);

            this.setState((prevState) => {
              return {
                spinner: false,
                accountType: updatedAccountType,
                all: {
                  loader:
                    transactionAPIResponse.transactions.length < 25
                      ? false
                      : true,
                  transactionsRender: updatedTransactionsRender,
                  transactionsResponse: [
                    ...prevState.all.transactionsResponse,
                    ...transactionAPIResponse.transactions,
                  ],
                },
              };
            });
          }
        } else {
          this.setState((prevState) => {
            return {
              all: {
                ...prevState.all,
                loader: false,
              },
            };
          });
        }
      } else if (transactionType === "Outflow") {
        const {
          outflow: { transactionsResponse },
        } = this.state;
        if (this.outflow.process) {
          let transactionOutflowAPIResponse = await getUserOutFlowTransactions(
            this.outflow.skipPoint,
            this.outflow.limitPoint
          );
          this.outflow.skipPoint =
            this.outflow.skipPoint + this.fetchTransactionPerScroll;
          if (
            transactionOutflowAPIResponse.outflowTransactions.transactions
              .length === 0 ||
            transactionOutflowAPIResponse.outflowTransactions.transactions
              .length < 25
          ) {
            this.outflow.process = false;
            this.setState((prevState) => {
              return {
                outflow: {
                  ...prevState.outflow,
                  loader: false,
                },
              };
            });
          }
          if (
            transactionOutflowAPIResponse.outflowTransactions.transactions
              .length > 0
          ) {
            const updatedOutFlowTransactionsRender = this.splitTransactions([
              ...transactionsResponse,
              ...transactionOutflowAPIResponse.outflowTransactions.transactions,
            ]);

            this.setState((prevState) => {
              return {
                outflow: {
                  loader:
                    transactionOutflowAPIResponse.outflowTransactions
                      .transactions.length < 25
                      ? false
                      : true,
                  transactionsRender: updatedOutFlowTransactionsRender,
                  transactionsResponse: [
                    ...prevState.outflow.transactionsResponse,
                    ...transactionOutflowAPIResponse.outflowTransactions
                      .transactions,
                  ],
                },
              };
            });
          }
        }
      } else {
        const {
          inflow: { transactionsResponse },
        } = this.state;
        if (this.inflow.process) {
          let transactionInflowAPIResponse = await getUserInflowTransactions(
            this.inflow.skipPoint,
            this.inflow.limitPoint
          );
          this.inflow.skipPoint =
            this.inflow.skipPoint + this.fetchTransactionPerScroll;
          if (
            transactionInflowAPIResponse.inflowTransactions.transactions
              .length === 0 ||
            transactionInflowAPIResponse.inflowTransactions.transactions
              .length < 25
          ) {
            this.inflow.process = false;
            this.setState((prevState) => {
              return {
                inflow: {
                  ...prevState.inflow,
                  loader: false,
                },
              };
            });
          }
          if (
            transactionInflowAPIResponse.inflowTransactions.transactions
              .length > 0
          ) {
            const updatedInflowTransactionsRender = this.splitTransactions([
              ...transactionsResponse,
              ...transactionInflowAPIResponse.inflowTransactions.transactions,
            ]);

            this.setState((prevState) => {
              return {
                inflow: {
                  loader:
                    transactionInflowAPIResponse.inflowTransactions.transactions
                      .length < 25
                      ? false
                      : true,
                  transactionsRender: updatedInflowTransactionsRender,
                  transactionsResponse: [
                    ...prevState.inflow.transactionsResponse,
                    ...transactionInflowAPIResponse.inflowTransactions
                      .transactions,
                  ],
                },
              };
            });
          }
        }
      }
    } catch (error) {
      console.log("Error here - ", error);
      this.setState(
        {
          spinner: false,
          all: {
            ...this.state.all,
            loader: false,
          },
        },
        () => {
          setTimeout(() => {
            Alert.alert("Message", "Something went wrong", [
              {
                text: "Okay",
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ]);
          }, 100);
        }
      );
    }
  };
  readyTransactionScreen = async () => {
    const { userData } = this.props.reduxState.userData;
    if (userData.bankIntegrationStatus == true) {
      await this.transactionStore(true, "All");
    } else {
      this.setState({
        spinner: false,
      });
    }
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    this.readyTransactionScreen();
  }
  componentWillUnmount() {
    this.setState({
      isBodyLoaded: false,
      isUserLinkedWithBank: false,
      showTimeoutScreen: false,
    });
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
      ////console.log("Transaction")
      return true;
    }
  };
  renderHeader = ({ currentBalance }) => {
    return (
      <View style={styles.parentHeader}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <AntDesign name="left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.renderUpperHeader}>
          <Text style={styles.renderCurrentBalance}>{`$${numberWithCommas(
            currentBalance
          )}`}</Text>

          <View style={styles.renderAccountTypeStyle}>
            <Text style={styles.accountTypeTextStyle}>
              {firstLetterCapital(this.state.accountType)}
            </Text>
          </View>
        </View>
        <View style={styles.renderUpperHeader}>
          <Text style={styles.cashTextStyle}>CASH</Text>
        </View>
      </View>
    );
  };
  handleOnCategoryTapPress = (
    rootTransactionObj,
    transactionType 
  ) => { 
    const { cohReducer, userData: userDataMain } = this.props.reduxState;
    const { userData } = userDataMain;
    if (userData.bankStatus == "linked") {
      this.props.navigation.navigate("NCategoryScreen", {
        showEditTray: true,
        transactionType,
        currentExecutingTransaction: rootTransactionObj,
        resetTransactionScreen: (reciever1 = false, reciever2 = false) => {
          this.setState({ ...this.getInitialState() }, () => {
            this.resetAllDataMembers();
            setTimeout(() => {
              this.readyTransactionScreen();
            }, 1000);
          });
        },
      });
    } else {
      Alert.alert(
        "Bank Disconnected",
        `Your bank account has been disconnected. Please reconnect again.`,
        [
          { text: "Cancel" },
          {
            text: "Reconnect",
            onPress: () => {
              this.props.navigation.navigate("Integration");
            },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };
  allTabNavigator = () => {
    const {
      all: { transactionsRender, loader },
    } = this.state;

    return (
      <View style={styles.parentTabChild}>
        {transactionsRender.length === 0 && loader === true ? (
          <NativeBaseSpinner color={"#070640"} />
        ) : transactionsRender.length === 0 && loader === false ? (
          <View style={styles.noTransactionAvailableParent}>
            <AntDesign
              name="exclamationcircle"
              size={20}
              style={styles.noTransactionAntDesign}
            />
            <Text style={styles.noTransactionAvailableText}>
              Oops There are No Transactions!
            </Text>
          </View>
        ) : (
          <TransactionComponentWithDate
            onPress={this.handleOnCategoryTapPress}
            items={transactionsRender}
            transactionType={"ALL"}
            onEndReached={() => {
              this.transactionStore(false, "All");
            }}
            loader={loader ? <NativeBaseSpinner color="#070640" /> : null}
          />
        )}
      </View>
    );
  };
  outflowTabNavigator = () => {
    const {
      outflow: { transactionsRender, loader },
    } = this.state;

    return (
      <View style={styles.parentTabChild}>
        {transactionsRender.length === 0 && loader === true ? (
          <NativeBaseSpinner color={"#070640"} />
        ) : transactionsRender.length === 0 && loader === false ? (
          <View style={styles.noTransactionAvailableParent}>
            <AntDesign
              name="exclamationcircle"
              size={20}
              style={styles.noTransactionAntDesign}
            />
            <Text style={styles.noTransactionAvailableText}>
              Oops There are No Outflow Transactions!
            </Text>
          </View>
        ) : (
          <TransactionComponentWithDate
            onPress={this.handleOnCategoryTapPress}
            items={transactionsRender}
            transactionType={"OUTFLOW"}
            onEndReached={() => {
              this.transactionStore(false, "Outflow");
            }}
            loader={loader ? <NativeBaseSpinner color="#070640" /> : null}
          />
        )}
      </View>
    );
  };
  inflowTabNavigator = () => {
    const {
      inflow: { transactionsRender, loader },
    } = this.state;

    return (
      <View style={styles.parentTabChild}>
        {transactionsRender.length === 0 && loader === true ? (
          <NativeBaseSpinner color={"#070640"} />
        ) : transactionsRender.length === 0 && loader === false ? (
          <View style={styles.noTransactionAvailableParent}>
            <AntDesign
              name="exclamationcircle"
              size={20}
              style={styles.noTransactionAntDesign}
            />
            <Text style={styles.noTransactionAvailableText}>
              Oops There are No Inflow Transactions!
            </Text>
          </View>
        ) : (
          <TransactionComponentWithDate
            onPress={this.handleOnCategoryTapPress}
            items={transactionsRender}
            transactionType={"INFLOW"}
            onEndReached={() => {
              this.transactionStore(false, "Inflow");
            }}
            loader={loader ? <NativeBaseSpinner color="#070640" /> : null}
          />
        )}
      </View>
    );
  };
  onChangeTab = (param) => {
    if (param.i === 1) {
      if (!this.outflow.onTimeRun) {
        this.outflow.onTimeRun = true;
        this.transactionStore(false, "Outflow");
      }
    } else if (param.i === 2) {
      if (!this.inflow.onTimeRun) {
        this.inflow.onTimeRun = true;
        this.transactionStore(false, "Inflow");
      }
    }
  };
  renderTransactionScreen = ({ currentBalance }) => {
    return (
      <Fragment>
        <this.renderHeader currentBalance={currentBalance} />
        <View style={styles.tabContainerParent}>
          <CustomTabs
            locked={true}
            items={this.tabs}
            onChangeTab={this.onChangeTab}
          />

          {/* <View style={styles.tabRightStyle}>
            <Text>Hello World</Text>
          </View> */}
        </View>
      </Fragment>
    );
  };
  render() {
    let currentBalance = "";
    const { cohReducer, userData: userDataMain } = this.props.reduxState;
    const { userData } = userDataMain;
    const { bankIntegrationStatus = null } = userData;
    if (bankIntegrationStatus) {
      currentBalance = cohReducer?.cohData?.currentBalance;
    }
    const { spinner } = this.state;
    return (
      <Root headerColor={"#070640"} footerColor={"#FFF"} barStyle={"light"}>
        <Spinner visible={spinner} textStyle={styles.spinnerTextStyle} />
        <View style={styles.margins}>
          {spinner === false ? (
            bankIntegrationStatus != null && bankIntegrationStatus === true ? (
              <this.renderTransactionScreen currentBalance={currentBalance} />
            ) : (
              <Timeout
                navigation={this.props.navigation}
                reloadPlaid={() => {
                  if (this.props.navigation.getParam("reloadPlaid")) {
                    this.props.navigation.getParam("reloadPlaid")();
                  }
                }}
              />
            )
          ) : null}
        </View>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  parentHeader: {
    height: 132,
    width: "100%",
    backgroundColor: "#07053E",
  },
  backButtonContainer: {
    height: 40,
    maxWidth: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  renderUpperHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  renderCurrentBalance: {
    fontSize: 23,
    color: "#FFF",
    fontWeight: "bold",
    alignSelf: "center",
  },
  renderAccountTypeStyle: {
    alignSelf: "center",
    borderRadius: 100,
    paddingVertical: 8,
    marginTop: 7,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  accountTypeTextStyle: {
    fontSize: 13,
    color: "#07053E",
    paddingHorizontal: 15,
  },
  cashTextStyle: {
    fontSize: 13,
    color: "#FFF",
    marginTop: 6,
  },
  tabContainerParent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    width: "100%",
    alignSelf: "center",
    flex: 1,
    // borderWidth:1,
    // borderColor:'blue'
  },
  parentTabChild: {
    flex: 1,
    borderColor: "red",
    borderWidth: 0,
    marginTop: 30,
  },
  tabRightStyle: {
    zIndex: -10,
    height: 25,
    alignItems: "center",
    position: "absolute",
    flexDirection: "row-reverse",
    width: "100%",
  },
  noTransactionAvailableParent: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  noTransactionAvailableText: { marginLeft: 10, alignSelf: "center" },
  noTransactionAntDesign: { color: "#070640", alignSelf: "center" },
});
const mapStateToProps = (state) => {
  return {
    reduxState: state,
    categoryReduxData: state.plaidCategoryData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPlaidCategoryDispatch: () => {
      dispatch(triggerPlaidCategoryAsync());
    },
    fetchExpenseByCategory: (type = 1) => {
      dispatch(fetchExpensesAsyncCreator(type));
    },
    fetchMainExepenseByCategory: (type = 1) => {
      dispatch(fetchMainExpenseAsyncCreator(type));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionScreen);
