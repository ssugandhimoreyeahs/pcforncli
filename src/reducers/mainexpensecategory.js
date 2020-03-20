

export const MAIN_EXPENSE_CATEGORY_REQUEST = "MAIN_EXPENSE_CATEGORY_REQUEST";
export const MAIN_EXPENSE_CATEGORY_SUCCESS = "MAIN_EXPENSE_CATEGORY_SUCCESS";
export const MAIN_EXPENSE_CATEGORY_ERROR  = "MAIN_EXPENSE_CATEGORY_ERROR";

import { getExpenseByCategoryPromise } from "../api/api";

const initialState = {

    error:false,
    errorMsg:"",
    mainExpenses:[],
    isFetched:false,
    loading:false,
    mainExpenseType:0,
    totalMainExpense:0

}

export const mainExpenseCategoryRequest = (action) => {
    return{
        type: MAIN_EXPENSE_CATEGORY_REQUEST,
        mainExpenseType: action.mainExpenseType,

    }
}

export const mainExpenseCategorySuccess = (action) => {
    return {
        type: MAIN_EXPENSE_CATEGORY_SUCCESS,
        mainExpenses: action.ExpenseByCategory,
        mainExpenseType: action.currentMainExpenseType,
        totalMainExpense: action.amount

    }
}

export const mainExpenseCategoryError = (error) => {
    return {
        type: MAIN_EXPENSE_CATEGORY_ERROR,
        payload:error.msg,
        
    }
}

export const mainExpenseReducer = ( state = initialState, action ) => {

    switch(action.type){

        case MAIN_EXPENSE_CATEGORY_REQUEST: return {

            error:false,
            errorMsg:"",
            mainExpenses:[],
            isFetched:false,
            loading:true,
            mainExpenseType:action.mainExpenseType,
            totalMainExpense:0

        }
        case MAIN_EXPENSE_CATEGORY_SUCCESS: return {

            error:false,
            errorMsg:"",
            mainExpenses:action.mainExpenses,
            isFetched:true,
            loading:false,
            mainExpenseType:action.mainExpenseType,
            totalMainExpense: action.totalMainExpense

        }
        case MAIN_EXPENSE_CATEGORY_ERROR: return {

            error:true,
            errorMsg:action.payload,
            mainExpenses:[],
            isFetched:false,
            loading:false,
            mainExpenseType:0,
            totalMainExpense: 0

        }
        default: return state;
    }
}


export const fetchMainExpenseAsyncCreator = ( mainExpenseType = 1 ) => {
    return (dispatch) => {
        dispatch(mainExpenseCategoryRequest({ mainExpenseType }));
        getExpenseByCategoryPromise(mainExpenseType).then((response)=>{
            if(response.result == true){
                
                response.expenseByCategoryResponse.currentMainExpenseType = mainExpenseType;
                //console.log("Main expense by category response - ",response);
                dispatch(mainExpenseCategorySuccess(response.expenseByCategoryResponse));
            }else{
                dispatch(mainExpenseCategoryError("Error While Fetching Expenses Try Again!"));
            }
        }).catch((error)=>{
            dispatch(mainExpenseCategoryError("Error While Fetching Expenses Try Again!"));
        })

    }
}

