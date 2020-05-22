import * as React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  BackHandler,
  Alert,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
// import { AntDesign} from '@expo/vector-icons';
import Button from "./button";
import ClearButton from "./clear-button";
import FormTextInput from "./input";
import imageLogo from "../../../assets/logo.png";
import { login } from "../../../api/api";
import tandc from "../../legal/legal";
import Spinner from "react-native-loading-spinner-overlay";
import {
  CONNECTION_ABORTED,
  INVALID_CREDENTIALS,
  TRY_AGAIN,
  ERROR,
} from "../../../api/message";
import DetectPlatfrom from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";

AntDesign.loadFont();
class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      err: "",
      isSpinner: false,
    };
  }

  showAlert(heading, content) {
    Alert.alert(
      heading,
      content,
      [
        {
          text: "Okay",
          // onPress: () => console.log('Cancel Pressed'),
          style: "cancel",
        },
      ],
      {
        cancelable: false,
      }
    );

    // Alert.alert('Alert', 'email is not valid, Please enter correct email', [{text: 'Ok'}]);
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
      nav.navigate("ValueProp");
      return true;
    }
  };

  handleEmailChange = (email) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password) => {
    this.setState({ password: password });
  };

  handleLoginPress = async () => {
    Keyboard.dismiss();
    if (this.state.email.length == 0 && this.state.password.length == 0) {
      this.showAlert("Message", "Enter Credentials");
    } else if (this.state.email.length == 0) {
      this.showAlert("Message", "Enter Email");
    } else if (this.state.password.length == 0) {
      this.showAlert("Message", "Enter Password");
    } else {
      const emailRegEx = new RegExp(/\w+@\w+\.\w+/);
      const isValidEmail = emailRegEx.test(this.state.email);
      if (isValidEmail) {
        this.setState({ isSpinner: true });
        const isUserValid = await login(
          this.state.email.trim().toLowerCase(),
          this.state.password.trim()
        );

        if (isUserValid.result) {
          this.props.navigation.navigate("Dashboard", {
            fromLogin: true,
            userResponse: {
              result: true,
              userData: { ...isUserValid.data.user },
            },
          });
          this.setState({ isSpinner: false });
        } else {
          if (
            isUserValid.error.code != undefined &&
            isUserValid.error.code == "ECONNABORTED"
          ) {
            this.setState(
              (prevState) => {
                return { isSpinner: !prevState.isSpinner };
              },
              () => {
                setTimeout(() => {
                  this.showAlert(ERROR.title, ERROR.message);
                }, 100);
              }
            );
          } else if (
            isUserValid.error.response != undefined &&
            (isUserValid.error.response.status == 401 ||
              isUserValid.error.response.status == 400)
          ) {
            this.setState(
              (prevState) => {
                return { isSpinner: !prevState.isSpinner };
              },
              () => {
                setTimeout(() => {
                  this.showAlert("Message", INVALID_CREDENTIALS);
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
                  this.showAlert(ERROR.title, ERROR.message);
                }, 100);
              }
            );
          }
        }
      } else {
        this.showAlert("Error", "Invalid Email");
      }
    }
  };

  handleLegalPressTOS = () => {
    Linking.openURL(`https://www.pocketcfoapp.com/terms-of-use`);
    // this.props.navigation.navigate("Legal")
  };
  handleLegalPressPP = () => {
    Linking.openURL(`https://www.pocketcfoapp.com/privacy-policy`);
    // this.props.navigation.navigate("Legal")
  };

  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isSpinner}
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView scrollEnabled={true} keyboardShouldPersistTaps={"always"}>
          <KeyboardAvoidingView style={styles.container} behavior="position">
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ValueProp")}
            >
              <AntDesign
                size={30}
                name="left"
                style={{
                  alignSelf: "flex-start",
                  marginLeft: 10,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.text}>{"PocketCFO"}</Text>
            <Image source={imageLogo} style={styles.logo} />
            {/* {this.state.err ? (
          <Text style={styles.err}>{this.state.err}</Text>
        ) : (
          undefined
        )} */}
            <View style={styles.form}>
              <FormTextInput
                value={this.state.email}
                secure={false}
                onChangeText={this.handleEmailChange}
                placeholder={"Email Address"}
              />
              <FormTextInput
                secure={true}
                value={this.state.password}
                onChangeText={this.handlePasswordChange}
                placeholder={"***********"}
                required={true}
              />

              <TouchableOpacity
                style={forgetPassStyle.container}
                onPress={() => {
                  this.props.navigation.navigate("ForgetPassword");
                }}
              >
                <Text style={forgetPassStyle.text}>{"Forget Password?"}</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 10 }}>
                <Button
                  label={"Login"}
                  onPress={this.handleLoginPress}
                  disabled={
                    !this.state.email ||
                    !this.state.password ||
                    this.state.loading
                  }
                  loading={this.state.loading}
                />
              </View>

              {/* <ClearButton
            label={"Terms and Conditions"}
            onPress={this.handleLegalPress}
          /> */}
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: "System",
                    fontSize: 12,
                    color: "#007AFF",
                  }}
                  onPress={this.handleLegalPressTOS}
                >
                  Terms of Service
                </Text>
                <Text style={{ fontFamily: "System", fontSize: 12 }}>
                  {" "}
                  and{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "System",
                    fontSize: 12,
                    color: "#007AFF",
                  }}
                  onPress={this.handleLegalPressPP}
                >
                  Privacy Policy
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const forgetPassStyle = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "white",
  },
  text: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  err: {
    fontSize: 12,
    color: "red",
    marginTop: "2%",
  },
  text: {
    marginTop: 5,
    fontSize: 45,
    marginBottom: 10,
    alignSelf: "center",
  },
  logo: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
  },
  form: {
    flex: 2,
    marginTop: "20%",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
  },
});
export default LoginScreen;

