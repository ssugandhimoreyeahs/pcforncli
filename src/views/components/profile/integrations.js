
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler,Alert,AsyncStorage } from "react-native";
//import { AntDesign } from "@expo/vector-icons";
import { isCheckUserConnectedToBank } from "../../../api/api";
import Spinner from 'react-native-loading-spinner-overlay';
import DetectPlatform from "../../../DetectPlatform";
import { unlinkBankAccount,reLinkBankAccount,validPlaidToken } from "../../../api/api";
import { connect } from "react-redux";
import { fetchUserAsyncActionCreator } from "../../../reducers/getUser";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SURE_UNLINK_ACCOUNT,SURE_RELINK_ACCOUNT,ERROR } from "../../../api/message";
AntDesign.loadFont();

class Integration extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSpinner:true,
            isUserLinkedToBank:false,
            isUserUnlinkedToBank:false,
            bankData:{},
            isBodyLoaded:false,
            isUserConnectedToQuickBook:false,

        }
    }
    
     isUserConnectedToBank = async () => {
        const { userData } = this.props.reduxState.userData;
        console.log("Getting user connected to bank");
        console.log(userData);
        console.log("Getting user connected to bank");
        if(userData.bankIntegrationStatus == false){
            if(userData.qbIntegrationStatus == true){
                this.setState({ isUserConnectedToQuickBook: true });
             }
            this.setState({ isSpinner:false,isBodyLoaded:true });
        }else{
            const triggerValidPlaidToken = await validPlaidToken();
            if(triggerValidPlaidToken.result == true && triggerValidPlaidToken.response.isValidPlaidToken == true){
                const userConnectedToBank = await isCheckUserConnectedToBank();
                if(userConnectedToBank.result == true){
                    if(userData.bankStatus == "linked"){
                        //Code if the Bank is integrated already and the bank is linked successfully 
                        this.setState({ isUserLinkedToBank:true,isUserUnlinkedToBank:false,bankData:userConnectedToBank.bankConnectedData,isSpinner:false,isBodyLoaded:true });
                    }else{
        
                        //Code if the Bank is integrated but unlinked by the user
                        this.setState({ isUserLinkedToBank:false,isUserUnlinkedToBank:true,bankData:userConnectedToBank.bankConnectedData,isSpinner:false,isBodyLoaded:true });
                    }
                }else{
                    
                }
            }else{
                this.setState({ isSpinner:false,isBodyLoaded:true });
            }
            if(userData.qbIntegrationStatus == true){
               this.setState({ isUserConnectedToQuickBook: true });
            }

            return false;
        //     const userConnectedToBank = await isCheckUserConnectedToBank();
        // // console.log(userConnectedToBank);
        //     if(userConnectedToBank.result == true){
        //         this.setState({ userConnectedToBankState:true,bankData:userConnectedToBank.bankConnectedData,isSpinner:false,isBodyLoaded:true });
        //     }else{
        //         this.setState({ isSpinner:false,isBodyLoaded:true });
        // }
         }
        
     }

     checkIsQuickBookConnected = () => {
        const { userData } = this.props.reduxState.userData;
        if(userData.qbIntegrationStatus == true){
            this.setState({ isUserConnectedToQuickBook: true });
         }
     }
     componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
        this.isUserConnectedToBank();
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
      BankNotConnectedView = () => {
          return(
            <View style={bankNotConnectedStyle.integrationView}>
            <View style={bankNotConnectedStyle.innerViews}>
             <View style={{flexDirection:"column",width:"64%",height:30}}><Text style={{fontWeight:"bold"}}>Bank Integration</Text></View>
             <View style={{flexDirection:"column",width:"36%",height:30}}><TouchableOpacity onPress={()=>{ this.props.navigation.navigate("BankIntegration", { reloadDashBoardData:()=>{ this.props.navigation.getParam("reloadDashBoardData")() },comeFromInnerIntegration:true,reloadInnerIntegrationScreen:()=>{ this.isUserConnectedToBank(); } } ); }} style={{borderRadius:15,borderColor:"#000000",borderWidth:1}}><Text style={{ paddingLeft:"25%" }}>Connect</Text></TouchableOpacity></View>
            </View>
            </View>
          );
      }

      quickBookNotConnectedView = () => {
        return(
          <View style={bankConnectedStyle.integrationViewQB}>
          <View style={{ ...bankNotConnectedStyle.innerViews,marginTop: '1%' }}>
           <View style={{flexDirection:"column",width:"64%",height:30}}><Text style={{fontWeight:"bold"}}>QuickBooks</Text></View>
           <View style={{flexDirection:"column",width:"36%",height:30}}><TouchableOpacity onPress={()=>{ this.props.navigation.navigate("QuickbookIntegration", { reloadDashBoardDataForQb:()=>{ this.props.navigation.getParam("updateSalesChartOnly")(); },comeFromInnerIntegrationOnQB:true } ); }} style={{borderRadius:15,borderColor:"#000000",borderWidth:1}}><Text style={{ paddingLeft:"25%" }}>Connect</Text></TouchableOpacity></View>
          </View>
          </View>
        );
    }
    

    quickBookConnectedView = () => {
        return(
            <View style={bankConnectedStyle.integrationViewQB}>
            <View style={bankConnectedStyle.innerViews}>
                <View style={{flexDirection:"column",width:"58%",height:60,}}><Text style={{fontWeight:"bold",fontSize:16}}>QuickBook</Text></View>
                {/* <View style={{flexDirection:"column",width:"40%",height:60}}><Text style={{fontWeight:"bold",fontSize:16}}>Beneficial State Bank - peerlook</Text></View> */}
                 <View style={{flexDirection:"column",width:"40%",height:30}}>
               <TouchableOpacity
                //onPress={()=>{this.showAlert()}}
                style={{borderRadius:30,borderWidth:0,backgroundColor:"#007AFF",flexDirection:"row",height:21, justifyContent:"center"}}>
                   <AntDesign name="check" size={15} color="#fff" style={{alignSelf:"center"}}/>
                       <Text  style={{ paddingLeft:"5%", color:"#fff", alignSelf:"center"}}>Connected</Text>
               </TouchableOpacity>
            </View>
            </View>
        </View>
        );
    }


    
      errorWhileDisconnectingBank = () => {  
        Alert.alert(  
            ERROR.title,  
            ERROR.message,  
            [  
                {  
                    text: 'Okay',  
                    onPress: () => {
                        //this.props.navigation.goBack();

                        this.setState(()=>{ return { isSpinner:false } },()=>{
                            setTimeout(()=>{
                                
                                    this.props.navigation.goBack();
                                
                            },300);
                        });

                    },  
                    style: 'ok',
                },
            ], 
            {cancelable: false}, 
        );  
    }  

    showSuccessfullyPopup = (TITLE,MESSAGE) => {
        this.props.reduxDispath(fetchUserAsyncActionCreator());
        Alert.alert(  
            TITLE,  
            MESSAGE,  
            [  
                {  
                    text: 'Okay',  
                    onPress: () => {
                        
                        
                            
                            this.setState(()=>{ return { isSpinner:true } },()=>{
                                setTimeout(()=>{
                                    this.setState(()=>{ return { isSpinner:false } },()=>{
                                        this.props.navigation.goBack();
                                    })
                                },1000);
                            });
                        
                        
                    },  
                    style: 'disconnect',
                } 
            ], 
            {cancelable: false}, 
        );
    }

    
    handleReLinkAccount = async () => {
        this.setState(()=>{ return {isSpinner: true}}, async ()=>{
            const isUserSuccessfullyReLinked = await reLinkBankAccount();
            if(isUserSuccessfullyReLinked.result == true){
                this.setState((prevState)=>{ return { isSpinner: false } },()=>{
                    
                    setTimeout(()=>{ this.showSuccessfullyPopup("Success","You have successfully connected your bank account.") },100);
                })

            }else{
                Alert.alert("Error","Error Try Again!");
            }  
        } );
            
    }
    handleUnlinkAccount = async () => { 
            this.setState(()=>{ return {isSpinner: true} }, async ()=>{
                const isUserSuccessfullyUnlinked = await unlinkBankAccount();
            if(isUserSuccessfullyUnlinked.result == true){
                this.setState((prevState)=>{ return { isSpinner: !prevState.isSpinner } },()=>{
                    
                    setTimeout(()=>{ this.showSuccessfullyPopup("Success","You have successfully disconnected your bank account.") },100);
                })

            }else{
                Alert.alert("Error","Error Try Again!");
            } 
            });
            
    }

    showConfirmPopupBeforeAction = (TITLE,MESSAGE,FUNCTION_CALL) => { 
        Alert.alert(  
            TITLE,  
            MESSAGE,  
            [  
                {text: 'Cancel', onPress: () => console.log('Cancel Button Pressed')},
                {   
                    text: 'Ok',  
                    onPress: () => {
                        switch(FUNCTION_CALL){
                            case "RELINK":  
                                this.handleReLinkAccount();
                            break;
                            case "UNLINK":
                                this.handleUnlinkAccount();
                            break;
                        }
                        
                    },  
                    style: 'disconnect',
                } 
            ],
            {cancelable: false},
        );
    }


      BankUnlinkedView = () => { 
        const { bankData } = this.state;
        return (
            <View style={bankConnectedStyle.integrationView}>
                <View style={bankConnectedStyle.innerViews}>
                    <View style={{flexDirection:"column",width:"58%",height:60,}}><Text style={{fontWeight:"bold",fontSize:16}}>{ bankData.institution_name1 }</Text></View>
                    {/* <View style={{flexDirection:"column",width:"40%",height:60}}><Text style={{fontWeight:"bold",fontSize:16}}>Beneficial State Bank - peerlook</Text></View> */}
                     <View style={{flexDirection:"column",width:"40%",height:30}}>
                   <TouchableOpacity onPress={()=>{ this.showConfirmPopupBeforeAction("Reconnect",SURE_RELINK_ACCOUNT,"RELINK"); }}
                    //onPress={()=>{this.showAlert()}}
                    style={{borderRadius:30,borderWidth:0,backgroundColor:"#b80909",flexDirection:"row",height:21, justifyContent:"center"}}>
                       <AntDesign name="close" size={15} color="#fff" style={{alignSelf:"center"}} />
                           <Text  style={{ paddingLeft:"5%", color:"#fff", alignSelf:"center"}}>Disconnected</Text>
                   </TouchableOpacity>
                </View>
                </View>
            </View>
        );
      }
      BankLinkedView = () => {
          const { bankData } = this.state;
        return (
            <View style={bankConnectedStyle.integrationView}>
                <View style={bankConnectedStyle.innerViews}>
                    <View style={{flexDirection:"column",width:"58%",height:60,}}><Text style={{fontWeight:"bold",fontSize:16}}>{ bankData.institution_name1 }</Text></View>
                    {/* <View style={{flexDirection:"column",width:"40%",height:60}}><Text style={{fontWeight:"bold",fontSize:16}}>Beneficial State Bank - peerlook</Text></View> */}
                     <View style={{flexDirection:"column",width:"40%",height:30}}>
                   <TouchableOpacity onPress={()=>{ this.showConfirmPopupBeforeAction("Disconnect",SURE_UNLINK_ACCOUNT,"UNLINK"); }}
                    //onPress={()=>{this.showAlert()}}
                    style={{borderRadius:30,borderWidth:0,backgroundColor:"#007AFF",flexDirection:"row",height:21, justifyContent:"center"}}>
                       <AntDesign name="check" size={15} color="#fff" style={{alignSelf:"center"}}/>
                           <Text  style={{ paddingLeft:"5%", color:"#fff", alignSelf:"center"}}>Connected</Text>
                   </TouchableOpacity>
                </View>
                </View>
            </View>
        );
      }
    render(){
        const { 
            isSpinner,
            isUserLinkedToBank,
            isUserUnlinkedToBank,
            isBodyLoaded
        } = this.state;
        const { qbIntegrationStatus,bankStatus: onlyForRenderBankStatus } = this.props.reduxState.userData.userData;
        console.log("Current Qb Integraiton Status - ",qbIntegrationStatus);
        return(
            <React.Fragment>
                <Spinner
                    visible={isSpinner}
                />
                    {
                        this.state.isBodyLoaded == true ?
                        <React.Fragment>
                            <View style={{flexDirection:'row', width:'62%',marginTop:'1%',alignSelf:"flex-start",justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                            <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
                        </TouchableOpacity>
                        <Text style={styles.header}>Integrations</Text>
                    </View>
                    {
                         
                                (isUserLinkedToBank == false && isUserUnlinkedToBank == false) ? this.BankNotConnectedView() : (
                                    (onlyForRenderBankStatus == "linked") ? this.BankLinkedView() : this.BankUnlinkedView()
                                    )
                           
                    }
                    {
                        qbIntegrationStatus ?
                        this.quickBookConnectedView() :
                        this.quickBookNotConnectedView()
                    }
                            </React.Fragment>
                            :
                            null
                    }
            </React.Fragment>
        );
    }
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        height:"100%",
        width:"100%"
    },
    header: {
        fontSize: 17,
        fontWeight: "bold",
      },
});


