import React, { Component } from "react";
import { StyleSheet, View,Alert,Keyboard, SafeAreaView, StatusBar,BackHandler } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { forgetPassword } from "../../api/api";
import {  FORGET_PASSWORD_SEND, TRY_AGAIN } from "../../api/message";
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableOpacity } from "react-native-gesture-handler";
//import {AntDesign} from "@expo/vector-icons"
import DetectPlatform from "../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";

AntDesign.loadFont();
class Forgetpassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isSpinner:true,
        email:"",
        isButtonEnabled:false,
        invalidBusinessEmail:false
        
    };
  }
  showAlert(heading="",content=""){
    Alert.alert(
      heading,
      content, [{
          text: 'OK',
          //onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
      },],{
          cancelable: false
      })
  }
  componentDidMount=()=>{
    this.setState({ isSpinner: false });
    BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }
   componentWillUnmount(){
     BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
   }
 
   handleBackButton=(nav)=> {
     if (!nav.isFocused()) {
       BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
       return false;
     }else{
       nav.goBack();
       return true;
     }
   }
  handlePress = async () => {
    Keyboard.dismiss();
    this.setState({ isSpinner:true,isButtonEnabled:false });
    //check email first is exist or not
    
    const forgetPasswordApiCall = await forgetPassword(this.state.email.trim().toLowerCase());
    // console.log("Test here",forgetPasswordApiCall);

    if(forgetPasswordApiCall.result == true){
        this.setState((prevState)=>{ return { isSpinner:false,isButtonEnabled:false,email:"" }  },()=>{
            setTimeout(()=>{
              Alert.alert(
                "Password Sent",
                FORGET_PASSWORD_SEND, [{
                    text: 'OK',
                    //onPress: () => console.log('Cancel Pressed'),
                    onPress: () => {
                      this.props.navigation.navigate("Login");
                      
                    },
                    style: 'cancel'
                },],{
                    cancelable: false
                })
            },100);
        });
        
    }else if(forgetPasswordApiCall.result == false){
      this.setState(()=>{ return { isSpinner:false,invalidBusinessEmail:true,isButtonEnabled:false } }, ()=>{
        setTimeout(()=>{
          Alert.alert(
            "Message",
            TRY_AGAIN, [{
                text: 'OK',
                //onPress: () => console.log('Cancel Pressed'),
                // onPress: () => {
                //   this.props.navigation.getParam("createBusinessProfile")();
                //   this.props.navigation.navigate("Setup",{ shouldReloadApi:true });
                  
                // },
                style: 'cancel'
            },],{
                cancelable: false
            })
        },100);
      }  );
            
    }else if(forgetPasswordApiCall.result == "error"){
        if(forgetPasswordApiCall.error.response != undefined && forgetPasswordApiCall.error.response.status == 400){
            this.setState({ isSpinner:false,invalidBusinessEmail:true,isButtonEnabled:false });
        }else{
            this.setState(()=>{ return { isSpinner:false,invalidBusinessEmail:true,isButtonEnabled:false } },()=>{
              setTimeout(()=>{ 
                Alert.alert(
                  "Message",
                  TRY_AGAIN, [{
                      text: 'OK',
                      //onPress: () => console.log('Cancel Pressed'),
                      // onPress: () => {
                      //   this.props.navigation.getParam("createBusinessProfile")();
                      //   this.props.navigation.navigate("Setup",{ shouldReloadApi:true });
                        
                      // },
                      style: 'cancel'
                  },],{
                      cancelable: false
                  })
               }, 100);
            });
            
        }
    }
  };

  handleChangeText = text => {
    if(this.state.invalidBusinessEmail){
      this.setState({ invalidBusinessEmail:false });
    }
    this.setState({ email: text });
    this.validateEmail(text);
  };

  validateEmail = text => {
    const emailRegEx = new RegExp(/\w+@\w+\.\w+/);
    const isValidEmail = emailRegEx.test(text);
    this.setState({ isButtonEnabled: isValidEmail });
  };

  render() {
    return (
      <React.Fragment>
         <Spinner
          visible={this.state.isSpinner}
          textStyle={styles.spinnerTextStyle}
        />
        <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
        <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft:10,marginTop:5}} />
        </TouchableOpacity>
        <Text style={styles.text}>Forget Password?</Text>
        <Input
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholder={"Business Email Address"}
          value={this.state.email}
          onChangeText={text => this.handleChangeText(text)}
        />
        {  this.state.invalidBusinessEmail && <Text style={{color:"red",alignSelf:"center"}}>Invalid Business Email</Text>}
        <Button
          disabled={!this.state.isButtonEnabled}
          buttonStyle={styles.button}
          disabledStyle={{backgroundColor:'#7FBDFF',}}
          containerStyle={styles.buttonContainer}
          title="Continue"
          onPress={this.handlePress}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height:48,
    backgroundColor:'#007AFF',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: "25%"
  },
  text: {
    alignSelf:'center', 
    marginTop:"13%",
    fontFamily:'System',
    fontSize:17,
    fontWeight:"bold"
  },
  buttonContainer: {
    marginTop: 50,
    width: "75%",
    alignSelf:'center'
  },
  inputContainer: {
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    marginVertical: "10%",
    width: "75%"
  },
  input: {
    marginVertical: "5%",
    textAlign: "center"
  }
});

export default DetectPlatform(Forgetpassword,styles.container);
