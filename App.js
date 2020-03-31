import { createAppContainer, } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import { createStore, applyMiddleware } from "redux";
import React, { Component } from "react";
import { View,Text, Platform } from "react-native";
import { Provider } from "react-redux";
import axios from "axios";
import reducer from "./src/reducers";
import { network } from "./src/constants/constants";
import Name from "./src/views/ftux/name";
import Title from "./src/views/ftux/title";
import Email from "./src/views/ftux/email";
import Password from "./src/views/ftux/password";
import Setup from "./src/views/ftux/setup";
import BusinessProfile from "./src/views/ftux/businessProfile";
import IntegrationLogin from "./src/views/ftux/integrationLogin";
import BankIntegration from "./src/views/ftux/bankIntegration";
import LedgerIntegration from "./src/views/ftux/ledgerIntegration";
import Forecasting from "./src/views/forecasting/forecasting";
import Dashboard from "./src/views/components/dashboard/dashboard";
import Feedback from "./src/views/feedback/feedback";
import HealthScore from "./src/views/components/charts/healthScore";
import CashOnHand from "./src/views/components/dashboard/cashOnHand";
import CashOnHandinsights from "./src/views/components/charts/cashonhandinsights";
import ChangeInCashInsights from "./src/views/components/charts/changeInCashInsights";
import IncomingARInsights from "./src/views/components/charts/incomingArInsights";
import SalesInsights from "./src/views/components/charts/salesInsights";
import Legal from "./src/views/legal/legal";
import Login from "./src/views/components/login/login";
import ValueProp from "./src/views/components/value-prop/value-prop";
import Businesspro from "./src/views/components/profile/businesspro";
import Contact from "./src/views/components/profile/contact";
import Setting from "./src/views/components/profile/setting";
import BusinessproEdit from "./src/views/components/profile/businessproedit";
import SettingEdit from "./src/views/components/profile/settingedit";
import AccountConnected from "./src/views/ftux/accountConnected";
import OopsSorry from "./src/views/ftux/oopsSorry";
import SomethingWrong from "./src/views/ftux/somethingWrong";
import Checking from "./src/views/components/profile/checking";
import InnerIntegrations from "./src/views/components/profile/integrations";
import { UserLoginDataProvider } from "./src/api/common";
import { getUser } from "./src/api/api";
import TimeOut from "./src/views/components/profile/timeout";
import FeedbackSubmission from "./src/views/feedback/feedbackSubmission";
import ChangePassword from "./src/views/components/profile/changepassword";
import ForgetPassword from "./src/views/ftux/forgetPassword";
import ReduxThunk from "redux-thunk";
import QuickbookIntegration from "./src/views/ftux/quickbookIntegration";
import QuickbookConnected from "./src/views/ftux/quickBookConnected";
import CategoryScreen from "./src/views/components/profile/categoryscreen";
import ExpenseScreenParent from "./src/views/components/expensebycategory/categoryExpenseParentScreen";
import ExpenseScreenChild from "./src/views/components/expensebycategory/categoryExpenseChildScreen";
import SplashScreen from "react-native-splash-screen";
// import messaging from '@react-native-firebase/messaging';
// import firebaseapp from "@react-native-firebase/app";
// import crashlytics from "@react-native-firebase/crashlytics";
const MainNavigator = createStackNavigator(
  {
    Login: { 
      screen: Login,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    ValueProp: { 
      screen: ValueProp ,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    Name: { 
      screen: Name,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    Title: { 
      screen: Title ,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    Email: { 
      screen: Email ,
      navigationOptions:{
        header: null,
        gesturesEnabled:false
      },},
    Password: { 
      screen: Password,
      navigationOptions:{
        header: null,
        gesturesEnabled:false
      },},
    Setup: { 
      screen: Setup,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    BusinessProfile: { 
      screen: BusinessProfile,
      navigationOptions:{
        header: null,
        gesturesEnabled:false,
      },},
    Dashboard: { screen: Dashboard ,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },},
    IntegrationLogin: { screen: IntegrationLogin,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    BankIntegration: { screen: BankIntegration, 
      navigationOptions: {
      header: null,
      gesturesEnabled:false,
      },},
    LedgerIntegration: { 
      screen: LedgerIntegration,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    Forecasting: {
      screen: Forecasting,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },},
    Feedback: { 
      screen: Feedback,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },},
    HealthScore: { screen: HealthScore,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },},
    CashOnHand: { 
      screen: CashOnHand 
    },
    Legal: { 
      screen: Legal,
      navigationOptions: {
        header: null,
        gesturesEnabled:false,
    },},
    Businesspro: { 
      screen: Businesspro,
      navigationOptions:{
        header:null,
        gesturesEnabled:false,
    },
    },
    ChangePassword:{ 
      screen: ChangePassword,
      navigationOptions:{
        header:null,
        gesturesEnabled:false,
    }, 
    },
    Contact: { 
      screen: Contact,
      navigationOptions:({navigation})=>{
        return{
        header: null,
        gesturesEnabled:false,
        }
    },},
    Setting:{
      screen: Setting,
      navigationOptions:{
        header:null,
        gesturesEnabled:false,
    },},
    SettingEdit: { 
      screen: SettingEdit,
      navigationOptions:{
        header:null,
        gesturesEnabled:false,
    },},
    TimeOutScreen:{ 
      screen:TimeOut,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    BusinessproEdit: { 
      screen: BusinessproEdit,
      navigationOptions:{
        header:null,
        gesturesEnabled:false
      }
    },
    Checking:{ 
      screen:Checking,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    FeedbackSubmission:{ 
      screen: FeedbackSubmission,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    Integration : { 
      screen: InnerIntegrations,
      navigationOptions:{
        header:null,
        gesturesEnabled:false
      }
    },
    ForgetPassword:{
      screen: ForgetPassword,
      navigationOptions:{
        header: null,
        gesturesEnabled:false
      }
    },
    AccountConnected: { 
      screen: AccountConnected,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    OopsSorry: { 
      screen: OopsSorry,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    SomethingWrong: { 
      screen: SomethingWrong,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    CashOnHandinsights: { 
      screen: CashOnHandinsights,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    ChangeInCashInsights: { 
      screen: ChangeInCashInsights,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    IncomingARInsights: { 
      screen: IncomingARInsights,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    QuickbookIntegration:{
        screen: QuickbookIntegration,
        navigationOptions: {
          header: null,
          gesturesEnabled:false
      },
    },
    QuickbookConnected:{
      screen: QuickbookConnected,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },
    },
    SalesInsights: { 
      screen: SalesInsights,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
    },},
    CategoryScreen:{
      screen : CategoryScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    ExpenseScreenParent:{
      screen: ExpenseScreenParent,
      navigationOptions:{
        header: null,
        gesturesEnabled: false
      }
    },
    ExpenseScreenChild:{
      screen: ExpenseScreenChild,
      navigationOptions: {
        header:null,
        gesturesEnabled:false
      }
    }
  },
  {
    initialRouteName: "ValueProp"
  }
);

const client = axios.create({
  baseURL: network.url,
  responseType: "json"
});

//const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));
const store = createStore(reducer,applyMiddleware(ReduxThunk));

const NavigationApp = createAppContainer(MainNavigator);

export default class App extends Component {

  // async registerAppWithFCM() {
  //   await messaging().registerForRemoteNotifications();
  // }

  // async requestPermission() {
  //   const granted = messaging().requestPermission();
   
  //   if (granted) {
  //     this.registerAppWithFCM();
  //   } else {
  //     console.log('User declined messaging permissions :(');
  //   }
  // }

  componentDidMount = () => {

      // if(Platform.OS == "android"){
      //   setTimeout(()=>{
      //     crashlytics().log('Testing crash');
      //     crashlytics().crash();
      //   },10000);
      // }
      setTimeout(()=>{
        SplashScreen.hide();
      },600);
    
  }
  
  render() {
    return (
     
      <Provider store={store}>
        <UserLoginDataProvider value={getUser}>
        <NavigationApp />
        </UserLoginDataProvider>
      </Provider>
      
    );
  }
}

// export default class App extends Component{

//   componentDidMount(){
//     SplashScreen.hide();
//     console.log("sdf");
//     Axios.get("https://jsonplaceholder.typicode.com/users")
//     .then((response)=>{
//       console.log(response.status);
//     }).catch((error)=>{
//       console.log(error.status);
//       console.log(error);
//     })
//   }
//   render(){
//     return(
//       <View>
//         <Text>Hello</Text>
//       </View>
//     );
//   }
// }