const bankConnectedStyle = StyleSheet.create({
    integrationView:{
        flexDirection:"row",
        backgroundColor:"#ffffff",
        justifyContent:'center',
        alignSelf:'center',
        marginTop:"15%",
        width:"90%",
        height:"10%",
        borderRadius:8,
        borderColor:"#000000",
        borderTopColor:"#000000",
        borderWidth:0.1,
        shadowColor:"#808080",
        shadowRadius: 5,
        shadowOpacity: 1.5,
        elevation:6
    },
    integrationViewQB:{
        flexDirection:"row",
        backgroundColor:"#ffffff",
        justifyContent:'center',
        alignSelf:'center',
        marginTop:"5%",
        width:"90%",
        height:"10%",
        borderRadius:8,
        borderColor:"#000000",
        borderTopColor:"#000000",
        borderWidth:0.1,
        shadowColor:"#808080",
        shadowRadius: 5,
        shadowOpacity: 1.5,
        elevation:6
    }, 
    innerViews:{
        marginTop:"12%",
        width: "90%",
        flexDirection:"row",
        marginTop:"3%",
        justifyContent:'space-between'
    },  

});

const bankNotConnectedStyle = StyleSheet.create({
    innerViews:{
        marginTop:"10%",
        width: "90%",
        flexDirection:"row",
        alignSelf:"center"
    },  
    integrationView:{
        flexDirection:"row",
        backgroundColor:"#ffffff",
        justifyContent:'center',
        alignSelf:'center',
        marginTop:"15%",
        width:"90%",
        height:"10%",
        borderRadius:8,
        borderColor:"#000000",
        borderTopColor:"#000000",
        borderWidth:0.1,
        shadowColor:"#808080",
        shadowRadius: 5,
        shadowOpacity: 1.5,
        elevation:6
    },
})

