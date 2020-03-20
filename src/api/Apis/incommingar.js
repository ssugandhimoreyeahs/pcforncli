import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK,API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;


export function getARData(){
    
    return new Promise((resolve,reject)=>{

      AsyncStorage.getItem("authToken").then(token => { 

        
        axios.get(APINETWORK.incommingAr,{
          headers: { Authorization: token,"Content-Type": "application/json" },
          timeout
        }).then((response)=>{

          if(response.status == 200 && response.data.success == true){
            resolve({ result: true,arResponse: response.data });
          }else{
            reject({ result: false, arResponse: response.data });
          }

        }).catch((error)=>{
          console.log("error log getARData() - axios error - ",error);
          reject({ result:false,error });
        });

      }).catch(error => {
        console.log("error log getARData() - token error - ",error);
        reject({ result: "error",error });
      });

    })
  }