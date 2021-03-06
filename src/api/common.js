import React, { Component } from "react";
import AsyncStorage from "@react-native-community/async-storage";

export const UserLoginDataContext = React.createContext();
export const UserLoginDataProvider = UserLoginDataContext.Provider;
export const UserLoginDataConsumer = UserLoginDataContext.Consumer;
import { ALL_MONTHS } from "../constants/constants";

export async function isUserLoggedIn() {
  const userToken = await AsyncStorage.getItem("authToken");
  if (userToken) {
    return true;
  } else {
    return false;
  }
}

export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
export const numberWithCommas = (x = 0) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const firstLetterCapital = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

export function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

export function getFormatedDate(originalDate) {
  let dateObj = new Date(originalDate);
  return `${
    ALL_MONTHS[dateObj.getMonth()]
  } ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

export function allFirstWordCapital(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
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
  { color: "#6C5BC1" },
];

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
  { color: "#6FB1AB" },
];

const INCOME_ICONS = {
  discounds_or_refunds: {
    categoryIcon: require("../assets/IncomeCategoryIcon/discounts_or_refund3.png"),
    categoryColor: "#4A90E2",
  },
  interest: {
    categoryIcon: require("../assets/IncomeCategoryIcon/interest3.png"),
    categoryColor: "#1FB7A6",
  },
  investment: {
    categoryIcon: require("../assets/IncomeCategoryIcon/investment3.png"),
    categoryColor: "#84D5DE",
  },
  product_revenue: {
    categoryIcon: require("../assets/IncomeCategoryIcon/product_revenue3.png"),
    categoryColor: "#027DF2",
  },
  service_revenue: {
    categoryIcon: require("../assets/IncomeCategoryIcon/service_revenue3.png"),
    categoryColor: "#5165D6",
  },
  miscellaneous: {
    categoryIcon: require("../assets/IncomeCategoryIcon/miscellaneous3.png"),
    categoryColor: "#33C881",
  },
  uncategorized: {
    categoryIcon: require("../assets/IncomeCategoryIcon/uncategorized3.png"),
    categoryColor: "#508AA9",
  },
};

const EXPENSE_ICONS = {
  advertising_and_marketing: {
    categoryIcon: require("../assets/CategoryIcon/advertising_and_marketing3.png"),
    categoryColor: "#F98361",
  },
  business_insurance: {
    categoryIcon: require("../assets/CategoryIcon/business_insurance3.png"),
    categoryColor: "#A599EC",
  },
  charitable_contributions: {
    categoryIcon: require("../assets/CategoryIcon/charitable_contributions3.png"),
    categoryColor: "#FE7F00",
  },
  education_and_training: {
    categoryIcon: require("../assets/CategoryIcon/education_and_training3.png"),
    categoryColor: "#C42F61",
  },
  entertainment: {
    categoryIcon: require("../assets/CategoryIcon/entertainment3.png"),
    categoryColor: "#EA727A",
  },
  employee_benefits: {
    categoryIcon: require("../assets/CategoryIcon/employee_benefits3.png"),
    categoryColor: "#DFDB67",
  },
  furniture_and_equipment: {
    categoryIcon: require("../assets/CategoryIcon/furniture_and_equpment3.png"),
    categoryColor: "#E15621",
  },
  interest_and_bank_fees: {
    categoryIcon: require("../assets/CategoryIcon/interest_and_bank_fees3.png"),
    categoryColor: "#7785E9",
  },
  licenses_and_permits: {
    categoryIcon: require("../assets/CategoryIcon/licenses_and_permits3.png"),
    categoryColor: "#DE84AA",
  },
  meals: {
    categoryIcon: require("../assets/CategoryIcon/meals3.png"),
    categoryColor: "#B7121A",
  },
  membership_fees: {
    categoryIcon: require("../assets/CategoryIcon/membership_fees3.png"),
    categoryColor: "#AA9637",
  },
  office_and_postage: {
    categoryIcon: require("../assets/CategoryIcon/office_and_postage3.png"),
    categoryColor: "#B35E5E",
  },
  payroll: {
    categoryIcon: require("../assets/CategoryIcon/payroll3.png"),
    categoryColor: "#E89200",
  },
  professional_services: {
    categoryIcon: require("../assets/CategoryIcon/professional_services3.png"),
    categoryColor: "#801365",
  },
  repair_and_maintanence: {
    categoryIcon: require("../assets/CategoryIcon/repair_and_maintanence3.png"),
    categoryColor: "#F04715",
  },
  rent_or_lease: {
    categoryIcon: require("../assets/CategoryIcon/rent_or_lease3.png"),
    categoryColor: "#DDB785",
  },
  travel: {
    categoryIcon: require("../assets/CategoryIcon/travel3.png"),
    categoryColor: "#9C662E",
  },
  utilities: {
    categoryIcon: require("../assets/CategoryIcon/utiilities3.png"),
    categoryColor: "#EE8F1C",
  },
  vehicle: {
    categoryIcon: require("../assets/CategoryIcon/vehicle3.png"),
    categoryColor: "#FEBC0F",
  },
  website_and_software: {
    categoryIcon: require("../assets/CategoryIcon/website_and_software3.png"),
    categoryColor: "#BB96B7",
  },
  taxes: {
    categoryIcon: require("../assets/CategoryIcon/taxes3.png"),
    categoryColor: "#433688",
  },
  miscellaneous: {
    categoryIcon: require("../assets/CategoryIcon/miscellaneous3.png"),
    categoryColor: "#C98397",
  },
  uncategorized: {
    categoryIcon: require("../assets/CategoryIcon/uncategorized3.png"),
    categoryColor: "#EEEFF1",
    categoryTextColor: "#131213",
  },
};

export const PLAID_EXPENSE_CATEGORIES = [
  {
    categoryName: "Advertising & marketing",
    ...EXPENSE_ICONS.advertising_and_marketing,
  },
  {
    categoryName: "Business Insurance",
    ...EXPENSE_ICONS.business_insurance,
  },
  {
    categoryName: "Charitable Contributions",
    ...EXPENSE_ICONS.charitable_contributions,
  },
  {
    categoryName: "Education & training",
    ...EXPENSE_ICONS.education_and_training,
  },
  {
    categoryName: "Employee Benefits",
    ...EXPENSE_ICONS.employee_benefits,
  },
  {
    categoryName: "Entertainment",
    ...EXPENSE_ICONS.entertainment,
  },
  {
    categoryName: "Food & Drink",
    ...EXPENSE_ICONS.meals,
  },
  {
    categoryName: "Furniture & equipment",
    ...EXPENSE_ICONS.furniture_and_equipment,
  },
  {
    categoryName: "Healthcare",
    ...EXPENSE_ICONS.business_insurance,
  },
  {
    categoryName: "Interest & bank fees",
    ...EXPENSE_ICONS.interest_and_bank_fees,
  },
  {
    categoryName: "Miscellaneous",
    ...EXPENSE_ICONS.miscellaneous,
  },
  {
    categoryName: "Office & postage",
    ...EXPENSE_ICONS.office_and_postage,
  },
  {
    categoryName: "Payroll",
    ...EXPENSE_ICONS.payroll,
  },
  {
    categoryName: "Professional Services",
    ...EXPENSE_ICONS.professional_services,
  },
  {
    categoryName: "Rent",
    ...EXPENSE_ICONS.rent_or_lease,
  },
  {
    categoryName: "Rent or lease",
    ...EXPENSE_ICONS.rent_or_lease,
  },
  {
    categoryName: "Repair & Maintanence",
    ...EXPENSE_ICONS.repair_and_maintanence,
  },
  {
    categoryName: "Licenses & Permits",
    ...EXPENSE_ICONS.licenses_and_permits,
  },
  {
    categoryName: "Taxes",
    ...EXPENSE_ICONS.taxes,
  },
  {
    categoryName: "Travel",
    ...EXPENSE_ICONS.travel,
  },
  {
    categoryName: "Uncategorized",
    ...EXPENSE_ICONS.uncategorized,
  },
  {
    categoryName: "Utilities",
    ...EXPENSE_ICONS.utilities,
  },
  {
    categoryName: "Vehicle",
    ...EXPENSE_ICONS.vehicle,
  },
  {
    categoryName: "Website & Software",
    ...EXPENSE_ICONS.website_and_software,
  },
];

export const PLAID_INCOME_CUSTOM_CATEGORIES_COLORS = [
  { color: "#1458A8" },
  { color: "#2457DC" },
  { color: "#245582" },
  { color: "#247E16" },
  { color: "#6BB410" },
  { color: "#1AA2B5" },
  { color: "#128E5A" },
  { color: "#18847D" },
  { color: "#2E7B9C" },
  { color: "#071E72" },
];
export const PLAID_EXPENSE_CUSTOM_CATEGORIES_COLORS = [
  { color: "#B96A22" },
  { color: "#AB5415" },
  { color: "#7D2040" },
  { color: "#B02C35" },
  { color: "#922E10" },
  { color: "#AF3000" },
  { color: "#791010" },
  { color: "#751884" },
  { color: "#9C2E5C" },
  { color: "#4F0772" },
];
export const getCategoryInitials = (str = "") => {
  let splitArray = str.split(" ");
  let forAcroyn = [];
  splitArray.map((singleWord) => {
    if (singleWord != "and" && singleWord != "And" && singleWord != "&") {
      forAcroyn.push(singleWord);
    }
  });
  let initials = "";
  let mapRunningAlong = 0;
  forAcroyn.map((word) => {
    if (mapRunningAlong < 2) {
      mapRunningAlong++;
      initials += word.charAt(0).toUpperCase();
    }
  });
  return initials;
};

export const PLAID_SECURE_MODAL = [
  {
    title: "Secure",
    text: "Your information is encrypted end-to-end.",
  },
  {
    title: "Private",
    text: "Your credentials will never be accessible to PocketCFO.",
  },
  {
    title: "Anonymous",
    text: "Your financial data will always be anonymized in our database.",
  },
];
