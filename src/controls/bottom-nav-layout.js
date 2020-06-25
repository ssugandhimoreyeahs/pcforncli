import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  BackHandler,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Menu from "./menu";

class BottomNavLayout extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <ScrollView style={{ backgroundColor: "#f1f3f5" }}>
          {this.props.children}
        </ScrollView>
        <Menu navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#F8F9FA",
  },
});

export default BottomNavLayout;
