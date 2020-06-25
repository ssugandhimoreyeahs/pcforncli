import React, { Component } from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { VictoryPie } from "victory-native";
import { Svg, Text, LinearGradient, Defs, Stop } from "react-native-svg";
import { connect } from "react-redux";

import {
  getHealthScoreColor,
  getHealthScoreCategory,
} from "../../../utilities/gradient";
import { ActivityIndicator } from "react-native-paper";

class HealthScore extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let bankIntegrationStatus = false;
    const { userData } = this.props;
    if (userData.isFetched == true) {
      bankIntegrationStatus = userData.userData.bankIntegrationStatus;
    }
    console.log("Finalization Testing here - ", bankIntegrationStatus);
    const { isFetched, healthScoreData, loading } = this.props.healthScoreRedux;
    let healthScoreDataOutput = 0;
    if (isFetched && bankIntegrationStatus == true) {
      healthScoreDataOutput = healthScoreData.HealthScore;
    }
    const healthScore = healthScoreDataOutput;
    const healthScorecategory = getHealthScoreCategory(healthScore);
    const gaugeColor = getHealthScoreColor(healthScore);
    return (
      <View
        style={{
          backgroundColor: "#090643",
          alignContent: "center",
          height: 350,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            height: 30,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Contact", {
                reloadPlaid: () => {
                  this.props.reloadPlaid();
                },
                reloadQuickbooks: () => {
                  this.props.reloadQuickbooks();
                },
              })
            }
          >
            <View
              style={{
                height: 44,
                width: 50,
                alignItems: "center",
                marginLeft: 1,
              }}
            >
              <Image
                source={require("../../../assets/icon_profile.png")}
                style={{ height: 20, width: 20 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Checking", {
                userCurrentBalance: this.props.userCurrentBalance,
                reloadPlaid: () => {
                  this.props.reloadPlaid();
                },
              })
            }
          >
            <View
              style={{
                height: 44,
                width: 50,
                alignItems: "center",
                marginRight: 1,
              }}
            >
              <Image
                source={require("../../../assets/icon_book.png")}
                style={{ resizeMode: "contain", height: 20, width: 20 }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "#090643",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {loading == false ? (
            <Svg
              width={375}
              height={300}
              style={{ marginTop: -40, marginRight: 20 }}
            >
              <Text
                x={200}
                y={135}
                fontSize={12}
                textAnchor={"middle"}
                fill={"#FFF"}
              >
                Cash Flow
              </Text>
              <Text
                x={200}
                y={150}
                fontSize={12}
                textAnchor={"middle"}
                fill={"#FFF"}
              >
                Health Score
              </Text>
              <Text
                x={200}
                y={200}
                fontSize={34}
                fontWeight={"bold"}
                textAnchor={"middle"}
                fill={"#FFF"}
              >
                {`${healthScore}`}
              </Text>
              <Text
                x={200}
                y={250}
                fontSize={24}
                fontWeight={"bold"}
                textAnchor={"middle"}
                fill={"#FFF"}
              >
                {`${healthScorecategory}`}
              </Text>
              <Text
                x={80}
                y={290}
                fontSize={11}
                textAnchor={"middle"}
                fill={"#FFF"}
              >
                DANGER
              </Text>
              <Text
                x={320}
                y={290}
                fontSize={11}
                textAnchor={"middle"}
                fill={"#FFF"}
              >
                EXCELLENT
              </Text>
              <VictoryPie
                startAngle={240}
                endAngle={480}
                padAngle={0}
                // used to hide labels
                labels={() => null}
                innerRadius={120}
                width={400}
                height={400}
                data={[
                  { key: "", y: healthScore },
                  { key: "", y: 100 - healthScore },
                ]}
                colorScale={[gaugeColor, "#EEEEEE"]}
              />
            </Svg>
          ) : (
            <ActivityIndicator
              color="#fff"
              size="large"
              style={{ marginTop: 110 }}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    healthScoreRedux: state.healthScoreReducer,
    userData: state.userData,
  };
};
export default connect(
  mapStateToProps,
  null
)(HealthScore);
