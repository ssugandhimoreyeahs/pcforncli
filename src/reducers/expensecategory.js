export const FETCH_EXPENSE_REQUEST = "FETCH_EXPENSE_REQUEST";
export const FETCH_EXPENSE_SUCCESS = "FETCH_EXPENSE_SUCCESS";
export const FETCH_EXPENSE_ERROR = "FETCH_EXPENSE_ERROR";

export const FETCH_EXPENSE_REQUEST_MULTIPLE = "FETCH_EXPENSE_REQUEST_MULTIPLE";
export const FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS =
  "FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS";
import { getExpenseByCategoryPromise } from "../api/api";
// import { fetchCategorySuccess } from "./plaidCategory";
// import { MAIN_EXPENSE_CATEGORY_SUCCESS,MAIN_EXPENSE_CATEGORY_REQUEST,MAIN_EXPENSE_CATEGORY_ERROR } from "./mainexpensecategory";
const initialExpense = {
  errorMsg: "",
  error: false,
  loading: false,
  expense: [],
  totalExpense: 0,
  isFetched: false,
  childLoader: false,
  expenseCurrentRange: 3,
};

export const fetchExpenseRequest = (action) => {
  return {
    type: FETCH_EXPENSE_REQUEST,
    expenseCurrentRange: action.expenseCurrentRange,
  };
};

export const fetchExpenseSuccess = (response) => {
  console.log("Is getting final Output here - ", response.expenseCurrentRange);
  return {
    type: FETCH_EXPENSE_SUCCESS,
    dashboardExpense: response.ExpenseByCategory,
    dashboardTotalExpense: response.amount,
    expenseCurrentRange: response.expenseCurrentRange,
  };
};

export const fetchExpenseError = (error) => {
  return {
    type: FETCH_EXPENSE_ERROR,
    errorMsg: error.msg,
    expenseCurrentRange: error.expenseCurrentRange,
  };
};

export const fetchExpenseRequestMultiple = (error) => {
  return {
    type: FETCH_EXPENSE_REQUEST_MULTIPLE,
    expenseCurrentRange: error.expenseCurrentRange,
  };
};
export const fetchExpenseRequestMultipleSuccess = (response) => {
  return {
    type: FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS,
    dashboardExpense: response.ExpenseByCategory,
    dashboardTotalExpense: response.amount,
    expenseCurrentRange: response.expenseCurrentRange,
  };
};
export const ExpenseReducer = (state = initialExpense, action) => {
  switch (action.type) {
    case FETCH_EXPENSE_REQUEST:
      return {
        ...state,
        error: false,
        loading: true,
        expenseCurrentRange: action.expenseCurrentRange,
      };

    case FETCH_EXPENSE_SUCCESS:
      return {
        ...state,
        loading: false,
        isFetched: true,
        expense: action.dashboardExpense,
        totalExpense: action.dashboardTotalExpense,
        expenseCurrentRange: action.expenseCurrentRange,
        childLoader: false,
      };

    case FETCH_EXPENSE_ERROR:
      return {
        errorMsg: action.errorMsg,
        error: true,
        loading: false,
        expense: [],
        totalExpense: 0,
        isFetched: false,
        childLoader: false,
        expenseCurrentRange: action.expenseCurrentRange,
      };

    case FETCH_EXPENSE_REQUEST_MULTIPLE:
      return {
        ...state,
        childLoader: true,
        isFetched: true,
        error: false,
        errorMsg: "",
        expenseCurrentRange: action.expenseCurrentRange,
      };

    case FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS:
      return {
        errorMsg: "",
        error: false,
        loading: false,
        expense: action.dashboardExpense,
        totalExpense: action.dashboardTotalExpense,
        isFetched: true,
        childLoader: false,
        expenseCurrentRange: action.expenseCurrentRange,
      };
    default:
      return state;
  }
};

export const fetchExpensesAsyncCreator = (expenseType = 1) => {
  return (dispatch) => {
    dispatch(fetchExpenseRequest({ expenseCurrentRange: expenseType }));
    getExpenseByCategoryPromise(expenseType)
      .then((response) => {
        if (response.result == true) {
          dispatch(
            fetchExpenseSuccess({
              ...response.expenseByCategoryResponse,
              expenseCurrentRange: expenseType,
            })
          );
        } else {
          dispatch(
            fetchExpenseError({
              msg: "Error While Fetching Expenses Try Again!",
              expenseCurrentRange: expenseType,
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          fetchExpenseError({
            msg: "Error While Fetching Expenses Try Again!",
            expenseCurrentRange: expenseType,
          })
        );
      });
  };
};

export const fetchExpensesMultipleTimesAsyncCreator = (expenseType) => {
  return (dispatch) => {
    dispatch(fetchExpenseRequestMultiple({ expenseCurrentRange: expenseType }));
    getExpenseByCategoryPromise(expenseType)
      .then((response) => {
        if (response.result == true) {
          // console.log("Fetching Response with differnt Months - ",response);
          response.expenseByCategoryResponse.expenseCurrentRange = expenseType;
          dispatch(
            fetchExpenseRequestMultipleSuccess(
              response.expenseByCategoryResponse
            )
          );
        } else {
          dispatch(
            fetchExpenseError({
              msg: "Error While Fetching Expenses Try Again!",
              expenseCurrentRange: expenseType,
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          fetchExpenseError({
            msg: "Error While Fetching Expenses Try Again!",
            expenseCurrentRange: expenseType,
          })
        );
      });
  };
};
