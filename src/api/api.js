
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK,API_TIMEOUT } from "../constants/constants";
const timeout = API_TIMEOUT;

//User Api's
export { 
  createUser,
  login,
  updateUserWithCompany,
  getUser,
  isUserAlreadyExist,
  editUserSetting,
  updateUserPassword,
  forgetPassword,
  uploadCompanyLogo,
  isUserLoggedIn,
  loggedOutUser,
  userLoginCounter,
  getUserPromise,
  sendUserFeedbackData
 } from "./Apis/user";

 //Plaid Api's
export {
  sendPlaidToken,
  getUserTransactions,
  saveBankData,
  isCheckUserConnectedToBank,
  fetchCurrentBalance,
  unlinkBankAccount,
  reLinkBankAccount,
  validPlaidToken,
  getCashOutOfDate,
  getUserOutFlowTransactions,
  getUserInflowTransactions,
  getPlaidCategory,
  addPlaidCategory,
  deletePlaidCategory,
  editPlaidCategory,
  getPlaidCategoryUsingPromise,
  getCashOutOfDatePromise,
  fetchCurrentBalancePromise,
  validatePlaidTokenPromise,
  addCategoryToTransaction,
  getSubCategories,
  getSubCategoryTransactions,
  getChangeInCash
} from "./Apis/plaid";

//QuickBooks Api's
export {
  getSalesData,
  getSalesDataPromise,
  triggerNoQbForm,
  triggerQbDataCopyDb
} from "./Apis/quickbooks";

//Health Score API's
export{
  getHealthScore,
  getHealthScoreUsingPromise,
  getHealthScoreUsingWithOutQbPromise
} from "./Apis/healthscore";

//CashOnHand Graph Api's

export { 
  getCashOnHandGraph,
  getCashOnHandGraphPromiseBased
} from "./Apis/cashonhand";

//all expense by category api's
export {
  getExpenseByCategoryPromise
} from "./Apis/expensecategory";

export {
  getARData
} from "./Apis/incommingar";

export { 
  getInsights
} from "./Apis/insights";

export {
  getForecastData
} from "./Apis/forecast";

//Uncategorized Api's

export async function fetchQuestionsFromApi(){
  try{
    const response = await axios.get(APINETWORK.getQuestions);
    if(response.data.success == true){
      return{ result:true,questions:response.data.data }
    }else{
      return { result:false };
    }
    
  }catch(error){
    return { result:false,error };
  }
}
 
export async function getCurrentAuthToken(){
  try{
    const Authorization = await AsyncStorage.getItem("authToken");
    return { result:true,Authorization };
  } 
  catch(error){
    return { result:"error",error } ;
  }
}



















