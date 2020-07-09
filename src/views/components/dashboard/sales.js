import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Moment from "moment";
import SalesChart from "../charts/salesChart";
// import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import { Dropdown } from "react-native-material-dropdown";
import { Button_Months } from "../../../constants/constants";
import { Button } from "react-native-elements";
import { numberWithCommas } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { connect } from "react-redux";
import { salesAsyncCreator } from "../../../reducers/sales";

SimpleLineIcons.loadFont();
//MaterialCommunityIcons.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      months: "3 Months",
      arrowStyle: "arrow-down",
      showInsightCart: false,
    };
    this.dropdownRef = React.createRef();
  }
  static getDerivedStateFromProps(props, state) {
    //code here
    const { salesCurrentRange } = props.salesRedux;

    let renderButton;
    if (salesCurrentRange == 1) {
      renderButton = "This Month";
    } else if (salesCurrentRange == 3) {
      renderButton = "3 Months";
    } else if (salesCurrentRange == 6) {
      renderButton = "6 Months";
    } else {
      renderButton = "12 Months";
    }
    return { months: renderButton };
  }
  showAlert = () => {
    Alert.alert(
      "Sales",
      "Revenue is the income generated from normal business operations and includes discounts and deductions for returned product or services. It is the top line or gross income figure from which costs are subtracted to determine net income.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );
  };
  handleArrowStyle = () => {
    if (this.state.arrowStyle == "arrow-down") {
      this.setState({ arrowStyle: "arrow-up" });
    } else {
      this.setState({ arrowStyle: "arrow-down" });
    }
  };
  handleSalesChangeRequest = (salesMonthIncomming) => {
    const { months: currentSalesMonth } = this.state;
    if (currentSalesMonth != salesMonthIncomming) {
      this.setState({ months: salesMonthIncomming });
      if (salesMonthIncomming == "This Month") {
        this.props.fetchSalesMultiple(1);
      } else if (salesMonthIncomming == "3 Months") {
        this.props.fetchSalesMultiple(3);
      } else if (salesMonthIncomming == "6 Months") {
        this.props.fetchSalesMultiple(6);
      } else {
        this.props.fetchSalesMultiple(12);
      }
    }
  };
  handleErrorReloadSales = () => {
    const { months: salesMonthIncomming } = this.state;
    if (salesMonthIncomming == "This Month") {
      this.props.fetchSalesMultiple(1);
    } else if (salesMonthIncomming == "3 Months") {
      this.props.fetchSalesMultiple(3);
    } else if (salesMonthIncomming == "6 Months") {
      this.props.fetchSalesMultiple(6);
    } else {
      this.props.fetchSalesMultiple(12);
    }
  };
  salesMasterLoader = React.memo(() => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator size="large" color="#070640" />
      </View>
    );
  });
  salesErrorView = React.memo(() => {
    return (
      <View style={{ width: "100%", justifyContent: "center" }}>
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
            Something went wrong!
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
              this.handleErrorReloadSales();
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
              <SimpleLineIcons
                style={{ marginTop: 4 }}
                name="reload"
                size={18}
                color="white"
              />
              <Text style={{ color: "white", paddingLeft: 5 }}>Try Again</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  salesChildLoader = React.memo(({ height }) => {
    return (
      <View style={{ height, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#070640" />
      </View>
    );
  });
  salesGraphEmpty = React.memo(({ height }) => {
    return (
      <View
        style={{
          height,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <AntDesign
          name="exclamationcircle"
          size={20}
          style={{ color: "#070640", alignSelf: "center" }}
        />
        <Text style={{ marginLeft: 10, alignSelf: "center" }}>
          You have no sales data this month.
        </Text>
      </View>
    );
  });
  salesInsightFooter = React.memo(
    ({ insightText, insightButtonText, backgroundColor }) => {
      return (
        <View style={{ ...styles.insightCartBody, backgroundColor }}>
          <Text style={styles.insightCartBodyText}>{insightText} </Text>

          <TouchableOpacity style={styles.insightCartBodyGotoButton}>
            <Text style={styles.insightCartBodyGotoButtonText}>
              {insightButtonText}
            </Text>
            <AntDesign
              name="right"
              style={styles.insightCartBodyGotoButtonIcon}
              size={14}
              color={"#000000"}
            />
          </TouchableOpacity>
        </View>
      );
    }
  );

  salesMainBody = React.memo(
    ({
      totalSalesAmount,
      salesCurrentRange,
      heightRatio,
      isSalesGraphEmpty,
      salesData,
    }) => {
      return (
        <View style={{ height: heightRatio }}>
          <View style={styles.heading}>
            <TouchableOpacity onPress={this.showAlert}>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 12 }}>SALES</Text>
                <Ionicons
                  name="md-information-circle-outline"
                  style={{ height: 12, width: 12, margin: 2 }}
                />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                {`$${numberWithCommas(totalSalesAmount)}`}
              </Text>
              <Text
                style={{
                  color: "#1D1E1F",
                  fontSize: 12,
                  textAlign: "right",
                  marginRight: 5,
                  marginTop: 8,
                }}
              >{` ${this.state.months} Total`}</Text>
            </View>
          </View>
          {isSalesGraphEmpty == true ? (
            <this.salesGraphEmpty height={heightRatio} />
          ) : (
            <View
              style={{ marginTop: "-10%", marginLeft: "-8%" }}
              accessible={true}
              pointerEvents="none"
            >
              <SalesChart
                salesCurrentRange={salesCurrentRange}
                salesData={salesData}
              />
            </View>
          )}
        </View>
      );
    }
  );
  salesBody = React.memo(
    ({
      salesData,
      childLoader,
      salesCurrentRange,
      heightRatio,
      totalSalesAmount,
      isSalesGraphEmpty,
    }) => {
      return (
        <View style={{ paddingVertical: 20 }}>
          {childLoader == true ? (
            <this.salesChildLoader height={heightRatio} />
          ) : (
            <this.salesMainBody
              heightRatio={heightRatio}
              isSalesGraphEmpty={isSalesGraphEmpty}
              salesData={salesData}
              salesCurrentRange={salesCurrentRange}
              totalSalesAmount={totalSalesAmount}
            />
          )}
          <View style={styles.buttonview}>
            <TouchableOpacity
              style={styles.Toucha}
              onPress={() => {
                this.dropdownRef.current.focus();
              }}
            >
              <Dropdown
                ref={this.dropdownRef}
                data={Button_Months}
                onChangeText={(month) => {
                  this.handleSalesChangeRequest(month);
                }}
                value={this.state.months}
                containerStyle={styles.dropdown}
                renderAccessory={() => null}
                pickerStyle={{ backgroundColor: "#E6E6EC", borderRadius: 10 }}
                onBlur={() => {
                  this.handleArrowStyle();
                  Keyboard.dismiss();
                }}
                onFocus={() => {
                  this.handleArrowStyle();
                  Keyboard.dismiss();
                }}
                inputContainerStyle={styles.detailsInputContainer}
                dropdownPosition={4.5}
                fontSize={11}
              />
              <SimpleLineIcons
                name={this.state.arrowStyle}
                color="#030538"
                style={{ marginTop: 10, marginRight: 20 }}
              />
            </TouchableOpacity>
            <View style={{ width: "40%", height: "100%" }}>
              <Button
                title="View Insights"
                type="solid"
                buttonStyle={styles.btnstyle1}
                titleStyle={styles.buttontextt1}
                onPress={() => {
                  Alert.alert(
                    "Coming soon",
                    "We are building your personalized Pocket Insights. We will notify you when they are ready.",
                    [{ text: "Okay" }],
                    false
                  );
                }}
              />
            </View>
          </View>

          {this.state.showInsightCart ? (
            <this.salesInsightFooter
              backgroundColor={"#E5FCEA"}
              insightText={
                "Your cash balance has increased from last months cash balance."
              }
              insightButtonText={"Keep on improving"}
            />
          ) : null}
        </View>
      );
    }
  );
  render() {
    const { showInsightCart } = this.state;
    const height = showInsightCart ? 455 : 355;
    const heightRatio = showInsightCart ? "66%" : "89%";
    let isSalesGraphEmpty = true;
    let {
      error,
      salesData: reduxObj,
      isFetched,
      masterLoader,
      childLoader,
      salesCurrentRange,
    } = this.props.salesRedux;
    let totalSalesAmount = 0;
    let salesData = [];
    if (isFetched == true) {
      totalSalesAmount = reduxObj.finalAmount;
      salesData = reduxObj.datamonth;
      for (let i = 0; i < salesData.length; i++) {
        if (salesData[i].amount != 0 && salesData[i].amount > 0) {
          isSalesGraphEmpty = false;
          break;
        }
      }
    }
    //childLoader = true;
    //isSalesGraphEmpty = true;
    //masterLoader = true;
    //error = true;

    return (
      <View style={{ height, ...styles.salesContainer }}>
        {masterLoader == true ? (
          <this.salesMasterLoader />
        ) : error == true ? (
          <this.salesErrorView />
        ) : (
          <this.salesBody
            childLoader={childLoader}
            heightRatio={heightRatio}
            totalSalesAmount={totalSalesAmount}
            isSalesGraphEmpty={isSalesGraphEmpty}
            salesCurrentRange={salesCurrentRange}
            salesData={salesData}
          />
        )}
      </View>
    );
  }
}

const styles = {
  salesContainer: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#FFF",
    elevation: 10,
    shadowColor: "#000",
    marginVertical: 8,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  buttonview: {
    paddingHorizontal: 15,
    width: "100%",
    height: 33,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Toucha: {
    width: "40%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#E6E6EC",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dropdown: {
    width: "71%",
    marginLeft: 22,
    marginTop: -25,
    borderBottomColor: "#FFF",
    borderBottomWidth: 0,
  },
  btnstyle1: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#85B1FF",
  },

  buttontextt1: {
    fontSize: 11,
  },
  detailsInputContainer: {
    borderBottomWidth: 0,
  },
  iconsty: {
    height: 12,
    width: 12,
    margin: 6,
  },
  insightCartBody: {
    borderRadius: 6,
    marginTop: 16,
    backgroundColor: "#FFE8DD",
    width: "91%",
    alignSelf: "center",
    padding: 16,
  },
  insightCartBodyText: {
    fontSize: 13,
    color: "#1D1E1F",
    fontWeight: "500",
  },
  insightCartBodyGotoButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: 12,
  },
  insightCartBodyGotoButtonText: {
    alignSelf: "center",
    fontSize: 13,
    color: "#1D1E1F",
    fontWeight: "500",
  },
  insightCartBodyGotoButtonIcon: {
    marginLeft: 3,
    marginTop: 3,
  },
};

const mapStateToProps = (state) => {
  return {
    salesRedux: state.salesReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSalesMultiple: (salesCurrentRange) => {
      dispatch(salesAsyncCreator(salesCurrentRange));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sales);
