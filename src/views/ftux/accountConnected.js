import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from "react-native";
import { Button } from "react-native-elements"; 
import { Root } from "@components";
import Spinner from "react-native-loading-spinner-overlay";

class AccountConnected extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );

    setTimeout(() => {
      this.props.navigation.getParam("redirectTo")();
    }, 2000);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  handleBackButton = (nav) => {
    if (!nav.isFocused()) {
      BackHandler.removeEventListener("hardwareBackPress", () =>
        this.handleBackButton(this.props.navigation)
      );
      return false;
    } else {
      nav.goBack();
      return true;
    }
  };

  render() {
    return (
      <Root headerColor={"#F5F6F7"} footerColor={"#F5F6F7"} barStyle={"dark"}>
        <Spinner visible={true} />
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#F5F6F7",
  },
  button: {
    borderRadius: 24,
    height: 48,
    width: "90%",
    backgroundColor: "#007AFF",
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 75,
    alignSelf: "center",
  },
});

export default AccountConnected;

/*
  <View style={styles.margins}>
          <View
            style={{
              justifyContent: "center",
              width: "70%",
              height: "50%",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 20,
                alignSelf: "center",
              }}
            >
              Your account has been successfully connected to PocketCFO
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              width: "70%",
              height: "50%",
              marginBottom: "10%",
              alignSelf: "center",
            }}
          >
            <Button 
                  buttonStyle={styles.button}  
                  onPress={()=>{ this.props.navigation.getParam("redirectTo")(); }} 
                  title={"Back"}
                  titleStyle={{textAlign:'center'}}
                  containerStyle={styles.buttonContainer} /> 
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.getParam("redirectTo")();
              }}
              style={{
                backgroundColor: "#007AFF",
                height: 48,
                width: "50%",
                borderRadius: 25,
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
*/
