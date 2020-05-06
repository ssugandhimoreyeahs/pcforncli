import { combineReducers } from "redux";



import { userReducer } from "./getUser";
import { plaidCategoryReducer } from "./plaidCategory";
import { ExpenseReducer } from "./expensecategory";
import { mainExpenseReducer } from "./mainexpensecategory";
import { cicReducer } from "./cashinchange";
import { arDataReducer } from "./incommingar";
import { insightsDataReducer } from './insights';
import { forecastReducer } from "./forecast";
import { salesReducer } from "./sales";
import { cohReducer } from "./cashonhand";
import { outOfCashDateReducer } from "./outofcashdate";
import { healthScoreReducer } from "./healthscore";

export default combineReducers({

  userData: userReducer,
  plaidCategoryData : plaidCategoryReducer,
  expenseByCategory: ExpenseReducer,
  mainExpenseByCategory : mainExpenseReducer,
  cashInChange: cicReducer,
  incommingArRedux: arDataReducer,
  insightsRedux: insightsDataReducer,
  forecastReducer: forecastReducer,
  salesReducer: salesReducer,
  cohReducer: cohReducer,
  outOfCashDateReducer: outOfCashDateReducer,
  healthScoreReducer: healthScoreReducer
});
