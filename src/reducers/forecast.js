import { getForecastData } from "../api/api";

export const FETCH_FORECAST_REQUEST = "FETCH_FORECAST_REQUEST";
export const FETCH_FORECAST_SUCCESS = "FETCH_FORECAST_SUCCESS";
export const FETCH_FORECAST_ERROR = "FETCH_FORECAST_ERROR";

const forecastInitialState = {

    errorMsg: '',
    error: false,
    masterLoader:false,
    childLoader:false,
    forecastData:{},
    isFetched: false

}


export const fetchForecastRequest = () => {
    return{
        type: FETCH_FORECAST_REQUEST
    }
}
export const fetchForecastSuccess = (action) => {
    return {
        type: FETCH_FORECAST_SUCCESS,
        forecastData: action.forecastData
    }
}
export const fetchForecastError = (action) => {
    return {
        type: FETCH_FORECAST_ERROR,
        errorMsg: action.errorMsg
    }
}

export const forecastReducer = (state = forecastInitialState, action) => {

    switch(action.type){

        case FETCH_FORECAST_REQUEST: return{
            
            errorMsg: '',
            error: false,
            masterLoader:true,
            childLoader:false,
            forecastData:{},
            isFetched: false

        }
        
        case FETCH_FORECAST_SUCCESS: return{

            errorMsg: '',
            error: false,
            masterLoader:false,
            childLoader:false,
            forecastData: action.forecastData,
            isFetched: true

        }

        case FETCH_FORECAST_ERROR: return {

            errorMsg: action.errorMsg,
            error: true,
            masterLoader:false,
            childLoader:false,
            forecastData:{},
            isFetched: false

        }

        default : return state;
    }
}

export const fetchForecastAsyncCreator = () => {
    return (dispatch) => {
        dispatch(fetchForecastRequest());
        getForecastData().then((forecastResponse) => {
            if(forecastResponse.result == true){
                const { forecastResponse: forecastData } = forecastResponse;
                
                dispatch(fetchForecastSuccess({ forecastData }));
            }else{
                dispatch(fetchForecastError({ errorMsg:"Error While Fetching Incoming Ar" }));
            }
        }).catch((forecastResponse)=>{
            dispatch(fetchForecastError({ errorMsg:"Error While Fetching Incoming Ar" }));
        });
    }
}