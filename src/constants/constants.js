import APPJSON from "../../app.json";
 
export const API_TIMEOUT = 20000;
export const APP_VERSION = APPJSON.version;
const NETWORKINSTANCE = {
  SANDBOXINSTANCE : "http://18.222.152.47:8081/v0.1", //code for the using the sandbox
  PRODUCTIONINSTANCE : "http://3.132.213.123:8081/v0.1", // code for the production
  NGROK : "https://aaffa9c4.ngrok.io/v0.1"
}
const APIENDPOINT = {
  endPoint: NETWORKINSTANCE.NGROK,
  isQuickBookProduction:true,
  isPlaidProduction: false,
  //isPlaidProduction: true
}

const USERDATAAPIS = {
  userSignUp : APIENDPOINT.endPoint+"/auth/signup",
  userLogin : APIENDPOINT.endPoint+"/auth/login",
  editUser : APIENDPOINT.endPoint+"/user/editUser",
  getUser: APIENDPOINT.endPoint+"/user/getUser",
  isUserExist : APIENDPOINT.endPoint+"/user/checkuser",
  changePassword : APIENDPOINT.endPoint+"/user/changePassword",
  forgetPassword : APIENDPOINT.endPoint+"/auth/forgotPassword",
  companyLogo: APIENDPOINT.endPoint+"/user/profilePic",
  userLoginCounter: APIENDPOINT.endPoint+"/user/userLogin",
  storeUserFeedback: APIENDPOINT.endPoint+"/user/submitFeedback"
}

const CASHONHANDAPI = {
  cashInHand: APIENDPOINT.endPoint+"/parcentage/CashInHand",
}

const HEALTHSCOREAPI = {
  getHealthScore: APIENDPOINT.endPoint+"/parcentage/healthScore",
  getHealthScoreWithoutQb: APIENDPOINT.endPoint+"/parcentage/healthScoreWithoutQuick"
}

const PLAIDAPIS = {
  pushToken : APIENDPOINT.endPoint+"/plaid/getToken",
  getTransactions : APIENDPOINT.endPoint+"/plaid/getTransection",
  saveBanksData: APIENDPOINT.endPoint+"/account/token",
  getBankData: APIENDPOINT.endPoint+"/account/getAccount",
  unlinkBank: APIENDPOINT.endPoint+"/user/unlinkBank",
  relinkBank: APIENDPOINT.endPoint+"/user/relinkBank",
  getCurrentBal: APIENDPOINT.endPoint+"/parcentage/CIHParcent",
  plaidTokenStatus: APIENDPOINT.endPoint+"/plaid/tokenStatus",
  outOfCashDateApi: APIENDPOINT.endPoint+"/parcentage/outOfCashDate",
  getOutflowTransactions: APIENDPOINT.endPoint+"/plaid/getTransection?Outflow=true",
  getInflowTransactions: APIENDPOINT.endPoint+"/plaid/getTransection?Inflow=true",
  //category Api's
  getCategory : APIENDPOINT.endPoint+"/plaid/getCategory",
  addCategory : APIENDPOINT.endPoint+"/plaid/AddCategory",
  deleteCategory : APIENDPOINT.endPoint+"/plaid/deleteCategory",
  editCategory: APIENDPOINT.endPoint+"/plaid/editCategory",
  addCategoryToTransaction: APIENDPOINT.endPoint+"/plaid/addCategoryToTransaction",
  getSubCategories: APIENDPOINT.endPoint+"/category/getSubCategories",
  getSubCategoryTransactions: APIENDPOINT.endPoint+"/category/getSubCategoryTransactions",
  categoryChangeInAllTransaction: APIENDPOINT.endPoint+"/category/categoryChangeInAllTransaction",
  //expsense by category
  expenseByCategoryCurrentMonth: APIENDPOINT.endPoint+"/plaid/ExpenseByCategory?currentMonth=true",
  expenseByCategoryPastThreeMonth: APIENDPOINT.endPoint+"/plaid/ExpenseByCategory?pastThreeMonth=true",
  expenseByCategoryPastSixMonth: APIENDPOINT.endPoint+"/plaid/ExpenseByCategory?pastSixMonth=true",
  expenseByCategoryPastTweleMonth: APIENDPOINT.endPoint+"/plaid/ExpenseByCategory?pastTwelveMonth=true",
  expenseByCategoryScreen: past => APIENDPOINT.endPoint+`/plaid/ExpenseByCategoryScreen?past=${past}`,
  expenseByCategorySubScreen: past => APIENDPOINT.endPoint+`/category/getSubCategoryScreen?past=${past}`,
  expenseByCategorySubScreenGrpah: APIENDPOINT.endPoint+`/category/getSubCategoryScreen/graph`,
  //change in cash api
  changeInCash: APIENDPOINT.endPoint+"/parcentage/changeIncash"
}

