import React, { Fragment } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { VictoryChart, VictoryAxis } from "victory-native";

const width = Dimensions.get("window").width;

const CashOnHandChart = () => {
  return (
    <View style={{ left: -28, top: -30, borderWidth: 0, borderColor: "green" }}>
      <VictoryChart height={250} width={width - 15}>
        <VictoryAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: { fontSize: 10, fill: "#8E8E93" },
            grid: { stroke: "#EEE", strokeDasharray: "50,0" },
          }}
          offsetX={width - 22}
          dependentAxis={true}
          tickValues={[0, 100000, 200000, 300000, 400000]}
          tickFormat={(y) => {
            if (y >= 1000) {
              let returnValue = parseInt(y / 1000);
              return `$${returnValue}K`;
            } else if (y >= 1000000) {
              let returnValue = parseInt(y / 1000000);
              return `$${returnValue}M`;
            } else {
              return `$${y}`;
            }
          }}
        />
        <VictoryAxis
          tickValues={[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]}
          style={{
            axis: { stroke: "none" },
            tickLabels: {
              fill: "#8E8E93",
              angle: 0,
              strokeWidth: 2.0,
              fontSize: 10,
            },
            // grid: {
            //   stroke: (currentvalue) => (currentvalue == "May" ? "grey" : null),
            //   strokeDasharray: [1, 3],
            //   strokeWidth: 1.0,
            // },
          }}
        />
        {/* <VictoryLine
          style={{
            data: { stroke: "url(#gradient)", strokeWidth: 5 },
          }}
          data={applyGraph}
        /> */}
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(CashOnHandChart);
