import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DetectPlatform from "../../DetectPlatform";
import { loggedOutUser } from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";

AntDesign.loadFont();
MaterialCommunityIcons.loadFont();
class SomethingWrong extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
  }
  handleLogoutButton = async () => {
    this.setState({ spinner: true });
    const confirmLogout = await loggedOutUser();
    if (confirmLogout) {
      this.setState(
        (prevState) => {
          return { spinner: !prevState.spinner };
        },
        () => {
          this.props.navigation.navigate("ValueProp");
        }
      );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Spinner visible={this.state.spinner} />
        <Image
          style={{ width: 133, height: 156, marginTop: "55%" }}
          source={require("../../assets/errorillustration.png")}
          resizeMode="contain"
        />
        <Text style={styles.text}>Oops:(</Text>
        <Text style={styles.textSecond}>Something went wrong.</Text>
        <TouchableOpacity
          onPress={() => {
            this.props.handleButton();
          }}
          style={styles.buttonStyle}
        >
          <MaterialCommunityIcons name="reload" size={20} color="white" />
          <Text style={{ fontSize: 15, color: "#FFF", marginLeft: 5 }}>
            Retry
          </Text>
        </TouchableOpacity>
        {this.props.showLoggedOutButton == true && (
          <TouchableOpacity
            onPress={() => {
              this.handleLogoutButton();
            }}
            style={styles.buttonStyle}
          >
            <AntDesign name="logout" size={15} color="white" />
            <Text style={{ fontSize: 15, color: "#FFF", marginLeft: 5 }}>
              Logout
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    fontSize: 25,
    marginTop: 20,
    marginBottom: 12,
  },
  textSecond: {
    fontSize: 17,
    fontFamily: "System",
    fontWeight: "normal",
    marginTop: 7,
    marginBottom: 15,
  },
  buttonStyle: {
    width: 115,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default SomethingWrong;