const QUICKBOOKSAPIS = {
  quickbooks: APIENDPOINT.endPoint+"/quickBooks/",
  quickBookCopyDb: APIENDPOINT.endPoint+"/quickBooks/Invoice",
  getSalesData: APIENDPOINT.endPoint+"/quickBooks/getInvoice",
  qbCallBackUrl: APIENDPOINT.isQuickBookProduction == true ? `https://api.cloud9performancesolutions.com/v0.1/quickBooks/callback` : APIENDPOINT.endPoint+"/quickBooks/callback",
  qbNGROKCallBackUrl: APIENDPOINT.endPoint+"/quickBooks/callback",
  noQbForm : APIENDPOINT.endPoint+"/quickBooks/NoQbForm",
}

export const APINETWORK = {
  getQuestions: APIENDPOINT.endPoint+"/questions/getQuestions",
  incommingAr: APIENDPOINT.endPoint+"/parcentage/incomingAr",
  insights : APIENDPOINT.endPoint+"/insights/dashboardInsights",
  forecast: APIENDPOINT.endPoint+"/forecast/forecastCalc",
  ...USERDATAAPIS,
  ...CASHONHANDAPI,
  ...HEALTHSCOREAPI,
  ...PLAIDAPIS,
  ...QUICKBOOKSAPIS
}




export const PLAID = {
        publicKey:"57cd2ba0516d13d9638a8c49495510",
        env: APIENDPOINT.isPlaidProduction == true ? "production" : "sandbox",
        product:"transactions",
        clientName:"Pocket CFO",
        selectAccount:true
}

export const BANKS = [
  { name: "Chase" },
  { name: "Bank of America" },
  { name: "Wells Fargo" },
  { name: "Citi" },
  { name: "US Bank" },
  { name: "Capital One" },
  { name: "PNC" }
];

export const LEDGERS = [{ name: "Quickbooks" }];

export const network = {
  // Development
  //url: "http://localhost:3000",
  //quickbooksClientId: "ABoyxLOkbyAFvCKw3blqaTDObPyrETfvOdDZXOjnNkvLLXCaQ8",
  //redirectUrl: "http://localhost:3000/quickbooks"
  // Staging
  url: "https://pocketcfo-api.herokuapp.com",
  redirectUrl: "https://pocketcfo-api.herokuapp.com/quickbooks",
  quickbooksClientId: "AB5CWTpsZ9zn9A75rI1qNEvnKLu9GKRjmPIzApLaWnWn3V8zMN"
};

export const BUSINESS_MODEL_OPTIONS = [
  { value: "SaaS" },
  { value: "Subscription" },
  { value: "Transactional" },
  { value: "Marketplace" },
  { value: "E-Commerce" },
  { value: "Advertising " },
  { value: "Enterprise" },
  { value: "Hardware" },
  { value: "Usage-Based" },
];

export const COMPANY_SIZE_OPTIONS = [
  { value: "0-1 employees" },
  { value: "2-10 employees" },
  { value: "11-30 employees" },
  { value: "31-50 employees" },
  { value: "50+ employees" }
];

export const INDUSTRY_OPTIONS = [
  { value: "Adtech" },
  { value: "Aerospace" },
  { value: "Agriculture" },
  { value: "Analytics" },
  { value: "Augmented Reality" },
  { value: "Biotech" },
  { value: "Community" },
  { value: "Construction" },
  //{ value: "Continuing Education" },
  { value: "Crypto / Blockchain" },
  { value: "Developer Tools" },
  { value: "E-sports" },
  { value: "Education" },
  { value: "Energy" },
  { value: "Entertainment" },
  { value: "Environmental Services" },
  { value: "Financial Services" },
  { value: "Fitness/Wellness" },
  { value: "Food/Beverage" },
  { value: "Freight" },
  { value: "Gaming" },
  { value: "Government" },
  { value: "Hard Tech" },
  { value: "Hardware" },
  { value: "Healthcare" },
  { value: "Insurance" },
  //{ value: "Language Learning" },
  { value: "Lending/Loan" },
  { value: "Marketplace" },
  { value: "Media" },
  { value: "Public Transportation" },
  { value: "Retail" },
  { value: "Recruiting/Talent" },
  { value: "Robotics" },
  { value: "Security" },
  //{ value: "Sourcing / Recruiting" },
  { value: "Transportation" },
  { value: "Travel/Tourism" },
  { value: "Virtual Reality" },
  { value: "Other" },
];

