import React, { Fragment, memo } from "react";
import { View, StyleSheet } from "react-native";

const Seprator = (props) => {
  const { style } = props;
  return <View style={[styles.seprator, style]} />;
};

const styles = StyleSheet.create({
  seprator: {
    borderBottomColor: "#1D1E1F",
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.2,
    width: "100%",
    alignSelf: "center",
    marginVertical: 20,
  },
});
export default memo(Seprator);