// import * as React from "react";
// import { Image, StyleSheet, View, Text, BackHandler, Alert, Keyboard, SafeAreaView,TouchableOpacity,Linking, KeyboardAvoidingView,ScrollView} from "react-native";
// import { AntDesign} from '@expo/vector-icons';
// import Button from "./button";
// import ClearButton from "./clear-button";
// import FormTextInput from "./input";
// import imageLogo from "../../../assets/logo.png";
// import { login } from "../../../api/api";
// import tandc from "../../legal/legal";
// import Spinner from 'react-native-loading-spinner-overlay';
// import { CONNECTION_ABORTED,INVALID_CREDENTIALS,TRY_AGAIN } from "../../../api/message";
// import DetectPlatfrom from "../../../DetectPlatform";

// class LoginScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       email: "",
//       password: "",
//       err: "",
//       isSpinner:false
//   };
//   }

//   showAlert(heading,content){
//     Alert.alert(
//       heading,
//       content, [{
//           text: 'OK',
//          // onPress: () => console.log('Cancel Pressed'),
//           style: 'cancel'
//       },],{
//           cancelable: false
//       })

//    // Alert.alert('Alert', 'email is not valid, Please enter correct email', [{text: 'Ok'}]);
//   }

//   componentDidMount(){
//     BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
//   }

//   componentWillUnmount(){
//     BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
//   }

//   handleBackButton=(nav)=> {
//     if (!nav.isFocused()) {
//       BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
//       return false;
//     }else{
//       //nav.navigate("ValueProp");
//       return true;
//     }
//   }

//   handleEmailChange = email => {
//     this.setState({ email: email });
//   };

//   handlePasswordChange = password => {
//     this.setState({ password: password });

//   };

//   handleLoginPress = async () => {

//       if(this.state.email.length == 0 && this.state.password.length == 0){
//         this.showAlert("Message","Enter Credentials");
//       }else if(this.state.email.length == 0){
//           this.showAlert("Message","Enter Email");

//       }else if(this.state.password.length == 0){
//           this.showAlert("Message","Enter Password");

//       }else{

//         const emailRegEx = new RegExp(/\w+@\w+\.\w+/);
//         const isValidEmail = emailRegEx.test(this.state.email);
//         if(isValidEmail){
//           this.setState({isSpinner:true});
//         const isUserValid = await login(this.state.email.trim().toLowerCase(), this.state.password.trim());
//         console.log(isUserValid);
//       if (isUserValid.result) {
//         this.props.navigation.navigate("Dashboard");
//         this.setState({isSpinner:false});
//       }
//       else{
//         if(isUserValid.error.code != undefined && isUserValid.error.code == "ECONNABORTED"){
//           this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
//             this.showAlert("",CONNECTION_ABORTED);
//           },100) });

//         }else if(isUserValid.error.response != undefined && ( isUserValid.error.response.status == 401  || isUserValid.error.response.status == 400)){
//           this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
//             this.showAlert("Error",INVALID_CREDENTIALS);
//           },100) });

//         }else{
//           this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
//             this.showAlert("Error",TRY_AGAIN);
//           },100) });
//         }
//       }
//         }
//         else{
//           this.showAlert("Error","Invalid Email");
//         }

//       }
//   };

//   handleLegalPressTOS = () => {
//         Linking.openURL(
//           `https://www.pocketcfoapp.com/terms-of-use`
//         );
//         // this.props.navigation.navigate("Legal")
//   };
//   handleLegalPressPP = () => {
//     Linking.openURL(
//       `https://www.pocketcfoapp.com/privacy-policy`
//     );
//     // this.props.navigation.navigate("Legal")
// };

