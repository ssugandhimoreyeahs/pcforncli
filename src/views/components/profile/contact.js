import React, { Component, Fragment } from "react";
import { View ,Text, TouchableOpacity, BackHandler,ScrollView,Alert,AsyncStorage, SafeAreaView, StyleSheet, StatusBar, Linking} from "react-native";
// import { Ionicons, AntDesign} from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Spinner from 'react-native-loading-spinner-overlay';
import { updateUserWithCompany,getUser } from "../../../api/api";
import { loggedOutUser } from "../../../api/api";
import { APP_VERSION } from "../../../constants/constants";
import DetectPlatform from "../../../DetectPlatform";
import { connect } from "react-redux";
import { StackActions, NavigationActions } from 'react-navigation';
Ionicons.loadFont();
AntDesign.loadFont();
const resetAction = StackActions.reset({
  index: 0,
  actions: [
      NavigationActions.navigate({ routeName: 'ValueProp' })
  ],
  });

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state={
      spinner:false
    }
    
  }
  componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }

  handleBackButton=(nav)=> {
    if(!nav.isFocused()) {
      BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
      return false;
    }else{
      nav.goBack();
      return true;
    }
  }
  handleLogoutButton = async () => {
      this.setState({ spinner: true });
      setTimeout( async ()=>{

        const confirmLogout = await loggedOutUser();
      if(confirmLogout){
        this.setState( async (prevState) => { return { spinner:false } },()=>{ 
          //this.props.navigation.navigate("ValueProp"); 
          setTimeout(()=>{
            this.props.navigation.dispatch(resetAction);
          },200);
        });
      }

      },1000);
  } 

  handleLegalPressTOS = () => {
    Linking.openURL(
      `https://www.pocketcfoapp.com/terms-of-use`
    );
    // this.props.navigation.navigate("Legal")
  };
  handleLegalPressPP = () => {
    Linking.openURL(
      `https://www.pocketcfoapp.com/privacy-policy`
      );
    // this.props.navigation.navigate("Legal")
  };
  

    render() {
      const { userData } = this.props.reduxState.userData;
      return (
        <Fragment>
      <ScrollView style={{backgroundColor: '#FFF'}}>
           <Spinner
          visible={this.state.spinner}
          textStyle={styles.spinnerTextStyle}
        />
          <View style={styles.first}>

          <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
            <AntDesign color="#fff" name='left' size={25} style={{marginTop:10,marginLeft:10}}/>
            </TouchableOpacity>
              <View style = {{marginTop:10,height:40, width:"100%",flexDirection:"row",justifyContent:"space-between", paddingLeft:18, paddingRight:19,
               alignSelf:"center"}}>
              <Text style={{ fontSize: 25, color: "#FFFFFF",}}>{ (userData.firstname) ? userData.firstname+" "+userData.lastname : null }</Text>
              <View style={styles.TextInputStyleClass}>
                <Text style={{fontSize:11,textAlign:'center'}}>PocketCFO BETA</Text>
              </View>
              </View>
               <Text style={{ fontSize: 11,color: "#FFFFFF",width:121,height:22.03,marginLeft:18, marginTop:11}}>{ (userData.title) ? userData.title : null }</Text> 
         </View>

          <View style={styles.voptionContainer}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Businesspro")}>
            <View style={styles.BusinessView}>
                    <View style={{width:127, height:38, flexDirection:"column", marginTop:22,marginLeft:12}}>
                      <Text style={styles.texthead}>BUSINESS PROFILE</Text>
                      <Text style={styles.textsubhead}>{ userData.company }</Text>
                    </View>

                    <View style={{justifyContent:'center', padding:12}}>
                      <Ionicons name='md-arrow-dropright' width={12} height={15}/>
                    </View>
              </View> 
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{ this.props.navigation.navigate("Integration",{ ...this.state.userData, updateSalesChartOnly:()=>{ 
              //this.props.navigation.getParam("updateSalesChartOnly")(); 
              this.props.navigation.getParam("reloadDashBoardData")();
              }  ,reloadDashBoardData: () =>{ this.props.navigation.getParam("reloadDashBoardData")(); } }) }}>
            <View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#f1f3f5',borderBottomWidth:1,borderRadius:6,
            height:82}}>
                    <View style={{width:210, height:70, flexDirection:"column",marginTop:22,marginLeft:12}}>
                      <Text style={styles.texthead}>INTEGRATIONS</Text>
                      <Text style={styles.textsubhead}>Chase, QuickBooks, Manage Integration</Text>
                    </View>

                    <View style={{justifyContent:'center', padding:12}}>
                      <Ionicons name='md-arrow-dropright' width={12} height={15}/>
                    </View>
              </View> 
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate("Setting")}>
              <View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#f1f3f5',borderBottomWidth:1,height:82}}>
                    <View style={{width:95, height:37, flexDirection:"column",marginTop:22,marginLeft:12}}>
                      <Text style={styles.texthead}>SETTINGS</Text>
                      <Text style={styles.textsubhead}>Profile, Security</Text>
                    </View>
                    <View style={{justifyContent:'center', padding:12}}>
                      <Ionicons name='md-arrow-dropright' width={12} height={15}/>
                    </View>

            </View>
            </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.handleLegalPressTOS()}>
            <View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#f1f3f5',borderBottomWidth:1,}}>
                 <View style={{width:127, height:38, flexDirection:"column",marginTop:22,marginLeft:12}}>
                      <Text style={styles.texthead}>TERMS OF SERVICE</Text>
                 </View>
                 <View style={{justifyContent:'center', padding:12}}>
                      <Ionicons name='md-arrow-dropright' width={12} height={15}/>
                 </View>
            </View> 
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.handleLegalPressPP()}>
            <View style={{flexDirection:'row',justifyContent:'space-between', backgroundColor: '#FFFFFF',borderBottomColor:'#f1f3f5',borderBottomWidth:1,borderBottomEndRadius:10, borderBottomStartRadius:10,}}>
                 <View style={{width:127, height:38, flexDirection:"column",marginTop:22,marginLeft:12}}>
                      <Text style={styles.texthead}>PRIVACY POLICY</Text>
                 </View>
                 <View style={{justifyContent:'center', padding:12}}>
                      <Ionicons name='md-arrow-dropright' width={12} height={15}/>
                  </View>
             </View>
             </TouchableOpacity>
            </View>
           <Text style={styles.headimh}>Logged in as { userData.username }</Text>
           <Text style={styles.headimh2}>Status - { userData.bankStatus == "linked" ? "Active" : "Inactive" }</Text>
           <Text style={styles.headimh2}>Version { APP_VERSION }</Text>

          <TouchableOpacity onPress={this.handleLogoutButton}>
            
            <View style={styles.vlogout}>
               <Text style={styles.subhead}>Log Out</Text>
            </View>
            
          </TouchableOpacity>
         </ScrollView>
         </Fragment>
      );
    }
};

