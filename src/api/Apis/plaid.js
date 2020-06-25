import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK, API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;

export async function sendPlaidToken(public_token, institution, accounts) {
  try {
    const body = {
      public_token,
      institution,
      accounts,
    };
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(APINETWORK.pushToken, body, {
      headers: { Authorization: token, "Content-Type": "application/json" },
    });
    const res = response.data;
    if (res.success == true) {
      return { result: true, response: response.data };
    } else {
      return { result: false, response: response.data };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function getUserTransactions(SKIP = 0, LIMIT = 25) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    let readyUrl = APINETWORK.getTransactions;
    if (SKIP != null && LIMIT != null) {
      readyUrl = `${readyUrl}?skip=${SKIP}&limit=${LIMIT}`;
    }
    console.log("Url Before Send ", readyUrl);
    const response = await axios.get(readyUrl, {
      headers: { Authorization: token, "Content-Type": "application/json" },
    });
    // console.log("Response Recieved - ",response.status);
    // console.log("Response Data - ",response.data);
    const data = response.data;
    if (data.success == true) {
      return {
        result: true,
        transactions: data.transactions,
        totalTransactions: data.totalTransactions,
        accountType: data.accountType,
      };
    } else {
      return Promise.reject({ result: false, response: data });
    }
  } catch (error) {
    return Promise.reject({ result: "error", error });
  }
}

export async function saveBankData(publicToken, institution, accounts) {
  try {
    const body = {
      publicToken,
      institution,
      accounts,
    };
    console.log("Sending account/token");
    console.log(body);
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(APINETWORK.saveBanksData, body, {
      headers: { Authorization: token, "Content-Type": "application/json" },
    });
    const data = response.data;
    console.log(response.status);
    console.log(response.statusText);
    return data;
  } catch (error) {
    console.log("error account/token");
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    return { result: "error", error };
  }
}

export async function isCheckUserConnectedToBank() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(APINETWORK.getBankData, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    const bankConnectedData = response.data;
    if (bankConnectedData.success == true) {
      return { result: true, bankConnectedData };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function fetchCurrentBalance() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.get(APINETWORK.getCurrentBal, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    if (response.data.succses == true) {
      return {
        result: true,
        available_balance: response.data["available balance"],
      };
    } else {
      return { result: false, response: response.data };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export function fetchCurrentBalancePromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        axios
          .get(APINETWORK.getCurrentBal, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            // setTimeout(()=>{
            //   console.log("fetchCurrentBalancePromise response - ",response.data);
            //   console.log("fetchCurrentBalancePromise response - ",response.status);
            // },15000);

            if (response.data.succses == true && response.status == 200) {
              resolve({
                result: true,
                available_balance: response.data["available balance"],
              });
            } else {
              reject({ result: false });
            }
          })
          .catch((error) => {
            console.log("fetchCurrentBalancePromise() - Axios Error");
            reject({ result: "error", error });
          });
      })
      .catch((error) => {
        console.log("fetchCurrentBalancePromise() - Async Token Error");
        reject({ result: "error", error });
      });
  });
}

