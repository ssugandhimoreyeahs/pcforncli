

import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK,API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;

export async function getSalesData(){
    try{
      const token = await AsyncStorage.getItem("authToken");
      const getSalesResponse = await axios.get(APINETWORK.getSalesData,{
        headers: { Authorization: token,"Content-Type": "application/json" },
        timeout
      });
      //console.log("Response Recieved ",getSalesResponse.data);
      if(getSalesResponse.data.success == true){
        return { result:true, salesChartData: getSalesResponse.data.datamonth, response:getSalesResponse.data }
      }else{
        return { result:false, response: getSalesResponse.data };
      }
    }catch(error){
      return { result:"error",error };
    }
  }

  export function getSalesDataPromise(){
   
    return new Promise( (resolve,reject)=>{
      AsyncStorage.getItem("authToken").then((token)=>{

        axios.get(APINETWORK.getSalesData,{
          headers: { Authorization: token,"Content-Type": "application/json" },
          timeout
        }).then((getSalesResponse)=>{
          if(getSalesResponse.data.success == true && getSalesResponse.status == 200){
             resolve({ result:true, salesChartData: getSalesResponse.data.datamonth, response:getSalesResponse.data });
          }else{
             reject({ result:false, response: getSalesResponse.data });
          }
        }).catch((error)=>{
          console.log("Axios error getSalesDataPromise() - ",error);
          reject({ result:"error",error });
        });
        
      

      }).catch((error)=>{
        console.log("Auth token error getSalesDataPromise() - ",error);
        reject({ result:"error",error });
      });
     

    })


  }



  export async function triggerNoQbForm(ledgerAccountType){
    try{
      const token = await AsyncStorage.getItem("authToken");
      const getSalesResponse = await axios.post(APINETWORK.noQbForm,{ ledgerAccountType },{
        headers: { Authorization: token,"Content-Type": "application/json" },
        timeout
      });
      // console.log("Getting No qb form response - ",getSalesResponse);
      if(getSalesResponse.data.success == true){
        return{ result:true,response:getSalesResponse.data };
      }else{
        return { result:false,response:getSalesResponse.data };
      }
    }catch(error){
      return { result:"error",error };
    }
  
  }

  export async function triggerQbDataCopyDb(){
    try{
      
      const token = await AsyncStorage.getItem("authToken");
      const triggerQbCopy = await axios.get(APINETWORK.quickBookCopyDb,{
        headers: { Authorization: token,"Content-Type": "application/json" },
        timeout
      });
      if(triggerQbCopy.data.success == true){
        return { result:true,response:triggerQbCopy.data }
      }else{
        return { result:false,response:triggerQbCopy.data }
      }
    }catch(error){
      return { result:"error",error };
    }
  }