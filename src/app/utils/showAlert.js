import { Alert } from "react-native";
import { AlertMessages } from "@constants";
const ShowAlert = (type) => {
  let title = ``;
  let message = ``;
  let button = [{ text: "Okay" }];
  if (type == "OUT_TERMINOLOGY") {
    title = AlertMessages.TERMINOLOGY.OUTOFCASHDATE.title;
    message = AlertMessages.TERMINOLOGY.OUTOFCASHDATE.message;
    button = AlertMessages.TERMINOLOGY.OUTOFCASHDATE.button;
  } else if (type == "COH_TERMINOLOGY") {
    title = AlertMessages.TERMINOLOGY.CASHONHAND.title;
    message = AlertMessages.TERMINOLOGY.CASHONHAND.message;
    button = AlertMessages.TERMINOLOGY.CASHONHAND.button;
  } else if (type == "INSIGHTS_COMMINGSOON") {
    title = AlertMessages.INSIGHTS.title;
    message = AlertMessages.INSIGHTS.message;
    button = AlertMessages.INSIGHTS.button;
  }

  Alert.alert(title, message, button);
};

export default ShowAlert;
