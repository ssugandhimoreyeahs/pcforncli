import React, { Component, Fragment } from "react";
import { Text, View } from "react-native";

import { CashOnHand, ChangeInCash } from "@components";
const NoPlaidView = () => {
  return (
    <View style={{ marginTop: 20 }}>
      <CashOnHand />
      <ChangeInCash />

      <View style={{ height: 20 }} />
    </View>
  );
};
export default NoPlaidView;
