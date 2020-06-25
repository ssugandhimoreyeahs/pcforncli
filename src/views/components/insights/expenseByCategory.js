import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Root } from "@components";
import { connect } from "react-redux";
import { EXPENSE_INSIGHTS_DATA } from "@constants";

Feather.loadFont();
AntDesign.loadFont();
class ExpenseByCategoryInsights extends PureComponent {
  constructor(props) {
    super(props);
  }
  readyExpenseInsights = () => {
    const { insightsData } = this.props.insightStore;
    let { Expense = null } = insightsData; 
    if (Expense != null) {
      if (Expense.type === 30) {
        return EXPENSE_INSIGHTS_DATA.EXPENSE30;
      } else if (Expense.type === 10) {
        return EXPENSE_INSIGHTS_DATA.EXPENSE10;
      }
    } else {
      return null;
    }
  };
  renderBlock = ({ blockNo, blockText, marginTop, index }) => {
    return (
      <View
        style={{
          ...styles.renderBlockContainer,
          marginTop: marginTop == true ? 25 : 14,
        }}
      >
        <View style={styles.childRenderBlockContainer}>
          <Text style={styles.blockTextNo}>{blockNo}</Text>
        </View>
        <View style={styles.blockTextStyle}>
          <Text style={styles.insightTextStyle}>
            {`${blockText}  `}
            {index == 0 && (
              <Text
                onPress={() => {
                  this.props.navigation.navigate("NewExpenseByCategoryParent");
                }}
                style={styles.viewExpenseStyle}
              >
                View Expense
              </Text>
            )}
          </Text>
        </View>
      </View>
    );
  };
  render() {
    let insightsData = this.readyExpenseInsights();
    if(insightsData === null){
      return this.props.navigation.goBack();
    }
    return (
      <Root headerColor={"#F8F8F8"} footerColor={"#FFF"} barStyle={"dark"}>
        <ScrollView style={styles.container}>
          <View style={styles.childContainer}>
            <View style={styles.nestedChildContainer}>
              <View style={styles.backButton}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                >
                  <AntDesign name="left" size={25} color={"#000000"} />
                </TouchableOpacity>
              </View>
              <View style={styles.titleHeaderText}>
                <Text style={styles.titleHeaderTextStyle}>
                  {"Expense Insights"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{...styles.bannerContantStyle,backgroundColor: insightsData.color}}>
            <Text style={styles.bannerTextContentStyle}>
              {`${insightsData?.insightText}`}
            </Text>
          </View>

          <View style={styles.bannerImproveContainer}>
            <View style={{ alignSelf: "flex-start" }}>
              <Text style={styles.improveBannerTextStyle}>
                {"How to improve"}
              </Text>
            </View>

            {insightsData.howToImprove.map((singleInsight, index) => {
              return (
                <this.renderBlock
                  index={index}
                  key={index}
                  marginTop={index == 0 ? true : false}
                  blockNo={singleInsight.id}
                  blockText={singleInsight.text}
                />
              );
            })}
          </View>
          <View style={styles.likeContainerStyle} />

          <View style={styles.likeNestedContainer}>
            <Text style={styles.likeInsightsText}>
              How do you like the insights?
            </Text>
            <View style={styles.likeInsightsButtonContainer}>
              <TouchableOpacity
                disabled={true}
                style={styles.likeInsightsTouchable}
              >
                <Feather name="thumbs-up" size={17} color="#1D1E1F" />
                <Text style={{ fontSize: 12, paddingLeft: 8 }}>useful</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={true}
                style={styles.likeInsightsTouchable}
              >
                <Feather
                  name="thumbs-down"
                  size={17}
                  color="#1D1E1F"
                  style={{
                    paddingTop: 6,
                    transform: [{ rotateX: "360deg" }, { rotateY: "180deg" }],
                  }}
                />
                <Text style={{ fontSize: 12, paddingLeft: 8 }}>not useful</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  renderBlockContainer: {
    borderRadius: 8,
    backgroundColor: "#E0EBFF",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 17,
  },
  childRenderBlockContainer: {
    marginTop: 3,
    borderRadius: 50,
    borderColor: "#185DFF",
    borderWidth: 2,
    height: 21,
    width: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  blockTextNo: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: 10,
    color: "#185DFF",
  },
  blockTextStyle: { width: "87%" },
  childContainer: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
  },
  nestedChildContainer: { flexDirection: "row", width: "100%" },
  backButton: {
    width: "10%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  titleHeaderText: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeaderTextStyle: { fontSize: 18, color: "#000", fontWeight: "600" },
  bannerContantStyle: {
    backgroundColor: "#FFE8DD",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextContentStyle: {
    width: "80%",
    textAlign: "left",
    color: "#1D1E1F",
    fontSize: 17,
    fontWeight: "bold",
  },
  bannerImproveContainer: { marginTop: 40, width: "90%", alignSelf: "center" },
  improveBannerTextStyle: {
    color: "#1D1E1F",
    fontSize: 17,
    fontWeight: "bold",
  },
  likeContainerStyle: { backgroundColor: "#EEEFF1", height: 15, marginTop: 40 },
  likeNestedContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  likeInsightsText: { fontSize: 13, color: "#1D1E1F" },
  likeInsightsButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  likeInsightsTouchable: {
    paddingHorizontal: 15,
    flexDirection: "row",
    backgroundColor: "#E0EBFF",
    height: 40,
    width: 114,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  insightTextStyle: { fontSize: 16, color: "#000", textAlign: "left" },
  viewExpenseStyle: {
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

const mapStateToProps = (state) => {
  return {
    insightStore: state.insightsRedux,
  };
};
export default connect(
  mapStateToProps,
  null
)(ExpenseByCategoryInsights);
