import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Keyboard,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { Button, Card, Input, Text as Txt, Icon } from "react-native-elements";
import { TextInput, ScrollView } from "react-native-gesture-handler";
import logo2g from "../../../assets/logo.png"; 
import AntDesign from "react-native-vector-icons/AntDesign";
import { getUser } from "../../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import { Dropdown } from "react-native-material-dropdown";
import { updateUserWithCompany, uploadCompanyLogo } from "../../../api/api";
import {
  BUSINESS_MODEL_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  STATE_OF_INCORP_OPTIONS,
  YEAR_FOUNDED_OPTIONS,
} from "../../../constants/constants";
import { ERROR, BUSINESS_PROFILE_UPDATED } from "../../../api/message";
import { Root } from "@components";

import { connect } from "react-redux";
import { fetchUserAsyncActionCreator } from "../../../reducers/getUser";
import ImagePickerRN from "react-native-image-picker";

AntDesign.loadFont();

class BusinessproEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: false,
      isSpinner: false,
      company: "",
      industry: "",
      businessModel: "",
      companySize: "",
      yearFounded: "",
      stateIncorporated: "",
      userData: {},
      logoByApi: null,
      selectLogoByUser: null,
      isBodyLoaded: true,
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitleStyle: {
        marginRight: 5,
        width: 128,
        height: 22,
        fontSize: 17,
      },
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={25} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
      title: "Business Profile",
    };
  };
  showAlert(heading = "", content = "") {
    Alert.alert(
      heading,
      content,
      [
        {
          text: "Okay",
          //onPress: () => console.log('Cancel Pressed'),
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  }
  handleButtonDisabled = () => {
    const {
      company,
      industry,
      businessModel,
      companySize,
      yearFounded,
      stateIncorporated,
      userData,
    } = this.state;
    //if( company in userData ){
    if (this.state.selectLogoByUser != null) {
      return false;
    } else {
      if (
        company == userData.company &&
        industry == userData.industry &&
        businessModel == userData.businessModel &&
        companySize == userData.companySize &&
        yearFounded == userData.yearFounded &&
        stateIncorporated == userData.stateIncorporated
      ) {
        return true;
      } else {
        return false;
      }
    }

    //  }else{
    //    return true;
    //  }
  };
  handleUpdateBtn = async () => {
    this.setState({ isSpinner: true });
    const {
      company,
      industry,
      businessModel,
      companySize,
      yearFounded,
      stateIncorporated,
    } = this.state;
    const body = {
      company,

      industry,
      businessModel,
      companySize,
      yearFounded,
      stateIncorporated,
    };
    const isUserUpdated = await updateUserWithCompany(body);
    //console.log(isUserUpdated);
    if (isUserUpdated.result == true) {
      let milliseconds = new Date().getTime();
      if (this.state.selectLogoByUser != null) {
        const formData = new FormData();
        let imgObj = {
          uri: `${this.state.selectLogoByUser.uri}`,
          type: "image/jpg",
          name: `image-${milliseconds}.jpg`,
        };
        formData.append("image", imgObj);
        const uploadLogo = await uploadCompanyLogo(formData);
        console.log("Mongo Updated Logo ", uploadLogo);
      }

      this.setState(
        (prevState) => {
          return { isSpinner: false };
        },
        () => {
          setTimeout(() => {
            Alert.alert(
              "Success",
              BUSINESS_PROFILE_UPDATED,
              [
                {
                  text: "Okay",
                  //onPress: () => console.log('Cancel Pressed'),
                  onPress: () => {
                    this.props.reduxDispatch(fetchUserAsyncActionCreator());
                    this.props.navigation.navigate("Businesspro");
                    //setTimeout(()=>{  },50);
                  },
                  style: "cancel",
                },
              ],
              {
                cancelable: false,
              }
            );
          }, 100);
        }
      );
    } else {
      if (
        isUserUpdated.error.code != undefined &&
        isUserUpdated.error.code == "ECONNABORTED"
      ) {
        this.setState(
          (prevState) => {
            return { spinner: !prevState.spinner };
          },
          () => {
            setTimeout(() => {
              this.showAlert(ERROR.title, ERROR.message);
            }, 100);
          }
        );
      } else {
        this.setState(
          (prevState) => {
            return { spinner: !prevState.spinner };
          },
          () => {
            setTimeout(() => {
              this.showAlert(ERROR.title, ERROR.message);
            }, 200);
          }
        );
      }
    }
  };
  fetchUser = async () => {
    // const response = this.props.reduxState.userData;
    // console.log("Getting response from redux ",response);
    // let { userData } = response;
    let userData = this.props.navigation.getParam("userData");
    let {
      company,
      industry,
      businessModel,
      companySize,
      yearFounded,
      stateIncorporated,
    } = userData;
    company = company == null ? "" : company;
    industry = industry == null ? "" : industry;
    businessModel = businessModel == null ? "" : businessModel;
    companySize = companySize == null ? "" : companySize;
    yearFounded = yearFounded == null ? "" : yearFounded;
    stateIncorporated = stateIncorporated == null ? "" : stateIncorporated;
    company = company.trim();
    this.setState({
      company: company,
      industry: industry,
      businessModel: businessModel,
      companySize: companySize,
      yearFounded: yearFounded,
      stateIncorporated: stateIncorporated,
      isSpinner: false,
      userData,
      logoByApi: userData.logo,
      isBodyLoaded: true,
    });
  };
  componentDidMount() {
    this.fetchUser();
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  componentWillUnmount() {
    //console.log("Businessproedit componentWillUnmount()");
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
  handleEditImage = async () => {
    const options = {
      title: "Select Company Logo",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      mediaType: "photo",
      takePhotoButtonTitle: null,
      quality: 0.1,
      width: 500,
      height: 500,
    };

    ImagePickerRN.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({ selectLogoByUser: response });
      }
    });
    // if(Platform.OS === 'ios'){

    //   try{
    //     const permis = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     // console.log("getAsync Handle");
    //     // console.log(permis);
    //     // console.log("getAsync Closed ");
    //   // if (statusget !== 'granted') {

    //     const permissionStatus = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    //     //console.log(permissionStatus);
    //    if( permissionStatus.status === "granted" ){
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //       //allowsEditing: false,
    //       // aspect: [4, 3],
    //       quality: 0.3
    //     });

    //     console.log(result);
    //     if (!result.cancelled) {
    //       this.setState({ selectLogoByUser: result });
    //     }
    //    }

    //  // }
    //   }catch(error){
    //     console.log("Iphone Image Permission Issue");
    //   }

    // }else{

    //   let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     //allowsEditing: false,
    //     // aspect: [4, 3],
    //     quality: 0.3
    //   });

    //   //console.log(result);
    //   console.log(result);
    //   if (!result.cancelled) {
    //     this.setState({ selectLogoByUser: result });
    //   }

    // }
  };
  render() {
    const {
      company,
      industry,
      businessModel,
      companySize,
      yearFounded,
      stateIncorporated,
    } = this.state;
    const { isDisabled, isSpinner } = this.state;
    const { logoByApi, selectLogoByUser, isBodyLoaded } = this.state;

    let readyProfileUrl =
      isBodyLoaded &&
      (selectLogoByUser == null
        ? logoByApi == null || logoByApi == ""
          ? { type: "require" }
          : { type: "uri", uri: logoByApi }
        : { type: "uri", uri: selectLogoByUser.uri });

    return (
      <Root headerColor={"#FFF"} footerColor={"#FFF"} barStyle={"dark"}>
        <View style={styles.container}>
          <Spinner visible={isSpinner} />
          {this.state.isBodyLoaded && (
            <ScrollView>
              {/* <View style={{flexDirection:'row', width:'71%',marginTop:'1%',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
            <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
          </TouchableOpacity>
          <Text style={styles.header}>Business Profile</Text>
        </View> */}

              <View
                style={{ marginTop: 15, flexDirection: "row", width: "100%" }}
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
                  <Text
                    style={{ fontSize: 17, fontWeight: "bold", color: "black" }}
                  >{`Business Profile`}</Text>
                </View>
              </View>

              <View style={styles.imgView}>
                {/* <Image source={{uri:"https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png"}} style={{height:50,width:50,alignSelf:'center'}}></Image> */}

                {readyProfileUrl != null &&
                readyProfileUrl.type != undefined &&
                readyProfileUrl.type == "uri" ? (
                  <Image
                    source={{ uri: readyProfileUrl.uri }}
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
              <TouchableOpacity
                onPress={() => {
                  this.handleEditImage();
                }}
              >
                <Text
                  style={{
                    color: "#007AFF",
                    alignSelf: "center",
                    marginVertical: "3%",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Edit Logo
                </Text>
              </TouchableOpacity>
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
                value={company}
                onChangeText={(text) => {
                  this.setState({ company: text });
                }}
              />
              <View style={styles.detailsContainer}>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Industry</Text>
                  <Dropdown
                    label={"Select                   v"}
                    disabled={isDisabled}
                    data={INDUSTRY_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={industry}
                    onChangeText={(text) => {
                      this.setState({ industry: text });
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                    }}
                    onFocus={() => {
                      Keyboard.dismiss();
                    }}
                    dropdownPosition={-5.4}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Business Model</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={"Select                   v"}
                    data={BUSINESS_MODEL_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={businessModel}
                    onChangeText={(text) => {
                      this.setState({ businessModel: text });
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                    }}
                    onFocus={() => {
                      Keyboard.dismiss();
                    }}
                    dropdownPosition={-5.4}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Company Size</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={"Select                   v"}
                    data={COMPANY_SIZE_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={companySize}
                    onChangeText={(text) => {
                      this.setState({ companySize: text });
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                    }}
                    onFocus={() => {
                      Keyboard.dismiss();
                    }}
                    dropdownPosition={-5.4}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsText}>Year Founded</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={"Select                   v"}
                    data={YEAR_FOUNDED_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    value={yearFounded}
                    onChangeText={(text) => {
                      this.setState({ yearFounded: text });
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                    }}
                    onFocus={() => {
                      Keyboard.dismiss();
                    }}
                    dropdownPosition={-5.4}
                  />
                </View>
                <View style={styles.detailsRow}>
                  <Text
                    style={{ fontSize: 15, width: "60%" }}
                  >{`State of Incorporation`}</Text>
                  <Dropdown
                    disabled={isDisabled}
                    label={"Select            v"}
                    data={STATE_OF_INCORP_OPTIONS}
                    inputContainerStyle={styles.detailsInputContainer}
                    containerStyle={{ width: "40%", marginTop: "-15%" }}
                    renderAccessory={() => null}
                    value={stateIncorporated}
                    onChangeText={(text) => {
                      this.setState({ stateIncorporated: text });
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                    }}
                    onFocus={() => {
                      Keyboard.dismiss();
                    }}
                    dropdownPosition={-5.4}
                  />
                </View>
              </View>
              <Button
                buttonStyle={styles.button}
                disabledStyle={{ backgroundColor: "#7FBDFF" }}
                onPress={this.handleUpdateBtn}
                title={"Save"}
                containerStyle={styles.buttonContainer}
                disabled={this.handleButtonDisabled()}
              />
            </ScrollView>
          )}
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height: 48,
    width: "60%",
    backgroundColor: "#007AFF",
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: "15%",
  },
  card: {
    padding: 30,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 48,
    // marginTop: 50,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.15,
    width: 96,
    height: 96,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailsContainer: {
    width: "72%",
    flexDirection: "column",
    paddingTop: "5%",
    alignSelf: "center",
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

    alignSelf: "center",
  },
  icon: {
    //marginTop: 5
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

const styles2 = {
  margins: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  editCompanyLogo: {
    width: 127,
    height: 20,
    fontSize: 15,
    color: "#007AFF",
    alignSelf: "center",
    // marginTop:9
  },

  bitbloc: {
    width: 49,
    height: 20,
    fontSize: 15,
    color: "#000000",
  },
};

//const mapStateToProps = state => ({reduxState: state});
const mapDispatchToProps = (dispatch) => ({ reduxDispatch: dispatch });
export default connect(
  null,
  mapDispatchToProps
)(BusinessproEdit);
