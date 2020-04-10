import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { APINETWORK,API_TIMEOUT } from "../../constants/constants";
const timeout = API_TIMEOUT;

export function getExpenseByCategoryPromise( fetchExpenseTypes = 1 ){
    
      return new Promise((resolve,reject)=>{
        //console.log("Getting Request for the "+fetchExpenseTypes+" of the expense by category");
        //code here for getExpenseByCategoryDta

        
        AsyncStorage.getItem("authToken").then( (token) =>{

            let expenseByCategoryEndPoint = "";
            if(fetchExpenseTypes == 1){
              expenseByCategoryEndPoint = APINETWORK.expenseByCategoryCurrentMonth;
            }else if(fetchExpenseTypes == 3){
              expenseByCategoryEndPoint = APINETWORK.expenseByCategoryPastThreeMonth;
            }else if(fetchExpenseTypes == 6){
              expenseByCategoryEndPoint = APINETWORK.expenseByCategoryPastSixMonth;
            }else if(fetchExpenseTypes == 12){
              expenseByCategoryEndPoint = APINETWORK.expenseByCategoryPastTweleMonth;
            }else{
              expenseByCategoryEndPoint = APINETWORK.expenseByCategoryCurrentMonth;
            }
            console.log("Request for get Category - ",expenseByCategoryEndPoint);
            axios.get(expenseByCategoryEndPoint,{
                headers: { Authorization: token,"Content-Type": "application/json" },
                timeout
              }).then((response)=>{

                if(response.status == 200 && response.data.success == true){
                    resolve({ result:true,expenseByCategoryResponse: response.data });
                  }else{
                    reject({ result:false,response:response.data });
                  }

              }).catch((error)=>{
                console.log("inside getExpenseByCategoryPromise() axios catch - ",error);
                reject({ result:false,error });
              })
              

        }).catch((error)=>{
            console.log("inside getExpenseByCategoryPromise() token catch - ",error);
            reject({ result:false,error });
        });
        
        

      })
      
   
  }


  export function getExpenseByCategoryScreenPromise( fetchExpenseTypes = 0 ){
    return new Promise((resolve,reject)=>{
      AsyncStorage.getItem("authToken").then( (token) =>{
        console.log("Before request Trigger - ",APINETWORK.expenseByCategoryScreen(fetchExpenseTypes));
        axios.get(APINETWORK.expenseByCategoryScreen(1),{
              headers: { Authorization: token,"Content-Type": "application/json" },
              timeout
            }).then((response)=>{
                if(response.status == 200 && response.data.success == true){
                  resolve({ result:true,expensesData: response.data });
                }else{
                  reject({ result:false,expensesData:response.data });
                }

            }).catch((error)=>{
              console.log("inside getExpenseByCategoryPromise() axios catch - ",error);
              reject({ result:false,error });
            })
      }).catch((error)=>{
          console.log("inside getExpenseByCategoryPromise() token catch - ",error);
          reject({ result:false,error });
      });
    });
}