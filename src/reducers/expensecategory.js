
export const FETCH_EXPENSE_REQUEST = "FETCH_EXPENSE_REQUEST";
export const FETCH_EXPENSE_SUCCESS = "FETCH_EXPENSE_SUCCESS";
export const FETCH_EXPENSE_ERROR = "FETCH_EXPENSE_ERROR";

export const FETCH_EXPENSE_REQUEST_MULTIPLE = "FETCH_EXPENSE_REQUEST_MULTIPLE";
export const FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS = "FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS";
import { getExpenseByCategoryPromise } from "../api/api";
import { fetchCategorySuccess } from "./plaidCategory";
import { MAIN_EXPENSE_CATEGORY_SUCCESS,MAIN_EXPENSE_CATEGORY_REQUEST,MAIN_EXPENSE_CATEGORY_ERROR } from "./mainexpensecategory";
const initialExpense = {
    errorMsg:'',
    error:false,
    loading:false,
    expense:[],
    totalExpense:0,
    isFetched:false,
    childLoader:false,
    expenseCurrentRange:3
}

export const fetchExpenseRequest = () => {
    return {
        type: FETCH_EXPENSE_REQUEST
    }
}

export const fetchExpenseSuccess = (response) => {
    return{
        type:FETCH_EXPENSE_SUCCESS,
        dashboardExpense: response.ExpenseByCategory,
        dashboardTotalExpense: response.amount,
        currentExpenseRange: 3
    }
}

export const fetchExpenseError = (error) => {
    return{
        type: FETCH_EXPENSE_ERROR,
        errorMsg: error
    }
}

export const fetchExpenseRequestMultiple = () => {
    return {
        type: FETCH_EXPENSE_REQUEST_MULTIPLE
    }
}
export const fetchExpenseRequestMultipleSuccess = (response) => {
    return {  
        type: FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS,
        dashboardExpense: response.ExpenseByCategory,
        dashboardTotalExpense: response.amount,
        currentExpenseRange: response.currentExpenseRange

    }
}
export const ExpenseReducer = (state = initialExpense, action) => {
    switch(action.type){

        case FETCH_EXPENSE_REQUEST: return {
            ...state,
            loading:true,
            expenseCurrentRange:1
        }

        case FETCH_EXPENSE_SUCCESS: return {
            ...state,
            loading:false,
            isFetched:true,
            expense:action.dashboardExpense,
            totalExpense:action.dashboardTotalExpense,
            expenseCurrentRange:action.currentExpenseRange,
            childLoader:false

        }

        case FETCH_EXPENSE_ERROR: return {
            ...state,
            errorMsg: action.errorMsg,
            error:true,
            loading:false,
            childLoader:false
            
            
        }

        case FETCH_EXPENSE_REQUEST_MULTIPLE: return {
            ...state,
            childLoader:true,
        }

        case FETCH_EXPENSE_REQUEST_MULTIPLE_SUCCESS: return {
            errorMsg:'',
            error:false,
            loading:false,
            expense:action.dashboardExpense,
            totalExpense:action.dashboardTotalExpense,
            isFetched:true,
            childLoader:false,
            expenseCurrentRange:action.currentExpenseRange
        }
        default: return state;
    }
}

export const fetchExpensesAsyncCreator = ( expenseType = 1 ) => {
        return (dispatch) => {
            dispatch(fetchExpenseRequest());

            //for inner expense screen 
            dispatch({
                type: MAIN_EXPENSE_CATEGORY_REQUEST,
                mainExpenseType: expenseType,
        
            });
            getExpenseByCategoryPromise(expenseType).then((response)=>{
                if(response.result == true){
                    //console.log("Fetching only current month expenses - ",response);
                    //1 Dispatch action for the dashboard
                    dispatch(fetchExpenseSuccess(response.expenseByCategoryResponse));

                    //2 Dispatch action for the inner category screen
                    dispatch({
                        type: MAIN_EXPENSE_CATEGORY_SUCCESS,
                        mainExpenses: response.expenseByCategoryResponse.ExpenseByCategory,
                        mainExpenseType: expenseType,
                        totalMainExpense: response.expenseByCategoryResponse.amount
                
                    });
                }else{
                    dispatch(fetchExpenseError("Error While Fetching Expenses Try Again!"));

                    dispatch({
                        type: MAIN_EXPENSE_CATEGORY_ERROR,
                        payload: "Error While Fetching Expenses Try Again!"
                        
                    });
                }
            }).catch((error)=>{
                dispatch(fetchExpenseError("Error While Fetching Expenses Try Again!"));

                dispatch({
                    type: MAIN_EXPENSE_CATEGORY_ERROR,
                    payload: "Error While Fetching Expenses Try Again!"
                    
                });
            })

        }
}

export const fetchExpensesMultipleTimesAsyncCreator = ( expenseType ) => {
    return (dispatch) => {
        dispatch(fetchExpenseRequestMultiple());

        //for inner screen
        dispatch({
            type: MAIN_EXPENSE_CATEGORY_REQUEST,
            mainExpenseType: expenseType,
    
        });
        getExpenseByCategoryPromise(expenseType).then((response)=>{
            if(response.result == true){
               // console.log("Fetching Response with differnt Months - ",response);
                response.expenseByCategoryResponse.currentExpenseRange = expenseType;
                dispatch(fetchExpenseRequestMultipleSuccess(response.expenseByCategoryResponse));

                dispatch({
                    type: MAIN_EXPENSE_CATEGORY_SUCCESS,
                    mainExpenses: response.expenseByCategoryResponse.ExpenseByCategory,
                    mainExpenseType: expenseType,
                    totalMainExpense: response.expenseByCategoryResponse.amount
            
                });
            }else{
                dispatch(fetchExpenseError("Error While Fetching Expenses Try Again!"));

                dispatch({
                    type: MAIN_EXPENSE_CATEGORY_ERROR,
                    payload: "Error While Fetching Expenses Try Again!"
                    
                });
            }
        }).catch((error)=>{
            dispatch(fetchExpenseError("Error While Fetching Expenses Try Again!"));

            dispatch({
                type: MAIN_EXPENSE_CATEGORY_ERROR,
                payload: "Error While Fetching Expenses Try Again!"
                
            });
        })

    }
}