export async function unlinkBankAccount() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      APINETWORK.unlinkBank,
      {},
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    const res = response.data;
    console.log("Mongo Api ", res);
    if (res.success == true) {
      return { result: true, response: res };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function reLinkBankAccount() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(
      APINETWORK.relinkBank,
      {},
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    const res = response.data;
    if (res.success == true) {
      return { result: true, response: res };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function validPlaidToken() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const validatePlaidToken = await axios.get(APINETWORK.plaidTokenStatus, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    if (validatePlaidToken.data.success == true) {
      return { result: true, response: validatePlaidToken.data };
    } else {
      return { result: false, response: validatePlaidToken.data };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export function validatePlaidTokenPromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        axios
          .get(APINETWORK.plaidTokenStatus, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((validatePlaidToken) => {
            // setTimeout(()=>{
            //   console.log("validatePlaidTokenPromise() response - ",validatePlaidToken.data);
            // },15000);

            console.log(
              "Valid Plaid Token Api response - ",
              validatePlaidToken.data
            );
            if (
              validatePlaidToken.data.success == true &&
              validatePlaidToken.status == 200
            ) {
              resolve({ result: true, response: validatePlaidToken.data });
            } else {
              reject({ result: false, response: validatePlaidToken.data });
            }
          })
          .catch((error) => {
            console.log("validatePlaidTokenPromise() - Axios Error");
            reject({ result: "error", error });
          });
      })
      .catch((error) => {
        console.log("getCashOnHandGraphPromiseBased() - Async Token Error");
        reject({ result: "error", error });
      });
  });
}
export async function getCashOutOfDate() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const triggerOutOfCashApiResponse = await axios.get(
      APINETWORK.outOfCashDateApi,
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    // console.log("out of cash data - ");
    // console.log(triggerOutOfCashApiResponse.data);
    // console.log("--------------out of cash ends here ---------------------");
    if (triggerOutOfCashApiResponse.data.success == true) {
      return {
        result: true,
        outOfCashDate: triggerOutOfCashApiResponse.data.days,
      };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export function getCashOutOfDatePromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        axios
          .get(APINETWORK.outOfCashDateApi, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            const res = response.data;
            if (res.success == true && response.status == 200) {
              return resolve({ result: true, outOfCashDateResponse: res });
            } else {
              return reject({ result: false });
            }
          })
          .catch((error) => {
            return reject({ result: "error", error });
          });
      })
      .catch((error) => {
        return reject({ result: "error", error });
      });
  });
}
export async function getUserOutFlowTransactions(skip = 0, limit = 0) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    let generateOutflowUrlWithSkip = `${
      APINETWORK.getOutflowTransactions
    }&skip=${skip}&limit=${limit}`;
    const outflowTransactionsResponse = await axios.get(
      generateOutflowUrlWithSkip,
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    if (
      outflowTransactionsResponse.status == 200 &&
      outflowTransactionsResponse.data.success == true
    ) {
      console.log(
        `Outflow Response url = ${generateOutflowUrlWithSkip} - response length - ${
          outflowTransactionsResponse.data.transactions.length
        }`
      );
      return {
        result: true,
        outflowTransactions: outflowTransactionsResponse.data,
      };
    } else {
      return Promise.reject({
        result: false,
        response: outflowTransactionsResponse.data,
      });
    }
  } catch (error) {
    return Promise.reject({ result: false, error });
  }
}

export async function getUserInflowTransactions(skip = 0, limit = 0) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    let generateInflowUrlWithSkip = `${
      APINETWORK.getInflowTransactions
    }&skip=${skip}&limit=${limit}`;
    const inflowTransactionsResponse = await axios.get(
      generateInflowUrlWithSkip,
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    if (
      inflowTransactionsResponse.status == 200 &&
      inflowTransactionsResponse.data.success == true
    ) {
      console.log(
        `Inflow Response url = ${generateInflowUrlWithSkip} - response length - ${
          inflowTransactionsResponse.data.transactions.length
        }`
      );
      return {
        result: true,
        inflowTransactions: inflowTransactionsResponse.data,
      };
    } else {
      return Promise.reject({
        result: false,
        response: inflowTransactionsResponse.data,
      });
    }
  } catch (error) {
    return Promise.reject({ result: false, error });
  }
}

export async function getPlaidCategory() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const getPlaidCategoryResponse = await axios.get(APINETWORK.getCategory, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });

    console.log(
      "-----------------------------------------------------------------------"
    );
    console.log(
      "Plaid Category Fetched Status - ",
      getPlaidCategoryResponse.status
    );
    console.log("Plaid Category Data - ", getPlaidCategoryResponse.data);
    console.log(
      "-----------------------------------------------------------------------"
    );

    if (
      getPlaidCategoryResponse.status == 200 &&
      getPlaidCategoryResponse.data.success == true
    ) {
      return {
        result: true,
        plaidCategoryData: getPlaidCategoryResponse.data.category,
      };
    } else {
      return { result: false };
    }
  } catch (error) {
    console.log("Error while Fetching plaid Category - ", error);
    return { result: "error", error };
  }
}

