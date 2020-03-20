export const GET_FINANCIALS = "pocketcfo/financial/LOAD";
export const GET_FINANCIALS_SUCCESS = "pocketcfo/financial/LOAD_SUCCESS";
export const GET_FINANCIALS_FAIL = "pocketcfo/financial/LOAD_FAIL";


const 
calculateFinancals = () => {
  let financialObj = {};
  const date = new Date();
  for (let i = 0; i < 12; i++) {
    let month = "";
    if (i < 9) {
      month = `0${i + 1}`;
    } else {
      month = `${i + 1}`;
    }
    let dateString = date.getFullYear() + "-" + month + "-01";

    financialObj[dateString] = { cash: 0, expenses: 0, revenue: 0 };
  }
  let object = {
    breakdown: financialObj,
    ar: {
      current: 0,
      late: 0,
      total: 0,
      zero: 1,
      fifteen: 1,
      thirty: 1,
      sixty: 1,
      ninety: 2
    },
    score: 50
  };
  return object;
};
export default function reducer(
  state = { financials: calculateFinancals() },
  action
) {
  switch (action.type) {
    case GET_FINANCIALS:
      return { ...state, loading: true };
    case GET_FINANCIALS_SUCCESS:
      return { ...state, loading: false, financials: action.payload.data };
    case GET_FINANCIALS_FAIL:
      return {
        ...state,
        loading: false,
        error: "Error while fetching financials"
      };
    default:
      return state;
  }
}

export function listFinancials(token) {
  return {
    type: GET_FINANCIALS,
    payload: {
      request: {
        url: `/financials`,
        headers: {
          Authorization: token
        }
      }
    }
  };
}
