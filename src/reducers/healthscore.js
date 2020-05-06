import { getHealthScoreUsingPromise,getHealthScoreUsingWithOutQbPromise } from "../api/api";

const FETCH_HEALTHSCORE_REQUEST = "FETCH_HEALTHSCORE_REQUEST";
const FETCH_HEALTHSCORE_SUCCESS = "FETCH_HEALTHSCORE_SUCCESS";
const FETCH_HEALTHSCORE_ERROR = "FETCH_HEALTHSCORE_ERROR";

const initialState = {
    error: false,
    loading: false,
    isFetched: false,
    healthScoreData: {}
}

const fetchHealthScoreRequest = () => {
    return {
        type : FETCH_HEALTHSCORE_REQUEST
    }
}

const fetchHealthScoreSuccess = (healthScoreData) => {
    return {
        type: FETCH_HEALTHSCORE_SUCCESS,
        healthScoreData
    }
}
const fetchHealthScoreError = (error) => {
    return{
        type: FETCH_HEALTHSCORE_ERROR
    }
}

export const healthScoreReducer = (state = initialState,action) => {
    const { type } = action;
    switch(type){
        case FETCH_HEALTHSCORE_REQUEST: return {
            error: false,
            loading: true,
            isFetched: false,
            healthScoreData: {}
        }
        case FETCH_HEALTHSCORE_SUCCESS: return {
            error: false,
            loading: false,
            isFetched: true,
            healthScoreData: action.healthScoreData
        }
        case FETCH_HEALTHSCORE_ERROR: return {
            error: true,
            loading: false,
            isFetched: false,
            healthScoreData: {}
        }
        default: return state;
    }
}

export const healthScoreAsyncCreator = (isQbConnected = true) => dispatch => {
    dispatch(fetchHealthScoreRequest());
    const healthScoreApiCall = isQbConnected == true ? getHealthScoreUsingPromise : getHealthScoreUsingWithOutQbPromise;

    healthScoreApiCall().then((response)=>{
        dispatch(fetchHealthScoreSuccess(response.healthScoreResponse));
    }).catch((error)=>{
        dispatch(fetchHealthScoreError(""));
    })
    
}