export async function addPlaidCategory(category) {
  try {
    const token = await AsyncStorage.getItem("authToken");

    //Old API End Point  - APINETWORK.addCategory
    const getPlaidCategoryResponse = await axios.post(
      APINETWORK.newAddCategory,
      { category },
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    console.log("Category Add response Starts  Here -------");
    console.log("Category Add Response - ", getPlaidCategoryResponse.status);
    console.log("Category Add Response - ", getPlaidCategoryResponse.data);
    console.log("Category Add response Ends Here -------");
    if (
      getPlaidCategoryResponse.status == 200 &&
      getPlaidCategoryResponse.data.success == true
    ) {
      return { result: true, message: getPlaidCategoryResponse.data.message };
    } else {
      return { result: false, message: getPlaidCategoryResponse.data.message };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function deletePlaidCategory(id) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    //Old end point APINETWORK.deleteCategory
    const deletePlaidCategoryResponse = await axios.post(
      APINETWORK.newDeleteCategory,
      { id },
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    if (
      deletePlaidCategoryResponse.status == 200 &&
      deletePlaidCategoryResponse.data.success == true
    ) {
      return { result: true, deleteResponse: deletePlaidCategoryResponse.data };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function editPlaidCategory(id, category) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    //Old end point APINETWORK.editCategory
    const editPlaidCategoryResponse = await axios.post(
      APINETWORK.newEditCategory,
      { id, category },
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    if (
      editPlaidCategoryResponse.status == 200 &&
      editPlaidCategoryResponse.data.success == true
    ) {
      return { result: true, editResponse: editPlaidCategoryResponse.data };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export function getPlaidCategoryUsingPromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken").then((token) => {
      // console.log("Testing token here inside the callback of the async storage - ",token);
      //Old Api Link
      axios
        .get(APINETWORK.newGetCategory, {
          headers: { Authorization: token, "Content-Type": "application/json" },
          timeout,
        })
        .then((getPlaidCategoryResponse) => {
          if (
            getPlaidCategoryResponse.status == 200 &&
            getPlaidCategoryResponse.data.success == true
          ) {
            resolve({
              result: true,
              plaidCategoryData: getPlaidCategoryResponse.data.category,
            });
          } else {
            reject({ result: false });
          }
        })
        .catch((error) => {
          console.log("Error while Fetching plaid Category - ", error);
          reject({ result: "error", error });
        });
    });
  });
}

export async function addCategoryToTransaction(transactionId, categoryId) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    let body = { transactionId, categoryId };
    console.log("------------------Ready Body---------------");
    console.log(body);
    console.log("------------------------------------");
    //Old APINETWORK.addCategoryToTransaction
    const addCategoryToTransactionResponse = await axios.post(
      APINETWORK.addClientCategoryToTransaction,
      body,
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    console.log(
      "Edit category response - ",
      addCategoryToTransactionResponse.data
    );
    console.log(
      "Edit category status - ",
      addCategoryToTransactionResponse.status
    );
    if (
      addCategoryToTransactionResponse.status == 200 &&
      addCategoryToTransactionResponse.data.success == true
    ) {
      return { result: true, message: addCategoryToTransactionResponse.data };
    } else {
      return { result: false, message: addCategoryToTransactionResponse.data };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function getSubCategories(fetchType, category) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    let readyQueryParams;
    if (fetchType == 1) {
      readyQueryParams = `${
        APINETWORK.getSubCategories
      }?currentMonth=true&category=${category}`;
    } else if (fetchType == 3) {
      readyQueryParams = `${
        APINETWORK.getSubCategories
      }?pastThreeMonth=true&category=${category}`;
    } else if (fetchType == 6) {
      readyQueryParams = `${
        APINETWORK.getSubCategories
      }?pastSixMonth=true&category=${category}`;
    } else {
      readyQueryParams = `${
        APINETWORK.getSubCategories
      }?pastTwelveMonth=true&category=${category}`;
    }
    console.log("request for the get sub categories - ", readyQueryParams);
    const getSubCategoryResponse = await axios.get(readyQueryParams, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    // console.log("Edit category response - ",getSubCategoryResponse.data);
    // console.log("Edit category status - ",getSubCategoryResponse.status);
    if (
      getSubCategoryResponse.status == 200 &&
      getSubCategoryResponse.data.success == true
    ) {
      return { result: true, subCategoryResponse: getSubCategoryResponse.data };
    } else {
      return {
        result: false,
        subCategoryResponse: getSubCategoryResponse.data,
      };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function getSubCategoryTransactions(
  transactionType,
  category,
  subCategory
) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    let readySubExpenseQueryParams;
    if (transactionType == 1) {
      readySubExpenseQueryParams = `${
        APINETWORK.getSubCategoryTransactions
      }?currentMonth=true&category=${category}&subCategory=${subCategory}`;
    } else if (transactionType == 3) {
      readySubExpenseQueryParams = `${
        APINETWORK.getSubCategoryTransactions
      }?pastThreeMonth=true&category=${category}&subCategory=${subCategory}`;
    } else if (transactionType == 6) {
      readySubExpenseQueryParams = `${
        APINETWORK.getSubCategoryTransactions
      }?pastSixMonth=true&category=${category}&subCategory=${subCategory}`;
    } else {
      readySubExpenseQueryParams = `${
        APINETWORK.getSubCategoryTransactions
      }?pastTwelveMonth=true&category=${category}&subCategory=${subCategory}`;
    }
    console.log(
      "request for the sub categories transactions  - ",
      readySubExpenseQueryParams
    );
    const getSubCategoryTransactionResponse = await axios.get(
      readySubExpenseQueryParams,
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    // console.log("Edit category response - ",getSubCategoryResponse.data);
    // console.log("Edit category status - ",getSubCategoryResponse.status);
    if (
      getSubCategoryTransactionResponse.status == 200 &&
      getSubCategoryTransactionResponse.data.success == true
    ) {
      return {
        result: true,
        subCategoryTransactionResponse: getSubCategoryTransactionResponse.data,
      };
    } else {
      return {
        result: false,
        subCategoryTransactionResponse: getSubCategoryTransactionResponse.data,
      };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export function getChangeInCash(cicCurrentRange = 1) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        let composeCICUri = `${APINETWORK.changeInCash}?`;

        if (cicCurrentRange == 1 || cicCurrentRange == 0) {
          composeCICUri += `currentMonth=true`;
        } else if (cicCurrentRange == 3) {
          composeCICUri += `pastThreeMonth=true`;
        } else if (cicCurrentRange == 6) {
          composeCICUri += `pastSixMonth=true`;
        } else {
          composeCICUri += `pastTwelveMonth=true`;
        }
        console.log("Cic request here for the api call - ", composeCICUri);
        axios
          .get(composeCICUri, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            // console.log("--------------change in cash api response -----");
            // console.log(response);
            // console.log("----------------------------------------------");
            if (response.status == 200 && response.data.success == true) {
              resolve({ result: true, cashInChangeResponse: response.data });
            } else {
              reject({ result: false, cashInChangeResponse: response.data });
            }
          })
          .catch((error) => {
            console.log("error log getChangeInCash() - axios error - ", error);
            reject({ result: false, error });
          });
      })
      .catch((error) => {
        console.log("error log getChangeInCash() - token error - ", error);
        reject({ result: "error", error });
      });
  });
}

export function changeAllSimilarTransaction(axiosBody = {}) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        console.log(
          "Hitting Change All similar Transaction - ",
          APINETWORK.categoryChangeInAllTransaction
        );
        console.log("Change Similar Transaction body - ", axiosBody);
        //OldEndpoint APINETWORK.categoryChangeInAllTransaction

        axios
          .post(APINETWORK.clientCategoryChangeInAllTransaction, axiosBody, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            if (response.status == 200 && response.data.success == true) {
              resolve({
                result: true,
                changeAllTransactionResponse: response.data,
              });
            } else {
              reject({
                result: false,
                changeAllTransactionResponse: response.data,
              });
            }
          })
          .catch((error) => {
            reject({ result: false, error });
          });
      })
      .catch((error) => {
        reject({ result: "error", error });
      });
  });
}
