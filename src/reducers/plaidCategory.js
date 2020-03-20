

export const FETCH_CATEGORY_REQUEST = "FETCH_CATEGORY_REQUEST";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS";
export const FETCH_CATEGORY_ERROR = "FETCH_CATEGORY_ERROR";

import Axios from "axios";
import { getPlaidCategoryUsingPromise } from "../api/api";

const initialCategoryState = {
    category: [],
    isFetched:false,
    loading:false,
    error: false
}

export const fetchCategoryRequest = () => {
    return {
        type: FETCH_CATEGORY_REQUEST
    }
}
export const fetchCategorySuccess = category => {
    return{
        type: FETCH_CATEGORY_SUCCESS,
        category,
    }
}

export const fetchCategoryError = payload => {
    return { 
        type: FETCH_CATEGORY_ERROR,
    }
}

export const plaidCategoryReducer = (state = initialCategoryState, action) => {
    switch(action.type){

        case FETCH_CATEGORY_REQUEST: return {
            category:[],
            isFetched: false,
            loading: true,
            error: false
        }
        case FETCH_CATEGORY_SUCCESS: return {
            category: action.category,
            isFetched: true,
            loading: false,
            error: false
        }
        case FETCH_CATEGORY_ERROR: return {
            category:[],
            isFetched:true,
            loading: false,
            error:true
        }
        default: return state;
    }
}

export function triggerPlaidCategoryAsync(){
    return (dispatch) => {

            dispatch(fetchCategoryRequest());

            getPlaidCategoryUsingPromise().then((plaidCategoryData)=>{
                dispatch(fetchCategorySuccess(plaidCategoryData.plaidCategoryData));
            }).catch((error)=>{
                dispatch(fetchCategoryError("Error While Fetching Category"));
            });
            
           

    }
}