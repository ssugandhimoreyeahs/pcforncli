import * as React from "react";
import { Image, StyleSheet, View, Text, SafeAreaView,Platform, StatusBar,BackHandler } from "react-native";
import Button from "./button";
import BlueButton from "./blue-button";
import logo from "../../../assets/logo2.png";
import { colors } from "react-native-elements";
import { isUserLoggedIn } from "../../../api/api";
import Spinner from 'react-native-loading-spinner-overlay';
import DetectPlatform from "../../../DetectPlatform";
import { StackActions, NavigationActions } from 'react-navigation';

const resetAction = StackActions.reset({
  index: 0,
  actions: [
      NavigationActions.navigate({ routeName: 'Dashboard' })
  ],
  });
class ValueProp extends React.Component {
  state = {
    err: "",
    isUserLoggedInFlag: null,
    isSpinner:true,
    isBodyLoaded:false
  };

  handleLoginPress = async () => {
    this.props.navigation.navigate("Login");
  };

  handleCreateAccountPress = () => {
    this.props.navigation.navigate("Name");
  };
  isUserLoggedIn = async () => {
    const userLoggedIn = await isUserLoggedIn();
    if(userLoggedIn.result == true){
      
      this.props.navigation.navigate("Dashboard");
      this.setState({ isBodyLoaded:true,isSpinner:false });
      //this.setState({ isSpinner: false});
      // setTimeout(()=>{
      //   this.props.navigation.dispatch(resetAction); 
      // },10000);
    }else{
      this.setState({ isBodyLoaded:true,isSpinner:false });
    }
     
  }
  componentDidMount = () => {
   BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    this.isUserLoggedIn();
  }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    }
  
    handleBackButton=(nav)=> {
      if (!nav.isFocused()) {
        BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
        return false;
      }else{
        //nav.goBack();
        return true;
      }
    }
  render() {
    const { isSpinner } = this.state;
    return (
      <React.Fragment>
         <Spinner
          visible={ isSpinner }
          
        />
      {
        ( this.state.isBodyLoaded == true ) ? 

        // <View style={styles.container} >
        <SafeAreaView style={styles.container} >
        <View style={styles.vicon}>
          <Image source={logo} style={styles.simage}
          />
          <Text style={{color:'#ffffff',width:35,height:14, fontSize:10, alignSelf:"center",marginLeft:5}}>Beta</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.heroText}>
            {"Confidence in knowing and going"}
          </Text>
        
          <Text style={styles.text}>
            {"Know your real-time cash position and make data-informed decisions."}
          </Text>
        </View>
        <View style={styles.form}>
          <Button
            label={"Get Started"}
            onPress={this.handleCreateAccountPress}
          />
          <BlueButton
            label={"I have an account"}
            onPress={this.handleLoginPress}
          />
        </View>
      </SafeAreaView> : null
      }
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070640",
  },
  simage:{
    height:37,
    width:33,
    resizeMode:'contain',
  },
  heroText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: Platform.OS === 'ios ' ? 'TimesNewRomanPS-BoldMT' : 'System'
  },
  text: {
    fontSize: 15,
    paddingTop:'8%',
    color: "#FFFFFF",
    fontFamily:'System'
  },
  form: {
    flexDirection:'column',
    justifyContent: "space-between",
    paddingTop:'27%',
    width: "100%",
    height:'30%',
  },
  vicon:{
    alignSelf:'flex-start',
    marginLeft:36,
    marginTop:50,
    flexDirection:'row'
  },
  textView:{
    marginTop:'32%',
    width:'75%',
    height:'30%',
    alignSelf:'center',
  },
});

export default DetectPlatform(ValueProp,styles.container);