const mapStateToProps = state => ({reduxState:state});
const mapDispatchToProps = dispatch => ({ reduxDispath:dispatch });
export default connect(mapStateToProps,mapDispatchToProps)(DetectPlatform(Integration,styles.container));





























//Code in working condition and is commented on 05-02-2020 on 12:55PM
// import React, { Component } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, BackHandler,Alert,AsyncStorage } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import { isCheckUserConnectedToBank } from "../../../api/api";
// import Spinner from 'react-native-loading-spinner-overlay';
// import DetectPlatform from "../../../DetectPlatform";
// import { unlinkBankAccount,reLinkBankAccount,validPlaidToken } from "../../../api/api";
// import { connect } from "react-redux";
// import { fetchUserAsyncActionCreator } from "../../../reducers/getUser";
// import axios from "axios";
// import { APINETWORK } from "../../../constants/constants";
// import { SURE_UNLINK_ACCOUNT,SURE_RELINK_ACCOUNT } from "../../../api/message";

// class Integration extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             isSpinner:true,
//             isUserLinkedToBank:false,
//             isUserUnlinkedToBank:false,
//             bankData:{},
//             isBodyLoaded:false,
//             isUserConnectedToQuickBook:false,

//         }
//     }
    
//      isUserConnectedToBank = async () => {
//         const { userData } = this.props.reduxState.userData;
//         console.log("Getting user connected to bank");
//         console.log(userData);
//         console.log("Getting user connected to bank");
//         if(userData.bankIntegrationStatus == false){
//             if(userData.qbIntegrationStatus == true){
//                 this.setState({ isUserConnectedToQuickBook: true });
//              }
//             this.setState({ isSpinner:false,isBodyLoaded:true });
//         }else{
//             const triggerValidPlaidToken = await validPlaidToken();
//             if(triggerValidPlaidToken.result == true && triggerValidPlaidToken.response.isValidPlaidToken == true){
//                 const userConnectedToBank = await isCheckUserConnectedToBank();
//                 if(userConnectedToBank.result == true){
//                     if(userData.bankStatus == "linked"){
//                         //Code if the Bank is integrated already and the bank is linked successfully 
//                         this.setState({ isUserLinkedToBank:true,isUserUnlinkedToBank:false,bankData:userConnectedToBank.bankConnectedData,isSpinner:false,isBodyLoaded:true });
//                     }else{
        
