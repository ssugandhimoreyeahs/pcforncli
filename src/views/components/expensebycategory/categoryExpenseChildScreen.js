import React, { Component, Fragment } from "react";
import {
  VictoryPie,
  VictoryTheme,
  VictoryLabel,
  VictoryBar,
  VictoryAxis,
  VictoryChart,
} from "victory-native";
import { Svg } from "react-native-svg";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
//import {SimpleLineIcons, MaterialIcons, EvilIcons,MaterialCommunityIcons} from '@expo/vector-icons';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { ScrollView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-material-dropdown";
import {
  Button_Months,
  EXPENSES_COLOR_CODE,
  Button_MonthsSUB,
  ALL_MONTHS,
} from "../../../constants/constants";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import { numberWithCommas } from "../../../api/common";
import { getSubCategoryTransactions } from "../../../api/api";
import {
  firstLetterCapital,
  allFirstWordCapital,
  isFloat,
} from "../../../api/common";
import AntDesign from "react-native-vector-icons/AntDesign";
AntDesign.loadFont();
SimpleLineIcons.loadFont();
const gw = Dimensions.get("window").width;
const Seprator = () => <View style={styles.separator} />;

getUnique = (array) => {
  var uniqueArray = [];

  // Loop through array values
  for (i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
};

class CategoryExpenseChildScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBodyLoaded: false,
      arrowStyle: "arrow-down",
      isSpinner: true,
      childScreenCurrentMonth: "This Month",
      parentExpenseCategory: {},
      subExpenseCategory: {},
      subParentExpenseCategoryData: [],

      //transactionsstate
      seprateTransactionDate: [],
    };
  }

  fetchSubCategoryTransactions = async () => {
    const parentExpenseCategory = this.props.navigation.getParam(
      "parentExpenseCategory"
    );
    const subExpenseCategory = this.props.navigation.getParam(
      "subExpenseCategory"
    );
    const oldSubCategoryExpenseType = this.props.navigation.getParam(
      "currentExecutingSubCategory"
    );
    let currentExecutingRequestType = 0;

    if (oldSubCategoryExpenseType == "This Month") {
      currentExecutingRequestType = 1;
    } else if (oldSubCategoryExpenseType == "3 Months") {
      currentExecutingRequestType = 3;
    } else if (oldSubCategoryExpenseType == "6 Months") {
      currentExecutingRequestType = 6;
    } else if (oldSubCategoryExpenseType == "12 Months") {
      currentExecutingRequestType = 12;
    }

    //console.log("----------------------------------------------------");
    //console.log("getting Old data here for the futher work - ",this.props.navigation.getParam("currentExecutingSubCategory"));
    //console.log("----------------------------------------------------");
    const subCategoryTransactionsResponse = await getSubCategoryTransactions(
      currentExecutingRequestType,
      parentExpenseCategory.category,
      subExpenseCategory.category
    );
    if (subCategoryTransactionsResponse.result == true) {
      const {
        subCategoryTransactionResponse,
      } = subCategoryTransactionsResponse;
      let pullOutSeprateDates = [];
      subCategoryTransactionResponse.Transactions.map((singleTransaction) => {
        pullOutSeprateDates.push(singleTransaction.date);
      });

      //console.log("All Dates of the Transaction - ",pullOutSeprateDates);
      let seprateTransactionDate = getUnique([...pullOutSeprateDates]);

      //console.log("All Dates of the Filter Transaction - ",seprateTransactionDate);
      this.setState({
        isBodyLoaded: true,
        isSpinner: false,
        subParentExpenseCategoryData: subCategoryTransactionResponse,
        parentExpenseCategory,
        subExpenseCategory,
        seprateTransactionDate,
        childScreenCurrentMonth: oldSubCategoryExpenseType,
      });
    } else {
      this.setState({ isSpinner: false }, () => {
        setTimeout(() => {
          Alert.alert("Error", "Error Try Again!", [
            {
              text: "Cancel",
              onPress: () => {
                this.props.navigation.goBack();
              },
            },
          ]);
        }, 100);
      });
    }
  };
  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    //console.log("Sub expense category data ----------------------------------------------");
    //console.log("Parent Expense data - ",this.props.navigation.getParam("parentExpenseCategory"));
    //console.log("sub expense category data - ",this.props.navigation.getParam("subExpenseCategory"));
    //console.log("Sub expense category data ----------------------------------------------");
    this.fetchSubCategoryTransactions();
  };

  handleChildDataSelectMonth = async (childDataSelectMonth) => {
    //console.log("request for change sub category and parent category expenses - ",childDataSelectMonth);

    if (this.state.childScreenCurrentMonth != childDataSelectMonth) {
      this.setState({ isSpinner: true, isBodyLoaded: false });

      let readyChangeParam = 1;
      if (childDataSelectMonth == "This Month") {
        readyChangeParam = 1;
      } else if (childDataSelectMonth == "3 Months") {
        readyChangeParam = 3;
      } else if (childDataSelectMonth == "6 Months") {
        readyChangeParam = 6;
      } else {
        readyChangeParam = 12;
      }
      const changeParentSubExpenseResponse = await getSubCategoryTransactions(
        readyChangeParam,
        this.state.parentExpenseCategory.category,
        this.state.subExpenseCategory.category
      );
      if (changeParentSubExpenseResponse.result == true) {
        const {
          subCategoryTransactionResponse,
        } = changeParentSubExpenseResponse;
        let pullOutSeprateDates = [];
        subCategoryTransactionResponse.Transactions.map((singleTransaction) => {
          pullOutSeprateDates.push(singleTransaction.date);
        });

        //console.log("All Dates of the Transaction - ",pullOutSeprateDates);
        let seprateTransactionDate = getUnique([...pullOutSeprateDates]);

        //console.log("All Dates of the Filter Transaction - ",seprateTransactionDate);
        this.setState({
          isBodyLoaded: true,
          isSpinner: false,
          subParentExpenseCategoryData: subCategoryTransactionResponse,
          // parentExpenseCategory,
          // subExpenseCategory,
          seprateTransactionDate,
          childScreenCurrentMonth: childDataSelectMonth,
        });
      } else {
        this.setState(
          {
            isSpinner: false,
            isBodyLoaded: true,
          },
          () => {
            setTimeout(() => {
              Alert.alert("Error", "Error Try Again!");
            }, 100);
          }
        );
      }
    }
  };
  renderTransaction = ({
    transactionName,
    transactionAmount,
    transactionSubCategory,
  }) => {
    // let readyTransactionTitle = transactionName.substring(0,20);
    if (
      transactionName == undefined ||
      transactionAmount == undefined ||
      transactionSubCategory == undefined
    ) {
      return null;
    } else {
      return (
        <Fragment>
          <View style={{ marginTop: 15, width: "90%" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontSize: 15, lineHeight: 20, width: 250 }}
              >{`${transactionName}`}</Text>
              <Text
                style={{ fontSize: 17, lineHeight: 20, direction: "rtl" }}
              >{`-$${numberWithCommas(transactionAmount)}`}</Text>
            </View>

            <View style={{ marginTop: 15 }}>
              <Text
                style={{ fontSize: 11, lineHeight: 13, color: "#1D1E1F" }}
              >{`${transactionSubCategory}`}</Text>
            </View>
          </View>
          <View
            style={{
              width: "91%",
              borderColor: "#1D1E1F",
              borderWidth: 0.4,
              marginTop: 10,
            }}
          />
        </Fragment>
      );
    }
  };
  renderTransactionDate = ({ transactionDate }) => {
    //console.log("renderTransactionDate Component - ",transactionDate);
    const { subParentExpenseCategoryData } = this.state;
    const currentTransactionDateObj = new Date(transactionDate);

    return (
      <Fragment>
        <View
          style={{
            backgroundColor: "#EEEFF1",
            alignItems: "flex-start",
            height: 27,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              lineHeight: 13,
              marginTop: 8,
              marginLeft: 17,
            }}
          >{`${
            ALL_MONTHS[currentTransactionDateObj.getMonth()]
          } ${currentTransactionDateObj.getDate()}, ${currentTransactionDateObj.getFullYear()}`}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 20,
            alignItems: "center",
          }}
        >
          {subParentExpenseCategoryData.Transactions.map(
            (singleTransactions, index) => {
              if (singleTransactions.date == transactionDate) {
                return (
                  <this.renderTransaction
                    key={index}
                    transactionSubCategory={singleTransactions.subCategory}
                    transactionName={singleTransactions.name}
                    transactionAmount={singleTransactions.amount}
                  />
                );
              } else {
                return null;
              }
            }
          )}

          <this.renderTransaction />
        </View>
      </Fragment>
    );
  };

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

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }
  renderBody = () => {
    const {
      subExpenseCategory,
      subParentExpenseCategoryData,
      seprateTransactionDate,
    } = this.state;
    //console.log("Inside render Body seprateTransactionDate - ",seprateTransactionDate);
    //console.log("------------------------------------------------- here ----------------------------------");
    // console.log(allFirstWordCapital(subExpenseCategory.category));
    let readyGraphData;
    if (this.state.childScreenCurrentMonth == "This Month") {
      readyGraphData = subParentExpenseCategoryData.result.map(
        (singleGraph, index) => {
          return {
            x: new Date(singleGraph.date).getDate(),
            y: parseInt(singleGraph.amount),
          };
        }
      );
    } else {
      readyGraphData = subParentExpenseCategoryData.result.map(
        (singleGraph, index) => {
          return {
            x: singleGraph.month,
            y: parseInt(singleGraph.amount),
          };
        }
      );
    }

    let readyYAxisLabels = [];
    let allYAxisData = readyGraphData.map((singlegraph) => singlegraph.y);
    let maxValue = Math.max(...allYAxisData);
    let maxValueWith10PercentIncrement = maxValue + (maxValue * 15) / 100;
    //console.log("maximum graph value - ",maxValueWith10PercentIncrement);

    let divideMaxValueWith5 = parseInt(
      parseInt(maxValueWith10PercentIncrement) / 5
    );
    //console.log("maximum graph value divide by 5 - ",divideMaxValueWith5);
    for (let i = 0; i <= 5; i++) {
      readyYAxisLabels.push(divideMaxValueWith5 * i);
    }

    console.log("Test Here ready Graph data - ", readyGraphData);
    let isGraphEmpty = false;
    for (let i = 0; i < readyGraphData.length; i++) {
      if (readyGraphData[i].y == 0) {
        isGraphEmpty = true;
      } else {
        isGraphEmpty = false;
        break;
      }
    }
    console.log("isGraph Empty = ", isGraphEmpty);
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            backgroundColor: "#F8F8F8",
            height: 75,
            width: "100%",
            flexDirection: "row",
          }}
        >
          <View style={{ marginTop: 15, flexDirection: "row", width: "100%" }}>
            <View
              style={{
                width: "10%",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <AntDesign name="left" size={25} color={"#000000"} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                disabled={true}
                style={{
                  paddingHorizontal: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 35,
                  borderRadius: 50,
                  borderColor: `${subExpenseCategory.colorCode}`,
                  backgroundColor: `${subExpenseCategory.colorCode}`,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 22,
                    height: 22,
                    color: "#FFFFFF",
                  }}
                >{`${allFirstWordCapital(subExpenseCategory.category)}`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <View style={{ backgroundColor:"#F8F8F8",height:75,width:"100%",flexDirection:"row"}}>
                    <TouchableOpacity onPress={ ()=> {this.props.navigation.goBack()}}>
                            <View style={{ width:34,height:30, marginTop:35,marginLeft:14,}}><AntDesign name='left' size={25} color={'#000000'}/></View>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true} style={{ marginTop:30,marginLeft:70,justifyContent:"center",alignItems:"center",width:150,height:35,borderRadius:50,borderColor:"#F98361",backgroundColor:`${subExpenseCategory.colorCode}` }}>
                                            <Text style={{ fontSize:15,lineHeight:22,height:22,color:"#FFFFFF" }}>{ `${ subExpenseCategory.category }` }</Text>
                    </TouchableOpacity>
                </View> */}
        <View
          style={{
            backgroundColor: "#fff",
            height: 450,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Text style={{ marginTop: 35, fontSize: 22, lineHeight: 26 }}>
            {parseInt(subParentExpenseCategoryData.TotalExpense) == 0
              ? ""
              : `-$${numberWithCommas(
                  subParentExpenseCategoryData.TotalExpense
                )}`}
          </Text>

          <View style={{ marginTop: 25 }}>
            {isGraphEmpty == false ? (
              <VictoryChart
                width={gw - 10}
                domainPadding={{
                  x: this.state.childScreenCurrentMonth == "3 Months" ? 70 : 3,
                }}
                style={{
                  parent: { marginLeft: -10 },
                }}
              >
                <VictoryAxis
                  offsetX={gw}
                  tickValues={[
                    ...readyGraphData.map((singleGraph) => singleGraph.x),
                  ]}
                  tickFormat={(value) => {
                    return `${value} `;
                  }}
                  style={{
                    axis: { stroke: "#ffffff" },
                    tickLabels: { fontSize: 10 },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  offsetX={gw - 7}
                  style={{
                    axis: { stroke: "#ffffff" },
                    tickLabels: { fontSize: 10 },
                  }}
                  tickValues={readyYAxisLabels}
                  tickFormat={(y) => {
                    if (y >= 1000) {
                      let returnValue = y / 1000;
                      if (isFloat(returnValue)) {
                        return `-${returnValue.toFixed(1)}K`;
                      } else {
                        return `-${returnValue}K`;
                      }
                    } else if (y >= 1000000) {
                      let returnValue = y / 1000;
                      if (isFloat(returnValue)) {
                        return `-${returnValue.toFixed(1)}M`;
                      } else {
                        return `-${returnValue}M`;
                      }
                    } else {
                      return `-${y}`;
                    }
                  }}
                />
                <VictoryBar
                  style={{ data: { fill: "#DE84AA" } }}
                  data={readyGraphData}
                />
              </VictoryChart>
            ) : (
              <View style={{ height: 250, justifyContent: "center" }}>
                <Text>No Data Available!</Text>
              </View>
            )}
          </View>
          <View style={styles.dropDownCss}>
            <Dropdown
              data={Button_Months}
              onChangeText={(childDataSelectMonth) => {
                this.handleChildDataSelectMonth(childDataSelectMonth);
              }}
              value={this.state.childScreenCurrentMonth}
              containerStyle={styles.dropdown}
              renderAccessory={() => null}
              pickerStyle={{ backgroundColor: "#E6E6EC", borderRadius: 10 }}
              onBlur={() => {
                Keyboard.dismiss();
              }}
              onFocus={() => {
                Keyboard.dismiss();
              }}
              inputContainerStyle={styles.detailsInputContainer}
              dropdownPosition={-5.5}
              fontSize={11}
            />
            <SimpleLineIcons
              name={this.state.arrowStyle}
              color="#030538"
              style={{ marginTop: 10, marginRight: 20 }}
            />
          </View>
        </View>
        <View>
          {seprateTransactionDate.map((singleTransactionDate, index) => {
            return (
              <this.renderTransactionDate
                key={index}
                transactionDate={singleTransactionDate}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };
  render() {
    const { isSpinner, isBodyLoaded } = this.state;
    // isBodyLoaded = false;
    // isSpinner = true;

    return (
      <Fragment>
        {/* <Spinner visible={isSpinner} /> */}
        {isBodyLoaded == true ? (
          this.renderBody()
        ) : isSpinner == true ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator
              style={{ alignContent: "center" }}
              animating={isSpinner}
              color="#070640"
              size={"large"}
            />
          </View>
        ) : null}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#EEEFF1",
  },
  separator: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 5,
    marginRight: 5,
  },
  dropDownCss: {
    width: 120,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E6E6EC",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailsInputContainer: {
    borderBottomWidth: 0,
  },
  dropdown: {
    width: "80%",
    marginLeft: 22,
    marginTop: -25,
    borderBottomColor: "#FFF",
    borderBottomWidth: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    mainExpenseByCategoryRedux: state.mainExpenseByCategory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};
//connect(mapStateToProps,mapDispatchToProps)
export default CategoryExpenseChildScreen;
