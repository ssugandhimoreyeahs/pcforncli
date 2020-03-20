import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image,BackHandler,Alert } from "react-native";


export default class Menu extends Component {
  constructor(props) {
    super(props);
    
  }

  render() {
    const currentRoute = this.props.navigation.state.routeName;
    return (
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Dashboard")}
        >
          <View style={{ opacity: currentRoute === "Dashboard" ? 1 : 0.25 ,alignItems:'center'}}>
            <Image
              source={require('../assets/icon_dashboard.png')}
              height={20}
              width={20}
            />
            <Text style={styles.text}>Dashboard</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Forecasting")}
        >
          <View style={{ opacity: currentRoute === "Forecasting" ? 1 : 0.25 ,alignItems:'center'}}>
          <Image
              source={require('../assets/icon_forecast.png')}
              height={20}
              width={20}
            />
            <Text style={styles.text}>Forecast</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Feedback")}
        >
          <View style={{ opacity: currentRoute === "Feedback" ? 1 : 0.25 ,alignItems:'center'}}>
            <Image
              source={require('../assets/icon_feedback.png')}
              height={21}
              width={29}
            />
            <Text style={styles.text}>Feedback</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: 10,
    borderTopWidth: 1,
    height:50,
    backgroundColor:'#fff',
    borderTopColor: "rgba(0,0,0,0.25)"
  },
  dashboard: {
    flexDirection: "column",
    alignItems: "center",
    color: "#090641",
    letterSpacing: 0.12,
    lineHeight: 12
  },
  text: {
    color: "#090641",
    fontSize:10,
    fontFamily:'System',
    fontWeight:'normal'
  },
  icon: {
    height: 50,
    width: 50
  }
});
