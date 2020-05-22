import React, { Component } from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-elements";
import SliderField from "../../controls/SliderField";
import Moment from "moment";
import BottomNavLayout from "../../controls/bottom-nav-layout";
import { getHealthScoreColor } from "../../utilities/gradient";
import { getOutOfCashDate } from "../../utilities/cash";
import { fetchForecastAsyncCreator } from "../../reducers/forecast";
//import { MaterialCommunityIcons,AntDesign } from "@expo/vector-icons";

import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import { getForecastData } from "../../api/api";
import { getFormatedDate } from "../../api/common";
import { getUpdatedForecast } from "../../utilities/forecast";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

MaterialCommunityIcons.loadFont();
AntDesign.loadFont();

class Forecasting extends Component {
  constructor(props) {
    super(props);
    Moment.locale("en");

    this.cohRef = React.createRef();
    this.expenseRef = React.createRef();
    this.salesRef = React.createRef();

    this.state = {
      cash: 0,
      expenses: 0,
      sales: 0,
      oocLabel: ``,
      isBodyLoaded: false,
      isError: false,
      isSpinner: true,
      forecastResponse: {},
      isPositiveCashFlow: false,
      isCommingPositiveCashFlow: false,
      showReset: false,
      isPositiveCashComeFromApi: false,
    };
  }