//                         //Code if the Bank is integrated but unlinked by the user
//                         this.setState({ isUserLinkedToBank:false,isUserUnlinkedToBank:true,bankData:userConnectedToBank.bankConnectedData,isSpinner:false,isBodyLoaded:true });
//                     }
//                 }else{
                    
//                 }
//             }else{
//                 this.setState({ isSpinner:false,isBodyLoaded:true });
//             }
//             if(userData.qbIntegrationStatus == true){
//                this.setState({ isUserConnectedToQuickBook: true });
//             }

//             return false;
//         //     const userConnectedToBank = await isCheckUserConnectedToBank();
//         // // console.log(userConnectedToBank);
//         //     if(userConnectedToBank.result == true){
//         //         this.setState({ userConnectedToBankState:true,bankData:userConnectedToBank.bankConnectedData,isSpinner:false,isBodyLoaded:true });
//         //     }else{
//         //         this.setState({ isSpinner:false,isBodyLoaded:true });
//         // }
//          }
        
//      }

//      checkIsQuickBookConnected = () => {
//         const { userData } = this.props.reduxState.userData;
//         if(userData.qbIntegrationStatus == true){
//             this.setState({ isUserConnectedToQuickBook: true });
//          }
//      }
//      componentDidMount(){
//         BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
//         this.isUserConnectedToBank();
//       }
      
