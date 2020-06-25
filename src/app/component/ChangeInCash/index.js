import React, { Fragment, Component } from "react";
import { Text, View } from "react-native";

import ChangeInCashCart from "../DashboardCart";
import { CashOnHandChart } from "@charts";

class ChangeInCash extends Component {
  render() {
    return (
      <ChangeInCashCart heading={"Change In Cash"} amount={"$-"}>
        <View style={{ flex: 1, borderWidth: 0, borderColor: "blue" }}>
          <CashOnHandChart />
        </View>
      </ChangeInCashCart>
    );
  }
}

export default React.memo(ChangeInCash);
