
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK,API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;

export async function getHealthScore(){
    try{
  
      const token = await AsyncStorage.getItem("authToken");
      const healthScoreResponse  = await axios.get(APINETWORK.getHealthScore,{
        headers: { Authorization: token,"Content-Type": "application/json" },
        timeout
      });
      console.log("health score api response - ");
      console.log("health score response - ",healthScoreResponse.data);
      console.log("Status - ",healthScoreResponse.status);
      console.log("health score api response ends here --- ");
      if(healthScoreResponse.status == 200 && healthScoreResponse.data.success == true){
        return { result:true, healthScoreResponse:healthScoreResponse.data };
      }else{
        return { result: false, healthScoreResponse:healthScoreResponse.data };
      }
    }catch(error){
      return { result:"error",error };
    }
  }
  
  export function getHealthScoreUsingPromise(){
    return new Promise((resolve,reject)=>{
      AsyncStorage.getItem("authToken").then((token)=>{
        axios.get(APINETWORK.getHealthScore,{
          headers: { Authorization: token,"Content-Type": "application/json" },
          timeout
        }).then((response)=>{
         // console.log("inside getHealthScoreUsingPromise() response - ",response.data);
          if(response.status == 200 && response.data.success == true){
            resolve({ result:true,HealthScore: response.data.HealthScore });
          }else{
            reject({ result: false });
          }
        }).catch((error)=>{
        //  console.log("Error on getHealthScoreUsingPromise() - ",error);
          reject({ result:"error",error });
        })
      }).catch((tokenError)=>{
       // console.log("Token Error on getHealthScoreUsingPromise() - ",tokenError);
        reject({ result:"error",tokenError });
      })
      
    })
  }


  export function getHealthScoreUsingWithOutQbPromise(){
    return new Promise((resolve,reject)=>{
      AsyncStorage.getItem("authToken").then((token)=>{

        axios.get(APINETWORK.getHealthScoreWithoutQb,{
          headers: { Authorization: token,"Content-Type": "application/json" },
          timeout
        }).then((response)=>{
          console.log("inside getHealthScoreUsingWithOutQbPromise() response - ",response.data);
          if(response.status == 200 && response.data.success == true){
            resolve({ result:true,HealthScore: response.data.HealthScore });
          }else{
            reject({ result: false });
          }
        }).catch((error)=>{
          console.log("Error on axios getHealthScoreUsingWithOutQbPromise() - ",error);
          reject({ result:"error",error });
        })


      }).catch((error)=>{

        console.log("token Error on axios getHealthScoreUsingWithOutQbPromise() - ",error);
        reject({ result:"error",error });

      });
      
    })
  }
  
  