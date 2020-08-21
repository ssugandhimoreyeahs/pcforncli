import { getPlaidCategoryUsingPromise } from "../api/api";
import {
  PLAID_EXPENSE_CATEGORIES,
  PLAID_EXPENSE_CUSTOM_CATEGORIES_COLORS,
  randomElement,
} from "@api";

export const FETCH_CATEGORY_REQUEST = "FETCH_CATEGORY_REQUEST";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS";
export const FETCH_CATEGORY_ERROR = "FETCH_CATEGORY_ERROR";

const initialCategoryState = {
  category: [],
  isFetched: false,
  loading: false,
  error: false,
};

export const fetchCategoryRequest = () => {
  return {
    type: FETCH_CATEGORY_REQUEST,
  };
};
export const fetchCategorySuccess = (category) => {
  return {
    type: FETCH_CATEGORY_SUCCESS,
    category,
  };
};

export const fetchCategoryError = (payload) => {
  return {
    type: FETCH_CATEGORY_ERROR,
  };
};

export const plaidCategoryReducer = (state = initialCategoryState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_REQUEST:
      return {
        //category: [],
        ...state,
        isFetched: false,
        loading: true,
        error: false,
      };
    case FETCH_CATEGORY_SUCCESS:
      return {
        category: action.category,
        isFetched: true,
        loading: false,
        error: false,
      };
    case FETCH_CATEGORY_ERROR:
      return {
        category: [],
        isFetched: true,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export function triggerPlaidCategoryAsync() {
  return (dispatch) => {
    dispatch(fetchCategoryRequest());

    getPlaidCategoryUsingPromise()
      .then((plaidCategoryData) => {
        let categoryIndex = 0;
        let updatedPlaidCategoryData = plaidCategoryData.plaidCategoryData.map(
          (singlePlaidCategory, index) => {
            let categoryAssets = {};
            if (!singlePlaidCategory.customcategories) {
              let categoryAssetsData = PLAID_EXPENSE_CATEGORIES.find(
                (itr) =>
                  itr.categoryName.toLowerCase() ===
                  singlePlaidCategory.categoryName.toLowerCase()
              );
              categoryAssets.categoryColor = categoryAssetsData.categoryColor;
              categoryAssets.categoryIcon = categoryAssetsData.categoryIcon;
              categoryAssets.categoryTextColor =
                categoryAssetsData.categoryTextColor != undefined
                  ? categoryAssetsData.categoryTextColor
                  : "#FFF";
            } else {
              if(categoryIndex == PLAID_EXPENSE_CUSTOM_CATEGORIES_COLORS.length-1){
                categoryIndex = 0;
              }
              categoryAssets.categoryColor = PLAID_EXPENSE_CUSTOM_CATEGORIES_COLORS[categoryIndex].color;
              categoryAssets.categoryTextColor = "#FFF";
              categoryIndex++;
            }
            return { ...singlePlaidCategory, ...categoryAssets };
          }
        );
        dispatch(fetchCategorySuccess(updatedPlaidCategoryData));
      })
      .catch((error) => {
        console.log("Error here - ", error);
        dispatch(fetchCategoryError("Error While Fetching Category"));
      });
  };
}
