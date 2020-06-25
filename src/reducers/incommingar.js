import { getARData } from "../api/api";

export const FETCH_INCOMMINGAR_REQUEST = "FETCH_INCOMMINGAR_REQUEST";
export const FETCH_INCOMMINGAR_SUCCESS = "FETCH_INCOMMINGAR_SUCCESS";
export const FETCH_INCOMMINGAR_ERROR = "FETCH_INCOMMINGAR_ERROR";

const ARInitalState = {
  errorMsg: "",
  error: false,
  masterLoader: false,
  childLoader: false,
  arData: {},
  isFetched: false,
};

export const fetchIncommingArRequest = () => {
  return {
    type: FETCH_INCOMMINGAR_REQUEST,
  };
};
export const fetchIncommingArSuccess = (action) => {
  return {
    type: FETCH_INCOMMINGAR_SUCCESS,
    arData: action.arData,
  };
};
export const fetchIncommingArError = (action) => {
  return {
    type: FETCH_INCOMMINGAR_ERROR,
    errorMsg: action.errorMsg,
  };
};

export const arDataReducer = (state = ARInitalState, action) => {
  switch (action.type) {
    case FETCH_INCOMMINGAR_REQUEST:
      return {
        errorMsg: "",
        error: false,
        masterLoader: true,
        childLoader: false,
        arData: {},
        isFetched: false,
      };

    case FETCH_INCOMMINGAR_SUCCESS:
      return {
        errorMsg: "",
        error: false,
        masterLoader: false,
        childLoader: false,
        arData: action.arData,
        isFetched: true,
      };

    case FETCH_INCOMMINGAR_ERROR:
      return {
        errorMsg: action.errorMsg,
        error: true,
        masterLoader: false,
        childLoader: false,
        arData: {},
        isFetched: false,
      };

    default:
      return state;
  }
};

export const fetchArAsyncCreator = () => {
  return (dispatch) => {
    dispatch(fetchIncommingArRequest());
    getARData()
      .then((incommingArResponse) => {
        if (incommingArResponse.result == true) {
          const { arResponse: arData } = incommingArResponse;
          dispatch(fetchIncommingArSuccess({ arData }));
        } else {
          dispatch(
            fetchIncommingArError({
              errorMsg: "Error While Fetching Incoming Ar",
            })
          );
        }
      })
      .catch((incommingArError) => {
        dispatch(
          fetchIncommingArError({
            errorMsg: "Error While Fetching Incoming Ar",
          })
        );
      });
  };
};
