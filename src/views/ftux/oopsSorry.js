import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler,
} from "react-native";
import { Button } from "react-native-elements";
import {Root} from '@components';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Button from "../components/login/button";

MaterialCommunityIcons.loadFont();
class OopsSorry extends Component {
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
      <Root headerColor={"#FFF"} footerColor={"#FFF"} barStyle={"light"}>
      <View style={styles.container}>
        <Image
          style={{
            width: 140,
            height: 119,
            marginTop: "55%",
            alignSelf: "center",
          }}
          source={require("../../assets/bank_fail.png")}
        />
        <Text style={styles.text}>Oops:(</Text>
        <Text style={styles.textSecond}>
          We’re not able to connect your bank.
        </Text>
        <Button
          buttonStyle={styles.buttonStyle}
          icon={
            <MaterialCommunityIcons name="reload" size={20} color="white" />
          }
          title="Retry"
          titleStyle={{ textAlign: "center", fontSize: 15, marginTop: -3 }}
          type="solid"
          onPress={() => {
            this.props.navigation.getParam("executeOperation")();
          }}
        />
      </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  text: {
    fontSize: 22,
    fontFamily: "System",
    fontWeight: "normal",
    marginVertical: 10,
  },
  textSecond: {
    fontSize: 17,
    fontFamily: "System",
    fontWeight: "normal",
    marginVertical: 10,
  },
  buttonStyle: {
    width: 101,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    marginTop: "5%",
  },
});

export default OopsSorry;
