import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK } from "../../constants/constants";

import { API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;

// export async function post(url, body) {
//     const token = await AsyncStorage.getItem("authToken");
//     const response = await axios.post(network.url + url, body, {
//       headers: { Authorization: token, "Content-Type": "application/json" }
//     });
//     return response.data;
//   }

export async function createUser(body) {
  try {
    const response = await axios.post(APINETWORK.userSignUp, body, {
      headers: { "Content-Type": "application/json" },
      timeout,
    });
    const userCreatedResponse = response.data;
    console.log("CREATE USER RESPONSE - ",JSON.stringify(userCreatedResponse));
    if (userCreatedResponse.success == true) {
      await AsyncStorage.setItem("authToken", userCreatedResponse.token);
      return { result: true, response: userCreatedResponse };
    } else {
      return { result: false, response: userCreatedResponse };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function login(username, password) {
  try {
    const response = await axios.post(
      APINETWORK.userLogin,
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        timeout,
      }
    );
    const data = response.data;

    if (data.token) {
      await AsyncStorage.setItem("authToken", data.token);
      // await AsyncStorage.setItem("userId", data.user.id.toString());
      // await AsyncStorage.setItem("userData",JSON.stringify(data.user));
      //await AsyncStorage.setItem("isUserLoggedInStorage", "true");
      return { result: true, data };
    } else {
      return { result: false, error: "Invalid User" };
    }
  } catch (error) {
    return { result: false, error };
  }
}

// export async function patch(url, body) {
//   const token = await AsyncStorage.getItem("authToken");
//   const response = await axios.patch(network.url + url, body, {
//     headers: { Authorization: token, "Content-Type": "application/json" }
//   });
//   return response.data;
// }

// export async function get(url) {
//   const token = await AsyncStorage.getItem("authToken");

//   const response = await axios.get(network.url + url, {
//     headers: { Authorization: token, "Content-Type": "application/json" }
//   });
//   return response.data;
// }

export async function updateUserWithCompany(body) {
  try {
    const userToken = await AsyncStorage.getItem("authToken");
    const response = await axios.post(APINETWORK.editUser, body, {
      headers: { Authorization: userToken, "Content-Type": "application/json" },
      timeout,
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

//old code for the getUser();
// export async function getUser(){
//   const token = await AsyncStorage.getItem("authToken");
//   console.log(token);

//   const response = await axios.get(APINETWORK.getUser, {
//     headers: { Authorization: token, "Content-Type": "application/json" },
//     timeout
//   });
//   return response.data.user;
// }

export async function getUser() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    console.log("Current Token ", token);
    const response = await axios.get(APINETWORK.getUser, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    const res = response.data;

    if (res.success == true) {
      return { result: true, userData: response.data.userData, token };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function isUserAlreadyExist(username) {
  try {
    console.log(
      "Gettint the isUserAlreadyExistURl Here - ",
      APINETWORK.isUserExist
    );
    const response = await axios.post(
      APINETWORK.isUserExist,
      { username },
      {
        headers: { "Content-Type": "application/json" },
        timeout,
      }
    );
    const res = response.data;
    if (res.success == true) {
      return { result: true, response: response.data };
    } else {
      return { result: false, response: res };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function editUserSetting(body) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(APINETWORK.editUser, body, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    const res = response.data;
    if (res.success == true) {
      return { result: true, res };
    } else {
      return { result: false, res };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function updateUserPassword(body) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(APINETWORK.changePassword, body, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    if (response.data.success == true) {
      return { result: true, response: response.data };
    } else {
      return { result: false, response: response.data };
    }
  } catch (error) {
    return { result: false, error };
  }
}

export async function forgetPassword(username) {
  try {
    const response = await axios.post(
      APINETWORK.forgetPassword,
      { username },
      {
        headers: { "Content-Type": "application/json" },
        timeout,
      }
    );
    const res = response.data;
    if (res.success == true) {
      return { result: true, response: response.data };
    } else {
      return { result: false };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export async function uploadCompanyLogo(formData) {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const response = await axios.post(APINETWORK.companyLogo, formData, {
      headers: { Authorization: token },
    });
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

export async function isUserLoggedIn() {
  const response = await AsyncStorage.getItem("isUserLoggedInStorage");
  if (response != undefined && response == "true") {
    return { result: true };
  } else {
    return { result: false };
  }
}

export async function loggedOutUser() {
  const response = await AsyncStorage.getItem("isUserLoggedInStorage");
  if (response != undefined && response == "true") {
    console.log("Auth token remove - ");
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("isUserLoggedInStorage");
    return true;
  } else {
    return false;
  }
}

export async function userLoginCounter() {
  try {
    console.log("Trigger userLoginCounter - ");
    const token = await AsyncStorage.getItem("authToken");
    const userLoginCounterResponse = await axios.post(
      APINETWORK.userLoginCounter,
      { checklogin: "true" },
      {
        headers: { Authorization: token, "Content-Type": "application/json" },
        timeout,
      }
    );
    console.log("user login Counter responses - ");
    console.log("Status - ", userLoginCounterResponse.status);
    console.log("Response Data - ", userLoginCounterResponse.data);
    console.log("user login counter response ends here");
    if (
      userLoginCounterResponse.status == 200 &&
      userLoginCounterResponse.data.success == true
    ) {
      return {
        result: true,
        userLoginCounterResponse: userLoginCounterResponse.data,
      };
    } else {
      return { result: false };
    }
  } catch (error) {
    console.log("Getting eror on userLoginCounter - ", error);
    return { result: "error", error };
  }
}

export function getUserPromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        axios
          .get(APINETWORK.getUser, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            if (response.data.success == true && response.status == 200) {
              resolve({
                result: true,
                userData: response.data.userData,
                token,
              });
            } else {
              reject({ result: false });
            }
          })
          .catch((error) => {
            reject({ result: "axioserror", error });
          });
      })
      .catch((error) => {
        console.log("getUserPromiseToken Error - ", error);
        reject({ result: "error", error });
      });
  });

  return false;
  // try{
  //   const token = await AsyncStorage.getItem("authToken");
  //   console.log("Current Token ",token);
  //   const response = await axios.get(APINETWORK.getUser, {
  //   headers: { Authorization: token, "Content-Type": "application/json" },
  //   timeout
  //   });
  //   const res = response.data;

  //   if(res.success == true){
  //     return { result:true,userData:response.data.userData,token } ;
  //   }else{
  //     return { result:false } ;
  //   }

  // }catch(error){
  //   return{ result:"error",error };
  // }
}

export function sendUserFeedbackData(feedbackBody) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        console.log("before sending feedback data = ", feedbackBody);
        axios
          .post(APINETWORK.storeUserFeedback, feedbackBody, {
            headers: { Authorization: token },
            timeout,
          })
          .then((response) => {
            console.log("sendUserFeedback response - ", response.data);
            if (response.status == 200 && response.data.success == true) {
              resolve({ result: true, feedbackResponse: response.data });
            } else {
              console.log(
                "Error Log - sendUserFeedbackData() - response issue"
              );
              reject({ result: false, feedbackResponse: response.data });
            }
          })
          .catch((error) => {
            console.log("Error Log - sendUserFeedbackData() - axios");
            reject({ result: false, error });
          });
      })
      .catch((error) => {
        console.log("Error Log - sendUserFeedbackData() - authToken");
        reject({ result: false, error });
      });
  });
}
