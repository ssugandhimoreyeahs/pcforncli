import React, { Component } from "react";
import { createAppContainer, } from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import { Provider } from "react-redux";
import Store from "./src/reducers/store";

//Home Screen 
import Legal from "./src/views/legal/legal";
import Login from "./src/views/components/login/login";
import ValueProp from "./src/views/components/value-prop/value-prop";

//Regester Levels Routes
import Name from "./src/views/ftux/name";
import Title from "./src/views/ftux/title";
import Email from "./src/views/ftux/email";
import Password from "./src/views/ftux/password";
import Setup from "./src/views/ftux/setup";
import BusinessProfile from "./src/views/ftux/businessProfile";
import IntegrationLogin from "./src/views/ftux/integrationLogin";
import BankIntegration from "./src/views/ftux/bankIntegration";
import LedgerIntegration from "./src/views/ftux/ledgerIntegration";
import AccountConnected from "./src/views/ftux/accountConnected";
import OopsSorry from "./src/views/ftux/oopsSorry";
import SomethingWrong from "./src/views/ftux/somethingWrong";
import TimeOut from "./src/views/components/profile/timeout";
import QuickbookIntegration from "./src/views/ftux/quickbookIntegration";
import QuickbookConnected from "./src/views/ftux/quickBookConnected";

//Dashboards
import Dashboard from "./src/views/components/dashboard/dashboard";
import Forecasting from "./src/views/forecasting/forecasting";
import Feedback from "./src/views/feedback/feedback";
import Checking from "./src/views/components/profile/checking";
import Contact from "./src/views/components/profile/contact";

//Charts
import HealthScore from "./src/views/components/charts/healthScore";
import CashOnHand from "./src/views/components/dashboard/cashOnHand";

// Profile Screens
import Businesspro from "./src/views/components/profile/businesspro";
import BusinessproEdit from "./src/views/components/profile/businessproedit";
import Setting from "./src/views/components/profile/setting";
import SettingEdit from "./src/views/components/profile/settingedit";
import InnerIntegrations from "./src/views/components/profile/integrations";
import FeedbackSubmission from "./src/views/feedback/feedbackSubmission";
import ChangePassword from "./src/views/components/profile/changepassword";
import ForgetPassword from "./src/views/ftux/forgetPassword";
import CategoryScreen from "./src/views/components/profile/categoryscreen";
import NCategoryScreen from "./src/views/components/profile/ncategoryscreen";

//insights
import CashOnHandinsights from "./src/views/components/charts/cashonhandinsights";
import ChangeInCashInsights from "./src/views/components/charts/changeInCashInsights";
import IncomingARInsights from "./src/views/components/charts/incomingArInsights";
import SalesInsights from "./src/views/components/charts/salesInsights";
import ExpenseByCategoryInsights from "./src/views/components/insights/expenseByCategory";

//Expense By Category Module
import ExpenseScreenParent from "./src/views/components/expensebycategory/categoryExpenseParentScreen";
import ExpenseScreenChild from "./src/views/components/expensebycategory/categoryExpenseChildScreen";
import NewExpenseByCategoryParent from "./src/views/components/expensebycategory/newParentExpenseByCategory";
import NewExpenseByCategoryChild from "./src/views/components/expensebycategory/newChildExpenseByCategory";
import UncategorizedExpenseByCategory from "./src/views/components/expensebycategory/uncategorized";

//App Levels Routes
import SplashScreen from "react-native-splash-screen";
import ErrorBoundry from "./src/ErrorBoundry";

const HOME = {
  ValueProp: { 
      screen: ValueProp,
      navigationOptions: {
       header: null,
       gesturesEnabled:false
      }
    },
    Login: { 
      screen: Login,
      navigationOptions: {
        header: null,
        gesturesEnabled:false
      },
    },
    Legal: { 
      screen: Legal,
      navigationOptions: {
        header: null,
        gesturesEnabled:false,
      },
    }
}

