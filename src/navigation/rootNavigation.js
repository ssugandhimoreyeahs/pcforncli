import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
//Home Screen
import Legal from "@views/legal/legal";
import Login from "@views/components/login/login";
import ValueProp from "@views/components/value-prop/value-prop";

//Regester Levels Routes
import Name from "@views/ftux/name";
import Title from "@views/ftux/title";
import Email from "@views/ftux/email";
import Password from "@views/ftux/password";
import Setup from "@views/ftux/setup";
import BusinessProfile from "@views/ftux/businessProfile";
import IntegrationLogin from "@views/ftux/integrationLogin";
import BankIntegration from "@views/ftux/bankIntegration";
import LedgerIntegration from "@views/ftux/ledgerIntegration";
import AccountConnected from "@views/ftux/accountConnected";
import OopsSorry from "@views/ftux/oopsSorry";
import SomethingWrong from "@views/ftux/somethingWrong";
import TimeOut from "@views/components/profile/timeout";
import QuickbookIntegration from "@views/ftux/quickbookIntegration";
import QuickbookConnected from "@views/ftux/quickBookConnected";

//Dashboards
import Dashboard from "@views/components/dashboard/dashboard";
import Forecasting from "@views/forecasting/forecasting";
import Feedback from "@views/feedback/feedback";
import Checking from "@views/components/profile/checking";
import Contact from "@views/components/profile/contact";

//Charts
import HealthScore from "@views/components/charts/healthScore";
import CashOnHand from "@views/components/dashboard/cashOnHand";

// Profile Screens
import Businesspro from "@views/components/profile/businesspro";
import BusinessproEdit from "@views/components/profile/businessproedit";
import Setting from "@views/components/profile/setting";
import SettingEdit from "@views/components/profile/settingedit";
import InnerIntegrations from "@views/components/profile/integrations";
import FeedbackSubmission from "@views/feedback/feedbackSubmission";
import ChangePassword from "@views/components/profile/changepassword";
import ForgetPassword from "@views/ftux/forgetPassword";
import CategoryScreen from "@views/components/profile/categoryscreen";
import NCategoryScreen from "@views/components/profile/ncategoryscreen";

//insights
import CashOnHandinsights from "@views/components/charts/cashonhandinsights";
import ChangeInCashInsights from "@views/components/charts/changeInCashInsights";
import IncomingARInsights from "@views/components/charts/incomingArInsights";
import SalesInsights from "@views/components/charts/salesInsights";
import ExpenseByCategoryInsights from "@views/components/insights/expenseByCategory";

//Expense By Category Module
import ExpenseScreenParent from "@views/components/expensebycategory/categoryExpenseParentScreen";
import ExpenseScreenChild from "@views/components/expensebycategory/categoryExpenseChildScreen";
import NewExpenseByCategoryParent from "@views/components/expensebycategory/newParentExpenseByCategory";
import NewExpenseByCategoryChild from "@views/components/expensebycategory/newChildExpenseByCategory";
import UncategorizedExpenseByCategory from "@views/components/expensebycategory/uncategorized";

//Transactions Screens
import { TransactionScreen } from "@screens";

const HOME = {
  ValueProp: {
    screen: ValueProp,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Legal: {
    screen: Legal,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};

const REGISTER = {
  Name: {
    screen: Name,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Title: {
    screen: Title,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Email: {
    screen: Email,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Password: {
    screen: Password,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Setup: {
    screen: Setup,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  BusinessProfile: {
    screen: BusinessProfile,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  IntegrationLogin: {
    screen: IntegrationLogin,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  BankIntegration: {
    screen: BankIntegration,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  LedgerIntegration: {
    screen: LedgerIntegration,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  AccountConnected: {
    screen: AccountConnected,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  OopsSorry: {
    screen: OopsSorry,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  SomethingWrong: {
    screen: SomethingWrong,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  TimeOutScreen: {
    screen: TimeOut,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  QuickbookIntegration: {
    screen: QuickbookIntegration,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  QuickbookConnected: {
    screen: QuickbookConnected,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};

const DASHBOARD = {
  Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Forecasting: {
    screen: Forecasting,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Contact: {
    screen: Contact,
    navigationOptions: ({ navigation }) => {
      return {
        header: null,
        gesturesEnabled: false,
      };
    },
  },
  Checking: {
    screen: Checking,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};

const CHARTS = {
  HealthScore: {
    screen: HealthScore,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  CashOnHand: {
    screen: CashOnHand,
  },
};

const PROFILE = {
  Businesspro: {
    screen: Businesspro,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  BusinessproEdit: {
    screen: BusinessproEdit,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  SettingEdit: {
    screen: SettingEdit,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  Integration: {
    screen: InnerIntegrations,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  FeedbackSubmission: {
    screen: FeedbackSubmission,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  CategoryScreen: {
    screen: CategoryScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  NCategoryScreen: {
    screen: NCategoryScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};

const EXPENSEBYCATEGORY = {
  ExpenseScreenParent: {
    screen: ExpenseScreenParent,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ExpenseScreenChild: {
    screen: ExpenseScreenChild,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  NewExpenseByCategoryParent: {
    screen: NewExpenseByCategoryParent,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  NewExpenseByCategoryChild: {
    screen: NewExpenseByCategoryChild,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  UncategorizedExpenseByCategory: {
    screen: UncategorizedExpenseByCategory,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};

const INSIGHTS = {
  CashOnHandinsights: {
    screen: CashOnHandinsights,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ChangeInCashInsights: {
    screen: ChangeInCashInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  IncomingARInsights: {
    screen: IncomingARInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  SalesInsights: {
    screen: SalesInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  ExpenseByCategoryInsights: {
    screen: ExpenseByCategoryInsights,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};

const TransactionsScreens = {
  TransactionScreen: {
    screen: TransactionScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
};
const MainNavigator = createStackNavigator(
  {
    ...HOME,
    ...REGISTER,
    ...DASHBOARD,
    ...CHARTS,
    ...PROFILE,
    ...EXPENSEBYCATEGORY,
    ...INSIGHTS,
    ...TransactionsScreens,
  },
  {
    initialRouteName: "ValueProp",
  }
);

const NavigationApp = createAppContainer(MainNavigator);

export default NavigationApp;
