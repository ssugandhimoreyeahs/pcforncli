import React, { Component, Fragment } from "react";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import ToggleSwitch from "toggle-switch-react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DialogInput from "react-native-dialog-input";
import { connect } from "react-redux";
import { allFirstWordCapital, firstLetterCapital } from "../../../api/common";
import Spinner from "react-native-loading-spinner-overlay";
import { fetchExpensesAsyncCreator } from "../../../reducers/expensecategory";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
import {
  addPlaidCategory,
  deletePlaidCategory,
  editPlaidCategory,
  addCategoryToTransaction,
  changeAllSimilarTransaction,
} from "../../../api/api";
import { toTitleCase } from '@utils';
import {
  PLAID_EXPENSE_CATEGORIES,
  EXPENSES_COLOR,
  getCategoryInitials,
} from "../../../api/common";
import {
  CHANGECATEGORY,
  ERRORCATEGORY,
  ADDEDCATEGORY,
  DELETECATEGORY,
} from "../../../api/message";
import { Root } from "@components";
import {
  getCategoryId,
  getCategoryName,
  getPlaidCategories,
  isCategoryExist,
} from "../expensebycategory/categoryFactory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";

AntDesign.loadFont();
EvilIcons.loadFont();
MaterialCommunityIcons.loadFont();

class CategoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false,
      isEdit: false,

      isSpinner: false,
      addCategoryDialogVisible: false,
      showPleaseEnterCategory: false,
      editInitDialogValue: "",
      editCategoryDialogVisible: false,
      pointIconToDefaultCategory: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
    let recievedData = this.props.navigation.getParam(
      "currentExecutingTransaction"
    );
  }

  componentWillMount() {
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
      return true;
    }
  };

  handleHeaderButton = () => {
    const { isEdit } = this.state;
    if (isEdit) {
      this.setState({ isEdit: false });
    } else {
      this.props.navigation.goBack();
    }
  };
  header = () => {
    let { category, error, isFetched, loading } = this.props.categoryReduxData;
    // error = true;
    const { isEdit } = this.state;
    let antDesignIcon = isEdit == true ? `close` : "close";
    const showEditTray = this.props.navigation.getParam("showEditTray", true);
    return (
      <View style={styles.header}>
        <View style={styles.myHeaderParent}>
          <TouchableOpacity onPress={this.handleHeaderButton}>
            <AntDesign name={`${antDesignIcon}`} size={22} color={"#000000"} />
          </TouchableOpacity>

          {error == true ? (
            <View style={styles.editTrayWidth} />
          ) : isEdit == true ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({ isEdit: false, toggle: false });
              }}
            >
              <Text style={styles.editHeaderTitle}>Done</Text>
            </TouchableOpacity>
          ) : showEditTray == true ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({ isEdit: true, toggle: false });
              }}
            >
              <Text style={styles.editHeaderTitle}>Edit Categories</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editTrayWidth} />
          )}
        </View>
      </View>
    );
  };

  addCategory = () => {
    const { isEdit, toggle } = this.state;
    return (
      <View style={styles.addCategoryParentView}>
        {isEdit == false ? (
          <Fragment>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 11, color: "#000", fontWeight: "600" }}>
                Apply change to all similar transactions
              </Text>
              <Text style={{ fontSize: 10, color: "#000" }}>
                Name of Recipient
              </Text>
            </View>

            <View>
              <ToggleSwitch
                isOn={toggle}
                onColor="limegreen"
                offColor="#999"
                size="large"
                onToggle={(isOn) => {
                  this.setState({ toggle: !toggle });
                }}
              />
            </View>
          </Fragment>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.setState((prevState) => {
                return {
                  addCategoryDialogVisible: !prevState.addCategoryDialogVisible,
                };
              });
            }}
            style={{ justifyContent: "center", paddingLeft: 4 }}
          >
            <Text style={styles.addCategoryTitle}>Add Category</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  seprator = () => {
    return <View style={styles.seprator} />;
  };

  handleChangeCategory = async (categoryId, categoryName) => {
    if (this.state.toggle) {
      const {
        clientCategoryObjectId: transactionCategory,
        _id,
      } = this.props.navigation.getParam("currentExecutingTransaction");
      let axiosBody = {};
      //axiosBody.oldCategoryId = getCategoryId(transactionCategory);
      //axiosBody.updateCategoryId = getCategoryId(categoryName);
      axiosBody.oldCategoryId = transactionCategory;
      axiosBody.updateCategoryId = categoryId;
      axiosBody.transactionId = _id;

      changeAllSimilarTransaction(axiosBody)
        .then((response) => {
          setTimeout(() => {
            this.setState({ isSpinner: false }, () => {
              this.props.navigation.getParam("resetTransactionScreen")(
                true,
                true
              );
              //setTimeout(() => {
              this.props.navigation.goBack();
              //}, 600);
            });
          }, 1000);
        })
        .catch((error) => {
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
        });
    } else {
      const { _id } = this.props.navigation.getParam(
        "currentExecutingTransaction"
      );
      let changePlaidCategoryResponse = await addCategoryToTransaction(
        _id,
        categoryId
      );
      if (changePlaidCategoryResponse.result == true) {
        setTimeout(() => {
          this.setState({ isSpinner: false }, () => {
            this.props.navigation.getParam("resetTransactionScreen")(
              true,
              false
            );
            // setTimeout(() => {
            this.props.navigation.goBack();
            // }, 600);
          });
        }, 1000);
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
    }
  };

  handleChangeCategoryAlert = (categoryId, categoryName) => {
    Alert.alert(CHANGECATEGORY.title, CHANGECATEGORY.message, [
      { text: CHANGECATEGORY.button1 },
      {
        text: CHANGECATEGORY.button2,
        onPress: () => {
          this.setState({ isSpinner: true }, () => {
            this.handleChangeCategory(categoryId, categoryName);
          });
        },
      },
    ]);
  };

  deletePlaidCategory = async (categoryId) => {
    const plaidCategoryDeleteResponse = await deletePlaidCategory(categoryId);
    if (plaidCategoryDeleteResponse.result == true) {
      setTimeout(() => {
        this.setState({ isSpinner: false }, () => {
          setTimeout(() => {
            this.props.fetchPlaidCategoryDispatch();
            //this.props.navigation.getParam("resetTransactionScreen")();
            setTimeout(() => {
              this.props.navigation.getParam("resetTransactionScreen")();
            }, 500);

            setTimeout(() => {
              this.props.fetchExpenseByCategory(3);
            }, 2000);

            setTimeout(() => {
              this.props.fetchMainExepenseByCategory(0);
            }, 2500);
          }, 500);
        });
      }, 500);
      // this.setState((prevState)=>{ return { isSpinner: !prevState.isSpinner } },()=>{
      //     setTimeout(()=>{

      //             this.props.navigation.getParam("resetTransactionScreen")();
      //             this.props.fetchExpenseByCategory(3);
      //             this.props.fetchPlaidCategoryDispatch();

      //     },500);
      // })
    } else {
      this.setState(
        { isSpinner: false, pointIconToDefaultCategory: false },
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
  };

  handleCategoryDataDelete = (categoryId, categoryName) => {
    Alert.alert(
      DELETECATEGORY.title,
      DELETECATEGORY.message(categoryName),
      [
        { text: DELETECATEGORY.button1 },
        {
          text: DELETECATEGORY.button2,
          onPress: () => {
            //Api Trigers here for deleting the Category Data
            let { clientCategory } = this.props.navigation.getParam(
              "currentExecutingTransaction"
            );
            let pointIconToDefaultCategory = false;

            if (categoryName.toLowerCase() == clientCategory.toLowerCase()) {
              pointIconToDefaultCategory = true;
            }
            this.setState(
              { isSpinner: true, pointIconToDefaultCategory },
              () => {
                this.deletePlaidCategory(categoryId);
              }
            );
          },
        },
      ],
      { cancelable: false }
    );
  };
  renderSingleCategory = ({ categoryData }) => {
    let executingTransactionDetails = this.props.navigation.getParam(
      "currentExecutingTransaction"
    );

    const { isEdit, pointIconToDefaultCategory } = this.state;
    let { category, error, isFetched, loading } = this.props.categoryReduxData;
    let {
      categoryName,
      index,
      customcategories,
      categoryIcon,
      id,
      categoryColor,
    } = categoryData;
    let showCheckIcon =
      pointIconToDefaultCategory == true
        ? categoryName == executingTransactionDetails.clientDefaultCategory
          ? true
          : false
        : categoryName == executingTransactionDetails.clientCategory
        ? true
        : false;

    return (
      <Fragment>
        {isEdit == false ? (
          <TouchableOpacity
            disabled={showCheckIcon}
            onPress={() => {
              this.handleChangeCategoryAlert(id, categoryName);
            }}
            style={styles.renderSingleCategoryParentView}
          >
            <View style={{ width: "15%" }}>
              {customcategories == false ? (
                <Image
                  source={categoryIcon}
                  height={36}
                  width={36}
                  style={{ height: 36, width: 36 }}
                />
              ) : (
                <View
                  style={{
                    ...styles.renderSingleCategoryCustomIconView,
                    backgroundColor: categoryColor,
                  }}
                >
                  <Text style={{ color: "#FFF" }}>
                    {getCategoryInitials(categoryName)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.renderSingleCategoryTitleView}>
              <Text style={styles.renderSingleCategoryTitleText}>
                {toTitleCase(categoryName)}
              </Text>
            </View>
            {showCheckIcon == true ? (
              <View style={styles.renderSingleCategoryCheckView}>
                <MaterialIcons name="check" size={20} color={"#000000"} />
              </View>
            ) : (
              <View style={styles.emptyCheckView} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.viewRenderSingleCategoryParent}>
            <View style={{ width: "15%" }}>
              {customcategories == false ? (
                <Image
                  source={categoryIcon}
                  height={36}
                  width={36}
                  style={{ height: 36, width: 36 }}
                />
              ) : (
                <View
                  style={{
                    ...styles.viewRenderSingleCategoryParentView,
                    backgroundColor: categoryColor,
                  }}
                >
                  <Text style={{ color: "#FFF" }}>
                    {getCategoryInitials(categoryName)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.viewRenderSingleCategoryTitleBody}>
              <Text style={styles.viewRenderSingleCategoryText}>
                {toTitleCase(categoryName)}
              </Text>
            </View>

            <View style={styles.viewRenderSingleCategoryLeftBody}>
              {customcategories == true ? (
                <Fragment>
                  <TouchableOpacity
                    onPress={() => {
                      this.handleCategoryDataEdit(
                        id,
                        firstLetterCapital(categoryName)
                      );
                    }}
                    style={{ paddingRight: 7 }}
                  >
                    <EvilIcons name="pencil" size={23} color={"#000"} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      this.handleCategoryDataDelete(
                        id,
                        firstLetterCapital(categoryName)
                      );
                    }}
                  >
                    <MaterialIcons name="delete" size={23} color={"#000"} />
                  </TouchableOpacity>
                </Fragment>
              ) : null}
            </View>
          </View>
        )}
        {category.length - 1 > index ? <this.seprator /> : null}
      </Fragment>
    );
  };

  handleCategoryDataEdit = async (categoryId, categoryName) => {
    this.setState(
      {
        editInitDialogId: categoryId,
        editInitDialogValue: categoryName,
      },
      () => {
        this.setState({ editCategoryDialogVisible: true });
      }
    );
  };

  renderCategories = () => {
    let { category, error, isFetched, loading } = this.props.categoryReduxData;
    return (
      <View style={styles.categoryBlock}>
        {category.map((singleCategory, index) => {
          return (
            <this.renderSingleCategory
              key={index}
              categoryData={{ ...singleCategory, index }}
            />
          );
        })}
      </View>
    );
  };

  handleReloadCategories = () => {
    this.props.fetchPlaidCategoryDispatch();
  };
  errorView = () => {
    return (
      <View style={styles.errorParentView}>
        <View style={styles.errorChildView}>
          <AntDesign
            name="exclamationcircle"
            size={20}
            style={{ color: "#070640", alignSelf: "center" }}
          />
          <Text style={{ marginLeft: 10, alignSelf: "center" }}>
            Something went wrong!
          </Text>
        </View>
        <View style={styles.errorCustomView}>
          <TouchableOpacity
            onPress={() => {
              this.handleReloadCategories();
            }}
            style={styles.errorTouchStyle}
          >
            <View style={styles.errorTouchStyleChild}>
              <MaterialCommunityIcons
                style={{ marginTop: 4 }}
                name="reload"
                size={20}
                color="white"
              />
              <Text style={{ color: "white", paddingLeft: 5 }}>Reload</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  addNewCategory = (categoryInput) => {
    this.setState(
      { addCategoryDialogVisible: false, isSpinner: true },
      async () => {
        //const addCategoryResponse = await addPlaidCategory(allFirstWordCapital(categoryInput));
        const addCategoryResponse = await addPlaidCategory(
          categoryInput.toLowerCase()
        );
        if (addCategoryResponse.result == true) {
          setTimeout(() => {
            this.setState(
              { isSpinner: false, showPleaseEnterCategory: false },
              () => {
                setTimeout(() => {
                  Alert.alert(
                    ADDEDCATEGORY.title,
                    ADDEDCATEGORY.message,
                    [
                      {
                        text: ADDEDCATEGORY.button1,
                        onPress: () => {
                          this.setState({ isEdit: false }, () => {
                            this.props.fetchPlaidCategoryDispatch();
                          });
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }, 500);
              }
            );
          }, 1300);
        } else if (addCategoryResponse.result == false) {
          setTimeout(() => {
            this.setState(
              { isSpinner: false, showPleaseEnterCategory: false },
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
          }, 1300);
        } else {
          setTimeout(() => {
            this.setState(
              { isSpinner: false, showPleaseEnterCategory: false },
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
          }, 1300);
        }
      }
    );
  };

  handleEditPlaidCategoryApi = (category) => {
    this.setState(
      { isSpinner: true, editCategoryDialogVisible: false },
      async () => {
        const editPlaidCategoryResponse = await editPlaidCategory(
          this.state.editInitDialogId,
          category.toLowerCase()
        );
        if (editPlaidCategoryResponse.result == true) {
          setTimeout(() => {
            this.setState({ isSpinner: false }, () => {
              setTimeout(() => {
                //this.props.fetchPlaidCategoryDispatch();

                //code change after the edit of the category by user
                // this.setState({ isEdit: false },()=>{
                this.props.fetchPlaidCategoryDispatch();
                // });
                setTimeout(() => {
                  this.props.navigation.getParam("resetTransactionScreen")();
                }, 500);
                setTimeout(() => {
                  this.props.fetchExpenseByCategory(3);
                }, 1500);
              }, 500);
            });
          }, 1000);
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
      }
    );
  };
  isCategoryAlreadyExistOnClient = (categoryInput, actionType) => {
    if (categoryInput == "" && actionType == "add") {
      this.setState({ showPleaseEnterCategory: true });
      return true;
    }
    if (categoryInput == "" && actionType == "edit") {
      this.setState({ showPleaseEnterCategory: true });
      return true;
    }
    let isCategoryAlreadyPresent = false;
    isCategoryAlreadyPresent = isCategoryExist(categoryInput);

    if (isCategoryAlreadyPresent) {
      this.setState(
        {
          isSpinner: true,
          editCategoryDialogVisible: false,
          addCategoryDialogVisible: false,
          showPleaseEnterCategory: false,
        },
        () => {
          setTimeout(() => {
            this.setState({ isSpinner: false }, () => {
              setTimeout(() => {
                Alert.alert(
                  "Message",
                  "Category Already Exist",
                  [{ text: "Okay" }],
                  { cancelable: false }
                );
              }, 100);
            });
          }, 700);
        }
      );
      return true;
    } else {
      return isCategoryAlreadyPresent;
    }
  };
  renderBody = () => {
    let { category, error, isFetched, loading } = this.props.categoryReduxData;
    //loading = true;
    let {
      editInitDialogValue,
      editCategoryDialogVisible,
      addCategoryDialogVisible,
      showPleaseEnterCategory,
    } = this.state;
    return (
      <Fragment>
        <this.header />
        <this.addCategory />
        <View style={{ marginTop: 20 }} />
        <ScrollView keyboardShouldPersistTaps={"always"}>
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
              let isCategoryAlreadyExist = this.isCategoryAlreadyExistOnClient(
                categoryInput,
                "add"
              );
              if (!isCategoryAlreadyExist) {
                this.addNewCategory(categoryInput);
              }
            }}
            closeDialog={() => {
              this.setState({
                addCategoryDialogVisible: false,
                showPleaseEnterCategory: false,
              });
            }}
          />

          <DialogInput
            dialogStyle={{ marginTop: -80 }}
            isDialogVisible={editCategoryDialogVisible}
            initValueTextInput={editInitDialogValue}
            title={"Edit Category"}
            message={
              <Fragment>
                <Text>{"Please Edit Category Here..."}</Text>
                {showPleaseEnterCategory == true ? (
                  <Text
                    style={{ color: "red" }}
                  >{`\n\nPlease Enter Category Name`}</Text>
                ) : null}
              </Fragment>
            }
            hintInput={"Name of the Category"}
            submitInput={(editInitDialogNewValue) => {
              let isCategoryAlreadyExist = this.isCategoryAlreadyExistOnClient(
                editInitDialogNewValue,
                "edit"
              );
              if (!isCategoryAlreadyExist) {
                this.handleEditPlaidCategoryApi(editInitDialogNewValue);
              }
              return false;
              this.setState(
                { isSpinner: true, editCategoryDialogVisible: false },
                () => {
                  this.handleEditPlaidCategoryApi(editInitDialogNewValue);
                }
              );
            }}
            closeDialog={() => {
              this.setState({ editCategoryDialogVisible: false });
            }}
          />

          {loading == false ? (
            <this.renderCategories />
          ) : (
            <ActivityIndicator
              style={{ marginTop: 50 }}
              animating={true}
              size={"large"}
            />
          )}
        </ScrollView>
      </Fragment>
    );
  };
  render() {
    let { category, error, isFetched, loading } = this.props.categoryReduxData;

    return (
      <Root headerColor={"#F8F8F8"} footerColor={"#EFEFF1"} barStyle={"dark"}>
        <View style={styles.container}>
          <Spinner visible={this.state.isSpinner} />
          {error == true ? (
            <Fragment>
              <this.header />
              <this.errorView />
            </Fragment>
          ) : (
            <this.renderBody />
          )}
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFF1",
    height: "100%",
    width: "100%",
  },
  header: {
    elevation: 5,
    shadowColor: "#F0F0F0",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1.5,
    height: 70,
    backgroundColor: "#F8F8F8",
  },
  seprator: {
    marginVertical: 16,
    borderBottomColor: "#1D1E1F",
    opacity: 0.2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  categoryBlock: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    width: "90%",
    marginTop: 10,
    marginBottom: 40,
    borderColor: "black",
    borderWidth: 0,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 1, width: 1 },
    elevation: 5,
    paddingLeft: 18,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
    alignSelf: "center",
  },
  myHeaderParent: {
    //borderWidth:1,borderColor:"red",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "92%",
    marginTop: 30,
    alignSelf: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    color: "#000",
  },
  editHeaderTitle: {
    color: "#4A90E2",
    fontSize: 17,
    textAlign: "left",
  },
  addCategoryParentView: {
    paddingHorizontal: 10,
    paddingVertical: 17,
    marginTop: 25,
    height: 70,
    backgroundColor: "#FFF",
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addCategoryTitle: {
    fontSize: 13,
    color: "#000",
    fontWeight: "600",
  },
  renderSingleCategoryParentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "93%",
    paddingLeft: 6,
  },
  renderSingleCategoryCustomIconView: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    borderColor: "#FFF",
  },
  renderSingleCategoryTitleView: {
    width: "79%",
    borderWidth: 0,
    borderColor: "red",
    justifyContent: "center",
    paddingLeft: 13,
  },
  renderSingleCategoryTitleText: {
    textAlign: "left",
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  renderSingleCategoryCheckView: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCheckView: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewRenderSingleCategoryParent: {
    paddingLeft: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  viewRenderSingleCategoryParentView: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    borderColor: "#FFF",
  },
  viewRenderSingleCategoryTitleBody: {
    width: "70%",
    borderWidth: 0,
    borderColor: "red",
    justifyContent: "center",
    paddingLeft: 8,
  },
  viewRenderSingleCategoryText: {
    textAlign: "left",
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
  viewRenderSingleCategoryLeftBody: {
    width: "15%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  errorParentView: {
    width: "100%",
    height: "85%",
    justifyContent: "center",
    alignSelf: "center",
    borderColor: "red",
    borderWidth: 2,
  },
  errorChildView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  errorCustomView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  errorTouchStyle: {
    height: 35,
    width: 170,
    borderRadius: 20,
    backgroundColor: "#090643",
    borderColor: "#090643",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTouchStyleChild: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    fetchMainExepenseByCategory: (type = 0) => {
      dispatch(fetchMainExpenseAsyncCreator(type));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryScreen);
