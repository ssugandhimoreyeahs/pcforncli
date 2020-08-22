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

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

Ionicons.loadFont();
AntDesign.loadFont();
class AccountConnected extends Component {
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
  handleQbCopyFunction = async () => {};
  render() {
    return (
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
            Your Quickbook account has been successfully connected to PocketCFO
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
          {/* <Button 
                  buttonStyle={styles.button}  
                  onPress={()=>{ this.props.navigation.getParam("redirectTo")(); }} 
                  title={"Back"}
                  titleStyle={{textAlign:'center'}}
                  containerStyle={styles.buttonContainer} /> */}
          <TouchableOpacity
            onPress={() => {
              this.handleQbCopyFunction();
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
            <Text style={{ textAlign: "center", color: "#FFFFFF" }}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
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
