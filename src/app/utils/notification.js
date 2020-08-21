import { Alert } from "react-native";

import firebase from "react-native-firebase";
class NotificationService {
  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
    } else {
      this.requestPermission();
    }
  };

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      this.showAlert("Your Firebase Token is:", fcmToken);
    } else {
      this.showAlert("Failed", "No token received");
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission(); 
    } catch (error) { 
        
    }
  };

  messageListener = async () => {
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body + " onNotification");
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body + " onNotificationOpened");
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body + " getInitialNotification");
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };
}

export default new NotificationService();