const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  first: {
      width:'100%',
      height:132,
      backgroundColor:"#07053E" ,                                                                                          
    },
    headimh:{
      fontSize:12,
      color:"#000",
      alignSelf:"center",
      marginTop:'10%',
    },
    headimh2:{
      fontSize:12,
      color:"#000",
      alignSelf:"center",
      marginTop:'4%'
    },
    subhead:{
      fontSize:10,
      color:"#000000",
      alignSelf:"center",
      marginTop:16,
  },
  TextInputStyleClass:{
    fontSize:11,
    height: 24,
    borderRadius: 12,
    width:116,
    color:'#07053E',
    backgroundColor : "#FFFFFF",
    justifyContent:'center',
    
  },
    vlogout:{
      width:'90%',
      height:48,
      marginTop:'10%',
      backgroundColor: "#FFFFFF",
      marginTop:10,
      marginLeft:18,
      marginRight:19,
      alignSelf:'baseline',
      borderRadius:6,
      marginBottom:19,
      elevation:2,
      shadowColor:'#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
    },
    voptionContainer:{
      width:'90%', 
      height:361,
      marginTop:42,
      backgroundColor:"#FFFFFF",
      alignSelf:'center',
      marginLeft:18,
      marginRight:19,
      flexDirection:"column",
      alignItems: 'stretch',
      marginHorizontal:12,
      borderRadius:6,
      elevation:4,
      shadowColor:'#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
    },
    BusinessView:{
      flexDirection:'row',
      justifyContent:'space-between',
      backgroundColor: '#FFFFFF',
      borderBottomColor:'#f1f3f5',
      borderBottomWidth:1,
      borderTopEndRadius:30, 
      borderTopStartRadius:30,
      height:82
    },
    texthead:{
      color:'#000000',
      fontSize:12,
      height:16
    },
    textsubhead:{
      color:'#000000',
      fontSize:10,
      height:16
    },
});

const mapStateToProps = state => ({reduxState: state});
export default connect(mapStateToProps,null)(DetectPlatform(Contact, styles.margins))