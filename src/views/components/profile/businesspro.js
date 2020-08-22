import React, { Fragment } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Button as NativeButton,
  Card,
  Input,
  Text as Txt,
  Icon,
} from "react-native-elements";

import { Root } from "@components"; 
import AntDesign from "react-native-vector-icons/AntDesign";
import { Dropdown } from "react-native-material-dropdown";
import {
  BUSINESS_MODEL_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  STATE_OF_INCORP_OPTIONS,
  YEAR_FOUNDED_OPTIONS,
} from "../../../constants/constants";

import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
AntDesign.loadFont();

class Businesspro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      isDisabled: true,
      isSpinner: false,
      isBodyLoaded: true,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
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
      nav.goBack();
      return true;
    }
  };
  renderValues = (value) => {
    if (value == null || value == undefined || value == "") {
      return "";
    } else {
      return value;
    }
  };
  render() {
    const {
      userData,
      loading,
      isFetched,
      isError,
    } = this.props.reduxState.userData;
    const { isDisabled } = this.state;
    const readyImageAssets =
      userData.logo == "" || userData.logo == undefined || userData.logo == null
        ? { type: "require" }
        : { type: "uri" };

    return (
      <Root headerColor={"#FFF"} footerColor={"#FFF"} barStyle={"dark"}>
        <View style={styles.container}>
          <Spinner visible={loading && !isFetched} />
          {!loading && isFetched && !isError && (
            <Fragment>
              {/* <View style={{flexDirection:'row', width:'100%',marginTop:'1%',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=> this.props.navigation.navigate("Contact")}>
            <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
          </TouchableOpacity>
          <Text style={styles.header}>Business Profile</Text>Z
          <TouchableOpacity onPress={()=> this.props.navigation.navigate("BusinessproEdit",{ userData:userData }) }>
            <Text style={styles.editView}>Edit</Text>
          </TouchableOpacity>
        </View> */}

              <View
                style={{
                  paddingHorizontal: 10,
                  alignSelf: "center",
                  marginTop: 15,
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  borderWidth: 0,
                  borderColor: "black",
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "flex-end" }}
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
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  {/* <Text style={{ fontSize:20,fontWeight:"bold",color:"black" }}>{ `Settings` }</Text> */}
                  <Text style={styles.header}>Business Profile</Text>
                </View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("BusinessproEdit", {
                        userData: userData,
                      });
                    }}
                  >
                    <Text style={styles.editView}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.imgView}>
                {/* <Image source={{uri:`${this.state.userData.profilePic}`}} style={{height:92,width:92,alignSelf:'center',borderRadius:48}}></Image> */}

                {readyImageAssets.type == "uri" ? (
                  <Image
                    source={{ uri: userData.logo }}
                    style={{
                      height: 92,
                      width: 92,
                      alignSelf: "center",
                      borderRadius: 48,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../../assets/avatar1.png")}
                    style={{
                      height: 92,
                      width: 92,
                      alignSelf: "center",
                      borderRadius: 48,
                    }}
                  />
                )}
              </View>
              {/* <Text style={styles.header}>Create Business Profile</Text> */}
              {/* <Card containerStyle={styles.card}>
            <Icon
              name="image"
              type="font-awesome"
              containerStyle={styles.icon}
              color={"gray"}
            />
          </Card>
          <Button title="Add company logo" type="clear" /> */}
              <Input
                disabled={isDisabled}
                style={{ marginTop: "50px" }}
                placeholder={"Company Name"}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                value={userData.company}
              />
              <View style={styles.detailsContainer}>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Industry</Text>
                  <Dropdown
                    label={
                      this.renderValues(userData.industry).length == 0
                        ? "Select                   v"
                        : ""
                    }
                    disabled={isDisabled}
                    data={INDUSTRY_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={this.renderValues(userData.industry)}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Business Model</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={
                      this.renderValues(userData.businessModel).length == 0
                        ? "Select                   v"
                        : ""
                    }
                    data={BUSINESS_MODEL_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={this.renderValues(userData.businessModel)}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Company Size</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={
                      this.renderValues(userData.companySize).length == 0
                        ? "Select                   v"
                        : ""
                    }
                    data={COMPANY_SIZE_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={this.renderValues(userData.companySize)}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Year Founded</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={
                      this.renderValues(userData.yearFounded).length == 0
                        ? "Select                   v"
                        : ""
                    }
                    data={YEAR_FOUNDED_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={this.renderValues(userData.yearFounded)}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text
                    style={{ fontSize: 15, width: "60%" }}
                  >{`State of Incorporation`}</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={
                      this.renderValues(userData.stateIncorporated).length == 0
                        ? "Select            v"
                        : ""
                    }
                    data={STATE_OF_INCORP_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={{ width: "40%", marginTop: "-15%" }}
                    renderAccessory={() => null}
                    value={this.renderValues(userData.stateIncorporated)}
                  />
                </View>
              </View>
            </Fragment>
          )}
        </View>
      </Root>
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
    backgroundColor: "#fff",
    alignItems: "center",
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
  header: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  editView: {
    fontSize: 17,
    color: "#4A90E2",
  },
  icon: {
    marginTop: 5,
  },
  imgView: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 36,
    marginLeft: 140,
    marginRight: 138,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
});

const mapStateToProps = (state) => ({ reduxState: state });
const mapDispatchToProps = (dispatch) => ({ reduxDispatch: dispatch });
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Businesspro);
