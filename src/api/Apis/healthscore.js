import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK, API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;

export async function getHealthScore() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const healthScoreResponse = await axios.get(APINETWORK.getHealthScore, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      timeout,
    });
    console.log("health score api response - ");
    console.log("health score response - ", healthScoreResponse.data);
    console.log("Status - ", healthScoreResponse.status);
    console.log("health score api response ends here --- ");
    if (
      healthScoreResponse.status == 200 &&
      healthScoreResponse.data.success == true
    ) {
      return { result: true, healthScoreResponse: healthScoreResponse.data };
    } else {
      return { result: false, healthScoreResponse: healthScoreResponse.data };
    }
  } catch (error) {
    return { result: "error", error };
  }
}

export function getHealthScoreUsingPromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        axios
          .get(APINETWORK.getHealthScore, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            // console.log("inside getHealthScoreUsingPromise() response - ",response.data);
            if (response.status == 200 && response.data.success == true) {
              return resolve({
                result: true,
                healthScoreResponse: response.data,
              });
            } else {
              return reject({ result: false });
            }
          })
          .catch((error) => {
            return reject({ result: "error", error });
          });
      })
      .catch((tokenError) => {
        return reject({ result: "error", tokenError });
      });
  });
}

export function getHealthScoreUsingWithOutQbPromise() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("authToken")
      .then((token) => {
        axios
          .get(APINETWORK.getHealthScoreWithoutQb, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            timeout,
          })
          .then((response) => {
            if (response.status == 200 && response.data.success == true) {
              return resolve({
                result: true,
                healthScoreResponse: response.data,
              });
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
