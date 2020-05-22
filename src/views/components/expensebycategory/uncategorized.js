import React, { Component, Fragment } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ALL_MONTHS } from "../../../constants/constants";

import {
  VictoryBar,
  VictoryAxis,
  VictoryChart,
  VictoryTheme,
} from "victory-native";
FontAwesome.loadFont();
AntDesign.loadFont();

const deviceWidth = Dimensions.get("window").width;
class UncategorizedCategory extends Component {
  constructor(props) {
    super(props);
  }
  header = () => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", width: "100%", marginTop: 20 }}>
          <View
            style={{
              width: "10%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <AntDesign name="left" size={22} color={"#000000"} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 17, color: "#000", fontWeight: "600" }}>
              {`Uncategorized`}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  seprator = () => {
    return <View style={styles.seprator} />;
  };
  renderBarChart = () => {
    const fillLight = "#FABFC3";
    const fill = "#EA717A";
    const data = [-10, -20, -30, -40, -50, -60];
    return (
      <View style={{ width: "100%" }}>
        <VictoryChart
          width={deviceWidth - 5}
          height={270}
          domainPadding={10}
          style={{
            parent: { marginLeft: -20 },
          }}
        >
          <VictoryAxis
            tickValues={["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]}
            offsetY={255}
            style={{
              axis: { stroke: "#ffffff" },
              tickLabels: { fontSize: 12, fill: "#8E8E93" },
            }}
          />
          <VictoryAxis
            dependentAxis
            offsetX={deviceWidth + 2}
            style={{
              grid: { stroke: "#EEE", strokeDasharray: "50,0" },
              axis: { stroke: "#ffffff" },
              tickLabels: { fontSize: 12, fill: "#8E8E93" },
            }}
            tickValues={[-0, -1, -2, -3, -4]}
            tickFormat={(value) => {
              return `-$${-value}K`;
            }}
          />
          <VictoryBar
            style={{
              data: {
                fill: (data) => {
                  if (data._x == 7) {
                    return fill;
                  } else {
                    return fillLight;
                  }
                },
              },
            }}
            data={[
              { y: -0 },
              { y: -1 },
              { y: -1.4 },
              { y: -1.5 },
              { y: -2.2 },
              { y: -2.15 },
              { y: -2.5 },
              { y: -3 },
            ]}
          />
        </VictoryChart>
      </View>
    );
  };
  bodyChart = () => {
    return (
      <Fragment>
        <View
          style={{
            height: 380,
            backgroundColor: "#FFF",
            borderWidth: 0,
            borderColor: "red",
          }}
        >
          <View style={{ alignSelf: "center", marginTop: 30 }}>
            <Text
              style={{ color: "#1D1E1F", fontSize: 22, fontWeight: "bold" }}
            >
              -$3,000.00
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <this.renderBarChart />
          </View>
        </View>
      </Fragment>
    );
  };

  renderUncategorizedTransaction = () => {
    return (
      <View
        style={{
          backgroundColor: "#FFF",
          width: "90%",
          alignSelf: "center",
          borderWidth: 0,
          borderColor: "red",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#1D1E1F", fontSize: 15 }}>
            Transaction Title
          </Text>
          <Text style={{ color: "#1D1E1F", fontSize: 15 }}>-$700.00</Text>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 3,
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#1D1E1F", fontSize: 11, opacity: 0.5 }}>
              Mar 15
            </Text>
          </View>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "#1C1C1D",
              height: 25,
              width: 90,
            }}
          >
            <Text style={{ fontSize: 11, color: "#1D1E1F" }}>+ Category</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  bodyTransaction = () => {
    return (
      <Fragment>
        <View style={{ height: 25, backgroundColor: "#EEEFF1" }} />
        <View style={{ paddingVertical: 30, backgroundColor: "#FFF" }}>
          <this.renderUncategorizedTransaction />
          <this.seprator />
          <this.renderUncategorizedTransaction />
          <this.seprator />
          <this.renderUncategorizedTransaction />
        </View>
      </Fragment>
    );
  };
  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <this.header />
        <this.bodyChart />
        <this.bodyTransaction />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    width: "100%",
  },
  header: {
    elevation: 5,
    shadowColor: "#F0F0F0",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1.5,
    height: 70,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
  },
  seprator: {
    alignSelf: "center",
    marginVertical: 25,
    borderBottomColor: "#1D1E1F",
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  seprator2: {
    alignSelf: "center",
    marginVertical: 20,
    borderBottomColor: "#1D1E1F",
    width: "90%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.2,
  },
});
export default UncategorizedCategory;
