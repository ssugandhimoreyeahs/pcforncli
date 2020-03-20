import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

class Button extends React.Component {
  render() {
    const { label, onPress } = this.props;
    return (
      <View style={styles.button_view}>
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
    justifyContent:'center',
    backgroundColor: "white",
    color: "black",
    marginTop:15,
    paddingVertical:18,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.7)"
  },
  text: {
    color: "black",
    textAlign: "center",
    height: 21,
    fontSize: 15,
    fontFamily:'System',

  },
button_view:{
   width:'70%',
   height:48,
   alignSelf:'center'
}

});

export default Button;
