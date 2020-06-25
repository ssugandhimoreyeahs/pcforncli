import React, { PureComponent, Fragment } from "react";
import {
  View,
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
import { StackActions, NavigationActions } from "react-navigation";
import { loggedOutUser } from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";
import RNStart from "react-native-restart";
AntDesign.loadFont();
MaterialCommunityIcons.loadFont();

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "ValueProp" })],
});
class SomethingWrong extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
  }
  restartApplication = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          RNStart.Restart();
        }}
        style={styles.buttonStyle}
      >
        <MaterialCommunityIcons name="reload" size={20} color="white" />
        <Text style={{ fontSize: 15, color: "#FFF", marginLeft: 5 }}>
          Restart Application
        </Text>
      </TouchableOpacity>
    );
  };
  renderContent = () => {
    return (
      <Fragment>
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
      </Fragment>
    );
  };
  handleLogoutButton = async () => {
    this.setState({ spinner: true });
    const confirmLogout = await loggedOutUser();
    if (confirmLogout) {
      this.setState(
        (prevState) => {
          return { spinner: !prevState.spinner };
        },
        () => {
          this.props.navigation.dispatch(resetAction);
        }
      );
    }
  };
  render() {
    const { errorBoundary = false } = this.props;
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
        {!errorBoundary ? <this.renderContent /> : <this.restartApplication />}
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
    borderRadius: 50,
    backgroundColor: "#007AFF",
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
});

export default SomethingWrong;
