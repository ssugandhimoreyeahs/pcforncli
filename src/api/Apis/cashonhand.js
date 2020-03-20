

import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK,API_TIMEOUT } from "../../constants/constants";

const timeout = API_TIMEOUT;


export async function getCashOnHandGraph(PAST = 0, FUTURE = 0){
    try{
      const token = await AsyncStorage.getItem("authToken");
      let readyGraphUrl = APINETWORK.cashInHand;
      if(PAST != 0 || FUTURE != 0){
        readyGraphUrl = `${readyGraphUrl}?past=${PAST}&future=${FUTURE}`
      }
      console.log("Graph Api ",readyGraphUrl);
      const response = await axios.get(readyGraphUrl,{
        headers: { Authorization: token,"Content-Type": "application/json" },
        timeout
      });
      const res = response.data;
      if(res.success == true){
        return { result:true,response:response.data.data };
      }
      else{
        return { result:false };
      }
    }catch(error){
      return { result:"error",error };
    }
  }

  export function getCashOnHandGraphPromiseBased(PAST = 0, FUTURE = 0){

    
    
      return new Promise((resolve,reject)=>{
        AsyncStorage.getItem("authToken").then((token)=>{

          let readyGraphUrl = APINETWORK.cashInHand;
          if(PAST != 0 || FUTURE != 0){
          readyGraphUrl = `${readyGraphUrl}?past=${PAST}&future=${FUTURE}`
          }
          console.log("Initially Graph url for the coh Api- ",readyGraphUrl);
          axios.get(readyGraphUrl,{
            headers: { Authorization: token,"Content-Type": "application/json" },
            timeout
          }).then(response => {
            const res = response.data;
            if(res.success == true && response.status == 200){
              resolve({ result:true,response:response.data.data });
            }
            else{
              reject({ result:false });
            }
          }).catch((error)=>{
            console.log("getCashOnHandGraphPromiseBased() - Axios Error");
            reject({ result:"error",error });
          });
        
  
  
        }).catch((error)=>{
          console.log("getCashOnHandGraphPromiseBased() - Async Token Error");
          reject({ result:"error",error });
        });
      })
      
    
  }