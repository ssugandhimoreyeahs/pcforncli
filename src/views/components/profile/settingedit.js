import React, { Component, Fragment } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from "react-native";
// import { AntDesign, Ionicons} from '@expo/vector-icons';
import { Button } from "react-native-elements";
import { editUserSetting } from "../../../api/api";
import Spinner from "react-native-loading-spinner-overlay";

import {
  SETTING_UPDATED,
  CONNECTION_ABORTED,
  TRY_AGAIN,
} from "../../../api/message";
import { fetchUserAsyncActionCreator } from "../../../reducers/getUser";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

AntDesign.loadFont();
Ionicons.loadFont();
class SettingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      title: "",
      username: "",
      isSpinner: false,
    };
  }
  // showAlertRedirect

  showAlertRedirect(heading = "", content = "") {
    Alert.alert(
      heading,
      content,
      [
        {
          text: "OK",
          //onPress: () => console.log('Cancel Pressed'),
          onPress: () => {
            //this.setState({ isSpinner:true });
            // if(this.props.navigation.getParam("reloadSetting")){
            //   this.props.navigation.getParam("reloadSetting")();
            // }
            //setTimeout(()=>{ this.props.navigation.goBack() },200);

            this.props.reduxDispatch(fetchUserAsyncActionCreator());
            this.props.navigation.goBack();
            //setTimeout(()=>{ this.props.navigation.goBack(); },50);
          },
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  showAlert(heading = "", content = "") {
    Alert.alert(
      heading,
      content,
      [
        {
          text: "OK",
          //onPress: () => console.log('Cancel Pressed'),
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  handleSettingEdit = async () => {
    Keyboard.dismiss();
    this.setState({ isSpinner: true });
    const { firstname, lastname, title, username } = this.state;
    const body = { firstname, lastname, username, title };
    const updateUser = await editUserSetting(body);
    //console.log(updateUser);
    if (updateUser.result == true) {
      this.setState(
        (prevState) => {
          return { isSpinner: false };
        },
        () => {
          setTimeout(() => {
            this.showAlertRedirect("Message", SETTING_UPDATED);
          }, 200);
        }
      );
    } else {
      if (updateUser.error && updateUser.error.code == "ECONNABORTED") {
        this.setState(
          (prevState) => {
            return { isSpinner: !prevState.isSpinner };
          },
          () => {
            setTimeout(() => {
              this.showAlert("", CONNECTION_ABORTED);
            }, 200);
          }
        );
      } else {
        this.setState(
          (prevState) => {
            return {
              isSpinner: !prevState.isSpinner,
              isButtonEnabled: !prevState.isButtonEnabled,
            };
          },
          () => {
            setTimeout(() => {
              this.showAlert("Error", TRY_AGAIN);
            }, 200);
          }
        );
      }
    }
  };
  handleSettingSaveButtonEnabledOrDisabled = () => {
    const { firstname, title, username, lastname } = this.state;
    const { getParam } = this.props.navigation;
    if (
      firstname == getParam("firstname") &&
      title == getParam("title") &&
      username == getParam("username") &&
      lastname == getParam("firstname")
    ) {
      return true;
    } else {
      return false;
    }
  };

  componentDidMount() {
    const { getParam } = this.props.navigation;
    //console.log("getting User seting params here --- ",getParam("fir"))
    this.setState({
      firstname: getParam("firstname"),
      title: getParam("title"),
      username: getParam("username"),
      lastname: getParam("lastname"),
    });
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
    const { getParam } = this.props.navigation;
    return (
      <View style={styles.margins}>
        <Spinner
          visible={this.state.isSpinner}
          textStyle={styles.spinnerTextStyle}
        />
        {/* <View style={{flexDirection:'row', width:'58%',marginTop:'1%', justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
            <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
          </TouchableOpacity>
          <Text style={styles.header}>Settings</Text>
        </View> */}

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
            <Text
              style={{ fontSize: 17, fontWeight: "bold", color: "black" }}
            >{`Settings`}</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 120,
            backgroundColor: "#FFFFFF",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* <View style={styles.vname}>
          <Text style={styles.texttitle}>First Name</Text>
          <TextInput style={styles.textdata} value={this.state.firstname} onChangeText={(firstname)=>{ this.setState({ firstname }) }}></TextInput>
        </View>  */}

          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              borderColor: "red",
            }}
          >
            <Text style={{ fontSize: 16, color: "#000000" }}>First Name</Text>

            <TextInput
              style={{
                textAlignVertical: "top",
                textAlign: "right",
                width: 250,
                marginHorizontal: 10,
                fontSize: 16,
                borderColor: "blue",
                borderWidth: 0,
                paddingTop: 0,
                height: 30,
              }}
              value={this.state.firstname}
              onChangeText={(firstname) => {
                this.setState({ firstname });
              }}
            />
          </View>

          <View
            style={{
              marginTop: 40,
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              borderColor: "red",
            }}
          >
            <Text style={{ fontSize: 16, color: "#000000" }}>Last Name</Text>
            <TextInput
              style={{
                textAlignVertical: "top",
                textAlign: "right",
                width: 250,
                marginHorizontal: 10,
                fontSize: 16,
                borderColor: "blue",
                borderWidth: 0,
                paddingTop: 0,
                height: 30,
              }}
              value={this.state.lastname}
              onChangeText={(lastname) => {
                this.setState({ lastname });
              }}
            />
          </View>

          <View
            style={{
              marginTop: 40,
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#007AFF",
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              borderColor: "red",
            }}
          >
            <Text style={{ fontSize: 16, color: "#000000" }}>Title</Text>
            <TextInput
              style={{
                textAlignVertical: "top",
                textAlign: "right",
                width: 250,
                marginHorizontal: 10,
                fontSize: 16,
                borderColor: "blue",
                borderWidth: 0,
                paddingTop: 0,
                height: 30,
              }}
              value={this.state.title}
              onChangeText={(title) => {
                this.setState({ title });
              }}
            />
          </View>

          {/* <View style={styles.vtitle}>
          <Text style={styles.texttitle}>Last Name</Text>
          <TextInput style={styles.textdata} value={this.state.lastname} onChangeText={(lastname)=>{ this.setState({ lastname }) }}></TextInput>
        </View> 

        <View style={styles.vtitle}>
          <Text style={styles.texttitle}>Title</Text>
          <TextInput style={styles.textdata} value={this.state.title} onChangeText={(title)=>{ this.setState({ title }) }}></TextInput>
        </View>  */}

          {/* <View style={styles.vemail}>
          <Text style={styles.texttitle}>Business Email</Text>
          <TextInput style={styles.textdata} value={this.state.username} onChangeText={(username)=>{ this.setState({ username }) }}></TextInput>
        </View> */}
          {/* 
<View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#007AFF',borderBottomWidth:1,borderBottomEndRadius:5,
    borderBottomStartRadius:5,height:27, width:299,marginLeft:38,marginRight:39 }}>
          <Text style={{color:'#000000',fontSize:15,width:41, height:20}}>Name</Text>
          <TextInput value={this.state.firstname} onChangeText={(firstname)=>{ this.setState({ firstname }) }}  placeholderTextColor="#000000" 
        style={{width:73, height:20, color:'#000000', fontSize:15, }}></TextInput>
 </View> 
<View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#007AFF',borderBottomWidth:1,
borderBottomEndRadius:5, borderBottomStartRadius:5,borderRadius:6,height:27, width:299,marginTop:42,marginLeft:38,marginRight:39 }}>
        <Text style={{color:'#000000',fontSize:15,width:30, height:20}}>Title</Text>
                  <TextInput value={this.state.title} placeholderTextColor="#000000" 
                    style={{width:106, height:20, color:'#000000', fontSize:15, }} onChangeText={(title)=>{ this.setState({ title }) }}></TextInput>
</View> 
  <View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF', marginLeft:38, marginRight:39,
  borderBottomColor:'#007AFF',borderBottomWidth:1,borderBottomEndRadius:5, borderBottomStartRadius:5,height:27, width:299,marginTop:42,}}>
     
     <Text style={{color:'#000000',fontSize:15,width:102, height:20}}>Business Email</Text>
     <TextInput value={this.state.username} onChangeText={(username)=>{ this.setState({ username }) }} placeholderTextColor="#000000" 
                style={{width:122, height:20, color:'#000000', fontSize:15, }}></TextInput>
   </View> */}

          {/* <View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#007AFF',marginRight:39,
borderBottomWidth:1,borderBottomEndRadius:5, borderBottomStartRadius:5,height:27, width:301,marginTop:42,marginLeft:38,}}>
   <Text style={{color:'#000000',fontSize:15,width:66, height:20}}>Password</Text>
<View style={{width:137, height:20, justifyContent:'space-between', flexDirection:'row',alignItems:'center'}}>
<Text placeholderTextColor="#000000" 
         style={{width:123, height:20, color:'#000000',fontSize:15,}}>Change password</Text>
 <AntDesign name='right' size={15} alignSelf='center'/>
</View> 
</View>  */}
          <Button
            disabled={this.handleSettingSaveButtonEnabledOrDisabled()}
            buttonStyle={styles.button}
            disabledStyle={{ backgroundColor: "#7FBDFF" }}
            containerStyle={styles.buttonContainer}
            title="Save"
            onPress={this.handleSettingEdit}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subhead: {
    fontSize: 10,
    color: "#000000",
    alignSelf: "center",
    marginTop: 16,
    width: 91,
    height: 16,
  },
  button: {
    borderRadius: 24,
    height: 48,
    backgroundColor: "#007AFF",
  },
  buttonContainer: {
    marginTop: 20,
    width: "75%",
    alignSelf: "center",
  },
  margins: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: "15%",
    textAlign: "center",
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
    marginTop: "52%",
  },
  textdata: {
    height: 20,
    color: "#000000",
    fontSize: 15,
    fontFamily: "System",
    fontWeight: "normal",
    borderWidth: 1,
    borderColor: "#fff",
  },
  texttitle: {
    color: "#000000",
    fontSize: 15,
    height: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

//const mapStateToProps = state => ({reduxState: state});
const mapDispatchToProps = (dispatch) => ({ reduxDispatch: dispatch });
export default connect(
  null,
  mapDispatchToProps
)(SettingEdit);
