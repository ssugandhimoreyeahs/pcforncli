import React, { Component, Fragment } from "react";
import { StyleSheet, View, Alert, Keyboard,Image, SafeAreaView, StatusBar,BackHandler,Platform,TouchableOpacity, ScrollView } from "react-native";
import { Button, Card, Input, Text, Icon } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import { updateUserWithCompany,getUser,uploadCompanyLogo } from "../../api/api";
import Spinner from 'react-native-loading-spinner-overlay';
//import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { ERROR,BUSINESS_PROFILE_CREATED } from "../../api/message";
import {
  BUSINESS_MODEL_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
  STATE_OF_INCORP_OPTIONS,
  YEAR_FOUNDED_OPTIONS,
  AVATAR_IMAGE
} from "../../constants/constants";
// import {AntDesign,S, Ionicons} from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import DetectPlatform from "../../DetectPlatform";
import TryAgainScreen from "./somethingWrong";
import Ionicons from "react-native-vector-icons/Ionicons";

import ImagePickerRN from 'react-native-image-picker';
Ionicons.loadFont();
 class BusinessProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logo: "",
      companyName: '',
      industry: "",
      businessmodel: "",
      companySize: "",
      yearFounded: "",
      stateOfInc: "",
      spinner:true,
      logoByApi:"",
      selectLogoByUser:null,
      isBodyLoaded:false,
      showReloadingPage:false

    };
  }
  fetchUser= async ()=>{
    const users = await getUser();
    const { userData } = users;
    
    if(users.result == true){
      let { company,industry,businessModel,companySize,yearFounded,stateIncorporated } = userData;
      company = company == null ? '' : company;
      
      industry = industry == null ? "" : industry;
      businessModel = businessModel == null ? "" : businessModel;
      companySize = companySize == null ? "" : companySize;
      yearFounded = yearFounded == null ? "" : yearFounded;
      stateIncorporated = stateIncorporated == null ? "" : stateIncorporated;
      company = company.trim();
      this.setState({ 
        isBodyLoaded:true,
        logoByApi:userData.logo,
        companyName: company, 
        industry:industry, 
        businessmodel:businessModel, 
        companySize:companySize, 
        yearFounded:yearFounded,
        stateOfInc:stateIncorporated,
        spinner:false 
      });
      
      //this.setState({ isBodyLoaded:true,spinner:false });
    }else{
      this.setState({ isBodyLoaded:true,spinner:false});
    }
    
}
  componentDidMount=()=>{
    this.fetchUser();
    //this.getPermissionAsync();
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

  showAlert(heading="",content=""){
    Alert.alert(
      heading,
      content, [{
          text: 'Okay',
          
          style: 'cancel'
      },],{
          cancelable: false
      })
  }

  handlePress = async () => {
    Keyboard.dismiss();
    this.setState({ spinner:true });
    this.props.navigation.getParam("createBusinessProfile")();
    const {
      logo,
      companyName,
      businessmodel,
      industry,
      companySize,
      yearFounded,
      stateOfInc
    } = this.state;
    
    const userId = this.props.navigation.getParam("userId", "");
    const firstName = this.props.navigation.getParam("firstName", "");
    
    const body = {
      company:companyName,
      logo:"",
      industry,
      businessModel:businessmodel,
      companySize,
      yearFounded,
      stateIncorporated:stateOfInc
    }
    
    

    const profileUpdated = await updateUserWithCompany(body);
    

    if(profileUpdated.result == true){
      let milliseconds = (new Date).getTime();
      if(this.state.selectLogoByUser != null)
      {
        const formData = new FormData();
        let imgObj = {
          uri: `${this.state.selectLogoByUser.uri}`,
          type: 'image/jpg',
          name: `image-${milliseconds}.jpg`,
        }
        formData.append("image",imgObj);
        const uploadLogo = await uploadCompanyLogo(formData);
      }


      this.setState((prevState)=>{ return { spinner:!prevState.spinner } },()=>{ setTimeout(()=>{
        
        Alert.alert(
          "Success",
          BUSINESS_PROFILE_CREATED, [{
              text: 'Okay',
              
              onPress: () => {
                this.props.navigation.getParam("createBusinessProfile")();
                this.props.navigation.navigate("Setup",{ shouldReloadApi:true });
              },
              style: 'cancel'
          },],{
              cancelable: false
          })

      },100) });

    
          
    }else if(profileUpdated.result == false){
      this.setState((prevState)=>{ return { spinner:!prevState.spinner } },()=>{ setTimeout(()=>{
        this.showAlert(ERROR.title,ERROR.message);
      },100) });
    }else{


      if(profileUpdated.error.code != undefined && profileUpdated.error.code == "ECONNABORTED"){
        this.setState((prevState)=>{ return { spinner:!prevState.spinner } },()=>{ setTimeout(()=>{
          this.showAlert(ERROR.title,ERROR.message);
        },100) });
        
      }
      else{
        this.setState((prevState)=>{ return { spinner:!prevState.spinner } },()=>{ setTimeout(()=>{
          this.showAlert(ERROR.title,ERROR.message);
        },100) });
      }

    }
  };

  //Code for the Images Related

  // getPermissionAsync = async () => {
  //   if (Constants.platform.ios) {
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!');
  //     }
  //   }
  // }

  handleChooseBusinessProfilePic = async  () => {

    //code on reactnative cli

    const options = {
      title: 'Select Company Logo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType:'photo',
      takePhotoButtonTitle: null,
      quality:0.1,
      width:500,
      height:500
    };

    
    ImagePickerRN.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
         this.setState({ selectLogoByUser: response });;
      }
    });

     
   
  };
  handleOveLayStyle=()=>{
    if(this.state.industry == ""){
      return { marginTop: "25%" };
    }else{
      return { marginTop: "19.80%" };
    }
    
  }
  //code for image related Ends here
  render() {
    const { logoByApi,selectLogoByUser,isBodyLoaded,showReloadingPage } = this.state;
    
    let readyProfileUrl = isBodyLoaded && (selectLogoByUser == null ? (logoByApi   == null || logoByApi == "") ? { "type":"require" }   :  { "type":"uri", uri : logoByApi } : { "type":"uri", uri: selectLogoByUser.uri } ); 
    return (
      <React.Fragment>
        <Spinner
          visible={this.state.spinner}
        />
        
        { (isBodyLoaded == true) ?  (showReloadingPage == true) ?
        <TryAgainScreen handleButton={()=>{ this.fetchUser(); }} />
        : <ScrollView>
        <View style={{ marginTop: 10,flexDirection:"row",width:"100%" }}>

          <View style={{ width:"8%",justifyContent:"center",alignItems:"flex-end" }}>
              <TouchableOpacity  onPress={()=>{ this.props.navigation.goBack(); }} >
                  <Ionicons name='md-close' size={28} color={'#000000'}/>
              </TouchableOpacity>
          </View>
          <View style={{ width:"87%",justifyContent:"center",alignItems:"center" }}>

          <Text style={{ fontSize:17,fontWeight:"bold",color:"black" }}>{ `Create Business Profile` }</Text>

              
          </View>
          </View>
        
        {/* <Card containerStyle={styles.card}>
          <Icon
            name="image"
            type="font-awesome"
            containerStyle={styles.icon}
            color={"gray"}
          />
        </Card>
        <Button title="Add company logo" type="clear" /> */}
        <View style={styles.imgView} >
             
              { ( readyProfileUrl.type != undefined && readyProfileUrl.type == "uri" ) ? <Image 
                source={{uri: readyProfileUrl.uri }} 
                style={{height:92,width:92,alignSelf:'center',borderRadius:48}}></Image> :
                <Image 
                source={require("../../assets/avatar1.png")}
                style={{height:92,width:92,alignSelf:'center',borderRadius:48}}></Image>
                }
              
          </View>
          <TouchableOpacity onPress={this.handleChooseBusinessProfilePic}><Text style={{fontFamily:'System', fontSize:15, fontWeight:"normal", color:'#007AFF', alignSelf:'center', marginBottom:"3%", marginTop:'2%'}}>Add company logo</Text></TouchableOpacity> 
        <Input
          style={{marginTop:"50px"}}
          placeholder={"Company Name"}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          value={this.state.companyName}
          onChangeText={(companyName)=>{ this.setState(()=>{ return {companyName } }) }}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Industry</Text>
            <Dropdown
              label={"Select                   v"}
              data={INDUSTRY_OPTIONS}
              value={this.state.industry}
              onChangeText={text => {  setTimeout(()=>{ this.setState({ industry: text }) },1000);  }}
              inputContainerStyle={styles.detailsInputContainer}
              containerStyle={styles.dropdown}
              renderAccessory={() => null}
              onBlur={()=>{ Keyboard.dismiss(); }}
              onFocus={()=>{ Keyboard.dismiss(); }}
              dropdownPosition={-5.4}
            />
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Business Model</Text>
            <Dropdown
              label={"Select                   v"}
              data={BUSINESS_MODEL_OPTIONS}
              value={this.state.businessmodel}
              onChangeText={text => this.setState({ businessmodel: text })}
              inputContainerStyle={styles.detailsInputContainer}
              containerStyle={styles.dropdown}
              renderAccessory={() => null}
              onBlur={()=>{ Keyboard.dismiss(); }}
              onFocus={()=>{ Keyboard.dismiss(); }}
              dropdownPosition={-5.4}
            />
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Company Size</Text>
            <Dropdown
              label={"Select                   v"}
              data={COMPANY_SIZE_OPTIONS}
              value={this.state.companySize}
              onChangeText={text => this.setState({ companySize: text })}
              inputContainerStyle={styles.detailsInputContainer}
              containerStyle={styles.dropdown}
              renderAccessory={() => null}
              onBlur={()=>{ Keyboard.dismiss(); }}
              onFocus={()=>{ Keyboard.dismiss(); }}
              dropdownPosition={-5.4}
            />
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>Year Founded</Text>
            <Dropdown
              label={"Select                   v"}
              data={YEAR_FOUNDED_OPTIONS}
              value={this.state.yearFounded}
              onChangeText={text => this.setState({ yearFounded: text })}
              inputContainerStyle={styles.detailsInputContainer}
              containerStyle={styles.dropdown}
              renderAccessory={() => null}
              onBlur={()=>{ Keyboard.dismiss(); }}
              onFocus={()=>{ Keyboard.dismiss(); }}
              dropdownPosition={-5.4}
            />
          </View>
          <View style={styles.detailsRow}>
            <Text
              style={{ fontSize: 15, width: "60%" }}
            >{`State of Incorporation`}</Text>
            <Dropdown
              label={"Select            v"}
              data={STATE_OF_INCORP_OPTIONS}
              value={this.state.stateOfInc}
              onChangeText={text => this.setState({ stateOfInc: text })}
              inputContainerStyle={styles.detailsInputContainer}
              containerStyle={{ width: "40%", marginTop: "-15%" }}
              renderAccessory={() => null}
              onBlur={()=>{ Keyboard.dismiss(); }}
              onFocus={()=>{ Keyboard.dismiss(); }}
              dropdownPosition={-5.4}
            />
          </View>
          <Button
            disabled={
               !this.state.companyName ||
              !this.state.industry ||
              !this.state.businessmodel ||
              !this.state.companySize ||
              !this.state.yearFounded ||
              !this.state.stateOfInc
            }
            buttonStyle={styles.button}
            disabledStyle={{backgroundColor:'#7FBDFF',}}
            containerStyle={styles.buttonContainer}
            title="Next"
            onPress={this.handlePress}
          />
        </View>
          </ScrollView>  : null  }
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
  buttonContainer: {
    marginTop: 45,
    width: "75%",
    alignSelf:'center'
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
    height: 96
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailsContainer: {
    width: "72%",
    flexDirection: "column",
    paddingTop: "5%",
    alignSelf:'center'
  },
  detailsRow: {
    flexDirection: "row",
    paddingTop: "10%",
    alignSelf:'center'
  },
  detailsText: {
    fontSize: 15,
    width: "50%"
  },
  detailsInputContainer: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 1
  },
  dropdown: {
    width: "50%",
    marginTop: "-15%"
  },
  inputContainer: {
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    width: "75%"
  },
  input: {
    textAlign: "center"
  },
  flexCol: {
    flexDirection: "column"
  },
  flexRow: {
    flexDirection: "row"
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft:'18%'
  },
  icon: {
    marginTop: 5
  },
  imgView:{ 
    width:96, 
    height:96, 
    borderRadius:48, 
    justifyContent:'center' ,
    backgroundColor:"#fff", 
    marginTop:36, 
    marginLeft:140, 
    marginRight:138, 
    alignSelf:"center",
    elevation:2,
    shadowColor:'#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  }
});

export default DetectPlatform(BusinessProfile,styles.container);