export const STATE_OF_INCORP_OPTIONS = [
  { value: "Alabama" },
  { value: "Alaska" },
  { value: "Arizona" },
  { value: "Arkansas" },
  { value: "California" },
  { value: "Colorado" },
  { value: "Connecticut" },
  { value: "Delaware" },
  { value: "Florida" },
  { value: "Georgia" },
  { value: "Hawaii" },
  { value: "Idaho" },
  { value: "Illinois" },
  { value: "Indiana" },
  { value: "Iowa" },
  { value: "Kansas" },
  { value: "Kentucky" },
  { value: "Louisiana" },
  { value: "Maine" },
  { value: "Maryland" },
  { value: "Massachusetts" },
  { value: "Michigan" },
  { value: "Minnesota" },
  { value: "Mississippi" },
  { value: "Missouri" },
  { value: "Montana" },
  { value: "Nebraska" },
  { value: "Nevada" },
  { value: "New Hampshire" },
  { value: "New Jersey" },
  { value: "New Mexico" },
  { value: "New York" },
  { value: "North Carolina" },
  { value: "North Dakota" },
  { value: "Ohio" },
  { value: "Oklahoma" },
  { value: "Oregon" },
  { value: "Pennsylvania" },
  { value: "Rhode Island" },
  { value: "South Carolina" },
  { value: "South Dakota" },
  { value: "Tennessee" },
  { value: "Texas" },
  { value: "Utah" },
  { value: "Vermont" },
  { value: "Virginia" },
  { value: "Washington" },
  { value: "West Virginia" },
  { value: "Wisconsin" },
  { value: "Wyoming" }
];
const calculateYear = () => {

  let currentYear = new Date().getFullYear();
  let YEARS_VALUE = [];
  for(let i=2000;i<=currentYear;i++){
      let obj = {
        value: i
      }
      YEARS_VALUE.push(obj);
  }
  return YEARS_VALUE;
}
export const YEAR_FOUNDED_OPTIONS = calculateYear();

export const JS_DATE_INDEX_TO_MONTH_MAP = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec"
};
export let ALL_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
export const Button_Months = [
  { value: "This Month" },
  { value: "3 Months" },
  { value: "6 Months" },
  { value: "12 Months" }
  
];
export const Button_MonthsSUB = [
  { value: "This Month" },
  { value: "3 Months" },
  { value: "6 Months" },
  { value: "12 Months" }
]
function getLast6Months(currentMonth){
  switch(currentMonth){
    case 0:
      return ['Aug','Sept','Oct','Nov','Dec','Jan'];
    break;
    case 1:
      return ['Sept','Oct','Nov','Dec','Jan','Feb'];
    break;
    case 2:
      return ['Oct','Nov','Dec','Jan','Feb','Mar'];
    break;
    case 3:
      return ['Nov','Dec','Jan','Feb','Mar','Apr'];
    break;
    case 4:
      return ['Dec','Jan','Feb','Mar','Apr','May'];
    break;
    case 5:
      return ['Jan','Feb','Mar','Apr','May','Jun'];
    break;
    case 6:
      return ['Feb','Mar','Apr','May','Jun','Jul'];
    break;
    case 7:
      return ['Mar','Apr','May','Jun','Jul','Aug'];
    break;
    case 8:
      return ['Apr','May','Jun','Jul','Aug','Sept'];
    break;
    case 9:
      return ['May','Jun','Jul','Aug','Sept','Oct'];
    break;
    case 10:
      return ['Jun','Jul','Aug','Sept','Oct','Nov'];
    break;
    case 11:
      return ['Jul','Aug','Sept','Oct','Nov','Dec'];
    break;
  }
}

export const FULL_MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const EXPENSES_COLOR_CODE = ["#DFDF67", "#5994B3", "#80C871", "#7785E9", "#EA727A","#a11997","#273c33","#bb9c69","#66bbe5","#d330ba","#868f6a","#74a69e","#e7c159","#36ea78","#ca763f","#9147c1","#cb85b2","#119728" ]