//       componentWillUnmount(){
//        BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
//       }
      
//       handleBackButton=(nav)=> {
//         if (!nav.isFocused()) {
//           BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
//           return false;
//         }else{
//           nav.goBack();
//           return true;
//         }
//       }
//       BankNotConnectedView = () => {
//           return(
//             <View style={bankNotConnectedStyle.integrationView}>
//             <View style={bankNotConnectedStyle.innerViews}>
//              <View style={{flexDirection:"column",width:"64%",height:30}}><Text style={{fontWeight:"bold"}}>Bank Integration</Text></View>
//              <View style={{flexDirection:"column",width:"36%",height:30}}><TouchableOpacity onPress={()=>{ this.props.navigation.navigate("BankIntegration", { reloadDashBoardData:()=>{ this.props.navigation.getParam("reloadDashBoardData")() },comeFromInnerIntegration:true,reloadInnerIntegrationScreen:()=>{ this.isUserConnectedToBank(); } } ); }} style={{borderRadius:15,borderColor:"#000000",borderWidth:1}}><Text style={{ paddingLeft:"25%" }}>Connect</Text></TouchableOpacity></View>
//             </View>
//             </View>
//           );
//       }

//       quickBookNotConnectedView = () => {
//         return(
//           <View style={bankConnectedStyle.integrationViewQB}>
//           <View style={bankNotConnectedStyle.innerViews}>
//            <View style={{flexDirection:"column",width:"64%",height:30}}><Text style={{fontWeight:"bold"}}>QuickBook</Text></View>
//            <View style={{flexDirection:"column",width:"36%",height:30}}><TouchableOpacity onPress={()=>{ this.props.navigation.navigate("QuickbookIntegration", { reloadDashBoardDataForQb:()=>{ this.props.navigation.getParam("updateSalesChartOnly")(); },comeFromInnerIntegrationOnQB:true } ); }} style={{borderRadius:15,borderColor:"#000000",borderWidth:1}}><Text style={{ paddingLeft:"25%" }}>Connect</Text></TouchableOpacity></View>
//           </View>
//           </View>
//         );
//     }
    

