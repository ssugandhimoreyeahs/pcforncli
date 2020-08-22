import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BarGraph } from "./BarGraph";
import * as accounting from "accounting-js"; 
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { fetchArAsyncCreator } from "../../../reducers/incommingar";
import { numberWithCommas, isFloat } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as Width,
  heightPercentageToDP as Height,
} from "react-native-responsive-screen";

AntDesign.loadFont();
MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

class IncomingAR extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInsights: false,
    };
  }
  showAlert() {
    Alert.alert(
      "INCOMING A/R",
      "Accounts receivable (AR) is the balance of money due to a firm for goods or services delivered or used but not yet paid for by customers. Accounts receivables are listed on the balance sheet as a current asset. AR is any amount of money owed by customers for purchases made on credit.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );
  }
  noIncommingAr = React.memo(() => {
    return (
      <View style={styles.noIncommingArData}>
        <View style={styles.noIncommingArDataChildView}>
          <AntDesign
            name="exclamationcircle"
            size={20}
            style={{ color: "#070640", alignSelf: "center" }}
          />
          <Text style={{ marginLeft: 10, alignSelf: "center" }}>
            No Incomming AR Data Available!
          </Text>
        </View>
        {/* <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
              <TouchableOpacity onPress={()=>{ this.handleReloadIncomingAr(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                  <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Reload</Text></View>
              </TouchableOpacity>
           </View> */}
      </View>
    );
  });
  incommingArBody = ({ composeArData }) => {
    // let total = composeArData.overDue.total + composeArData.notYetDue.total;
    // total = parseFloat(total).toFixed(2);

    //testing manually

    // composeArData = {
    //   "notYetDue": {
    //     "1-30": "10.00",
    //     "31-60": "80.00",
    //     "60+": "10.00",
    //     "total": "100.00",
    //   },
    //   "overDue": {
    //     "1-30": "1000.02",
    //     "31-60": "5000.00",
    //     "61-90": "3000.00",
    //     "90+": "1000.50",
    //     "total": "10000.52",
    //   },
    //   "total": "1100.00",
    // }
    //testing ends here
    let finalTotal = numberWithCommas(
      isFloat(composeArData.total)
        ? composeArData.total.toFixed(2)
        : composeArData.total
    );
    let isAllZero =
      parseInt(composeArData.overDue.total) == 0 &&
      parseInt(composeArData.notYetDue.total) == 0 &&
      parseInt(composeArData.total) == 0;
    let overDueIsZero =
      parseInt(composeArData.overDue["1-30"]) == 0 &&
      parseInt(composeArData.overDue["31-60"]) == 0 &&
      parseInt(composeArData.overDue["61-90"]) == 0 &&
      parseInt(composeArData.overDue["90+"]) == 0;
    let notYetDueIsZero =
      parseInt(composeArData.notYetDue["1-30"]) == 0 &&
      parseInt(composeArData.notYetDue["31-60"]) == 0 &&
      parseInt(composeArData.notYetDue["60+"]) == 0;
    console.log("overDueIsZero = ", overDueIsZero);
    console.log("notYetDueIsZero = ", notYetDueIsZero);

    return (
      <Fragment>
        {isAllZero == true ? (
          <this.noIncommingAr />
        ) : (
          <Fragment>
            <View style={styles.heading}>
              <TouchableOpacity onPress={this.showAlert}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={[styles.titleText, styles.text]}>
                    INCOMING A/R
                  </Text>
                  <Ionicons
                    name="md-information-circle-outline"
                    style={{ height: 12, width: 12, margin: 2 }}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text style={styles.moneyTotal}>{`$${finalTotal}`}</Text>
                <Text style={[styles.text, styles.total]}>Total</Text>
              </View>
            </View>
            <View style={styles.data}>
              <View>
                <Text style={[styles.label, { marginTop: 28 }]}>Overdue</Text>
                {overDueIsZero == false ? (
                  <BarGraph
                    style={styles.barChart}
                    data={[
                      parseInt(composeArData.overDue["1-30"]),
                      parseInt(composeArData.overDue["31-60"]),
                      parseInt(composeArData.overDue["61-90"]),
                      parseInt(composeArData.overDue["90+"]),
                    ]}
                    //data={[10,20,30]}
                    legend={["20-40", "50-60", "70-80"]}
                    barColors={["#E84500", "#FF7B32", "#FF9E6C", "#FFC0A0"]}
                    width={215}
                    height={8}
                    barWidth={8}
                    backgroundGradientFrom={"#ffffff"}
                    backgroundGradientTo={"#ffffff"}
                    backgroundColor={"#ffffff"}
                    chartColor={"#000000"}
                  />
                ) : null}
                <Text style={[styles.label, { marginTop: 26 }]}>
                  Not yet due
                </Text>
                {notYetDueIsZero == false ? (
                  <BarGraph
                    style={styles.barChart}
                    data={[10, 20, 30]}
                    data={[
                      parseInt(composeArData.notYetDue["1-30"]),
                      parseInt(composeArData.notYetDue["31-60"]),
                      parseInt(composeArData.notYetDue["60+"]),
                    ]}
                    barColors={["#137BC8", "#5DBAFF", "#B0DDFF"]}
                    width={150}
                    height={8}
                    barWidth={8}
                    backgroundGradientFrom={"#ffffff"}
                    backgroundGradientTo={"#ffffff"}
                    backgroundColor={"#ffffff"}
                    chartColor={"#000000"}
                  />
                ) : null}
              </View>
              <View style={{ marginTop: 44, width: 95 }}>
                <Text style={[styles.currency]}>
                  {parseInt(composeArData.overDue.total) == 0
                    ? `$0`
                    : `$${numberWithCommas(composeArData.overDue.total)}`}
                </Text>
                <Text style={[styles.currency, { marginTop: 40 }]}>
                  {parseInt(composeArData.notYetDue.total) == 0
                    ? `$0`
                    : `$${numberWithCommas(composeArData.notYetDue.total)}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "40%",
                height: 60,
                marginTop: "20%",
                alignSelf: "flex-end",
              }}
            >
              <Button
                title="View Insights"
                type="solid"
                buttonStyle={styles.btnstyle1}
                titleStyle={styles.buttontextt1}
                onPress={() => {
                  //this.props.navigation.navigate("IncomingARInsights")
                  Alert.alert(
                    "Coming soon",
                    "We are building your personalized Pocket Insights. We will notify you when they are ready.",
                    [{ text: "Okay" }],
                    false
                  );
                }}
              />
            </View>

            {this.state.showInsights == true ? (
              <this.arInsightFooter
                backgroundColor={"#E5FCEA"}
                insightText={
                  "Your cash balance has increased from last months cash balance."
                }
                insightButtonText={"Keep on improving"}
              />
            ) : null}
          </Fragment>
        )}
      </Fragment>
    );
  };

  handleReloadIncomingAr = () => {
    this.props.fetchIncommingAr();
  };
  arInsightFooter = React.memo(
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
  incommingArError = React.memo(() => {
    return (
      <View style={{ ...styles.margins, justifyContent: "center" }}>
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
              this.handleReloadIncomingAr();
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
              <Text style={{ color: "white", paddingLeft: 5 }}>Try Again</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  render() {
    let composeArData = {};
    let {
      arData,
      isFetched,
      masterLoader,
      error,
    } = this.props.incommingArRedux;
    if (isFetched == true) {
      let { overDue, notYetDue, total } = arData;
      composeArData = { ...composeArData, overDue, notYetDue, total };
    }

    let height = this.state.showInsights ? 400 : 300;
    //error = true;
    return (
      <Fragment>
        {error == true ? (
          <this.incommingArError />
        ) : isFetched == true && masterLoader == false ? (
          <View style={{ ...styles.margins, height }}>
            <this.incommingArBody composeArData={composeArData} />
          </View>
        ) : (
          <View style={{ ...styles.margins, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#070640" />
          </View>
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: "white",
    marginTop: 8,
    marginBottom: 20,
    height: 300,
    width: "95%",
    alignSelf: "center",
    elevation: 10,
    shadowColor: "#000",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.07,
    lineHeight: 13,
    marginBottom: 13,
    color: "#151927",
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 101,
    width: "100%",
  },
  currency: {
    color: "#151927",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "right",
    letterSpacing: -0.24,
    color: "#151927",
  },
  text: {
    color: "#1D1E1F",
    fontSize: 12,
    lineHeight: 16,
  },
  titleText: {
    width: 90,
  },
  moneyTotal: {
    fontWeight: "bold",
    color: "#1D1E1F",
    fontSize: 22,
    letterSpacing: 0.32,
    lineHeight: 26,
    height: 26,
  },
  total: {
    textAlign: "right",
    marginTop: 4,
  },
  barChart: {
    borderRadius: 16,
    backgroundColor: "white",
  },
  buttonview: {
    height: 32,
    width: "90%",
    marginTop: "10%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  btnstyle1: {
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#85B1FF",
  },
  buttontextt1: {
    fontSize: 11,
  },
  noIncommingArData: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  noIncommingArDataChildView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  insightCartBody: {
    borderRadius: 6,
    marginTop: -5,
    backgroundColor: "#FFE8DD",
    width: "100%",
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
});

const mapStateToProps = (state) => {
  return {
    incommingArRedux: state.incommingArRedux,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchIncommingAr: () => {
      dispatch(fetchArAsyncCreator());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IncomingAR);
