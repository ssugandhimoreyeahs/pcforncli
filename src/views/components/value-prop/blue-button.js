import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

class Button extends React.Component {
  render() {
    const { label, onPress } = this.props;
    return (
      <View style={styles.buttonview1}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#070640",
    marginBottom: 12,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#070640"
  },
  text: {
    color: "#FFFFFF",
    textAlign: "center",
    height: 30,
    fontSize: 15,
    fontFamily:'System',
  },
  buttonview1:{
    width:'65%',
    height:20,
    marginTop:'10%',
    alignSelf:'center'
 }
});

export default Button;