const REGISTER = {
  Name: { 
    screen: Name,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
    }
  },
  Title: { 
    screen: Title ,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
    }
  },
  Email: { 
    screen: Email ,
    navigationOptions:{
      header: null,
      gesturesEnabled:false
    }
  },
  Password: { 
    screen: Password,
    navigationOptions:{
      header: null,
      gesturesEnabled:false
    }
  },
  Setup: { 
    screen: Setup,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
    }
  },
  BusinessProfile: { 
    screen: BusinessProfile,
    navigationOptions:{
      header: null,
      gesturesEnabled:false,
    }
  },
  IntegrationLogin: { 
    screen: IntegrationLogin,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
    }
  },
  BankIntegration: { 
    screen: BankIntegration, 
    navigationOptions: {
    header: null,
    gesturesEnabled:false,
    }
  },
  LedgerIntegration: { 
    screen: LedgerIntegration,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
    }
  },
  AccountConnected: { 
    screen: AccountConnected,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  OopsSorry: { 
    screen: OopsSorry,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  SomethingWrong: { 
    screen: SomethingWrong,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  TimeOutScreen:{ 
    screen:TimeOut,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
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
} 

const DASHBOARD = {
  Dashboard: { 
    screen: Dashboard ,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Forecasting: {
    screen: Forecasting,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Feedback: { 
    screen: Feedback,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  Contact: { 
    screen: Contact,
    navigationOptions:({navigation})=>{
      return{
      header: null,
      gesturesEnabled:false,
      }
  }
  },
  Checking:{ 
    screen:Checking,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
}

const CHARTS = {
  HealthScore: { 
    screen: HealthScore,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
    }
  },
  CashOnHand: { 
    screen: CashOnHand 
  }
}

const PROFILE = {
  Businesspro: { 
    screen: Businesspro,
    navigationOptions:{
      header:null,
      gesturesEnabled:false,
  },
  },
  BusinessproEdit: { 
    screen: BusinessproEdit,
    navigationOptions:{
      header:null,
      gesturesEnabled:false
    }
  },
  Setting:{
    screen: Setting,
    navigationOptions:{
      header:null,
      gesturesEnabled:false,
  }
  },
  SettingEdit: { 
    screen: SettingEdit,
    navigationOptions:{
      header:null,
      gesturesEnabled:false,
  }
  },
  Integration : { 
    screen: InnerIntegrations,
    navigationOptions:{
      header:null,
      gesturesEnabled:false
    }
  },
  FeedbackSubmission:{ 
    screen: FeedbackSubmission,
    navigationOptions: {
      header: null,
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
  ChangePassword:{ 
    screen: ChangePassword,
    navigationOptions:{
      header:null,
      gesturesEnabled:false,
  }, 
  },
  CategoryScreen:{
    screen : CategoryScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  NCategoryScreen: {
    screen: NCategoryScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
}

const EXPENSEBYCATEGORY = {

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
  },
  NewExpenseByCategoryParent: {
    screen: NewExpenseByCategoryParent,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  NewExpenseByCategoryChild: {
    screen: NewExpenseByCategoryChild,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  UncategorizedExpenseByCategory: {
    screen: UncategorizedExpenseByCategory,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
}

const INSIGHTS = {
  CashOnHandinsights: { 
    screen: CashOnHandinsights,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  ChangeInCashInsights: { 
    screen: ChangeInCashInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  IncomingARInsights: { 
    screen: IncomingARInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  SalesInsights: { 
    screen: SalesInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled:false
  }
  },
  ExpenseByCategoryInsights: {
    screen: ExpenseByCategoryInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
}
const MainNavigator = createStackNavigator(
  {
    ...HOME,
    ...REGISTER,
    ...DASHBOARD,
    ...CHARTS,
    ...PROFILE,
    ...EXPENSEBYCATEGORY,
    ...INSIGHTS,
  },
  {
    initialRouteName: "Setup"
  }
);



const NavigationApp = createAppContainer(MainNavigator);

export default class App extends Component {

  componentDidMount = () => {

     setTimeout(()=>{
        SplashScreen.hide();
      },600);
    
  }
  
  render() {
    return (
     
      <Provider store={Store}>
        <ErrorBoundry>
          <NavigationApp />
        </ErrorBoundry>
      </Provider>
      
    );
  }
}

