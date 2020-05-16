import React, { Component, Fragment } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform,
  BackHandler,
} from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ALL_MONTHS } from "../../../constants/constants";
import {
  numberWithCommas,
  firstLetterCapital,
  isFloat,
} from "../../../api/common";
import {
  VictoryBar,
  VictoryAxis,
  VictoryChart,
  VictoryTheme,
} from "victory-native";
import {
  getExpenseByCategorySubScreenPromise,
  getExpenseBySubCategoryGraphPromise,
} from "../../../api/api";
import SVG from "react-native-svg";
import { connect } from "react-redux";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
import { fetchExpensesAsyncCreator } from "../../../reducers/expensecategory";
FontAwesome.loadFont();
AntDesign.loadFont();
MaterialCommunityIcons.loadFont();

const deviceWidth = Dimensions.get("window").width;
class ExpenseByCategoryChild extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subCategoryRequestType: {
        current: 0,
        maximum: 5,
        minimum: 0,
      },
      barDataTree: {
        barLoader: true,
        barError: false,
        barData: {},
      },
      currentExpenseCategory: {},
      error: false,
      loading: true,
      subExepenseByCategory: {},
    };
  }
  triggerDataOnTouchableOpacity = (index) => {
    const { subCategoryRequestType } = this.state;
    const { maximum, current } = subCategoryRequestType;
    let actionType = maximum - index;

    if (actionType != current) {
      subCategoryRequestType.current = actionType;
      this.setState({ loading: true, subCategoryRequestType }, () => {
        this.triggerExpenseSubCategoryServer();
      });
    }
  };
  triggerDataOnBarClick = (datum) => {
    let { _x } = datum;
    const { subCategoryRequestType } = this.state;
    const { maximum, current } = subCategoryRequestType;
    let changeCurrent = Math.abs(maximum + 1 - _x);

    if (current != changeCurrent) {
      //let changeCurrent = Math.abs( (maximum+1) - _x );
      subCategoryRequestType.current = changeCurrent;
      this.setState({ loading: true, subCategoryRequestType }, () => {
        this.triggerExpenseSubCategoryServer();
      });
    }
  };
  triggerDataOnTextLabelClick = (datum) => {
    const { subCategoryRequestType } = this.state;
    const { maximum, current } = subCategoryRequestType;
    if (current != datum) {
      let changeCurrent = Math.abs(maximum + 1 - datum);
      subCategoryRequestType.current = changeCurrent;
      this.setState({ loading: true, subCategoryRequestType }, () => {
        this.triggerExpenseSubCategoryServer();
      });
    }
  };
  triggerExpenseSubCategoryGraphServer = () => {
    const { categoryId } = this.state.currentExpenseCategory;
    getExpenseBySubCategoryGraphPromise(categoryId)
      .then((response) => {
        let { barDataTree } = this.state;
        barDataTree.barLoader = false;
        barDataTree.barError = false;
        barDataTree.barData = response.subExpenseGraph;
        this.setState({ barDataTree });
      })
      .catch((error) => {
        let { barDataTree } = this.state;
        barDataTree.barLoader = false;
        barDataTree.barError = true;
        barDataTree.barData = {};
        this.setState({ barDataTree });
      });
  };
  triggerExpenseSubCategoryServer = () => {
    const { categoryId } = this.state.currentExpenseCategory;
    const { subCategoryRequestType } = this.state;
    const { current } = subCategoryRequestType;
    getExpenseByCategorySubScreenPromise(current, categoryId)
      .then((response) => {
        this.setState({
          error: false,
          loading: false,
          subExepenseByCategory: response.subCategoryExpenseData,
        });
      })
      .catch((error) => {
        this.setState({
          error: true,
          loading: false,
          subExepenseByCategory: {},
        });
      });
  };
  currentMonthString = () => {
    let { current } = this.state.subCategoryRequestType;
    let newDate = new Date();
    newDate.setMonth(newDate.getMonth() - current);
    return newDate.getMonth();
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
  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    const currentExpenseCategory = this.props.navigation.getParam(
      "currentExpenseCategory"
    );
    console.log("Data recieved - ", currentExpenseCategory);
    let { subCategoryRequestType } = this.state;
    subCategoryRequestType.current = currentExpenseCategory.expenseType;
    this.setState({ currentExpenseCategory, subCategoryRequestType }, () => {
      this.triggerExpenseSubCategoryServer();
      this.triggerExpenseSubCategoryGraphServer();
    });
  };
  header = () => {
    const { category } = this.props.navigation.getParam(
      "currentExpenseCategory"
    );
    return (
      <View style={styles.header}>
        <View style={styles.headerChild}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={styles.headerBack}
          >
            <AntDesign name="left" size={22} color={"#000000"} />
          </TouchableOpacity>
          <View
            style={{
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 19, color: "#000", fontWeight: "600" }}>
              {`${firstLetterCapital(category)}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  seprator = () => {
    return <View style={styles.seprator} />;
  };
  getCurrentExecutingMonth = () => {
    const { current } = this.state.subCategoryRequestType;
    const date = new Date();
    date.setMonth(date.getMonth() - current);
    return date.getMonth();
  };
  changeSubCategory = (actionType = "prev") => {
    let { subCategoryRequestType } = this.state;
    let { current, maximum, minimum } = subCategoryRequestType;

    if (actionType == "prev") {
      if (current < maximum) {
        subCategoryRequestType.current = current + 1;
        this.setState({ subCategoryRequestType, loading: true }, () => {
          this.triggerExpenseSubCategoryServer();
        });
      }
    } else {
      if (current > minimum) {
        subCategoryRequestType.current = current - 1;
        this.setState({ subCategoryRequestType, loading: true }, () => {
          this.triggerExpenseSubCategoryServer();
        });
      }
    }
  };
  renderCurrentButton = () => {
    const { subCategoryRequestType } = this.state;
    const { current, maximum, minimum } = subCategoryRequestType;
    return (
      <View style={styles.renderCurrentButton}>
        <TouchableOpacity
          style={{ opacity: current == maximum ? 0.3 : 1 }}
          disabled={current == maximum ? true : false}
          onPress={() => {
            this.changeSubCategory("prev");
          }}
        >
          <AntDesign name={"left"} size={17} />
        </TouchableOpacity>
        <Text>{`${ALL_MONTHS[this.getCurrentExecutingMonth()]}`}</Text>
        <TouchableOpacity
          style={{ opacity: current == minimum ? 0.3 : 1 }}
          disabled={current == minimum ? true : false}
          onPress={() => {
            this.changeSubCategory("next");
          }}
        >
          <AntDesign name={"right"} size={17} />
        </TouchableOpacity>
      </View>
    );
  };
  transactionSeprator = () => {
    return <View style={styles.seprator2} />;
  };
  graphAxis = () => {
    const { barDataTree } = this.state;
    const { barData } = barDataTree;

    let graphDataArray = [];
    barData.graphData.map((singleGraph, index) => {
      let obj = {};
      obj.x = singleGraph.month;
      obj.y = parseFloat(singleGraph.amount);
      graphDataArray.push(obj);
    });

    let maxYAxis = Math.max(...graphDataArray.map((item) => item.y));
    let add10PercentToYaxis = (maxYAxis + parseInt(maxYAxis / 10)) / 4;

    let yAxisLabels = [];
    for (let i = 0; i < 5; i++) {
      let amount = i == 0 ? add10PercentToYaxis * i : add10PercentToYaxis * -i;
      yAxisLabels.push(amount);
    }

    return [graphDataArray, yAxisLabels];
  };
  renderBarChart = () => {
    const { backgroundColor: graphFillColor } = this.props.navigation.getParam(
      "currentExpenseCategory"
    );
    const [graphDataArray, yAxisLabels] = this.graphAxis();

    const fill = graphFillColor;
    const BarWraper = Platform.select({
      ios: TouchableOpacity,
      android: SVG,
    });
    return (
      <Fragment>
        <BarWraper style={{ marginLeft: -15 }}>
          <VictoryChart
            width={deviceWidth - 5}
            height={270}
            domainPadding={20}
            animate={{
              duration: 700,
              onLoad: { duration: 100 },
            }}
            //style={{ parent: { marginLeft: -20 } }}
          >
            {/* <VictoryAxis 
                    
                    events={[{
                    target: "tickLabels",
                    eventHandlers: {
                        onPressIn: () => {
                        return [
                            {
                            target: "tickLabels",
                            mutation: (props) => {
                               //console.log("datum recieve on axis - ",props.datum);
                                this.triggerDataOnTextLabelClick(props.datum);
                            }
                            }
                        ];
                        }
                    }
                    }]}

                    tickValues={[ ...graphDataArray.map(item => item.x)]}
                    offsetY={255}
                    style={{
                        axis: { stroke: '#ffffff' },
                        tickLabels: { fontSize: 12,fill: (data) => {
                            
                            return data == ALL_MONTHS[this.currentMonthString()] ? `#1D1E1F` : `#8E8E93`;
                        } 
                        },
                    }} /> */}
            <VictoryAxis
              dependentAxis
              offsetX={deviceWidth + 8}
              style={{
                grid: { stroke: "#EEE", strokeDasharray: "50,0" },
                axis: { stroke: "#ffffff" },
                tickLabels: { fontSize: 12, fill: "#8E8E93" },
              }}
              tickValues={[...yAxisLabels]}
              tickFormat={(y) => {
                y = Math.abs(y);
                if (y > 1000) {
                  let returnValue = y / 1000;
                  if (isFloat(returnValue)) {
                    return `-$${returnValue.toFixed(1)}K`;
                  } else {
                    return `-$${returnValue}K`;
                  }
                } else if (y > 1000000) {
                  let returnValue = y / 1000000;
                  if (isFloat(returnValue)) {
                    return `-$${returnValue.toFixed(1)}M`;
                  } else {
                    return `-$${returnValue}M`;
                  }
                } else {
                  let returnValue = y;
                  if (isFloat(returnValue)) {
                    return `-$${returnValue.toFixed(1)}`;
                  } else {
                    return `-$${returnValue}`;
                  }
                }
              }}
            />
            <VictoryBar
              style={{
                data: {
                  fill,
                  opacity: (data) => {
                    if (data.xName == ALL_MONTHS[this.currentMonthString()]) {
                      return 1;
                    } else {
                      return 0.3;
                    }
                  },
                },
              }}
              data={graphDataArray.map((singleItem) => {
                singleItem.y = singleItem.y * -1;
                return singleItem;
              })}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => {
                            this.triggerDataOnBarClick(props.datum);
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </VictoryChart>
        </BarWraper>
        <View
          style={{
            marginTop: -35,
            marginLeft: 37,
            width: deviceWidth - 115,
            justifyContent: "space-between",
            borderWidth: 0,
            borderColor: "red",
            flexDirection: "row",
            marginBottom: 40,
          }}
        >
          {graphDataArray.map((singleMonth, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  this.triggerDataOnTouchableOpacity(index);
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 11,
                    color:
                      singleMonth.x == ALL_MONTHS[this.currentMonthString()]
                        ? `#1D1E1F`
                        : "#8E8E93",
                  }}
                >
                  {`${singleMonth.x}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Fragment>
    );
  };
  bodyChart = () => {
    const { subExepenseByCategory, barDataTree } = this.state;
    let { barLoader, barError } = barDataTree;

    const { ExpenseSubCategory } = subExepenseByCategory;
    let iconObj = {};
    iconObj.visible = false;
    iconObj.type = ``;
    iconObj.color = ``;
    iconObj.text = ``;
    if (
      subExepenseByCategory.isUp != null &&
      subExepenseByCategory.isDown == null
    ) {
      iconObj.visible = true;
      iconObj.type = `arrow-up`;
      iconObj.color = `#FF784B`;
      iconObj.text = subExepenseByCategory.isUp;
    } else if (
      subExepenseByCategory.isUp == null &&
      subExepenseByCategory.isDown != null
    ) {
      iconObj.visible = true;
      iconObj.type = `arrow-down`;
      iconObj.color = `#1188DF`;
      iconObj.text = subExepenseByCategory.isDown;
    }
    let isSubCategoryEmpty = ExpenseSubCategory.length == 0 ? true : false;
    return (
      <Fragment>
        <View style={styles.upperView}>
          {isSubCategoryEmpty == false ? (
            <View style={{ ...styles.upperTotalAmountView }}>
              <Text style={styles.upperTotalAmountText}>
                {`-$${numberWithCommas(subExepenseByCategory.totalAmount)}`}
              </Text>
              {iconObj.visible == true ? (
                <View style={styles.upperIconView}>
                  <FontAwesome
                    name={`${iconObj.type}`}
                    color={`${iconObj.color}`}
                  />
                  <Text style={styles.upperIconHikeText}>
                    {`${iconObj.text}% since last month`}
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: 8 }} />
              )}
            </View>
          ) : (
            <View
              style={{
                height: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#070640" }}>
                You have not spent anything this month.
              </Text>
            </View>
          )}
          {barError == true ? (
            <View
              style={{
                height: 270,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <this.graphErrorView />
            </View>
          ) : barLoader == true ? (
            <View
              style={{
                height: 270,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                animating={true}
                size={"large"}
                color={`#070640`}
              />
            </View>
          ) : (
            <this.renderBarChart />
          )}
        </View>
      </Fragment>
    );
  };
  renderTransaction = ({ transaction, index, totalIndex }) => {
    let currentTransactionDateObj = transaction.date.split("-");
    return (
      <Fragment>
        <View
          style={{
            width: "85%",
            alignSelf: "center",
            borderColor: "red",
            borderWidth: 0,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                width: "70%",
                textAlign: "left",
                fontSize: 15,
                color: "#1D1E1F",
              }}
            >
              {`${transaction.name}`}
            </Text>
            <Text
              style={{
                textAlign: "right",
                width: "30%",
                fontSize: 15,
                color: "#1D1E1F",
              }}
            >
              {`-$${numberWithCommas(transaction.amount)}`}
            </Text>
          </View>
          <View
            style={{
              marginLeft: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 11, color: "#1D1E1F", opacity: 0.5 }}>
              {`${ALL_MONTHS[parseInt(currentTransactionDateObj[1]) - 1]} ${
                currentTransactionDateObj[2]
              }, ${currentTransactionDateObj[0]}`}
            </Text>
          </View>
        </View>
        {index < totalIndex - 1 ? <this.transactionSeprator /> : null}
      </Fragment>
    );
  };

  triggerSubCategoryClick = (index) => {
    const { subExepenseByCategory } = this.state;
    let { ExpenseSubCategory } = subExepenseByCategory;
    ExpenseSubCategory[index].isVisible = !ExpenseSubCategory[index].isVisible;
    this.setState({
      subExepenseByCategory: {
        ...subExepenseByCategory,
        ExpenseSubCategory,
      },
    });
  };
  renderSubCategory = ({ category, index }) => {
    const {
      subCategory,
      total,
      percentage,
      isUp,
      isDown,
      isVisible,
      transaction,
    } = category;
    const currentExpenseCategory = this.state.currentExpenseCategory;

    let iconObj = {};
    iconObj.visible = false;
    iconObj.type = ``;
    iconObj.color = ``;
    iconObj.text = ``;
    if (isUp != null && isDown == null) {
      iconObj.visible = true;
      iconObj.type = `arrow-up`;
      iconObj.color = `#FF784B`;
      iconObj.text = isUp;
    } else if (isUp == null && isDown != null) {
      iconObj.visible = true;
      iconObj.type = `arrow-down`;
      iconObj.color = `#1188DF`;
      iconObj.text = isDown;
    }

    return (
      <View
        style={{
          backgroundColor: "#FFF",
          flexDirection: "column",
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View style={{ width: "90%", alignSelf: "center" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                width: "70%",
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                disabled={transaction.length > 0 ? false : true}
                style={{ flexDirection: "row" }}
                onPress={() => {
                  this.triggerSubCategoryClick(index);
                }}
              >
                <Text
                  style={{ color: "#1D1E1F", fontSize: 15, fontWeight: "600" }}
                >
                  {`${firstLetterCapital(subCategory)}`}
                </Text>
                {transaction.length > 0 ? (
                  <AntDesign
                    name={isVisible == true ? "up" : "down"}
                    size={15}
                    style={{ marginLeft: 5, marginTop: 2, opacity: 0.4 }}
                    color={"#030538"}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
            <Text
              style={{
                textAlign: "right",
                width: "30%",
                fontSize: 15,
                color: "#1D1E1F",
              }}
            >
              {`-$${numberWithCommas(total)}`}
            </Text>
          </View>
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "55%",
                borderWidth: 0,
                borderColor: "red",
                flexDirection: "row",
              }}
            >
              {iconObj.visible == true ? (
                <Fragment>
                  <FontAwesome
                    size={10}
                    name={`${iconObj.type}`}
                    color={`${iconObj.color}`}
                  />
                  <Text
                    style={{ color: "#1D1E1F", fontSize: 10, paddingLeft: 4 }}
                  >
                    {`${iconObj.text}% since previous month`}
                  </Text>
                </Fragment>
              ) : null}
            </View>
            <Text
              style={{
                textAlign: "right",
                borderColor: "red",
                borderWidth: 0,
                color: "#1D1E1F",
                fontSize: 10,
                width: "45%",
              }}
            >
              {`${percentage}% of ${firstLetterCapital(
                currentExpenseCategory.category
              )}`}
            </Text>
          </View>
        </View>

        {/* code for the transactions */}
        {isVisible == true ? (
          <View
            style={{
              marginVertical: 25,
              paddingVertical: 25,
              backgroundColor: "#EEEFF1",
            }}
          >
            {transaction.map((singleTransaction, index) => {
              return (
                <Fragment key={index}>
                  <this.renderTransaction
                    key={index}
                    transaction={{ ...singleTransaction }}
                    index={index}
                    totalIndex={transaction.length}
                  />
                </Fragment>
              );
            })}
          </View>
        ) : (
          <this.seprator />
        )}
      </View>
    );
  };
  renderNoCategoryTransaction = ({ singleTransaction, index }) => {
    let currentTransactionDateObj = singleTransaction.date.split("-");
    return (
      <Fragment>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.transactionTitle}>{`${
            singleTransaction.name
          }`}</Text>
          <Text style={styles.transactionAmount}>{`-$${numberWithCommas(
            singleTransaction.amount
          )}`}</Text>
        </View>

        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.transactionDate}>
            {`${ALL_MONTHS[parseInt(currentTransactionDateObj[1]) - 1]} ${
              currentTransactionDateObj[2]
            }, ${currentTransactionDateObj[0]}`}
          </Text>
        </View>
        <this.seprator />
      </Fragment>
    );
  };
  renderWhenNoSubCategory = ({ category, index }) => {
    const { transaction } = category;
    if (transaction.length == 0) {
      return null;
    }
    return (
      <View
        style={{
          borderColor: "red",
          borderWidth: 0,
          alignSelf: "center",
          width: "90%",
          backgroundColor: "#FFF",
        }}
      >
        {transaction.map((singleTransaction, index) => {
          return (
            <this.renderNoCategoryTransaction
              singleTransaction={{ ...singleTransaction }}
              key={index}
              index={index}
            />
          );
        })}
      </View>
    );
  };

  handleReloadSubScreen = () => {
    this.setState(
      {
        loading: true,
        error: false,
      },
      () => {
        setTimeout(() => {
          this.triggerExpenseSubCategoryServer();
        }, 500);
      }
    );
  };
  loadingView = () => {
    return (
      <View style={{ flex: 1 }}>
        <this.header />
        <View style={{ flex: 0.9, justifyContent: "center" }}>
          <ActivityIndicator
            animating={true}
            size={"large"}
            color={`#070640`}
          />
        </View>
      </View>
    );
  };
  reloadGraphDataOnly = () => {
    let { barDataTree } = this.state;
    //let { barData,barLoader,barError } = barDataTree;
    // barDataTree: {
    //     barLoader: true,
    //     barError: false,
    //     barData:{}
    // }
    barDataTree.barLoader = true;
    barDataTree.barError = false;
    barDataTree.barData = {};
    this.setState({ barDataTree }, () => {
      this.triggerExpenseSubCategoryGraphServer();
    });
  };
  graphErrorView = () => {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              this.reloadGraphDataOnly();
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
  };
  errorView = () => {
    return (
      <View style={{ flex: 1 }}>
        <this.header />
        <View
          style={{ flex: 0.9, justifyContent: "center", alignItems: "center" }}
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
                this.handleReloadSubScreen();
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
      </View>
    );
  };
  bankNotConnectedPopup = () => {
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
  };

  renderNewTransactionTile = React.memo(() => {
    return (
      <Fragment>
        <View style={styles.newTransactionChildContainer}>
          <Text style={styles.newTransactionTitle}>Transaction Title</Text>

          <Text style={styles.newTransactionAmountTitle}>$700.00</Text>
        </View>

        <View style={styles.newTransactionChildContainer2}>
          <Text style={styles.newTransactionDateTitle}>Mar 15</Text>

          <View style={{ maxWidth: "70%" }}>
            <TouchableOpacity style={styles.newTransactionCategoryButton}>
              <Text style={styles.newTransactionCategoryButtonText}>
                Advertising & marketing
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Fragment>
    );
  });
  renderNewBodyTransaction = React.memo(() => {
    return (
      <Fragment>
        <View style={{ height: 25, backgroundColor: "#EEEFF1" }} />
        <View style={styles.newTransactionParentContainer}>
          <this.renderNewTransactionTile />
          <View style={styles.commonSeperator} />
          <this.renderNewTransactionTile />
          <View style={styles.commonSeperator} />
          <this.renderNewTransactionTile />
          <View style={styles.commonSeperator} />
          <this.renderNewTransactionTile />
        </View>
      </Fragment>
    );
  });
  renderBody = () => {
    const { ExpenseSubCategory } = this.state.subExepenseByCategory;
    let { category } = this.state.currentExpenseCategory;
    let isUncategorized = category.toLowerCase() === "uncategory";
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <this.header />
        <this.bodyChart />
        {/* {ExpenseSubCategory.length > 0 ? (
          isUncategorized == true ? (
            <this.renderUncategorizedCategory />
          ) : (
            <this.bodyTransaction />
          )
        ) : (
          <View style={{ height: 25, backgroundColor: "#EEEFF1" }} />
        )} */}

        <this.renderNewBodyTransaction />
      </ScrollView>
    );
  };
  render() {
    let { loading, error } = this.state;

    return (
      <Fragment>
        {error == true ? (
          <this.errorView />
        ) : loading == true ? (
          <this.loadingView />
        ) : (
          <this.renderBody />
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    width: "100%",
  },
  header: {
    elevation: 5,
    shadowColor: "#F0F0F0",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 0.9,
    height: 70,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
  },
  headerChild: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  headerBack: {
    paddingLeft: 15,
    borderWidth: 0,
    borderColor: "red",
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  seprator: {
    alignSelf: "center",
    marginVertical: 25,
    borderBottomColor: "#1D1E1F",
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  seprator2: {
    alignSelf: "center",
    marginVertical: 20,
    borderBottomColor: "#1D1E1F",
    width: "90%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.2,
  },
  renderCurrentButton: {
    paddingHorizontal: 7,
    alignItems: "center",
    borderWidth: 0,
    borderColor: "red",
    height: 35,
    backgroundColor: "#E6E6EC",
    borderRadius: 8,
    width: 130,
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  upperView: {
    backgroundColor: "#FFF",
    borderWidth: 0,
    borderColor: "red",
  },
  upperTotalAmountView: {
    alignSelf: "center",
    marginTop: 30,
  },
  upperTotalAmountText: {
    textAlign: "center",
    color: "#1D1E1F",
    fontSize: 22,
    fontWeight: "bold",
  },
  upperIconView: {
    marginTop: 8,
    flexDirection: "row",
    alignSelf: "center",
  },
  upperIconHikeText: {
    textAlign: "center",
    color: "#1D1E1F",
    fontSize: 10,
    paddingLeft: 5,
  },
  transactionTitle: {
    borderWidth: 0,
    borderColor: "yellow",
    color: "#1D1E1F",
    fontSize: 15,
    textAlign: "left",
    width: "70%",
  },
  transactionAmount: {
    borderWidth: 0,
    borderColor: "yellow",
    color: "#1D1E1F",
    fontSize: 15,
    textAlign: "right",
    width: "30%",
  },
  uncategoryTransactionlayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0,
    borderColor: "green",
  },
  transactionDate: {
    color: "#1D1E1F",
    opacity: 0.5,
    fontSize: 11,
    textAlign: "left",
  },
  plusCategoryText: {
    fontSize: 11,
    textAlign: "center",
    color: "#1D1E1F",
  },
  plusCategoryTouch: {
    borderColor: "#1C1C1D",
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    height: 25,
    paddingHorizontal: 15,
  },
  uncategoryContainer: {
    paddingVertical: 30,
    backgroundColor: "#FFF",
    borderColor: "red",
    borderWidth: 0,
    width: "90%",
    alignSelf: "center",
  },
  uncategorizedSeprator: {
    alignSelf: "center",
    marginVertical: 20,
    borderBottomColor: "#1D1E1F",
    width: "103%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.2,
  },
  newTransactionParentContainer: {
    borderWidth: 0,
    borderColor: "red",
    paddingVertical: 30,
    width: "90%",
    alignSelf: "center",
  },
  newTransactionChildContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newTransactionTitle: {
    fontSize: 15,
    color: "#1D1E1F",
    maxWidth: "60%",
    textAlign: "left",
  },
  newTransactionAmountTitle: {
    fontSize: 15,
    color: "#1D1E1F",
    maxWidth: "40%",
    textAlign: "right",
  },
  newTransactionChildContainer2: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newTransactionDateTitle: {
    alignSelf: "center",
    fontSize: 11,
    color: "#1D1E1F",
    opacity: 0.5,
    maxWidth: "30%",
  },
  newTransactionCategoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#A599EC",
    borderColor: "#A995F3",
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  newTransactionCategoryButtonText: {
    color: "#FFF",
    fontSize: 11,
  },
  commonSeperator: {
    borderColor: "#1D1E1F",
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.1,
    marginVertical: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    reduxState: state,
    categoryReduxData: state.plaidCategoryData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchExpenseByCategory: (type = 1) => {
      dispatch(fetchExpensesAsyncCreator(type));
    },
    fetchMainExepenseByCategory: (type = 0) => {
      dispatch(fetchMainExpenseAsyncCreator(type));
    },
    //staggingData: (staggingDataParam) => { dispatch(staggingDataParam); }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetectPlatform(ExpenseByCategoryChild, styles.container));

/*

renderUncategorizedCategory = () => {
    const { subExepenseByCategory } = this.state;
    const { ExpenseSubCategory } = subExepenseByCategory;
    //let expenseMoreOne = ExpenseSubCategory.filter( itr => itr.transaction.length > 0 );
    let customKey = 0;
    return (
      <Fragment>
        <View style={{ height: 25, backgroundColor: "#EEEFF1" }} />
        <View style={styles.uncategoryContainer}>
          {ExpenseSubCategory.map((singleExpenseCategory, categoryIndex) => {
            if (singleExpenseCategory.transaction.length > 0) {
              return singleExpenseCategory.transaction.map(
                (singleUncategorized, transactionIndex) => {
                  let showSeprator = true;
                  if (
                    categoryIndex == ExpenseSubCategory.length - 1 &&
                    transactionIndex ==
                      singleExpenseCategory.transaction.length - 1
                  ) {
                    showSeprator = false;
                  }
                  customKey++;
                  return (
                    <this.renderUncategoryTransactions
                      key={customKey}
                      items={{ ...singleUncategorized }}
                      showSeprator={showSeprator}
                    />
                  );
                }
              );
            } else {
              return null;
            }
          })}
        </View>
      </Fragment>
    );
  }; 
  
  
  
  renderUncategoryTransactions = ({ items, showSeprator }) => {
    const { name, amount, date } = items;
    let currentTransactionDateObj = date.split("-");
    let userData = { ...this.props.reduxState.userData.userData };
    const { expenseType } = this.props.navigation.getParam(
      "currentExpenseCategory"
    );
    const { current } = this.state.subCategoryRequestType;
    return (
      <Fragment>
        <View style={styles.uncategoryTransactionlayout}>
          <Text style={styles.transactionTitle}>{name}</Text>
          <Text style={styles.transactionAmount}>{`-$${numberWithCommas(
            amount
          )}`}</Text>
        </View>

        <View style={{ ...styles.uncategoryTransactionlayout, marginTop: 8 }}>
          <Text style={{ ...styles.transactionDate, alignSelf: "center" }}>
            {`${ALL_MONTHS[parseInt(currentTransactionDateObj[1]) - 1]} ${
              currentTransactionDateObj[2]
            }, ${currentTransactionDateObj[0]}`}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (userData.bankStatus !== "linked") {
                return this.bankNotConnectedPopup();
              }
              this.props.navigation.navigate("NCategoryScreen", {
                currentExecutingTransaction: {
                  ...items,
                  category: "uncategory",
                },
                resetTransactionScreen: (
                  runMethod = false,
                  directlyGoBack = false
                ) => {
                  if (runMethod == true) {
                    if (directlyGoBack == true) {
                      this.props.fetchMainExepenseByCategory(expenseType);
                      setTimeout(() => {
                        this.props.fetchExpenseByCategory(3);
                      }, 1300);
                      this.props.navigation.goBack();
                      return;
                    }
                    this.setState({ loading: true }, () => {
                      setTimeout(() => {
                        this.triggerExpenseSubCategoryServer();
                      }, 500);

                      if (current === expenseType) {
                        setTimeout(() => {
                          this.props.fetchMainExepenseByCategory(expenseType);
                        }, 1000);
                      }

                      setTimeout(() => {
                        this.props.fetchExpenseByCategory(3);
                      }, 1300);
                    });
                  }
                },
              });
            }}
            style={styles.plusCategoryTouch}
          >
            <Text style={styles.plusCategoryText}>+ Category</Text>
          </TouchableOpacity>
        </View>
        {showSeprator == true ? (
          <View style={styles.uncategorizedSeprator} />
        ) : null}
      </Fragment>
    );
  };
  

  bodyTransaction = () => {
    const { subExepenseByCategory } = this.state;
    const { ExpenseSubCategory } = subExepenseByCategory;
    return (
      <Fragment>
        <View style={{ height: 25, backgroundColor: "#EEEFF1" }} />
        <View style={{ paddingVertical: 30, backgroundColor: "#FFF" }}>
          {ExpenseSubCategory.map((singleCategory, index) => {
            if (
              singleCategory.subCategory.toLowerCase() ===
              "subcategory unavailable"
            ) {
              return (
                <this.renderWhenNoSubCategory
                  category={{ ...singleCategory }}
                  index={index}
                  key={index}
                />
              );
            }
            return (
              <this.renderSubCategory
                key={index}
                index={index}
                category={{ ...singleCategory }}
              />
            );
          })}
        </View>
      </Fragment>
    );
  };
  */
