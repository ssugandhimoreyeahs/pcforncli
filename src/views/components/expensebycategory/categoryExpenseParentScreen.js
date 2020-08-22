import React, { Component, Fragment } from "react";
import { VictoryPie, VictoryTheme, VictoryLabel } from "victory-native";
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

 
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { ScrollView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-material-dropdown";
import {
  Button_Months,
  EXPENSES_COLOR_CODE,
  Button_MonthsSUB,
} from "../../../constants/constants";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import { numberWithCommas } from "../../../api/common";
import { getSubCategories } from "../../../api/api";
import { firstLetterCapital } from "../../../api/common";
import { MAIN_EXPENSE_CATEGORY_SUCCESS } from "../../../reducers/mainexpensecategory";
import { allFirstWordCapital } from "../../../api/common";

AntDesign.loadFont();
MaterialCommunityIcons.loadFont();
SimpleLineIcons.loadFont();
const gw = Dimensions.get("window").width;
const Seprator = () => <View style={styles.separator} />;
class CategoryExpenseParentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sampleSpinner: false,
      arrowStyle: "arrow-down",
      currentExecutingMainExpenseMonth: "This Month",
      showSubExpenseCategoryState: {
        isLogicStart: false,
        parentExpenseCategoryData: {},
        subExpenseCategoryData: [],
        showSubExpenseCategoryLoader: false,
        currentExecutingSubExpenseMonth: "This Month",
      },
    };
  }

  static getDerivedStateFromProps(props, state) {
    //code here
    const {
      mainExpenseType: expenseCurrentRange,
    } = props.mainExpenseByCategoryRedux;
    // console.log("testing here for main expense screen inside static getDerivedStatefromprops--------------------------------------");
    let renderButton;
    if (expenseCurrentRange == 1) {
      renderButton = "This Month";
    } else if (expenseCurrentRange == 3) {
      renderButton = "3 Months";
    } else if (expenseCurrentRange == 6) {
      renderButton = "6 Months";
    } else {
      renderButton = "12 Months";
    }
    // console.log(renderButton);
    // console.log("Ends Here")
    return { currentExecutingMainExpenseMonth: renderButton };
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    console.log("CategoryExpenseParentScreen() componentDidMount()");
    //dashboard expense
    const {
      expense,
      expenseCurrentRange: dashboardExpenseCurrentRange,
      totalExpense,
    } = this.props.expenseByCategoryRedux;

    const {
      mainExpenseType: expenseCurrentRange,
    } = this.props.mainExpenseByCategoryRedux;

    if (dashboardExpenseCurrentRange != expenseCurrentRange) {
      this.props.staggingData({
        type: MAIN_EXPENSE_CATEGORY_SUCCESS,
        mainExpenses: expense,
        mainExpenseType: dashboardExpenseCurrentRange,
        totalMainExpense: totalExpense,
      });
    }
  };
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
      if (this.state.showSubExpenseCategoryState.isLogicStart == true) {
        this.setState({
          showSubExpenseCategoryState: {
            ...this.state.showSubExpenseCategoryState,
            isLogicStart: false,
          },
        });
      } else {
        nav.goBack();
      }

      return true;
    }
  };
  handleChangeMainExpense = (currentExpenseRange) => {
    const { currentExecutingMainExpenseMonth: currentRange } = this.state;

    if (currentRange != currentExpenseRange) {
      if (currentExpenseRange == "This Month") {
        this.props.fetchMainExepenseByCategory(1);
      } else if (currentExpenseRange == "3 Months") {
        this.props.fetchMainExepenseByCategory(3);
      } else if (currentExpenseRange == "6 Months") {
        this.props.fetchMainExepenseByCategory(6);
      } else if (currentExpenseRange == "12 Months") {
        this.props.fetchMainExepenseByCategory(12);
      }
      this.setState({ currentExecutingMainExpenseMonth: currentExpenseRange });
      //currentExecutingMainExpenseMonth
    }
  };

  handleChangeSubMainExpense = (mainSubExpenseText) => {
    const {
      category,
    } = this.state.showSubExpenseCategoryState.parentExpenseCategoryData;
    const {
      currentExecutingSubExpenseMonth,
    } = this.state.showSubExpenseCategoryState;
    //console.log("triggering submainexpense change - comming text - ",mainSubExpenseText," - old text ",currentExecutingSubExpenseMonth);
    if (currentExecutingSubExpenseMonth != mainSubExpenseText) {
      this.setState(
        (prevState) => {
          return {
            sampleSpinner: true,
            showSubExpenseCategoryState: {
              ...prevState.showSubExpenseCategoryState,
              showSubExpenseCategoryLoader: true,
              currentExecutingSubExpenseMonth: mainSubExpenseText,
            },
          };
        },
        async () => {
          let readyParam;
          if (mainSubExpenseText == "This Month") {
            readyParam = 1;
          } else if (mainSubExpenseText == "3 Months") {
            readyParam = 3;
          } else if (mainSubExpenseText == "6 Months") {
            readyParam = 6;
          } else if (mainSubExpenseText == "12 Months") {
            readyParam = 12;
          }
          //console.log("final test here ----------------------------------------------------",this.state.currentExecutingMainExpenseMonth);
          const triggerSubExpenseCategoryApiResponse = await getSubCategories(
            readyParam,
            category
          );
          if (triggerSubExpenseCategoryApiResponse.result == true) {
            this.setState((prevState) => {
              return {
                sampleSpinner: false,
                showSubExpenseCategoryState: {
                  ...prevState.showSubExpenseCategoryState,
                  showSubExpenseCategoryLoader: false,
                  subExpenseCategoryData:
                    triggerSubExpenseCategoryApiResponse.subCategoryResponse,
                },
              };
            });
          } else {
            this.setState(
              (prevState) => {
                return {
                  sampleSpinner: false,
                  showSubExpenseCategoryState: {
                    ...prevState.showSubExpenseCategoryState,
                    isLogicStart: false,
                    showSubExpenseCategoryLoader: false,
                    currentExecutingSubExpenseMonth: currentExecutingSubExpenseMonth,
                  },
                };
              },
              () => {
                setTimeout(() => {
                  Alert.alert("Message", "Error Try Again!");
                }, 150);
              }
            );
          }
        }
      );
    }
    // console.log("-----------------------------------------------------");
    // console.log("Triggering subcategory change - ",mainSubExpenseText);
    // console.log("parent cat button - ",this.state.currentExecutingMainExpenseMonth);
    // console.log("child cat button - ",this.state.showSubExpenseCategoryState.currentExecutingSubExpenseMonth);
    // console.log("-----------------------------------------------------");
  };
  handleReloadMainExpenseByCategory = () => {
    const {
      currentExecutingMainExpenseMonth: currentExpenseMainRange,
    } = this.state;

    if (currentExpenseMainRange == "This Month") {
      this.props.fetchMainExepenseByCategory(1);
    } else if (currentExpenseMainRange == "3 Months") {
      this.props.fetchMainExepenseByCategory(3);
    } else if (currentExpenseMainRange == "6 Months") {
      this.props.fetchMainExepenseByCategory(6);
    } else if (currentExpenseMainRange == "12 Months") {
      this.props.fetchMainExepenseByCategory(12);
    }
  };

  triggerChildCategoryLogic = async (allSingleParentCategoryData) => {
    const {
      mainExpenseType: expenseCurrentRange,
    } = this.props.mainExpenseByCategoryRedux;
    //console.log("implementation is in the progress");
    let readyButtonRenderTextHere = "";

    if (expenseCurrentRange == 1) {
      readyButtonRenderTextHere = "This Month";
    } else if (expenseCurrentRange == 3) {
      readyButtonRenderTextHere = "3 Months";
    } else if (expenseCurrentRange == 6) {
      readyButtonRenderTextHere = "6 Months";
    } else {
      readyButtonRenderTextHere = "12 Months";
    }

    //console.log("ready subcategory show type - ",readyButtonRenderTextHere);
    //console.log("implementation ends here ----");
    this.setState((prevState) => {
      return {
        sampleSpinner: true,
        showSubExpenseCategoryState: {
          ...prevState.showSubExpenseCategoryState,
          parentExpenseCategoryData: allSingleParentCategoryData,
          showSubExpenseCategoryLoader: true,
          // currentExecutingSubExpenseMonth: prevState.currentExecutingMainExpenseMonth
        },
      };
    });

    //console.log("final test here ----------------------------------------------------",this.state.currentExecutingMainExpenseMonth);
    const triggerSubExpenseCategoryApiResponse = await getSubCategories(
      expenseCurrentRange,
      allSingleParentCategoryData.category
    );
    if (triggerSubExpenseCategoryApiResponse.result == true) {
      this.setState((prevState) => {
        return {
          sampleSpinner: false,
          showSubExpenseCategoryState: {
            ...prevState.showSubExpenseCategoryState,
            parentExpenseCategoryData: allSingleParentCategoryData,
            isLogicStart: true,
            showSubExpenseCategoryLoader: false,
            subExpenseCategoryData:
              triggerSubExpenseCategoryApiResponse.subCategoryResponse,
            currentExecutingSubExpenseMonth: readyButtonRenderTextHere,
          },
        };
      });
    } else {
      this.setState(
        (prevState) => {
          return {
            sampleSpinner: false,
            showSubExpenseCategoryState: {
              ...prevState.showSubExpenseCategoryState,
              isLogicStart: false,
              showSubExpenseCategoryLoader: false,
            },
          };
        },
        () => {
          setTimeout(() => {
            Alert.alert("Message", "Error Try Again!");
          }, 150);
        }
      );
    }
  };
  renderMainExpenseSingleData = ({
    category,
    amount,
    colorCode,
    allSingleParentCategory,
  }) => {
    return (
      <Fragment>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.triggerChildCategoryLogic(allSingleParentCategory);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 175,
              height: 35,
              borderRadius: 50,
              borderColor: "#F98361",
              backgroundColor: `${colorCode}`,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                height: 22,
                color: "#FFFFFF",
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              height: 22,
              direction: "rtl",
            }}
          >{`-$${numberWithCommas(amount)}`}</Text>
        </View>
        <Seprator />
      </Fragment>
    );
  };

  renderMainExpenseSubSingleData = ({
    category,
    amount,
    colorCode,
    allSingleSubCategory,
  }) => {
    //category = "Hello World Indore Madhya Pradesh"

    return (
      <Fragment>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("ExpenseScreenChild", {
                parentExpenseCategory: this.state.showSubExpenseCategoryState
                  .parentExpenseCategoryData,
                subExpenseCategory: allSingleSubCategory,
                currentExecutingSubCategory: this.state
                  .showSubExpenseCategoryState.currentExecutingSubExpenseMonth,
              });
            }}
            style={{
              //justifyContent:"center",alignItems:"center",width:200,height:35,borderRadius:50,borderColor:"#F98361",backgroundColor:`${colorCode}`
              paddingHorizontal: 20,
              paddingVertical: 10,
              width: 200,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              borderColor: "#F98361",
              backgroundColor: `${colorCode}`,
            }}
          >
            {/* <Text style={{ fontSize:15,lineHeight:22,height:22,color:"#FFFFFF" }}>{ category }</Text> */}
            <Text
              style={{ fontSize: 15, color: "#FFFFFF", textAlign: "center" }}
            >
              {category}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              height: 22,
              direction: "rtl",
            }}
          >{`-$${numberWithCommas(amount)}`}</Text>
        </View>
        <Seprator />
      </Fragment>
    );
  };

  renderAllExpensesList = () => {
    let {
      error,
      isFetched,
      loading,
      mainExpenses,
    } = this.props.mainExpenseByCategoryRedux;
    let colorCode = EXPENSES_COLOR_CODE;
    let mainExpensesChange = mainExpenses.map((singleMainExpense, index) => {
      return { ...singleMainExpense, colorCode: colorCode[index] };
    });

    let {
      isLogicStart,
      subExpenseCategoryData,
    } = this.state.showSubExpenseCategoryState;
    let readySubExpenseCategoryData;
    if (isLogicStart == true) {
      readySubExpenseCategoryData = subExpenseCategoryData.ExpenseByCategory.map(
        (singleSubCategoryExpense, index) => {
          return { ...singleSubCategoryExpense, colorCode: colorCode[index] };
        }
      );
    }
    return (
      <Fragment>
        {isLogicStart == false && mainExpensesChange.length > 0 ? (
          <View
            style={{ marginVertical: 30, width: "90%", alignSelf: "center" }}
          >
            {mainExpensesChange.map((singleMainExpense, index) => {
              return (
                <this.renderMainExpenseSingleData
                  key={index}
                  category={allFirstWordCapital(singleMainExpense.category)}
                  amount={singleMainExpense.amount}
                  colorCode={singleMainExpense.colorCode}
                  allSingleParentCategory={singleMainExpense}
                />
              );
            })}
          </View>
        ) : null}

        {isLogicStart == true && readySubExpenseCategoryData.length > 0 ? (
          <View
            style={{ marginVertical: 30, width: "90%", alignSelf: "center" }}
          >
            {readySubExpenseCategoryData.map((singleSubMainExpense, index) => {
              return (
                <this.renderMainExpenseSubSingleData
                  key={index}
                  category={allFirstWordCapital(singleSubMainExpense.category)}
                  amount={singleSubMainExpense.amount}
                  colorCode={singleSubMainExpense.colorCode}
                  allSingleSubCategory={singleSubMainExpense}
                />
              );
            })}
          </View>
        ) : null}
      </Fragment>
    );
  };

  handleArrowStyle = () => {
    if (this.state.arrowStyle == "arrow-up") {
      this.setState({ arrowStyle: "arrow-down" });
    } else {
      this.setState({ arrowStyle: "arrow-up" });
    }
  };
  handleSubCategoryLogicReset = () => {
    //logic here for close the sub category data
    const {
      mainExpenseType: expenseCurrentRange,
    } = this.props.mainExpenseByCategoryRedux;
    // console.log("handleSubCategoryLogic reset --------------------------------------",expenseCurrentRange);
    let renderButton;
    if (expenseCurrentRange == 1) {
      renderButton = "This Month";
    } else if (expenseCurrentRange == 3) {
      renderButton = "3 Months";
    } else if (expenseCurrentRange == 6) {
      renderButton = "6 Months";
    } else {
      renderButton = "12 Months";
    }
    //console.log(renderButton);
    // console.log("logic false Ends Here")
    this.setState({
      currentExecutingMainExpenseMonth: renderButton,
      showSubExpenseCategoryState: {
        ...this.state.showSubExpenseCategoryState,
        isLogicStart: false,
        showSubExpenseCategoryLoader: false,
        currentExecutingSubExpenseMonth: "This Month",
      },
    });
  };
  render() {
    let {
      showSubExpenseCategoryLoader,
      isLogicStart,
      parentExpenseCategoryData,
      currentExecutingSubExpenseMonth,
      subExpenseCategoryData,
    } = this.state.showSubExpenseCategoryState;
    // console.log(this.props.mainExpenseByCategoryRedux);
    const {
      error,
      isFetched,
      loading,
      mainExpenses,
      totalMainExpense,
      mainExpenseType,
    } = this.props.mainExpenseByCategoryRedux;
    //label:`${singleMainExpense.category}\n${parseInt(singleMainExpense.percentage)}%`,
    //label:`${singleMainExpense.category}\n${parseInt(singleMainExpense.percentage)}%`,
    const generatePieChart = mainExpenses.map((singleMainExpense, index) => {
      return { x: index, y: parseInt(singleMainExpense.percentage) };
    });
    let generateSubPieChart;
    if (isLogicStart == true) {
      generateSubPieChart = subExpenseCategoryData.ExpenseByCategory.map(
        (singleSubMainExpense, index) => {
          return { x: index, y: parseInt(singleSubMainExpense.amount) };
        }
      );
    }
    return (
      <ScrollView style={styles.container}>
        <Spinner visible={this.state.sampleSpinner} />
        {isLogicStart == false ? (
          <View
            style={{
              backgroundColor: "#F8F8F8",
              height: 75,
              width: "100%",
              flexDirection: "row",
            }}
          >
            <View
              style={{ marginTop: 20, flexDirection: "row", width: "100%" }}
            >
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
                <Text style={{ fontSize: 17, lineHeight: 22 }}>Expenses</Text>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "#F8F8F8",
              height: 75,
              width: "100%",
              flexDirection: "row",
            }}
          >
            <View
              style={{ marginTop: 20, flexDirection: "row", width: "100%" }}
            >
              <View
                style={{
                  width: "10%",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity onPress={this.handleSubCategoryLogicReset}>
                  <AntDesign name="close" size={25} color={"#000000"} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 17, lineHeight: 22 }}>
                  {`${allFirstWordCapital(
                    parentExpenseCategoryData.category
                  )} Expenses`}{" "}
                </Text>
              </View>
            </View>
          </View>
        )}

        {error == true ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 300,
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
                Oops Error Try Again!
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
                  this.handleReloadMainExpenseByCategory();
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
                    Try Again
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : loading == true ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 300,
            }}
          >
            <ActivityIndicator
              size="large"
              animating={loading}
              color="#070640"
            />
          </View>
        ) : isFetched == true ? (
          <Fragment>
            <View
              style={{
                backgroundColor: "#FFF",
                height: 400,
                alignItems: "center",
                width: "100%",
              }}
            >
              {isLogicStart == false && generatePieChart.length > 0 ? (
                <Svg>
                  <VictoryPie
                    labels={() => {
                      return null;
                    }}
                    width={gw - 20}
                    height={300}
                    innerRadius={60}
                    theme={VictoryTheme.material}
                    colorScale={EXPENSES_COLOR_CODE}
                    data={generatePieChart}
                    style={{
                      data: { width: 3 },
                      labels: {
                        fill: "black",
                        fontSize: 15,
                        fontWeight: "200",
                        paddingLeft: 20,
                      },
                    }}
                    events={[
                      {
                        target: "labels",
                        eventHandlers: {
                          onPressIn: () => {
                            console.log("i am clicked on the lables - ");
                            return [
                              {
                                target: "labels",
                                mutation: ({ style }) => {
                                  console.log("i am click on labels - ", style);
                                  if (style.fontWeight == "200") {
                                    return {
                                      style: { ...style, fontWeight: "600" },
                                    };
                                  } else {
                                    return {
                                      style: { ...style, fontWeight: "200" },
                                    };
                                  }
                                },
                              },
                            ];
                          },
                        },
                      },
                    ]}
                  />
                  <VictoryLabel
                    textAnchor="middle"
                    style={{
                      fontSize: 22,
                      height: 20,
                      lineHeight: 20,
                      fontWeight: "600",
                    }}
                    x={(gw - 20) / 2}
                    y={150}
                    text={
                      isLogicStart == false
                        ? `-$${numberWithCommas(parseInt(totalMainExpense))}`
                        : `-$${numberWithCommas(
                            parseInt(subExpenseCategoryData.amount)
                          )}`
                    }
                  />
                </Svg>
              ) : isLogicStart == false && generatePieChart.length == 0 ? (
                <View
                  style={{
                    height: 250,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No Data Available!</Text>
                </View>
              ) : null}
              {isLogicStart == true && generateSubPieChart.length > 0 ? (
                <Svg>
                  <VictoryPie
                    labels={() => {
                      return null;
                    }}
                    width={gw - 20}
                    height={300}
                    innerRadius={60}
                    theme={VictoryTheme.material}
                    colorScale={EXPENSES_COLOR_CODE}
                    data={generateSubPieChart}
                    style={{
                      data: { width: 3 },
                      labels: {
                        fill: "black",
                        fontSize: 15,
                        fontWeight: "200",
                        paddingLeft: 20,
                      },
                    }}
                    events={[
                      {
                        target: "labels",
                        eventHandlers: {
                          onPressIn: () => {
                            console.log("i am clicked on the lables - ");
                            return [
                              {
                                target: "labels",
                                mutation: ({ style }) => {
                                  console.log("i am click on labels - ", style);
                                  if (style.fontWeight == "200") {
                                    return {
                                      style: { ...style, fontWeight: "600" },
                                    };
                                  } else {
                                    return {
                                      style: { ...style, fontWeight: "200" },
                                    };
                                  }
                                },
                              },
                            ];
                          },
                        },
                      },
                    ]}
                  />
                  <VictoryLabel
                    textAnchor="middle"
                    style={{
                      fontSize: 22,
                      height: 20,
                      lineHeight: 20,
                      fontWeight: "600",
                    }}
                    x={(gw - 20) / 2}
                    y={150}
                    text={
                      isLogicStart == false
                        ? `-$${numberWithCommas(parseInt(totalMainExpense))}`
                        : `-$${numberWithCommas(
                            parseInt(subExpenseCategoryData.amount)
                          )}`
                    }
                  />
                </Svg>
              ) : isLogicStart == true && generateSubPieChart.length == 0 ? (
                <View
                  style={{
                    height: 250,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>No Data Available!</Text>
                </View>
              ) : null}

              <View style={{ marginTop: 20, alignItems: "center" }}>
                {isLogicStart == false ? (
                  <View style={styles.dropDownCss}>
                    {/* <Text>Rendering Parent</Text> */}
                    <Dropdown
                      data={Button_Months}
                      onChangeText={(mainExpenseText) => {
                        this.handleChangeMainExpense(mainExpenseText);
                      }}
                      value={
                        isLogicStart == false &&
                        this.state.currentExecutingMainExpenseMonth
                      }
                      containerStyle={styles.dropdown}
                      renderAccessory={() => null}
                      pickerStyle={{
                        backgroundColor: "#E6E6EC",
                        borderRadius: 10,
                      }}
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
                ) : (
                  <View style={styles.dropDownCss}>
                    {/* <Text>Rendering Child</Text> */}
                    <Dropdown
                      data={Button_MonthsSUB}
                      onChangeText={(mainSubExpenseText) => {
                        this.handleChangeSubMainExpense(mainSubExpenseText);
                      }}
                      value={
                        isLogicStart == true && currentExecutingSubExpenseMonth
                      }
                      containerStyle={styles.dropdown}
                      renderAccessory={() => null}
                      pickerStyle={{
                        backgroundColor: "#E6E6EC",
                        borderRadius: 10,
                      }}
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
                )}
              </View>
            </View>

            <View
              style={{
                marginTop: 24,
                marginLeft: 20,
                marginRight: 20,
                backgroundColor: "#FFF",
                flexDirection: "column",
              }}
            >
              {this.state.sampleSpinner == true ? (
                <View
                  style={{
                    marginVertical: 30,
                    width: "90%",
                    alignSelf: "center",
                  }}
                >
                  <ActivityIndicator animating={this.state.sampleSpinner} />
                </View>
              ) : (
                <this.renderAllExpensesList />
              )}
            </View>
          </Fragment>
        ) : null}
      </ScrollView>
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
    marginVertical: 20,
    borderBottomColor: "#1D1E1F",
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
    width: "90%",
    marginLeft: 22,
    marginTop: -25,
    borderBottomColor: "#FFF",
    borderBottomWidth: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    expenseByCategoryRedux: state.expenseByCategory,
    mainExpenseByCategoryRedux: state.mainExpenseByCategory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMainExepenseByCategory: (type = 1) => {
      dispatch(fetchMainExpenseAsyncCreator(type));
    },
    staggingData: (staggingDataParam) => {
      dispatch(staggingDataParam);
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryExpenseParentScreen);
