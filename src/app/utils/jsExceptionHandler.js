import { Alert } from "react-native";
import RNRestart from "react-native-restart";
const jsExceptionHandler = (e, isFatal) => {
  console.log("JS Error ", e, "isfatal:", isFatal);
  //crashlytics().log(e);
  if (isFatal) {
    Alert.alert(
      "Unexpected error occurred",
      `Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}
          We will need to restart the app.`,
      [
        {
          text: "Restart",
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ]
    );
  } else {
    console.log("--------------------------", e, "isfatal:", isFatal);
  }
};

export default jsExceptionHandler;
