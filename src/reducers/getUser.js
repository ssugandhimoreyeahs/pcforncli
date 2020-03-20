import Axios from "axios";
import { getUserPromise } from "../api/api";

export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";


const initialUserState = { 
    userData:{},
    isFetched:false,
    error: "",
    loading: false,
    isError:false
 }

 const fetchUserRequest = () => {
     return {
         type: FETCH_USER_REQUEST
     }
 }
 export const fetchUserSuccess = userData => { 
     return { 
         type: FETCH_USER_SUCCESS,
         payload: userData
     }
 }
 const fetchUserFailure = error => {
     return {
         type: FETCH_USER_FAILURE,
         payload: error
     }
 }

 export const userReducer = ( state = initialUserState, action ) => {
     switch(action.type){
        
        
        case FETCH_USER_REQUEST : return {
            userData:{},
            isFetched:false,
            error: "",
            isError:false,
            loading: true
        }
        case FETCH_USER_SUCCESS : return {
            userData: action.payload,
            isFetched: true,
            error: "",
            isError:false,
            loading: false
        }
        case FETCH_USER_FAILURE: return {
            userData: {},
            isFetched: true,
            error: action.payload,
            isError:true,
            loading: false
        }
        default: return state;
     }
 }


 export const fetchUserAsyncActionCreator = () => {
     return async (dispatch) => {

        //Code using async await
        //  dispatch(fetchUserRequest());
        //  const response = await getUser();
        //  if(response.result == true){
        //     dispatch(fetchUserSuccess(response.userData));
        //  }else if(response.result == false){
        //      dispatch( fetchUserFailure("Server Error Try Again!!!") )
        //  }else if(response.result == "error"){
        //      dispatch( fetchUserFailure(response.error));
        //  }else{
        //     dispatch( fetchUserFailure("Error Try Again!!!"));
        //  }

        //code using promise base

        dispatch(fetchUserRequest());
         getUserPromise().then((response)=>{

            if(response.result == true){
                dispatch(fetchUserSuccess(response.userData));
             }else{
                dispatch( fetchUserFailure(response.error));
             }

         }).catch((error)=>{
            dispatch( fetchUserFailure("Error Try Again!"));
         });
         

     }
 }
 



