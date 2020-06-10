import { getCashOutOfDatePromise } from "../api/api";

const FETCH_OUT_OF_CASH_DATE_REQUEST = "OUT_OF_CASH_DATE_REQUEST";
const FETCH_OUT_OF_CASH_DATE_SUCCESS = "OUT_OF_CASH_DATE_SUCCESS";
const FETCH_OUT_OF_CASH_DATE_ERROR = "OUT_OF_CASH_DATE_ERROR";

const initialState = {
  error: false,
  loading: false,
  fetched: false,
  outOfCashDateResponse: {},
};

const fetchOutOfCashDateRequest = () => {
  return {
    type: FETCH_OUT_OF_CASH_DATE_REQUEST,
  };
};
const fetchOutOfCashDateSuccess = (outOfCashDateResponse) => {
  return {
    type: FETCH_OUT_OF_CASH_DATE_SUCCESS,
    outOfCashDateResponse,
  };
};
const fetchOutOfCashDateError = (error) => {
  return {
    type: FETCH_OUT_OF_CASH_DATE_ERROR,
  };
};

export const outOfCashDateReducer = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case FETCH_OUT_OF_CASH_DATE_REQUEST:
      return {
        error: false,
        loading: true,
        fetched: false,
        outOfCashDateResponse: {},
      };
    case FETCH_OUT_OF_CASH_DATE_SUCCESS:
      return {
        error: false,
        loading: false,
        fetched: true,
        outOfCashDateResponse: action.outOfCashDateResponse,
      };
    case FETCH_OUT_OF_CASH_DATE_ERROR:
      return {
        error: true,
        loading: false,
        fetched: false,
        outOfCashDateResponse: {},
      };
    default:
      return state;
  }
};

export const outOfCashDateAsyncCreator = () => (dispatch) => {
  dispatch(fetchOutOfCashDateRequest());

  getCashOutOfDatePromise()
    .then((response) => {
      dispatch(fetchOutOfCashDateSuccess(response.outOfCashDateResponse));
    })
    .catch((error) => {
      dispatch(fetchOutOfCashDateError(""));
    });
};
