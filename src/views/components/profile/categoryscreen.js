import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  StyleSheet,
  ScrollView,
} from "react-native"; 

import ToggleSwitch from "toggle-switch-react-native";
import { Switch, ActivityIndicator } from "react-native-paper";
import { connect } from "react-redux";
import DialogInput from "react-native-dialog-input";
import Spinner from "react-native-loading-spinner-overlay";
import {
  addPlaidCategory,
  deletePlaidCategory,
  editPlaidCategory,
  addCategoryToTransaction,
} from "../../../api/api";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
import { allFirstWordCapital } from "../../../api/common";
import { StackActions, NavigationActions } from "react-navigation";
import { fetchExpensesAsyncCreator } from "../../../reducers/expensecategory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
 

import {
  DELETECATEGORY,
  ADDEDCATEGORY,
  ERRORCATEGORY,
  CHANGECATEGORY,
} from "../../../api/message";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

SimpleLineIcons.loadFont();
MaterialIcons.loadFont();
EvilIcons.loadFont();
AntDesign.loadFont();
const resetAction = StackActions.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: "Dashboard" }),
    NavigationActions.navigate({ routeName: "Checking" }),
  ],
});

function Separator() {
  return <View style={Styles.separator} />;
}

class CategoryScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      showPleaseEnterCategory: false,
      isUsefulTouched: false,
      toggle: false,
      addCategoryDialogVisible: false,
      isSpinner: false,
      editCategoryDialogVisible: false,
      editInitDialogValue: "",
      editInitDialogId: "",
      editInitDialogNewValue: "",
      handleCategoryChangeValue: "",
    };
  }

  onTog = () => {
    this.setState((prevState, toggle) => {
      return { toggle: !prevState.toggle };
    });
  };
  FirstViewComponent = () => {
    return (
      <View
        style={{
          width: "95%",
          height: "10%",
          elevation: 10,
          backgroundColor: "#FFFFFF",
          alignSelf: "center",
          marginTop: 24,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.setState((prevState) => {
              return {
                addCategoryDialogVisible: !prevState.addCategoryDialogVisible,
              };
            });
          }}
        >
          <Text style={{ fontSize: 12, color: "#000000", marginLeft: 12 }}>
            Add Category
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  SecondViewComponent = () => {
    return (
      <View
        style={{
          width: "95%",
          height: "10%",
          elevation: 10,
          backgroundColor: "#FFFFFF",
          alignSelf: "center",
          marginTop: 24,
        }}
      >
        <View
          style={{
            width: "95%",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 13,
          }}
        >
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 12, color: "#000000" }}>
              Apply change to all similar transactions
            </Text>
            <Text style={{ fontSize: 10, color: "#000000" }}>
              Name of Recipient
            </Text>
          </View>
          <View>
            <ToggleSwitch
              isOn={this.state.toggle}
              onColor="limegreen"
              offColor="#999"
              size="large"
              onToggle={(isOn) => this.onTog()}
            />
          </View>
        </View>
      </View>
    );
  };

  addNewPlaidTransactionCategory = async (categoryInput) => {
    if (categoryInput != "") {
      this.setState({ addCategoryDialogVisible: false, isSpinner: true });
      console.log(
        "Category before added - ",
        allFirstWordCapital(categoryInput)
      );
      const addCategoryResponse = await addPlaidCategory(
        allFirstWordCapital(categoryInput)
      );
      if (addCategoryResponse.result == true) {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              Alert.alert(
                ADDEDCATEGORY.title,
                ADDEDCATEGORY.message,
                [
                  {
                    text: ADDEDCATEGORY.button1,
                    onPress: () => {
                      this.props.fetchPlaidCategoryDispatch();
                    },
                  },
                ],
                { cancelable: false }
              );
            }, 100);
          }
        );
      } else if (addCategoryResponse.result == false) {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              Alert.alert(
                ERRORCATEGORY.title,
                ERRORCATEGORY.message,
                [{ text: ERRORCATEGORY.button1 }],
                { cancelable: false }
              );
            }, 100);
          }
        );
      } else {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              Alert.alert(
                ERRORCATEGORY.title,
                ERRORCATEGORY.message,
                [{ text: ERRORCATEGORY.button1 }],
                { cancelable: false }
              );
            }, 100);
          }
        );
      }
    } else {
      this.setState({ showPleaseEnterCategory: true });
    }
  };
  deletePlaidCategory = async (categoryId) => {
    const plaidCategoryDeleteResponse = await deletePlaidCategory(categoryId);
    if (plaidCategoryDeleteResponse.result == true) {
      this.setState(
        (prevState) => {
          return { isSpinner: !prevState.isSpinner };
        },
        () => {
          setTimeout(() => {
            this.props.navigation.getParam("resetTransactionScreen")();
            this.props.fetchExpenseByCategory(3);
            this.props.fetchPlaidCategoryDispatch();
          }, 500);
        }
      );
    } else {
      this.setState({ isSpinner: false }, () => {
        setTimeout(() => {
          Alert.alert(
            ERRORCATEGORY.title,
            ERRORCATEGORY.message,
            [{ text: ERRORCATEGORY.button1 }],
            { cancelable: false }
          );
        }, 100);
      });
    }
  };
  handleCategoryDataDelete = (categoryId, categoryName) => {
    console.log("Category Id to be deleted ", categoryId, " ", categoryName);
    Alert.alert(
      DELETECATEGORY.title,
      DELETECATEGORY.message(categoryName),
      [
        { text: DELETECATEGORY.button1 },
        {
          text: DELETECATEGORY.button2,
          onPress: () => {
            //Api Trigers here for deleting the Category Data
            this.setState({ isSpinner: true }, () => {
              this.deletePlaidCategory(categoryId);
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  handleCategoryDataEdit = async (categoryId, categoryName) => {
    this.setState(
      { editInitDialogId: categoryId, editInitDialogValue: categoryName },
      () => {
        this.setState({ editCategoryDialogVisible: true });
      }
    );
  };

  triggerAddCategoryToTransaction = async (categoryId, categoryName) => {
    const { _id } = this.props.navigation.getParam(
      "currentExecutingTransaction"
    );
    console.log("Change plaid category request - ", _id, "  ", categoryId);
    const changePlaidCategoryResponse = await addCategoryToTransaction(
      _id,
      categoryId
    );
    console.log(
      "Testing for the changing category responses ----------------------------"
    );
    console.log(changePlaidCategoryResponse);
    console.log(
      "---------------------------------ends here------------------------"
    );
    if (changePlaidCategoryResponse.result == true) {
      this.setState(
        { handleCategoryChangeValue: categoryName, isSpinner: false },
        () => {
          // this.props.navigation.getParam("resetTransactionScreen")();
          this.props.fetchExpenseByCategory(3);
          //this.props.fetchMainExepenseByCategory();
          setTimeout(() => {
            // Alert.alert("Message","Transaction Category Successfully Changed",[
            //     { text:"Ok",onPress:()=>{
            //this.props.navigation.dispatch(resetAction);
            this.props.navigation.getParam("resetTransactionScreen")();
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 500);

            //     }}
            // ])
          }, 100);
        }
      );
    } else {
      this.setState({ isSpinner: false }, () => {
        setTimeout(() => {
          Alert.alert(
            ERRORCATEGORY.title,
            ERRORCATEGORY.message,
            [{ text: ERRORCATEGORY.button1 }],
            { cancelable: false }
          );
        }, 100);
      });
    }
  };
  handleAddCategoryToTransaction = (categoryId, categoryName) => {
    console.log("change Request name - ", categoryName);
    Alert.alert(CHANGECATEGORY.title, CHANGECATEGORY.message, [
      { text: CHANGECATEGORY.button1 },
      {
        text: CHANGECATEGORY.button2,
        onPress: () => {
          this.setState({ isSpinner: true }, () => {
            this.triggerAddCategoryToTransaction(categoryId, categoryName);
          });
        },
      },
    ]);
  };
  CategoryComponent = (props) => {
    // console.log(props.showEditTray);
    const readyDesign = props.index == true ? { marginTop: 24 } : {};
    const { handleCategoryChangeValue } = this.state;
    const { category } = this.props.navigation.getParam(
      "currentExecutingTransaction"
    );
    let readyCheck =
      handleCategoryChangeValue.length == 0
        ? category
        : handleCategoryChangeValue;
    return (
      <React.Fragment>
        {this.state.isUsefulTouched == true ? (
          <View style={{ width: "100%", alignSelf: "center", ...readyDesign }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                width: "90%",
                alignSelf: "center",
              }}
            >
              <Text style={{ marginLeft: 12 }}>{props.categoryName}</Text>
              {this.state.isUsefulTouched == true &&
              props.showEditTray == true ? (
                <Fragment>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.handleCategoryDataEdit(
                          props.categoryId,
                          props.categoryName
                        );
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#FFFFFF",
                          width: 34,
                          height: 30,
                        }}
                      >
                        <EvilIcons name="pencil" size={23} color={"#000000"} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.handleCategoryDataDelete(
                          props.categoryId,
                          props.categoryName
                        );
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#FFFFFF",
                          width: 34,
                          height: 30,
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          size={20}
                          color={"#000000"}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              ) : null}
            </View>
            <Separator style={Styles.separator} />
          </View>
        ) : (
          <TouchableOpacity
            style={{ width: "100%", alignSelf: "center", ...readyDesign }}
            onPress={() => {
              this.handleAddCategoryToTransaction(
                props.categoryId,
                props.categoryName
              );
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                width: "90%",
                alignSelf: "center",
              }}
            >
              <Text style={{ marginLeft: 12 }}>{props.categoryName}</Text>
              {props.categoryName == readyCheck ? (
                <Fragment>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "#FFFFFF",
                          width: 34,
                          height: 30,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={"#000000"}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              ) : null}
            </View>
            <Separator style={Styles.separator} />
          </TouchableOpacity>
        )}
      </React.Fragment>
    );
  };

  handleUpdatePlaidCategoryApi = async (category) => {
    const editPlaidCategoryResponse = await editPlaidCategory(
      this.state.editInitDialogId,
      category
    );
    if (editPlaidCategoryResponse.result == true) {
      this.setState(
        (prevState) => {
          return { isSpinner: !prevState.isSpinner };
        },
        () => {
          setTimeout(() => {
            //this.props.fetchPlaidCategoryDispatch();

            //code change after the edit of the category by user
            this.props.navigation.getParam("resetTransactionScreen")();
            this.props.fetchExpenseByCategory(3);
            this.props.fetchPlaidCategoryDispatch();
          }, 500);
        }
      );
    } else {
      this.setState({ isSpinner: false }, () => {
        setTimeout(() => {
          Alert.alert(
            ERRORCATEGORY.title,
            ERRORCATEGORY.message,
            [{ text: ERRORCATEGORY.button1 }],
            { cancelable: false }
          );
        }, 100);
      });
    }
  };
  render() {
    const { categoryReduxData } = this.props;
    const {
      addCategoryDialogVisible,
      isSpinner,
      editCategoryDialogVisible,
      editInitDialogValue,
      showPleaseEnterCategory,
    } = this.state;

    console.log(this.props.navigation.getParam("currentExecutingTransaction"));

    return (
      <View style={Styles.margins}>
        <Spinner visible={isSpinner} />
        <View
          style={{
            width: "100%",
            height: 100,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {this.state.isUsefulTouched == false ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  width: 34,
                  height: 30,
                  marginTop: 54,
                  marginLeft: 10,
                }}
              >
                <AntDesign name="left" size={25} color={"#000000"} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => {
                  return { isUsefulTouched: !prevState.isUsefulTouched };
                });
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  width: 34,
                  height: 30,
                  marginTop: 54,
                  marginLeft: 10,
                }}
              >
                <AntDesign name="close" size={25} color={"#000000"} />
              </View>
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontSize: 17,
              width: 129,
              marginLeft: 45,
              marginRight: 45,
              marginTop: 54,
              height: 22,
              color: "#000000",
            }}
          >
            Select Category
          </Text>
          {this.state.isUsefulTouched == false ? (
            <TouchableOpacity
              onPress={() => {
                this.setState((prevState) => {
                  return { isUsefulTouched: !prevState.isUsefulTouched };
                });
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  marginRight: 10,
                  marginTop: 54,
                }}
              >
                <Text style={{ color: "#4A90E2", fontSize: 17 }}>Edit</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={true}
              onPress={() => {
                this.setState((prevState) => {
                  return { isUsefulTouched: !prevState.isUsefulTouched };
                });
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  marginRight: 10,
                  marginTop: 54,
                }}
              >
                <Text
                  style={{ color: "#4A90E2", fontSize: 17 }}
                >{`     `}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {this.state.isUsefulTouched
          ? this.FirstViewComponent()
          : this.SecondViewComponent()}
        <DialogInput
          dialogStyle={{ marginTop: -80 }}
          isDialogVisible={addCategoryDialogVisible}
          title={"Add Category"}
          message={
            <Fragment>
              <Text>{"Please Add New Category Here..."}</Text>
              {showPleaseEnterCategory == true ? (
                <Text
                  style={{ color: "red" }}
                >{`\n\nPlease Enter Category Name`}</Text>
              ) : null}
            </Fragment>
          }
          hintInput={"Name of the Category"}
          submitInput={(categoryInput) => {
            console.log("User entered new category - ", categoryInput);
            this.addNewPlaidTransactionCategory(categoryInput);
          }}
          closeDialog={() => {
            console.log("Cancle Pressed.....");
            this.setState({
              addCategoryDialogVisible: false,
              showPleaseEnterCategory: false,
            });
          }}
        />

        <DialogInput
          isDialogVisible={editCategoryDialogVisible}
          initValueTextInput={editInitDialogValue}
          title={"Edit Category"}
          message={"Please Edit Category Here..."}
          hintInput={"Name of the Category"}
          submitInput={(editInitDialogNewValue) => {
            this.setState(
              { editCategoryDialogVisible: false, isSpinner: true },
              () => {
                this.handleUpdatePlaidCategoryApi(editInitDialogNewValue);
              }
            );
          }}
          closeDialog={() => {
            this.setState({ editCategoryDialogVisible: false });
          }}
        />

        <ScrollView>
          {categoryReduxData.loading == true ? (
            <ActivityIndicator
              color="#070640"
              size={"large"}
              style={{ marginTop: 30 }}
            />
          ) : (
            <View
              style={{
                width: "95%",
                elevation: 10,
                backgroundColor: "#FFFFFF",
                alignSelf: "center",
                marginTop: 24,
                justifyContent: "space-between",
                flexDirection: "column",
                marginVertical: 24,
              }}
            >
              {categoryReduxData.isFetched == true &&
              categoryReduxData.error == false ? (
                <Fragment>
                  {categoryReduxData.category.map(
                    (singleCategoryData, indexing) => {
                      return (
                        <this.CategoryComponent
                          key={indexing}
                          index={indexing == 0 ? true : false}
                          categoryName={`${singleCategoryData.categoryName}`}
                          categoryId={singleCategoryData.id}
                          showEditTray={
                            singleCategoryData.customcategories == true
                              ? true
                              : false
                          }
                        />
                      );
                    }
                  )}
                </Fragment>
              ) : null}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  margins: {
    backgroundColor: "#EEEFF1",
    flex: 1,
  },
  separator: {
    marginVertical: 24,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 12,
    marginRight: 12,
  },
});

const mapStateToProps = (state) => {
  return {
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
    //fetchMainExepenseByCategory: (type = 1) => { dispatch(fetchMainExpenseAsyncCreator(type)) }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryScreen);
