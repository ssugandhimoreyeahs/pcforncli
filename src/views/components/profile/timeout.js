import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper"; 

class TimeOut extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
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
      <View style={{ flex: 1 }}>
        {/* <View style={{ backgroundColor: '#070640', height: StatusBar.currentHeight, width:'100%' }} />
        <View style={{flex:1}}> */}

        <View style={styles.margins}>
          <View style={styles.innerView}>
            <Image
              source={require("../../../assets/ClipartKey.png")}
              resizeMode={"contain"}
              style={styles.image}
            />
            <Text style={styles.text}>Sorry Your account is not Connected</Text>
          </View>
          <View
            style={{
              width: "70%",
              height: "13%",
              marginTop: "60%",
              justifyContent: "space-between",
              alignSelf: "center",
            }}
          >
            <Button
              mode="contained"
              style={{
                width: "100%",
                height: 40,
                borderRadius: 20,
                backgroundColor: "#007AFF",
              }}
              onPress={() => {
                this.props.navigation.navigate("BankIntegration", {
                  comeFromTimeout: true,
                  reloadPlaid: () => {
                    this.props.reloadPlaid();
                  },
                });
              }}
            >
              Connect Your Account
            </Button>
            <Button
              mode="contained"
              style={{
                width: "100%",
                marginTop: "3%",
                height: 40,
                borderRadius: 20,
                backgroundColor: "#007AFF",
              }}
              onPress={() => {
                this.props.navigation.navigate("Dashboard");
              }}
            >
              or Goto Dashboard
            </Button>
          </View>
        </View>
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#F5F6F7",
    //borderWidth:1
  },
  innerView: {
    width: "90%",
    height: "18%",
    marginTop: "30%",
    alignSelf: "center",
    //borderWidth:1
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
    marginTop: 10
  },
  image: {
    height: 80,
    width: 80,
    alignSelf: "center",
  },
});

export default TimeOut;

{
  /* <TouchableOpacity style={styles.button_V1}>
            <View style={styles.button_V1}>
                <Text style={styles.text}>Please Connect Your Account</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button_V2}>
            <View>
                <Text style={styles.text}>Or Goto Dashboard</Text>
            </View>
             </TouchableOpacity> */
}