//     quickBookConnectedView = () => {
//         return(
//             <View style={bankConnectedStyle.integrationViewQB}>
//             <View style={bankConnectedStyle.innerViews}>
//                 <View style={{flexDirection:"column",width:"58%",height:60,}}><Text style={{fontWeight:"bold",fontSize:16}}>QuickBook</Text></View>
//                 {/* <View style={{flexDirection:"column",width:"40%",height:60}}><Text style={{fontWeight:"bold",fontSize:16}}>Beneficial State Bank - peerlook</Text></View> */}
//                  <View style={{flexDirection:"column",width:"40%",height:30}}>
//                <TouchableOpacity
//                 //onPress={()=>{this.showAlert()}}
//                 style={{borderRadius:30,borderWidth:0,backgroundColor:"#007AFF",flexDirection:"row",height:21, justifyContent:"center"}}>
//                    <AntDesign name="check" size={15} color="#fff" style={{alignSelf:"center"}}/>
//                        <Text  style={{ paddingLeft:"5%", color:"#fff", alignSelf:"center"}}>Connected</Text>
//                </TouchableOpacity>
//             </View>
//             </View>
//         </View>
//         );
//     }


    
//       errorWhileDisconnectingBank = () => {  
//         Alert.alert(  
//             'Error',  
//             'Server Error Try Again.',  
//             [  
//                 {  
//                     text: 'OK',  
//                     onPress: () => {
//                         this.props.navigation.goBack();
//                     },  
//                     style: 'ok',
//                 },
//             ], 
//             {cancelable: false}, 
//         );  
//     }  

//     showSuccessfullyPopup = (TITLE,MESSAGE) => {
//         this.props.reduxDispath(fetchUserAsyncActionCreator());
//         Alert.alert(  
//             TITLE,  
//             MESSAGE,  
//             [  
//                 {  
//                     text: 'Ok',  
//                     onPress: () => {
                        
                        
                            
//                             this.setState(()=>{ return { isSpinner:true } },()=>{
//                                 setTimeout(()=>{
//                                     this.setState(()=>{ return { isSpinner:false } },()=>{
//                                         this.props.navigation.goBack();
//                                     })
//                                 },1000);
//                             });
                        
                        
//                     },  
//                     style: 'disconnect',
//                 } 
//             ], 
//             {cancelable: false}, 
//         );
//     }

    
//     handleReLinkAccount = async () => {
//         this.setState(()=>{ return {isSpinner: true}}, async ()=>{
//             const isUserSuccessfullyReLinked = await reLinkBankAccount();
//             if(isUserSuccessfullyReLinked.result == true){
//                 this.setState((prevState)=>{ return { isSpinner: false } },()=>{
                    
//                     setTimeout(()=>{ this.showSuccessfullyPopup("Message","Account Successfully Re-linked") },100);
//                 })

//             }else{
//                 Alert.alert("Error","Server Error Try Again!!!");
//             }  
//         } );
            
