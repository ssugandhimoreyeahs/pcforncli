import React, { Component, PureComponent, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
  StyleSheet,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Moment, { months } from "moment";
import { getHealthScoreColor } from "../../../utilities/gradient";
import { getOutOfCashDate } from "../../../utilities/cash";
import CashOnHandChart from "../charts/cashOnHandChart";
// import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Dropdown } from "react-native-material-dropdown";
import { Button_Months } from "../../../constants/constants";
import { Button } from "react-native-elements";
import { numberWithCommas } from "../../../api/common";
import { TERMINOLOGY, INSIGHTS } from "../../../api/message";
import { connect } from "react-redux";
import { cohAsyncCreator } from "../../../reducers/cashonhand";
import {
  heightPercentageToDP as Height,
  widthPercentageToDP as Width,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

AntDesign.loadFont();
Ionicons.loadFont();
SimpleLineIcons.loadFont();

class CashOnHand extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arrowStyle: "arrow-down",
      //showInsightsCart: true,
    };
    this.dropdownRef = React.createRef();
  }

  getRunwayColor(cash, expenses, sales) {
    const oocDate = getOutOfCashDate(cash, expenses, sales);
    const oocMonths = oocDate.diff(Moment(), "months", true);
    return getHealthScoreColor(oocMonths, true);
  }

  showAlert1() {
    Alert.alert(
      TERMINOLOGY.OUTOFCASHDATE.title,
      TERMINOLOGY.OUTOFCASHDATE.message,
      [
        {
          text: TERMINOLOGY.OUTOFCASHDATE.button1,
          style: "cancel",
        },
      ]
    );
  }

  showAlert2() {
    Alert.alert(TERMINOLOGY.CASHONHAND.title, TERMINOLOGY.CASHONHAND.message, [
      {
        text: TERMINOLOGY.CASHONHAND.button1,
        style: "cancel",
      },
    ]);
  }
  handleArrowStyle = () => {
    if (this.state.arrowStyle == "arrow-down") {
      this.setState({ arrowStyle: "arrow-up" });
    } else {
      this.setState({ arrowStyle: "arrow-down" });
    }
  };
  triggerCohRequest = (userRequest) => {
    const { cohCurrentRange } = this.props.cashOnHandRedux;
    let monthRequestType =
      userRequest == "This Month"
        ? 1
        : userRequest == "3 Months"
        ? 3
        : userRequest == "6 Months"
        ? 6
        : 12;
    if (monthRequestType != cohCurrentRange) {
      this.props.triggerCohRequestApi(monthRequestType);
    }
  };
  renderOutOfCashDate = React.memo(({ outOfCashDate }) => {
    return (
      <View
        style={{
          backgroundColor: this.getRunwayColor(0, 0, 0),
          ...styles.outOfCashDateDateStyle,
        }}
      >
        <TouchableOpacity onPress={this.showAlert1}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#FFF" }}>
              Out-of-Cash Date
            </Text>
            <Ionicons
              name="md-information-circle-outline"
              style={{ height: 12, width: 12, margin: 4, color: "#fff" }}
            />
          </View>
        </TouchableOpacity>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#FFF" }}>
          {`${outOfCashDate}`}
        </Text>
      </View>
    );
  });
  childLoader = React.memo(({ height }) => {
    return (
      <View style={{ height, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#070640" />
      </View>
    );
  });
  parentLoaderRender = React.memo(({ height }) => {
    return (
      <View style={{ height, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#070640" />
      </View>
    );
  });
  cashOnHandBody = React.memo(
    ({ height, cashOnHandGraphData, past, future, currentBalance }) => {
      return (
        <View style={{ height }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignSelf: "center",
              width: "90%",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={this.showAlert2}
            >
              <Text
                style={{ fontWeight: "500", fontSize: 13, color: "#1D1E1F" }}
              >{`CASH ON HAND`}</Text>
              <Ionicons
                name="md-information-circle-outline"
                style={{ height: 12, width: 12, marginLeft: 3, marginTop: 2 }}
              />
            </TouchableOpacity>

            <View>
              <Text
                style={{ fontSize: 22, color: "#1D1E1F", fontWeight: "700" }}
              >{`$${numberWithCommas(currentBalance) || 0.0}`}</Text>
              {/* <Text style={{ marginTop:7,fontSize:12,color:"#1D1E1F",textAlign:"right" }}>{`7 minutes ago`}</Text> */}
            </View>
          </View>

          <View
            style={{
              marginTop: "-4.9%",
              marginLeft: "-6.5%",
              borderColor: "red",
              borderWidth: 0,
            }}
            accessible={true}
            pointerEvents="none"
          >
            <CashOnHandChart
              cashOnHandGraphData={cashOnHandGraphData}
              cohPast={past}
              cohFuture={future}
            />
          </View>
        </View>
      );
    }
  );

  cashOnHandFooter = React.memo(({ btnText, arrowStyle }) => {
    const { showInsightsCart } = this.state;
    return (
      <Fragment>
        <View style={styles.cashOnHandFooter}>
          <View style={{ ...styles.buttonview }}>
            <TouchableOpacity
              style={styles.Toucha}
              onPress={() => {
                this.dropdownRef.current.focus();
              }}
            >
              <Dropdown
                ref={this.dropdownRef}
                //disabled={this.props.isEnableDropDownForSwitchingGraph}
                disabled={false}
                data={Button_Months}
                onChangeText={this.triggerCohRequest}
                value={btnText}
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
                fontSize={11}
                inputContainerStyle={styles.detailsInputContainer}
                dropdownPosition={4.5}
              />
              <SimpleLineIcons
                name={arrowStyle}
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
                    INSIGHTS.title,
                    INSIGHTS.message,
                    [{ text: INSIGHTS.button1 }],
                    false
                  );
                }}
              />
            </View>
          </View>
        </View>

        {showInsightsCart ? (
          <View style={styles.insightCartBody}>
            <Text style={styles.insightCartBodyText}>
              Your cash balance has decreased more than 50% from last month.
            </Text>

            <TouchableOpacity style={styles.insightCartBodyGotoButton}>
              <Text style={styles.insightCartBodyGotoButtonText}>
                How to improve
              </Text>
              <AntDesign
                name="right"
                style={styles.insightCartBodyGotoButtonIcon}
                size={14}
                color={"#000000"}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </Fragment>
    );
  });

  emptyCashOnHandView = React.memo(({ height }) => {
    return (
      <View style={{ height, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 14, color: "#070640" }}>
          No Data Available!
        </Text>
      </View>
    );
  });
  renderCashOnHand = React.memo(
    ({
      currentBalance,
      parentLoader,
      isCOHGraphEmpty,
      childLoader,
      arrowStyle,
      btnText,
      cashOnHandGraphData,
      past,
      future,
    }) => {
      let heightRatio = this.state.showInsightsCart ? "66%" : "90%";
      return (
        <View
          style={{
            ...styles.cashOnHandNewCantainer,
            height: this.state.showInsightsCart ? 450 : 360,
          }}
        >
          <Fragment>
            {parentLoader ? (
              <this.parentLoaderRender
                height={this.state.showInsightsCart ? 465 : 360}
              />
            ) : (
              <Fragment>
                {childLoader ? (
                  <this.childLoader height={heightRatio} />
                ) : isCOHGraphEmpty ? (
                  <this.emptyCashOnHandView height={heightRatio} />
                ) : (
                  <this.cashOnHandBody
                    height={heightRatio}
                    cashOnHandGraphData={cashOnHandGraphData}
                    past={past}
                    future={future}
                    currentBalance={currentBalance}
                  />
                )}
                <this.cashOnHandFooter
                  btnText={btnText}
                  arrowStyle={arrowStyle}
                />
              </Fragment>
            )}
          </Fragment>
        </View>
      );
    }
  );
  render() {
    const {
      outOfCashDateResponse,
      fetched: outOfCashDateIsFetched,
    } = this.props.outOfCashDateRedux;
    const gw = Dimensions.get("window").width;
    const {
      isFetched,
      cohData,
      parentLoader,
      childLoader,
      cohCurrentRange,
    } = this.props.cashOnHandRedux;
    let instanceObj = { past: 0, future: 0 };
    instanceObj =
      cohCurrentRange == 1
        ? { past: 0, future: 0 }
        : cohCurrentRange == 3
        ? { past: 3, future: 1 }
        : cohCurrentRange == 6
        ? { past: 3, future: 3 }
        : { past: 12, future: 0 };

    let cashOnHandGraphData = isFetched == true ? cohData.data : [];
    let isCOHGraphEmpty = true;
    let btnText =
      cohCurrentRange == 1
        ? "This Month"
        : cohCurrentRange == 3
        ? "3 Months"
        : cohCurrentRange == 6
        ? "6 Months"
        : "12 Months";
    for (let i = 0; i < cashOnHandGraphData.length; i++) {
      if (
        cashOnHandGraphData[i].amount != 0 &&
        cashOnHandGraphData[i].amount > 0
      ) {
        isCOHGraphEmpty = false;
        break;
      }
    }
    let outOfCashDate = "";
    if (outOfCashDateIsFetched) {
      outOfCashDate = outOfCashDateResponse.days;
    }

    return (
      <View style={{ alignSelf: "center", marginTop: -20, width: "95%" }}>
        {this.props.healthScoreIndicator == true ? (
          <View style={styles.offOutOfCashDate} />
        ) : (
          <this.renderOutOfCashDate outOfCashDate={outOfCashDate} />
        )}
        <this.renderCashOnHand
          childLoader={childLoader}
          arrowStyle={this.state.arrowStyle}
          btnText={btnText}
          cashOnHandGraphData={cashOnHandGraphData}
          past={instanceObj.past}
          future={instanceObj.future}
          isCOHGraphEmpty={isCOHGraphEmpty}
          parentLoader={parentLoader}
          currentBalance={cohData.currentBalance}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cohContainer: {
    backgroundColor: "#EEEFF1",
    marginTop: 15,
  },
  cashOnHandNewCantainer: {
    marginTop: Height(3),
    width: Width(95),
    alignSelf: "center",
    backgroundColor: "#FFF",
    elevation: 10,
    shadowColor: "#000",
    marginVertical: Height(1),
    paddingVertical: 20,
  },
  cashOnHandFooter: {
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "red",
    borderWidth: 0,
    width: "90%",
    alignSelf: "center",
  },
  offOutOfCashDate: {
    height: 48,
    width: "100%",
  },
  outOfCashDateDateStyle: {
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    height: 48,
    width: "100%",
    elevation: 10,
    shadowColor: "#000",
    backgroundColor: "#FF7749",
  },
  heading: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  cashOnHandCart: {
    marginVertical: 8,
    height: 340,
    width: "100%",
    backgroundColor: "#FFF",
    elevation: 10,
    shadowColor: "#000",
    paddingVertical: 20,
  },
  buttonview: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  Toucha: {
    width: "40%",
    height: 34,
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
    color: "#FFFFFF",
  },
  detailsInputContainer: {
    borderBottomWidth: 0,
  },
  insightCartBody: {
    borderRadius: 6,
    marginTop: 16,
    backgroundColor: "#FFE8DD",
    width: "90%",
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
    marginTop: 2,
  },
});

const mapStateToProps = (state) => {
  return {
    cashOnHandRedux: state.cohReducer,
    outOfCashDateRedux: state.outOfCashDateReducer,
    healthScoreIndicator: !state.healthScoreReducer.isFetched,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    triggerCohRequestApi: (cohCurrentRange) => {
      dispatch(cohAsyncCreator(cohCurrentRange));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashOnHand);

// render2() {
//   const { outOfCashDateResponse,fetched: outOfCashDateIsFetched } = this.props.outOfCashDateRedux;
//   const gw=Dimensions.get("window").width;
//   const { isFetched,cohData,parentLoader,childLoader,cohCurrentRange } = this.props.cashOnHandRedux;
//   let instanceObj = { past: 0, future: 0 };
//   instanceObj = cohCurrentRange == 1 ? { past: 0, future: 0 } :
//                 cohCurrentRange == 3 ? { past: 3, future: 1 } :
//                 cohCurrentRange == 6 ? { past: 3, future: 3 } :
//                 { past: 12, future: 0 };

//   let cashOnHandGraphData = isFetched == true ? cohData.data : [];
//   let isCOHGraphEmpty = true;
//   let btnText = cohCurrentRange == 1 ? "This Month" : cohCurrentRange == 3 ? "3 Months" : cohCurrentRange == 6 ? "6 Months" : "12 Months";
//   for(let i=0;i<cashOnHandGraphData.length; i++){

//     if( cashOnHandGraphData[i].amount != 0 && cashOnHandGraphData[i].amount > 0 ){

//       isCOHGraphEmpty = false;
//       break;
//     }
//   }

//   let outOfCashDate = "";
//   if(outOfCashDateIsFetched){
//     outOfCashDate = outOfCashDateResponse.days;
//   }
//   return (
//     <View style={{alignSelf:'center',marginTop:-20, width:'95%'}}>
//       {
//         this.props.healthScoreIndicator == true ?
//         <View style={ styles.offOutOfCashDate }></View> :
//         <this.renderOutOfCashDate outOfCashDate = {outOfCashDate} />
//       }

//       <View style={styles.cohContainer}/>
//           {
//             parentLoader == true ? <this.parentLoader /> :
//             <View style={{ ...styles.cashOnHandCart,
//             height:this.state.showInsightsCart ? 432 : 340  }}>
//           {
//             childLoader == true ? <this.childLoader /> :
//             <View style={{ height: "90%" }}>
//               <View style={styles.heading}>
//               <TouchableOpacity onPress={this.showAlert2}>
//                   <View style={{flexDirection:'row'}}>
//                     <Text style={{ fontSize: 12 }}>CASH ON HAND</Text>
//                     <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
//                   </View>
//                 </TouchableOpacity>
//                 <Text style={{ textAlign:"right",fontSize: 22, fontWeight: "bold" }}>
//                   {`$${ numberWithCommas(cohData.currentBalance) || 0.0}`}
//                 </Text>
//               </View>
//               {
//                 isCOHGraphEmpty == true ? <this.emptyGraph /> :
//                 <View style={{marginTop:"-4.9%",marginLeft:"3%"}} accessible={true} pointerEvents="none">
//                   <CashOnHandChart
//                   cashOnHandGraphData={cashOnHandGraphData}
//                   cohPast={instanceObj.past}
//                   cohFuture={instanceObj.future} />
//                 </View>
//               }
//             </View>
//           }
//             <this.cohFooter btnText={btnText} arrowStyle={this.state.arrowStyle} />
//           </View>
//           }
//     </View>
//   );
// }