//   render() {
//     return (
//       <React.Fragment>
//         <Spinner
//           visible={this.state.isSpinner}
//           textStyle={styles.spinnerTextStyle}
//         />
//         <KeyboardAvoidingView style={styles.container} behavior="padding">
//           <ScrollView scrollEnabled={true}>
//         <TouchableOpacity onPress={()=> this.props.navigation.navigate("ValueProp")}>
//           <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft:10,marginTop:5}} />
//         </TouchableOpacity>
//         <Text style={styles.text}>{"PocketCFO"}</Text>
//         <Image source={imageLogo} style={styles.logo} />
//         {/* {this.state.err ? (
//           <Text style={styles.err}>{this.state.err}</Text>
//         ) : (
//           undefined
//         )} */}
//         <View style={styles.form}>
//           <FormTextInput
//             value={this.state.email}
//             secure={false}
//             onChangeText={this.handleEmailChange}
//             placeholder={"Email Address"}
//           />
//           <FormTextInput
//             secure={true}
//             value={this.state.password}
//             onChangeText={this.handlePasswordChange}
//             placeholder={"***********"}
//             required={true}
//           />

//       <TouchableOpacity style={forgetPassStyle.container} onPress={()=>{ this.props.navigation.navigate("ForgetPassword") }}>
//         <Text style={forgetPassStyle.text}>{"Forget Password?"}</Text>
//       </TouchableOpacity>
//           <View style={{marginTop:10}}>
//           <Button label={"Login"} onPress={this.handleLoginPress}
//           disabled={
//             !this.state.email ||
//             !this.state.password ||
//             this.state.loading
//           }
//           loading={this.state.loading}/>
//           </View>

//           {/* <ClearButton
//             label={"Terms and Conditions"}
//             onPress={this.handleLegalPress}
//           /> */}
//           <View style={{flexDirection:'row',justifyContent:'center'}}>
//             <Text style={{fontFamily:'System',fontSize:12,color:'#007AFF'}} onPress={this.handleLegalPressTOS}>Terms of Service</Text>
//             <Text  style={{fontFamily:'System',fontSize:12,}}> and </Text>
//             <Text  style={{fontFamily:'System',fontSize:12,color:'#007AFF'}} onPress={this.handleLegalPressPP}>Privacy Policy</Text>
//           </View>
//         </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//       </React.Fragment>
//     );
//   }
// }

// const forgetPassStyle = StyleSheet.create({
//   container: {
//     width: "100%",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "white",
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "white"
//   },
//   text: {
//     color: "#007AFF",
//     textAlign: "center",
//     fontSize:12,
//     lineHeight:18
//   }
// });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     justifyContent: "space-between"
//   },
//   err: {
//     fontSize: 12,
//     color: "red",
//     marginTop: "2%"
//   },
//   text: {
//     marginTop: 5,
//     fontSize: 45,
//     marginBottom: 10,
//     alignSelf: "center"
//   },
//   logo: {
//     width: "100%",
//     height: 100,
//     resizeMode: "contain",
//     alignSelf: "center"
//   },
//   form: {
//     flex: 2,
//     marginTop:"50%",
//     justifyContent: "center",
//     width: "80%",
//     alignSelf:'center',
//   }
// });
// export default DetectPlatfrom(LoginScreen,styles.container);

// // import * as React from "react";
// // import { Image, StyleSheet, View, Text, BackHandler, Alert, Keyboard, SafeAreaView, StatusBar, TouchableOpacity} from "react-native";
// // import { AntDesign} from '@expo/vector-icons';
// // import Button from "./button";
// // import ClearButton from "./clear-button";
// // import FormTextInput from "./input";
// // import imageLogo from "../../../assets/logo.png";
// // import { login } from "../../../api/api";
// // import tandc from "../../legal/legal";
// // import Spinner from 'react-native-loading-spinner-overlay';
// // import { CONNECTION_ABORTED,INVALID_CREDENTIALS,TRY_AGAIN } from "../../../api/message";

// // class LoginScreen extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       email: "",
// //       password: "",
// //       err: "",
// //       isSpinner:false
// //   };
// //   }

// //   showAlert(heading,content){
// //     Alert.alert(
// //       heading,
// //       content, [{
// //           text: 'OK',
// //          // onPress: () => console.log('Cancel Pressed'),
// //           style: 'cancel'
// //       },],{
// //           cancelable: false
// //       })

// //    // Alert.alert('Alert', 'email is not valid, Please enter correct email', [{text: 'Ok'}]);
// //   }