//     }
//     handleUnlinkAccount = async () => { 
//             this.setState(()=>{ return {isSpinner: true} }, async ()=>{
//                 const isUserSuccessfullyUnlinked = await unlinkBankAccount();
//             if(isUserSuccessfullyUnlinked.result == true){
//                 this.setState((prevState)=>{ return { isSpinner: !prevState.isSpinner } },()=>{
                    
//                     setTimeout(()=>{ this.showSuccessfullyPopup("Message","Account Successfully Un-Linked") },100);
//                 })

//             }else{
//                 Alert.alert("Error","Server Error Try Again!!!");
//             } 
//             });
            
//     }

//     showConfirmPopupBeforeAction = (TITLE,MESSAGE,FUNCTION_CALL) => { 
//         Alert.alert(  
//             TITLE,  
//             MESSAGE,  
//             [  
//                 {text: 'Cancel', onPress: () => console.log('Cancel Button Pressed')},
//                 {   
//                     text: 'Ok',  
//                     onPress: () => {
//                         switch(FUNCTION_CALL){
//                             case "RELINK":  
//                                 this.handleReLinkAccount();
//                             break;
//                             case "UNLINK":
//                                 this.handleUnlinkAccount();
//                             break;
//                         }
                        
//                     },  
//                     style: 'disconnect',
//                 } 
//             ],
//             {cancelable: false},
//         );
//     }


//       BankUnlinkedView = () => { 
//         const { bankData } = this.state;
//         return (
//             <View style={bankConnectedStyle.integrationView}>
//                 <View style={bankConnectedStyle.innerViews}>
//                     <View style={{flexDirection:"column",width:"58%",height:60,}}><Text style={{fontWeight:"bold",fontSize:16}}>{ bankData.institution_name1 }</Text></View>
//                     {/* <View style={{flexDirection:"column",width:"40%",height:60}}><Text style={{fontWeight:"bold",fontSize:16}}>Beneficial State Bank - peerlook</Text></View> */}
//                      <View style={{flexDirection:"column",width:"40%",height:30}}>
//                    <TouchableOpacity onPress={()=>{ this.showConfirmPopupBeforeAction("Message",SURE_RELINK_ACCOUNT,"RELINK"); }}
//                     //onPress={()=>{this.showAlert()}}
//                     style={{borderRadius:30,borderWidth:0,backgroundColor:"#b80909",flexDirection:"row",height:21, justifyContent:"center"}}>
//                        <AntDesign name="close" size={15} color="#fff" style={{alignSelf:"center"}} />
//                            <Text  style={{ paddingLeft:"5%", color:"#fff", alignSelf:"center"}}>Un-Linked</Text>
//                    </TouchableOpacity>
//                 </View>
//                 </View>
//             </View>
//         );
//       }
//       BankLinkedView = () => {
//           const { bankData } = this.state;
//         return (
//             <View style={bankConnectedStyle.integrationView}>
//                 <View style={bankConnectedStyle.innerViews}>
//                     <View style={{flexDirection:"column",width:"58%",height:60,}}><Text style={{fontWeight:"bold",fontSize:16}}>{ bankData.institution_name1 }</Text></View>
//                     {/* <View style={{flexDirection:"column",width:"40%",height:60}}><Text style={{fontWeight:"bold",fontSize:16}}>Beneficial State Bank - peerlook</Text></View> */}
//                      <View style={{flexDirection:"column",width:"40%",height:30}}>
//                    <TouchableOpacity onPress={()=>{ this.showConfirmPopupBeforeAction("Message",SURE_UNLINK_ACCOUNT,"UNLINK"); }}
//                     //onPress={()=>{this.showAlert()}}
//                     style={{borderRadius:30,borderWidth:0,backgroundColor:"#007AFF",flexDirection:"row",height:21, justifyContent:"center"}}>
//                        <AntDesign name="check" size={15} color="#fff" style={{alignSelf:"center"}}/>
//                            <Text  style={{ paddingLeft:"5%", color:"#fff", alignSelf:"center"}}>Linked</Text>
//                    </TouchableOpacity>
//                 </View>
//                 </View>
//             </View>
//         );
//       }
//     render(){
//         const { 
//             isSpinner,
//             isUserLinkedToBank,
//             isUserUnlinkedToBank,
//             isBodyLoaded
//         } = this.state;
//         const { qbIntegrationStatus } = this.props.reduxState.userData.userData;
//         console.log("Current Qb Integraiton Status - ",qbIntegrationStatus);
//         return(
//             <React.Fragment>
//                 <Spinner
//                     visible={isSpinner}
//                 />
//                     {
//                         this.state.isBodyLoaded == true ?
//                         <React.Fragment>
//                             <View style={{flexDirection:'row', width:'62%',marginTop:'1%',alignSelf:"flex-start",justifyContent:'space-between'}}>
//                         <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
//                             <AntDesign size={30} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
//                         </TouchableOpacity>
//                         <Text style={styles.header}>Integrations</Text>
//                     </View>
//                     {
                         
