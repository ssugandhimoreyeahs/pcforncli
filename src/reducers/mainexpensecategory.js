

export const MAIN_EXPENSE_CATEGORY_REQUEST = "MAIN_EXPENSE_CATEGORY_REQUEST";
export const MAIN_EXPENSE_CATEGORY_SUCCESS = "MAIN_EXPENSE_CATEGORY_SUCCESS";
export const MAIN_EXPENSE_CATEGORY_ERROR  = "MAIN_EXPENSE_CATEGORY_ERROR";

import { getExpenseByCategoryScreenPromise } from "../api/api";

const initialState = {

   error: false,
   errorMsg: '',
   masterLoader: false,
   childLoader: false,
   expensesData:{},
   expenseType:0,
   isFetched: false

}

export const mainExpenseCategoryRequest = (action) => {
    return{
        type: MAIN_EXPENSE_CATEGORY_REQUEST,
        expenseType: action.expenseType,

    }
}

export const mainExpenseCategorySuccess = (action) => {
    return {
        type: MAIN_EXPENSE_CATEGORY_SUCCESS,
        expensesData: action.expensesData,
        expenseType: action.expenseType
    }
}

export const mainExpenseCategoryError = (error) => {
    return {
        type: MAIN_EXPENSE_CATEGORY_ERROR,
        errorMsg: error.errorMsg,
        expenseType: error.expenseType
        
    }
}

export const mainExpenseReducer = ( state = initialState, action ) => {

    switch(action.type){

        case MAIN_EXPENSE_CATEGORY_REQUEST: return {

            error: false,
            errorMsg: '',
            loader: true,
            expensesData:{},
            expenseType: action.expenseType,
            isFetched: false

        }
        case MAIN_EXPENSE_CATEGORY_SUCCESS: return {

            error: false,
            errorMsg: '',
            loader: false,
            expensesData: action.expensesData,
            expenseType: action.expenseType,
            isFetched: true

        }
        case MAIN_EXPENSE_CATEGORY_ERROR: return {

            error: true,
            errorMsg: action.errorMsg,
            loader: false,
            expensesData:{},
            expenseType: action.expenseType,
            isFetched: false

        }
        default: return state;
    }
}


export const fetchMainExpenseAsyncCreator = ( expenseType = 0 ) => {
    return (dispatch) => {
        dispatch(mainExpenseCategoryRequest({ expenseType }));
        getExpenseByCategoryScreenPromise(expenseType).then((response)=>{
            if(response.result == true){
                dispatch(mainExpenseCategorySuccess({
                    expensesData: response.expensesData,
                    expenseType
                }));
            }else{
                dispatch(mainExpenseCategoryError({
                    errorMsg: "Something went wrong!",
                    expenseType
                }));
            }
        }).catch((error)=>{
            dispatch(mainExpenseCategoryError({
                errorMsg: "Something went wrong!",
                expenseType
            }));
        })

    }
}

