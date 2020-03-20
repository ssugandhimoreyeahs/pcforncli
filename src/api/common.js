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