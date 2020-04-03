import React,{ Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";



export const UserLoginDataContext = React.createContext();
export const UserLoginDataProvider = UserLoginDataContext.Provider;
export const UserLoginDataConsumer = UserLoginDataContext.Consumer;
import { ALL_MONTHS } from "../constants/constants";

export async function isUserLoggedIn(){
    const userToken = await AsyncStorage.getItem("authToken");
    if(userToken){
        return true;
    }else{
        return false;
    }
}


export const numberWithCommas = (x = 0) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  export const firstLetterCapital = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1)
  }

export  function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

export function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

export function getFormatedDate(originalDate){
    let dateObj = new Date(originalDate);
    return `${ALL_MONTHS[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

export function allFirstWordCapital(text) {
    return text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}


export const PLAID_CATEGORIES = [
    { 
        categoryName: "Bank Fees",
        categoryIcon: require("../assets/CategoryIcon/bank_fees3.png"),
        categoryColor: "#7785E9"
    },
    { 
        categoryName: "Food and Drink",
        categoryIcon: require("../assets/CategoryIcon/food_and_drink3.png"),
        categoryColor: "#B7121A"
    },
    { 
        categoryName: "Healthcare",
        categoryIcon: require("../assets/CategoryIcon/healthcare3.png"),
        categoryColor: "#A599EC"
    },
    { 
        categoryName: "Interest",
        categoryIcon: require("../assets/CategoryIcon/bank_fees3.png"),
        categoryColor: "#7785E9"
    },
    { 
        categoryName: "Service",
        categoryIcon: require("../assets/CategoryIcon/service3.png"),
        categoryColor: "#5165D6"
    },
    { 
        categoryName: "Tax",
        categoryIcon: require("../assets/CategoryIcon/tax3.png"),
        categoryColor: "#433688"
    },
    { 
        categoryName: "Travel",
        categoryIcon: require("../assets/CategoryIcon/travel3.png"),
        categoryColor: "#9C662E"
    }
]