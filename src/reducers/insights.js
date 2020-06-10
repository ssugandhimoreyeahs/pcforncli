import { getInsights } from "../api/api";

export const FETCH_INSIGHTS_REQUEST = "FETCH_INSIGHTS_REQUEST";
export const FETCH_INSIGHTS_SUCCESS = "FETCH_INSIGHTS_SUCCESS";
export const FETCH_INSIGHTS_ERROR = "FETCH_INSIGHTS_ERROR";

const insightsInitialData = {
  errorMsg: "",
  error: false,
  masterLoader: false,
  childLoader: false,
  insightsData: {},
  isFetched: false,
};

export const fetchInsightsRequest = () => {
  return {
    type: FETCH_INSIGHTS_REQUEST,
  };
};
export const fetchInsightsSuccess = (action) => {
  return {
    type: FETCH_INSIGHTS_SUCCESS,
    insightsData: action.insightsData,
  };
};
export const fetchInsightsError = (action) => {
  return {
    type: FETCH_INSIGHTS_ERROR,
    errorMsg: action.errorMsg,
  };
};

export const insightsDataReducer = (state = insightsInitialData, action) => {
  switch (action.type) {
    case FETCH_INSIGHTS_REQUEST:
      return {
        errorMsg: "",
        error: false,
        masterLoader: true,
        childLoader: false,
        insightsData: {},
        isFetched: false,
      };

    case FETCH_INSIGHTS_SUCCESS:
      return {
        errorMsg: "",
        error: false,
        masterLoader: false,
        childLoader: false,
        insightsData: action.insightsData,
        isFetched: true,
      };

    case FETCH_INSIGHTS_ERROR:
      return {
        errorMsg: action.errorMsg,
        error: true,
        masterLoader: false,
        childLoader: false,
        insightsData: {},
        isFetched: false,
      };

    default:
      return state;
  }
};

export const fetchInsightsAsyncCreator = () => {
  return (dispatch) => {
    dispatch(fetchInsightsRequest());
    getInsights()
      .then((insightsResponse) => {
        if (insightsResponse.result == true) {
          const { insightsResponse: insightsData } = insightsResponse;
          dispatch(fetchInsightsSuccess({ insightsData }));
        } else {
          dispatch(
            fetchInsightsError({ errorMsg: "Error While Fetching Incoming Ar" })
          );
        }
      })
      .catch((incommingArError) => {
        dispatch(
          fetchInsightsError({ errorMsg: "Error While Fetching Incoming Ar" })
        );
      });
  };
};
