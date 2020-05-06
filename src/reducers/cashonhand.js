
import { getCashOnHandGraphPromiseBased } from "../api/api";

const COH_FETCH_REQUEST = "COH_FETCH_REQUEST";
const COH_FETCH_SUCCESS = "COH_FETCH_SUCCESS";
const COH_FETCH_ERROR = "COH_FETCH_ERROR";

const COH_FETCH_MULTIPLE = "COH_FETCH_MULTIPLE";

const initialState = {
    error: false,
    errorMsg: '',
    parentLoader: true,
    childLoader: false,
    cohData:{},
    cohCurrentRange: 3,
    isFetched: false
}

const cohFetchRequest = (cohCurrentRange) => {
    return {
        type: COH_FETCH_REQUEST,
        cohCurrentRange
    }
}

const cohFetchSuccess = (cohData,cohCurrentRange) => {
    return {
        type: COH_FETCH_SUCCESS,
        cohData,
        cohCurrentRange
    }
}

const cohFetchError = (errorMsg,cohCurrentRange) => {
    return {
        type: COH_FETCH_ERROR,
        errorMsg,
        cohCurrentRange
    }
}

const cohFetchMultiple = (cohCurrentRange) => {
    return {
        type: COH_FETCH_MULTIPLE,
        cohCurrentRange
    }
}

export const cohReducer = (state = initialState,action) => {
    const { type } = action;
    switch(type){

        case COH_FETCH_REQUEST: return {
            error: false,
            errorMsg: '',
            parentLoader: true,
            childLoader: false,
            cohData:{},
            cohCurrentRange: action.cohCurrentRange,
            isFetched: false
        }

        case COH_FETCH_SUCCESS: return {
            error: false,
            errorMsg: '',
            parentLoader: false,
            childLoader: false,
            cohData:action.cohData,
            cohCurrentRange: action.cohCurrentRange,
            isFetched: true
        }
        case COH_FETCH_ERROR: return {
            error: true,
            errorMsg: action.errorMsg,
            parentLoader: false,
            childLoader: false,
            cohData: {},
            cohCurrentRange: action.cohCurrentRange,
            isFetched: false
        }
        case COH_FETCH_MULTIPLE: return {
            error: false,
            errorMsg: '',
            parentLoader: false,
            childLoader: true,
            cohData: {},
            cohCurrentRange: action.cohCurrentRange,
            isFetched: false
        }

        default: return state;
    }
}

export const cohAsyncCreator = (cohCurrentRange = 3, isInitialRequest = false) => (dispatch) => {
    if(isInitialRequest){
        dispatch(cohFetchRequest(cohCurrentRange));
    }else{
        dispatch(cohFetchMultiple(cohCurrentRange));
    }

    //triger the coh api request here
    let instanceObj = { past: 0, future: 0 };
    instanceObj = cohCurrentRange == 1 ? { past: 0, future: 0 } :
                  cohCurrentRange == 3 ? { past: 3, future: 1 } :
                  cohCurrentRange == 6 ? { past: 3, future: 3 } :
                  { past: 12, future: 0 };
    getCashOnHandGraphPromiseBased(instanceObj.past,instanceObj.future)
        .then((response)=>{
        if(response.result == true){
            dispatch(cohFetchSuccess(response.cohResponse,cohCurrentRange));
        }
      }).catch((error)=>{
        dispatch(cohFetchError(error.message,cohCurrentRange));  
      });
}