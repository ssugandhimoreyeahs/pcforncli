import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  StatusBar,
} from "react-native";
//import { AntDesign} from '@expo/vector-icons';
import Spinner from "react-native-loading-spinner-overlay";
import { getUser } from "../../../api/api";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Root } from "@components";
AntDesign.loadFont();
class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      isSpinner: false,
      isBodyLoaded: true,
    };
  }

  fetchUser = async () => {
    const response = await getUser();
    const { userData } = response;
    this.setState({ userData, isSpinner: false, isBodyLoaded: true });
  };
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

  render() {
    // const { getParam } = this.props.navigation;
    const {
      userData,
      loading,
      isFetched,
      isError,
    } = this.props.reduxState.userData;
    return (
      <Root headerColor={"#FFF"} footerColor={"#FFF"} barStyle={"dark"}>
        <View style={styles.margins}>
          <Spinner visible={loading && !isFetched} />
          {!loading && isFetched && !isError && (
            <Fragment>
              <ScrollView>
                {/* <View style={{flexDirection:'row', width:'100%',marginTop:'1%',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
            <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
          </TouchableOpacity>
          <Text style={styles.header}>Settings</Text>
          <TouchableOpacity onPress={()=>{ this.props.navigation.navigate("SettingEdit",{ ...userData }) }}>
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
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >{`Settings`}</Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("SettingEdit", {
                          ...userData,
                        });
                      }}
                    >
                      <Text style={styles.editView}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.container}>
                  <View style={styles.vname}>
                    <Text style={styles.texttitle}>First Name</Text>
                    <Text style={styles.textdata}>{userData.firstname}</Text>
                  </View>

                  <View style={styles.vtitle}>
                    <Text style={styles.texttitle}>Last Name</Text>
                    <Text style={styles.textdata}>{userData.lastname}</Text>
                  </View>

                  <View style={styles.vtitle}>
                    <Text style={styles.texttitle}>Title</Text>
                    <Text style={styles.textdata}>{userData.title}</Text>
                  </View>

                  <View style={styles.vemail}>
                    <Text style={styles.texttitle}>Business Email</Text>
                    <Text style={styles.textdata}>{userData.username}</Text>
                  </View>

                  <View style={styles.vpass}>
                    <Text style={styles.texttitle}>Password</Text>
                    <View
                      style={{
                        width: 148,
                        height: 20,
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate("ChangePassword", {
                            ...userData,
                          });
                        }}
                        style={{ flexDirection: "row" }}
                      >
                        <Text
                          placeholderTextColor="#000000"
                          style={styles.textdata}
                        >
                          Change password
                        </Text>
                        <AntDesign name="right" size={15} alignSelf="center" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.delview}>
                  <Text style={styles.subhead}>Deactivate my account</Text>
                </View>
              </ScrollView>
            </Fragment>
          )}
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  subhead: {
    fontSize: 10,
    color: "#000000",
    textAlign: "center",
    marginTop: 16,
    width: "100%",
    height: 16,
  },
  container: {
    marginTop: 94,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  vname: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    height: 27,
    width: "90%",
  },
  editView: {
    fontSize: 17,
    color: "#4A90E2",
    alignSelf: "flex-end",
  },
  vtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    borderRadius: 6,
    height: 27,
    width: "90%",
    marginTop: 42,
  },
  vemail: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    height: 27,
    width: "90%",
    marginTop: 42,
  },
  vpass: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    height: 27,
    width: "90%",
    marginTop: 42,
  },
  delview: {
    width: "80%",
    height: 48,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    borderRadius: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    marginTop: "42%",
  },
  textdata: {
    height: 20,
    color: "#000000",
    fontSize: 15,
    fontFamily: "System",
    fontWeight: "normal",
  },
  texttitle: {
    color: "#000000",
    fontSize: 15,
    height: 20,
  },
});

const mapStateToProps = (state) => ({ reduxState: state });
export default connect(
  mapStateToProps,
  null
)(Setting);
//export default DetectPlatfrom(Setting,styles.margins);
