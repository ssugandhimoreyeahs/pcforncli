
export const SALES_FETCH_REQUEST = "SALES_FETCH_REQUEST";
export const SALES_FETCH_SUCCESS = "SALES_FETCH_SUCCESS";
export const SALES_FETCH_ERROR = "SALES_FETCH_ERROR";

export const SALES_FETCH_MULTIPLE_REQUEST = "SALES_FETCH_MULTIPLE_REQUEST";

import { getSalesDataPromise } from "../api/api";

const initialSalesState = {

    errorMsg: '',
    error: false,
    masterLoader:false,
    childLoader:false,
    salesData:{},
    salesCurrentRange: 3,
    isFetched: false

}


const salesFetchRequest = (action) => {
    return { 
        type: SALES_FETCH_REQUEST,
        salesCurrentRange: action.salesCurrentRange
    }
}

export const salesFetchSuccess = (action) => {
    return{
        type: SALES_FETCH_SUCCESS,
        salesData:action.salesData,
        salesCurrentRange:action.salesCurrentRange
    }
}

export const salesFetchError = (action) => {
    return{
        type: SALES_FETCH_ERROR,
        errorMsg: action.errorMsg,
        salesCurrentRange: action.salesCurrentRange
    }
}

export const salesFetchMultipleRequest = (action) => {
    return{
        type: SALES_FETCH_MULTIPLE_REQUEST,
        salesCurrentRange: action.salesCurrentRange
    }
}

export const salesReducer = (state = initialSalesState, action) => {
    switch(action.type){

        case SALES_FETCH_REQUEST: return{
            errorMsg: '',
            error: false,
            masterLoader:true,
            childLoader:false,
            salesData:{},
            salesCurrentRange: action.salesCurrentRange, //default Range Set here for the 3 Month
            isFetched: false
        }

        case SALES_FETCH_SUCCESS: return{
            errorMsg: '',
            error: false,
            masterLoader:false,
            childLoader:false,
            salesData: action.salesData,
            salesCurrentRange: action.salesCurrentRange, 
            isFetched: true
        }

        case SALES_FETCH_ERROR: return{
            errorMsg: action.errorMsg,
            error: true,
            masterLoader:false,
            childLoader:false,
            salesData: {},
            salesCurrentRange: action.salesCurrentRange, 
            isFetched: false
        }

        case SALES_FETCH_MULTIPLE_REQUEST: return{
            errorMsg: '',
            error: false,
            masterLoader:false,
            childLoader:true,
            salesData:{},
            salesCurrentRange: action.salesCurrentRange, //default Range Set here for the 3 Month
            isFetched: false
        }
        default: return state;
    }
}
 
export const salesAsyncCreator = ( salesCurrentRange = 3, isMultiple = true ) => {
    return (dispatch) => {

        if(isMultiple == true){
            dispatch(salesFetchMultipleRequest({ salesCurrentRange }));
        }else{
            dispatch(salesFetchRequest({ salesCurrentRange }));
        }

        //sales api call here

        getSalesDataPromise( salesCurrentRange ).then((salesResponse)=>{
            if(salesResponse.result == true){
                const { salesData } = salesResponse;
                dispatch(salesFetchSuccess({ salesData,salesCurrentRange }));
            }else{
                dispatch(salesFetchError({ errorMsg:"Error!",salesCurrentRange }));
            }
        }).catch((salesError)=>{
            dispatch(salesFetchError({ errorMsg:"Error!",salesCurrentRange }));
        });
    }
}

// return false;
// //request type 0 = for first time
// //reqeust type 1 = for second time
// export const cicAsynCreator = ( cicCurrentRange = 0 ) => {
//     return (dispatch) => {
//         if(cicCurrentRange == 0){
//             dispatch(cicFetchRequest({ cicCurrentRange:1 }));
//         }else{
//             dispatch(cicFetchMultipleRequest({ cicCurrentRange }));
//         }
//         getChangeInCash( cicCurrentRange ).then((response)=>{
//             if(response.result == true){
//                 // console.log("testing cic 3 months api respones - ",response);
//                 const { cashInChangeResponse } = response;
//                 cicCurrentRange = cicCurrentRange == 0 ? 1 : cicCurrentRange;
//                 dispatch(cicFetchSuccess({ cicData: cashInChangeResponse, cicCurrentRange }));
//             }else{
//                 cicCurrentRange = cicCurrentRange == 0 ? 1 : cicCurrentRange;
//                 dispatch(cicFetchError({ errorMsg: "Error Try Again!", cicCurrentRange }));    
//             }
//         }).catch((error)=>{
//             cicCurrentRange = cicCurrentRange == 0 ? 1 : cicCurrentRange;
//             dispatch(cicFetchError({ errorMsg: "Error Try Again!", cicCurrentRange }));
//         })

//     }
// }
// // const initialExpense = {
// //     errorMsg:'',
// //     error:false,
// //     loading:false,
// //     expense:[],
// //     totalExpense:0,
// //     isFetched:false,
// //     childLoader:false,
// //     expenseCurrentRange:1
// // }