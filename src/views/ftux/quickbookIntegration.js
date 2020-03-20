import React,{ Component,Fragment } from "react";
import { Text,View,Image,TouchableOpacity,StatusBar, Alert  } from "react-native";
import { WebView } from "react-native-webview";
//import OfflineCacheWebView from 'react-native-offline-cache-webview';
import { APINETWORK } from "../../constants/constants";
import { getCurrentAuthToken } from "../../api/api";
import { triggerQbDataCopyDb } from "../../api/api";
import Spinner from 'react-native-loading-spinner-overlay';
import { Ionicons } from '@expo/vector-icons';
import DetectPlatform from "../../DetectPlatform";
import Url from "url";

class QuickbookIntegration extends Component{
    injectedJavaScripttt = `(function() {
        window.postMessage = function(data) {
          window.ReactNativeWebView.postMessage(data);
        };
      })()`;
    constructor(props){
        super(props);
        this.state = { 
            Authorization: "",
            isBodyLoaded:false,
            spinner:true,
            isExecutedTimes: 0
        }
    }
    componentDidMount = async () => {
        // let myUrl = "http://msgmy.in:8081/v0.1/quickBooks/callback?code=25&error=true";
        // let myUrlObj = Url.parse(myUrl,true);
        // console.log("Testing Url Response here");
        // if(myUrlObj.query.error == undefined){
        //     console.log("error nhi hai");
        // }else{
        //     console.log("error hai");
        // }
        const AuthorizationResponse = await getCurrentAuthToken();

        if(AuthorizationResponse.result == true){
            this.setState({ Authorization: AuthorizationResponse.Authorization,isBodyLoaded:true,spinner:false });
        }
    }
    onMessageCalls = (e) => {
        console.log("In on message");
        console.log(e);
        
    }
    handleUrlResponses = async (nativeEvent) => {
        console.log("native urls triggers here - ",nativeEvent.url);
        let { isExecutedTimes } = this.state;
        let currentExecutingUrl = nativeEvent.url;
        let currentExecutingUrlObjParse = Url.parse(currentExecutingUrl,true);
        let splitingUrl = currentExecutingUrl.split("?");
        let qbCallBackUrl  = APINETWORK.qbCallBackUrl;
        if(splitingUrl[0] == qbCallBackUrl){

            if(isExecutedTimes == 0){
                console.log("Triggering callback api here - ");
                console.log("Getting cb url from qb - ",nativeEvent.url);
                this.setState({ spinner: true,isExecutedTimes: 1 },()=>{
                console.log("getting Query obj from qb - ",currentExecutingUrlObjParse.query);
                if(currentExecutingUrlObjParse.query.error == undefined){
                    setTimeout( async ()=>{

                        console.log("Connection Establised ");
                if(this.props.navigation.getParam("createBankIntegration")){
                     const qbCopyResponse = await triggerQbDataCopyDb();
                     // console.log("Recieveing Qb Copy Response  ",qbCopyResponse);
                    this.props.navigation.getParam("createBankIntegration")();
                }
                if(this.props.navigation.getParam("reloadDashBoardDataForQb")){
                    console.log("here for reloading qb data");
                    const qbCopyResponse = await triggerQbDataCopyDb();
                    console.log("Recieveing Qb Copy Response  ",qbCopyResponse);
                    this.props.navigation.getParam("reloadDashBoardDataForQb")();
                }
                this.setState({ spinner:false },()=>{
                    this.props.navigation.navigate("QuickbookConnected",{
                        redirectTo: () => {
                            if(this.props.navigation.getParam("createBankIntegration")){
                                this.props.navigation.navigate("Setup");
                            }
                            if(this.props.navigation.getParam("reloadDashBoardDataForQb")){
                                this.props.navigation.navigate("Integration");
                            }
                        }
                    });
                })
    
                    },7000);
                }else{
                    this.setState((prevState)=>{
                        return {
                            spinner: !prevState.spinner
                        }
                    },()=>{
                        setTimeout(()=>{
                            Alert.alert("Message","QuickBooks Connection Successfully Aborted",[ { text:'Ok',onPress:()=>{  this.props.navigation.goBack();  } } ],{ cancelable:false });
                        },100);
                    })
                }

            });
            
            }
        }
    }
    render(){
        return(
         
            <Fragment>
                <Spinner visible={this.state.spinner}/>
                {
                    this.state.isBodyLoaded ? 
                    <Fragment>

                        <View style={{flexDirection:'row', width:'75%',marginTop:'1%',alignSelf:"flex-start",justifyContent:'space-between',}}>
                                    <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                    <Ionicons size={30} name='md-close' style={{alignSelf:'flex-start', marginLeft: 15,}} />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize:17, fontWeight:"bold" }}>QuickBooks Integration</Text>
                        </View>
                        <WebView 
                        incognito={true}
                        source={{ uri: APINETWORK.quickbooks, 
                                headers: { Authorization:this.state.Authorization },
                                
                            }}
                        onNavigationStateChange={(navEvent)=> {
                            this.handleUrlResponses(navEvent);
                        }}
                        
                        onMessage={(e) => { this.onMessageCalls(e); }}
                        style={{ marginTop: StatusBar.currentHeight }}
                        
                    //  cacheEnabled={false}
                    //  sharedCookiesEnabled={false}
                    //  thirdPartyCookiesEnabled={false}
                    />

                        </Fragment> : null
                }
            </Fragment>
        );
     }
 
}
const styles = {
    container: {
        flex: 1,
        // backgroundColor: "#F1F3F5",
      }
}