  loadForecastData = () => {
    getForecastData()
      .then((forecastRes) => {
        if (forecastRes.result == true) {
          let { forecastResponse } = forecastRes;
          console.log(
            "getting forecast response here ------ ",
            forecastResponse
          );
          let isCommingPositiveCashFlow = false;
          let isPositiveCashComeFromApi = false;
          //forecastResponse.outOfCashDate = "Positive Cash Flow";

          if (forecastResponse.outOfCashDate == "Positive Cash Flow") {
            isCommingPositiveCashFlow = true;
            isPositiveCashComeFromApi = true;
          }
          this.setState(
            {
              isPositiveCashComeFromApi,
              forecastResponse,
              cash: forecastResponse.cashOnHand,
              expenses: Math.abs(forecastResponse.expense),
              sales: Math.abs(forecastResponse.sales),
              oocLabel: forecastResponse.outOfCashDate,
              isCommingPositiveCashFlow,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  isSpinner: false,
                  isError: false,
                  isBodyLoaded: true,
                });
              }, 100);
            }
          );
        } else {
          this.setState({
            isSpinner: false,
            isError: true,
            isBodyLoaded: false,
          });
        }
      })
      .catch((forecastResponseError) => {
        this.setState({ isSpinner: false, isError: true, isBodyLoaded: false });
      });
  };
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    const { userData } = this.props.userData;
    if (userData.bankIntegrationStatus == true) {
      this.loadForecastData();
    } else {
      this.setState({ isSpinner: false });
    }
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
      Alert.alert(
        "Exit App",
        "Do you want to Exit..",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Exit",
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

  getUpdatedForecastLocal(oocLabel, cash, expenses, sales, isPositive) {
    if (this.state.showReset != true) {
      this.setState({ showReset: true });
    }
    let responseData = getUpdatedForecast(
      oocLabel,
      cash,
      expenses,
      sales,
      this.state.forecastResponse.cashOnHand,
      this.state.forecastResponse.outOfCashDate,
      this.state.isCommingPositiveCashFlow
    );
    if (this.state.isCommingPositiveCashFlow == true) {
      let forecastResponse = this.state.forecastResponse;
      forecastResponse.outOfCashDate = Moment(new Date()).format("YYYY-MM-DD");
      this.setState({ forecastResponse });
    }

    if (responseData.updatedOutofCashDate == "Positive Cash Flow") {
      this.setState({ isPositiveCashFlow: true });
      return this.state.forecastResponse.outOfCashDate;
    } else {
      this.setState({
        isPositiveCashFlow: false,
        isCommingPositiveCashFlow: false,
      });
      return responseData.updatedOutofCashDate;
    }
  }
  getOutOfCashDateLabel(cash, expenses, sales) {
    const rate = sales - expenses;
    if (rate === 0) {
      return "Cash Flow Neutral";
    } else if (rate > 0) {
      return "Cash Flow Positive";
    } else {
      const ooc = getOutOfCashDate(cash, expenses, sales);
      return ooc.format("MMM D, YYYY");
    }
  }

  getRunwayColor(cash, expenses, sales) {
    // const oocDate = getOutOfCashDate(cash, expenses, sales);
    // const oocMonths = oocDate.diff(Moment(), "months", true);
    // return getHealthScoreColor(oocMonths, true);
    //console.log("test color - ",this.state.oocLabel," + ",this.state.forecastResponse.outOfCashDate);
    if (
      this.state.isPositiveCashFlow == true ||
      this.state.isCommingPositiveCashFlow == true
    ) {
      // console.log("getting the postive cash flow from the api end point");
      return `#47C4D3`;
    } else if (
      this.state.oocLabel == this.state.forecastResponse.outOfCashDate
    ) {
      return `#47C4D3`;
    } else {
      if (
        new Date(this.state.forecastResponse.outOfCashDate).getTime() <
        new Date(this.state.oocLabel).getTime()
      ) {
        return `#47C4D3`;
      } else {
        return `#FF5E3A`;
      }
    }
  }
  handleReloadForecast = () => {
    this.setState({ isSpinner: true, isBodyLoaded: false, isError: false });

    this.loadForecastData();
  };

  handleResetForecast = () => {
    console.log("Parent method successfuly trigger here ");
    let forecastResponse = {};
    this.setState(
      (prevState) => {
        forecastResponse = prevState.forecastResponse;
        return {
          cash: forecastResponse.cashOnHand,
          expenses: Math.abs(forecastResponse.expense),
          sales: Math.abs(forecastResponse.sales),
          oocLabel: forecastResponse.outOfCashDate,
          showReset: false,
          isPositiveCashFlow: false,
          isCommingPositiveCashFlow: prevState.isPositiveCashComeFromApi,
        };
      },
      () => {
        // this.setState({ showReset: false });
        // if(this.state.isPositiveCashFlow == true){
        //   this.setState({ isPositiveCashFlow: false });
        // }
        this.cohRef.current.methodToBeRunAfterReset(
          forecastResponse.cashOnHand
        );
        this.expenseRef.current.methodToBeRunAfterReset(
          Math.abs(forecastResponse.expense)
        );
        this.salesRef.current.methodToBeRunAfterReset(
          Math.abs(forecastResponse.sales)
        );
      }
    );

    console.log("Parent method successfully ends here ---");
  };
  render() {
    let { isBodyLoaded, isError, isSpinner } = this.state;
    let { userData } = this.props.userData;
    // isBodyLoaded = false;
    // isError = true;
    return (
      <BottomNavLayout navigation={this.props.navigation}>
        {isSpinner == true ? (
          <View>
            <Spinner visible={this.state.isSpinner} />
          </View>
        ) : userData.bankIntegrationStatus == false ? (
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "60%",
                height: 300,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="exclamationcircle"
                  size={20}
                  style={{ color: "#070640", alignSelf: "center" }}
                />
                <Text style={{ marginLeft: 10, alignSelf: "center" }}>
                  You are not connected to Bank!
                </Text>
              </View>
              {/* <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
                <TouchableOpacity onPress={()=>{ this.handleReloadForecast(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Reload</Text></View>
                </TouchableOpacity>
            </View> */}
            </View>
          </View>
        ) : isBodyLoaded == true ? (
          <View style={styles.container}>
            <View
              style={{
                backgroundColor: this.getRunwayColor(
                  this.state.cash,
                  this.state.expenses,
                  this.state.sales
                ),
                height: 156,
                width: "100%",
                padding: 30,
              }}
            >
              <Text style={styles.headerLabel}>Out-of-Cash Date</Text>
              <Text style={styles.headerValue}>
                {this.state.isCommingPositiveCashFlow == true
                  ? `Positive Cash Flow`
                  : this.state.isPositiveCashFlow == true
                  ? `Positive Cash Flow`
                  : getFormatedDate(this.state.oocLabel)}
              </Text>
            </View>
            <View
              style={{
                height: 471,
                width: "90%",
                marginTop: -20,
                marginBottom: 35,
                alignSelf: "center",
              }}
            >
              <SliderField
                ref={this.cohRef}
                resetForecast={() => {
                  this.handleResetForecast();
                }}
                isShowReset={this.state.showReset}
                label="Cash on Hand"
                min={0}
                max={this.state.cash * 2}
                value={this.state.cash}
                valuePrefix="$"
                steps={100}
                trackTint={"#1B238E"}
                onChange={(value) => {
                  let isPositive = value > this.state.cash ? true : false;
                  this.setState({
                    cash: value,
                    oocLabel: this.getUpdatedForecastLocal(
                      this.state.oocLabel,
                      value,
                      this.state.expenses,
                      this.state.sales,
                      isPositive
                    ),
                  });
                }}
              />
              <SliderField
                ref={this.expenseRef}
                label="Average Monthly Expenses"
                min={0}
                max={this.state.expenses * 2}
                value={this.state.expenses}
                valuePrefix={this.state.expenses > 0 ? "-$" : "$"}
                steps={100}
                trackTint={"#A30014"}
                onChange={(value) =>
                  this.setState({
                    expenses: value,
                    oocLabel: this.getUpdatedForecastLocal(
                      this.state.oocLabel,
                      this.state.cash,
                      value,
                      this.state.sales
                    ),
                  })
                }
              />
              <SliderField
                ref={this.salesRef}
                label="Average Monthly Sales"
                min={0}
                max={this.state.sales * 2}
                value={this.state.sales}
                valuePrefix="$"
                steps={100}
                trackTint={"#1B238E"}
                onChange={(value) =>
                  this.setState({
                    sales: value,
                    oocLabel: this.getUpdatedForecastLocal(
                      this.state.oocLabel,
                      this.state.cash,
                      this.state.expenses,
                      value
                    ),
                  })
                }
              />
            </View>
          </View>
        ) : isError == true ? (
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "60%",
                height: 300,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="exclamationcircle"
                  size={20}
                  style={{ color: "#070640", alignSelf: "center" }}
                />
                <Text style={{ marginLeft: 10, alignSelf: "center" }}>
                  Error Try Again!
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.handleReloadForecast();
                  }}
                  style={{
                    height: 35,
                    width: 170,
                    borderRadius: 20,
                    backgroundColor: "#090643",
                    borderColor: "#090643",
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{ marginTop: 4 }}
                      name="reload"
                      size={20}
                      color="white"
                    />
                    <Text style={{ color: "white", paddingLeft: 5 }}>
                      Reload
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </BottomNavLayout>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
  },
  buttonContainer: {
    marginTop: 75,
  },
  card: {
    padding: 30,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 48,
    marginTop: 50,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.15,
    width: 96,
    height: 96,
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f3f5",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    width: "72%",
    flexDirection: "column",
    paddingTop: "5%",
  },
  detailsRow: {
    flexDirection: "row",
    paddingTop: "10%",
  },
  detailsText: {
    fontSize: 15,
    width: "50%",
  },
  detailsInputContainer: {
    borderBottomColor: "blue",
    borderBottomWidth: 1,
  },
  dropdown: {
    width: "50%",
    marginTop: "-15%",
  },
  inputContainer: {
    alignSelf: "center",
    borderBottomColor: "blue",
    width: "75%",
  },
  input: {
    textAlign: "center",
  },
  flexCol: {
    flexDirection: "column",
  },
  flexRow: {
    flexDirection: "row",
  },
  headerLabel: {
    color: "#FFF",
  },
  headerValue: {
    color: "#FFF",
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  icon: {
    marginTop: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    forecastReducer: state.forecastReducer,
    userData: state.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchForecast: () => {
      dispatch(fetchForecastAsyncCreator());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forecasting);
