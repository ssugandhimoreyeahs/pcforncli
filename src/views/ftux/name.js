import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  BackHandler,
} from "react-native";
import { Button, Input, Text } from "react-native-elements";


import Ionicons from "react-native-vector-icons/Ionicons";

Ionicons.loadFont();

class Name extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
    };
  }
  handlePress = () => {
    this.props.navigation.navigate("Title", {
      firstName: this.state.firstName.trim(),
      lastName: this.state.lastName.trim(),
    });
  };

  handleLegalPressTOS = () => {
    Linking.openURL(`https://www.pocketcfoapp.com/terms-of-use`);
    // this.props.navigation.navigate("Legal")
  };
  handleLegalPressPP = () => {
    Linking.openURL(`https://www.pocketcfoapp.com/privacy-policy`);
    // this.props.navigation.navigate("Legal")
  };

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
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("ValueProp")}
        >
          <Ionicons
            size={30}
            name="md-close"
            style={{ alignSelf: "flex-start", marginLeft: 25, marginTop: 5 }}
          />
        </TouchableOpacity>
        <Text style={{ alignSelf: "center", marginTop: "10%" }} h4>
          What's your name?
        </Text>
        <Input
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholder={"First name"}
          value={this.state.firstName}
          onChangeText={(text) => this.setState({ firstName: text })}
        />
        <Input
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholder={"Last name"}
          value={this.state.lastName}
          onChangeText={(text) => this.setState({ lastName: text })}
        />
        <View
          style={{ marginTop: 50, alignItems: "center", marginBottom: "3%" }}
        >
          <Text style={styles.text}>By continuing, you accept our</Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={(styles.text, { color: "#007AFF" })}
              onPress={this.handleLegalPressTOS}
            >
              Terms of Service
            </Text>
            <Text style={styles.text}> and </Text>
            <Text
              style={(styles.text, { color: "#007AFF" })}
              onPress={this.handleLegalPressPP}
            >
              Privacy Policy
            </Text>
          </View>
        </View>
        <Button
          disabled={
            !this.state.firstName.trim().length ||
            !this.state.lastName.trim().length
          }
          buttonStyle={styles.button}
          disabledStyle={{ backgroundColor: "#7FBDFF" }}
          containerStyle={styles.buttonContainer}
          title="Continue"
          onPress={this.handlePress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height: 48,
    backgroundColor: "#007AFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    marginVertical: "50%",
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 10,
    width: "75%",
    alignSelf: "center",
  },
  inputContainer: {
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    marginVertical: "2%",
    width: "75%",
  },
  input: {
    marginVertical: "5%",
    textAlign: "center",
  },
  text: {
    fontFamily: "System",
    fontSize: 12,
  },
});

export default Name;