export default DetectPlatform(QuickbookIntegration, styles.container);



//old code of the build 2.1.27

// import React,{ Component,Fragment } from "react";
// import { Text,View,Image,TouchableOpacity,StatusBar  } from "react-native";
// import { WebView } from "react-native-webview";
// //import OfflineCacheWebView from 'react-native-offline-cache-webview';
// import { APINETWORK } from "../../constants/constants";
// import { getCurrentAuthToken } from "../../api/api";
// import { triggerQbDataCopyDb } from "../../api/api";
// import Spinner from 'react-native-loading-spinner-overlay';
// import { Ionicons } from '@expo/vector-icons';
// import DetectPlatform from "../../DetectPlatform";
// class QuickbookIntegration extends Component{
//     injectedJavaScripttt = `(function() {
//         window.postMessage = function(data) {
//           window.ReactNativeWebView.postMessage(data);
//         };
//       })()`;
//     constructor(props){
//         super(props);
//         this.state = { 
//             Authorization: "",
//             isBodyLoaded:false,
//             spinner:true
//         }
//     }
//     componentDidMount = async () => {
//         const AuthorizationResponse = await getCurrentAuthToken();
//         console.log(AuthorizationResponse);
//         if(AuthorizationResponse.result == true){
//             this.setState({ Authorization: AuthorizationResponse.Authorization,isBodyLoaded:true,spinner:false });
//         }
//     }
//     onMessageCalls = (e) => {
//         console.log("In on message");
//         console.log(e);
        
//     }
//     handleUrlResponses = async (nativeEvent) => {
//         console.log(nativeEvent);
//         let currentExecutingUrl = nativeEvent.url;
//         let splitingUrl = currentExecutingUrl.split("?");
//         let qbCallBackNetwork  = APINETWORK.qbCallBackUrl;
//         let qbCallBackNGROK = APINETWORK.qbNGROKCallBackUrl;
//         if(splitingUrl[0] == qbCallBackNetwork){

//             // this.setState((prevState)=>{
//             //     return { spinner:!prevState.spinner }
//             // })
//             this.setState({ spinner: true });
//             console.log("Connection Establised ");
//             if(this.props.navigation.getParam("createBankIntegration")){
//                  const qbCopyResponse = await triggerQbDataCopyDb();
//                  // console.log("Recieveing Qb Copy Response  ",qbCopyResponse);
//                 this.props.navigation.getParam("createBankIntegration")();
//             }
//             if(this.props.navigation.getParam("reloadDashBoardDataForQb")){
//                 console.log("here for reloading qb data");
//                 const qbCopyResponse = await triggerQbDataCopyDb();
//                 console.log("Recieveing Qb Copy Response  ",qbCopyResponse);
//                 this.props.navigation.getParam("reloadDashBoardDataForQb")();
//             }
//             this.setState({ spinner:false },()=>{
//                 this.props.navigation.navigate("QuickbookConnected",{
//                     redirectTo: () => {
//                         if(this.props.navigation.getParam("createBankIntegration")){
//                             this.props.navigation.navigate("Setup");
//                         }
//                         if(this.props.navigation.getParam("reloadDashBoardDataForQb")){
//                             this.props.navigation.navigate("Integration");
//                         }
//                     }
//                 });
//             })
//             // this.setState((prevState)=>{
//             //     return { spinner: !prevState.spinner }
//             // },()=>{
                
//             // });
//         }
//     }
//     render(){
//         return(
         
//             <Fragment>
//                 <Spinner visible={this.state.spinner}/>
//                 {
//                     this.state.isBodyLoaded ? 
//                     <Fragment>

//                         <View style={{flexDirection:'row', width:'75%',marginTop:'1%',alignSelf:"flex-start",justifyContent:'space-between',}}>
//                                     <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
//                                     <Ionicons size={30} name='md-close' style={{alignSelf:'flex-start', marginLeft: 10,}} />
//                                     </TouchableOpacity>
//                                     <Text style={{ fontSize:17, fontWeight:"bold" }}>QuickBook Integration</Text>
//                         </View>
//                         <WebView 
//                         incognito={true}
//                         source={{ uri: APINETWORK.quickbooks, 
//                                 headers: { Authorization:this.state.Authorization },
                                
//                             }}
//                         onNavigationStateChange={(navEvent)=> {
//                             this.handleUrlResponses(navEvent);
//                         }}
                        
//                         onMessage={(e) => { this.onMessageCalls(e); }}
//                         style={{ marginTop: StatusBar.currentHeight }}
                        
//                     //  cacheEnabled={false}
//                     //  sharedCookiesEnabled={false}
//                     //  thirdPartyCookiesEnabled={false}
//                     />

//                         </Fragment> : null
//                 }
//             </Fragment>
//         );
//      }
 
// }
// const styles = {
//     container: {
//         flex: 1,
//         // backgroundColor: "#F1F3F5",
//       }
// }

// export default DetectPlatform(QuickbookIntegration, styles.container);

