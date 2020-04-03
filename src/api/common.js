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


export const EXPENSES_COLOR = [
    { color: "#F98361" },
    { color: "#A599EC" },
    { color: "#DE84AA" },
    { color: "#FEBC0F" },
    { color: "#FE7F00" },
    { color: "#C42F61" },
    { color: "#EA727A" },
    { color: "#DFDB67" },
    { color: "#E15621" },
    { color: "#7785E9" },
    { color: "#B7121A" },
    { color: "#AA9637" },
    { color: "#B35E5E" },
    { color: "#E89200" },
    { color: "#801365" },
    { color: "#F04715" },
    { color: "#DDB785" },
    { color: "#9C662E" },
    { color: "#EE8F1C" },
    { color: "#BB96B7" },
    { color: "#433688" },
    { color: "#C98397" },
    { color: "#6C5BC1" }
]

export const INCOME_COLOR = [
    { color: "#4A90E2" },
    { color: "#1FB7A6" },
    { color: "#84D5DE" },
    { color: "#027DF2" },
    { color: "#5165D6" },
    { color: "#33C881" },
    { color: "#508AA9" },
    { color: "#8EB4C9" },
    { color: "#6196CD" },
    { color: "#C5DA2B" },
    { color: "#215086" },
    { color: "#498D87" },
    { color: "#5994B3" },
    { color: "#7AC32C" },
    { color: "#407B00" },
    { color: "#096968" },
    { color: "#00C051" },
    { color: "#6F986C" },
    { color: "#6FB1AB" }
]
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