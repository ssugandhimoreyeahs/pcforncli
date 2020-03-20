
export const CIC_FETCH_REQUEST = "CIC_FETCH_REQUEST";
export const CIC_FETCH_SUCCESS = "CIC_FETCH_SUCCESS";
export const CIC_FETCH_ERROR = "CIC_FETCH_ERROR";

export const CIC_FETCH_MULTIPLE_REQUEST = "CIC_FETCH_MULTIPLE_REQUEST";

import { getChangeInCash } from "../api/api";

const initialCICState = {

    errorMsg: '',
    error: false,
    masterLoader:false,
    childLoader:false,
    cicData:{},
    cicCurrentRange: 0,
    isFetched: false

}


const cicFetchRequest = (action) => {
    return { 
        type: CIC_FETCH_REQUEST,
        cicCurrentRange: action.cicCurrentRange
    }
}

export const cicFetchSuccess = (action) => {
    return{
        type: CIC_FETCH_SUCCESS,
        cicData:action.cicData,
        cicCurrentRange:action.cicCurrentRange
    }
}

export const cicFetchError = (action) => {
    return{
        type: CIC_FETCH_ERROR,
        errorMsg: action.errorMsg,
        cicCurrentRange: action.cicCurrentRange
    }
}

export const cicFetchMultipleRequest = (action) => {
    return{
        type: CIC_FETCH_MULTIPLE_REQUEST,
        cicCurrentRange: action.cicCurrentRange
    }
}

export const cicReducer = (state = initialCICState, action) => {
    switch(action.type){

        case CIC_FETCH_REQUEST: return{
            errorMsg: '',
            error: false,
            masterLoader:true,
            childLoader:false,
            cicData:{},
            cicCurrentRange: action.cicCurrentRange,
            isFetched: false
        }

        case CIC_FETCH_SUCCESS: return{
            errorMsg: '',
            error: false,
            masterLoader:false,
            childLoader:false,
            cicData: action.cicData,
            cicCurrentRange: action.cicCurrentRange,
            isFetched: true
        }

        case CIC_FETCH_ERROR: return{
            errorMsg: action.error,
            error: true,
            masterLoader:false,
            childLoader:false,
            cicData: {},
            cicCurrentRange: action.cicCurrentRange,
            isFetched: false
        }

        case CIC_FETCH_MULTIPLE_REQUEST: return{
            errorMsg: '',
            error: false,
            masterLoader:false,
            childLoader:true,
            cicData: {},
            cicCurrentRange: action.cicCurrentRange,
            isFetched: false
        }
        default: return state;
    }
}

//request type 0 = for first time
//reqeust type 1 = for second time
export const cicAsynCreator = ( cicCurrentRange = 0 ) => {
    return (dispatch) => {
        if(cicCurrentRange == 0){
            dispatch(cicFetchRequest({ cicCurrentRange:1 }));
        }else{
            dispatch(cicFetchMultipleRequest({ cicCurrentRange }));
        }
        getChangeInCash( cicCurrentRange ).then((response)=>{
            if(response.result == true){
                // console.log("testing cic 3 months api respones - ",response);
                const { cashInChangeResponse } = response;
                cicCurrentRange = cicCurrentRange == 0 ? 1 : cicCurrentRange;
                dispatch(cicFetchSuccess({ cicData: cashInChangeResponse, cicCurrentRange }));
            }else{
                cicCurrentRange = cicCurrentRange == 0 ? 1 : cicCurrentRange;
                dispatch(cicFetchError({ errorMsg: "Error Try Again!", cicCurrentRange }));    
            }
        }).catch((error)=>{
            cicCurrentRange = cicCurrentRange == 0 ? 1 : cicCurrentRange;
            dispatch(cicFetchError({ errorMsg: "Error Try Again!", cicCurrentRange }));
        })

    }
}
// const initialExpense = {
//     errorMsg:'',
//     error:false,
//     loading:false,
//     expense:[],
//     totalExpense:0,
//     isFetched:false,
//     childLoader:false,
//     expenseCurrentRange:1
// }