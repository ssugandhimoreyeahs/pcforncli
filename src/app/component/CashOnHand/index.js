import React, { Fragment, Component } from "react";
import { Text, View } from "react-native";

import CashOnHandCart from "../DashboardCart";
import { CashOnHandChart } from "@charts";

class CashOnHand extends Component {
  render() {
    return (
      <CashOnHandCart heading={"Cash On Hand"} amount={"$-"}>
        <View style={{ flex: 1, borderWidth: 0, borderColor: "blue" }}>
          <CashOnHandChart />
        </View>
      </CashOnHandCart>
    );
  }
}

export default React.memo(CashOnHand);