// //   componentDidMount(){
// //     BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
// //   }

// //   componentWillUnmount(){
// //     BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
// //   }

// //   handleBackButton=(nav)=> {
// //     if (!nav.isFocused()) {
// //       BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
// //       return false;
// //     }else{
// //       nav.navigate("ValueProp");
// //       return true;
// //     }
// //   }

// //   handleEmailChange = email => {
// //     this.setState({ email: email });
// //   };

// //   handlePasswordChange = password => {
// //     this.setState({ password: password });
// //   };

// //   handleLoginPress = async () => {
// //     Keyboard.dismiss();

// //       if(this.state.email.length == 0 && this.state.password.length == 0){
// //         this.showAlert("Message","Enter Credentials");
// //       }else if(this.state.email.length == 0){
// //           this.showAlert("Message","Enter Email");

// //       }else if(this.state.password.length == 0){
// //           this.showAlert("Message","Enter Password");

// //       }else{

// //         const emailRegEx = new RegExp(/\w+@\w+\.\w+/);
// //         const isValidEmail = emailRegEx.test(this.state.email);
// //         if(isValidEmail){
// //           this.setState({isSpinner:true});
// //         const isUserValid = await login(this.state.email.trim().toLowerCase(), this.state.password.trim());
// //         console.log(isUserValid);
// //       if (isUserValid.result) {
// //         this.props.navigation.navigate("Dashboard");
// //         this.setState({isSpinner:false});
// //       }
// //       else{
// //         if(isUserValid.error.code != undefined && isUserValid.error.code == "ECONNABORTED"){
// //           this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
// //             this.showAlert("",CONNECTION_ABORTED);
// //           },100) });

// //         }else if(isUserValid.error.response != undefined && ( isUserValid.error.response.status == 401  || isUserValid.error.response.status == 400)){
// //           this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
// //             this.showAlert("Error",INVALID_CREDENTIALS);
// //           },100) });

// //         }else{
// //           this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
// //             this.showAlert("Error",TRY_AGAIN);
// //           },100) });
// //         }
// //       }
// //         }
// //         else{
// //           this.showAlert("Error","Invalid Email");
// //         }
// //       }
// //   };

// //   handleLegalPress = () => {
// //     this.props.navigation.navigate("Legal");
// //   };

// //   render() {
// //     return (
// //       <React.Fragment>
// //       <View style={{ backgroundColor: '#070640', height: StatusBar.currentHeight, width:'100%' }} />
// //       <View style={styles.container}>
// //        <Spinner
// //           visible={this.state.isSpinner}
// //           textStyle={styles.spinnerTextStyle}
// //         />
// //         <TouchableOpacity onPress={()=> this.props.navigation.navigate("ValueProp")}>
// //           <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft:10,marginTop:5}} />
// //         </TouchableOpacity>
// //         <Text style={styles.text}>{"PocketCFO"}</Text>
// //         <Image source={imageLogo} style={styles.logo} />
// //         {/* {this.state.err ? (
// //           <Text style={styles.err}>{this.state.err}</Text>
// //         ) : (
// //           undefined
// //         )} */}
// //         <View style={styles.form}>
// //           <FormTextInput
// //             value={this.state.email}
// //             secure={false}
// //             onChangeText={this.handleEmailChange}
// //             placeholder={"Email Address"}
// //           />
// //           <FormTextInput
// //             secure={true}
// //             value={this.state.password}
// //             onChangeText={this.handlePasswordChange}
// //             placeholder={"***********"}
// //             required={true}
// //           />
// //           <Button label={"Login"} onPress={this.handleLoginPress}
// //           disabled={
// //             !this.state.email ||
// //             !this.state.password ||
// //             this.state.loading
// //           }
// //           loading={this.state.loading}/>
// //           <ClearButton
// //             label={"Terms and Conditions"}
// //             onPress={this.handleLegalPress}
// //           />
// //         </View>
// //       </View>
// //       </React.Fragment>
// //     );
// //   }
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "white",
// //     justifyContent: "space-between"
// //   },
// //   err: {
// //     fontSize: 12,
// //     color: "red",
// //     marginTop: "2%"
// //   },
// //   text: {
// //     marginTop: 5,
// //     fontSize: 45,
// //     marginBottom: 10,
// //     alignSelf: "center"
// //   },
// //   logo: {
// //     width: "100%",
// //     height: 100,
// //     resizeMode: "contain",
// //     alignSelf: "center"
// //   },
// //   form: {
// //     flex: 2,
// //     marginTop:-130,
// //     justifyContent: "center",
// //     width: "80%",
// //     alignSelf:'center',
// //   }
// // });

// // export default LoginScreen;