//                                 (isUserLinkedToBank == false && isUserUnlinkedToBank == false) ? this.BankNotConnectedView() : (
//                                     (isUserLinkedToBank == true) ? this.BankLinkedView() : this.BankUnlinkedView()
//                                     )
                           
//                     }
//                     {
//                         qbIntegrationStatus ?
//                         this.quickBookConnectedView() :
//                         this.quickBookNotConnectedView()
//                     }
//                             </React.Fragment>
//                             :
//                             null
//                     }
//             </React.Fragment>
//         );
//     }
// }


// const styles = StyleSheet.create({
//     container:{
//         flex:1,
//         height:"100%",
//         width:"100%"
//     },
//     header: {
//         fontSize: 17,
//         fontWeight: "bold",
//       },
// });


// const bankConnectedStyle = StyleSheet.create({
//     integrationView:{
//         flexDirection:"row",
//         backgroundColor:"#ffffff",
//         justifyContent:'center',
//         alignSelf:'center',
//         marginTop:"15%",
//         width:"90%",
//         height:"10%",
//         borderRadius:8,
//         borderColor:"#000000",
//         borderTopColor:"#000000",
//         borderWidth:0.1,
//         shadowColor:"#808080",
//         shadowRadius: 5,
//         shadowOpacity: 1.5,
//         elevation:6
//     },
//     integrationViewQB:{
//         flexDirection:"row",
//         backgroundColor:"#ffffff",
//         justifyContent:'center',
//         alignSelf:'center',
//         marginTop:"5%",
//         width:"90%",
//         height:"10%",
//         borderRadius:8,
//         borderColor:"#000000",
//         borderTopColor:"#000000",
//         borderWidth:0.1,
//         shadowColor:"#808080",
//         shadowRadius: 5,
//         shadowOpacity: 1.5,
//         elevation:6
//     }, 
//     innerViews:{
//         marginTop:"12%",
//         width: "90%",
//         flexDirection:"row",
//         marginTop:"3%",
//         justifyContent:'space-between'
//     },  

// });

// const bankNotConnectedStyle = StyleSheet.create({
//     innerViews:{
//         marginTop:"10%",
//         width: "90%",
//         flexDirection:"row",
//         alignSelf:"center"
//     },  
//     integrationView:{
//         flexDirection:"row",
//         backgroundColor:"#ffffff",
//         justifyContent:'center',
//         alignSelf:'center',
//         marginTop:"15%",
//         width:"90%",
//         height:"10%",
//         borderRadius:8,
//         borderColor:"#000000",
//         borderTopColor:"#000000",
//         borderWidth:0.1,
//         shadowColor:"#808080",
//         shadowRadius: 5,
//         shadowOpacity: 1.5,
//         elevation:6
//     },
// })

// const mapStateToProps = state => ({reduxState:state});
// const mapDispatchToProps = dispatch => ({ reduxDispath:dispatch });
// export default connect(mapStateToProps,mapDispatchToProps)(DetectPlatform(Integration,styles.container));