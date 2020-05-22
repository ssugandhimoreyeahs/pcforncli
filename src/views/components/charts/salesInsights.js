import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

class SalesInsights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUsefulTouched: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", () =>
      this.handleBackButton(this.props.navigation)
    );
  }

  handleBackButton = (nav) => {
    if (!nav.isFocused()) {
      BackHandler.removeEventListener("hardwareBackPress", () =>
        this.handleBackButton(this.props.navigation)
      );
      return false;
    } else {
      nav.goBack();
      return true;
    }
  };

  useFulComponent = () => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          height: 100,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            width: 166,
            height: 16,
            marginTop: 20,
            alignSelf: "center",
            fontSize: 12,
          }}
        >
          How do you like the insights?
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
            marginLeft: 60,
            marginRight: 60,
            height: 80,
          }}
        >
          <TouchableOpacity
            style={styles.Buttondesign}
            activeOpacity={0.5}
            onPress={() => {
              this.setState({ isUsefulTouched: true });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignSelf: "center",
                marginTop: 12,
              }}
            >
              <Feather name="thumbs-up" size={15} color="#1D1E1F" />
              <Text style={styles.buttontxt}>useful</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Buttondesign}
            activeOpacity={0.5}
            onPress={() => {
              this.setState({ isUsefulTouched: true });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignSelf: "center",
                marginTop: 12,
                marginLeft: 10,
              }}
            >
              <Feather name="thumbs-down" size={14} color="#1D1E1F" />
              <Text style={styles.buttontxt}>not useful</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  feedbackComponent = () => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#FFFFFF",
          marginBottom: 10,
          height: 100,
        }}
      >
        <Text
          style={{
            width: 166,
            height: 16,
            alignSelf: "center",
            marginTop: 20,
            fontSize: 12,
          }}
        >
          How do you like the insights?
        </Text>

        <TouchableOpacity style={styles.Buttondesign1}>
          <View style={styles.circView1}>
            <View style={styles.checkview}>
              <AntDesign
                name="check"
                size={15}
                color="#1D1E1F"
                style={styles.checkIconView}
              />
            </View>
            <Text style={styles.buttontxt1}>Thanks for the feedback!</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <ScrollView style={styles.margins}>
        <View
          style={{
            flexDirection: "row",
            width: "66%",
            height: 45,
            marginTop: "3%",
            alignSelf: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <AntDesign
              size={25}
              name="left"
              style={{ alignSelf: "flex-start", marginLeft: 10 }}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Sales Insights</Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 131,
            flexDirection: "column",
            backgroundColor: "#FFE8DD",
            alignItems: "center",
          }}
        >
          <View style={{ marginTop: 42 }}>
            <Text style={styles.text1}>Your cash balance has decreased</Text>
            <Text style={styles.text1}>more than 50% from last month.</Text>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            height: 550,
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text style={styles.text3}>How to improve</Text>
          <View style={styles.viewdes}>
            <View style={styles.circView}>
              <Text style={styles.imgtxt}>1</Text>
            </View>
            <Text style={styles.viewtxt}>
              Actionable insight copy - Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
          </View>

          <View style={styles.viewdes}>
            <View style={styles.circView}>
              <Text style={styles.imgtxt}>2</Text>
            </View>
            <Text style={styles.viewtxt}>
              Actionable insight copy - Lorem ipsum dolor sit amet, consectetur
              adipiscing elit,sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
          </View>

          <View style={styles.viewdes}>
            <View style={styles.circView}>
              <Text style={styles.imgtxt}>3</Text>
            </View>
            <Text style={styles.viewtxt}>
              Actionable insight copy - Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
          </View>
        </View>
        {this.state.isUsefulTouched
          ? this.feedbackComponent()
          : this.useFulComponent()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  text1: {
    color: "#1D1E1F",
    fontSize: 17,
    fontWeight: "bold",
  },
  text2: {
    color: "#1D1E1F",
    fontSize: 17,
    fontWeight: "bold",
  },
  text3: {
    color: "#1D1E1F",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 36,
    marginLeft: 24,
  },

  buttontxt: {
    color: "#07053E",
    textAlign: "center",
    marginLeft: 10,
    fontSize: 12,
  },
  Buttondesign: {
    width: 114,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0EBFF",
  },
  Buttondesign1: {
    width: "75%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5FCEA",
    marginTop: 24,
    alignSelf: "center",
  },
  buttontxt1: {
    color: "#1D1E1F",
    textAlign: "center",
    marginLeft: 10,
  },
  img: {
    width: 43,
    height: 43,
    backgroundColor: "#FFF1EA",
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imgtxt: {
    color: "#185DFF",
    textAlign: "center",
  },

  viewdes: {
    width: "90%",
    flexDirection: "row",
    backgroundColor: "#E0EBFF",
    marginTop: 12,
    height: 129,
    alignSelf: "center",
    borderRadius: 6,
  },
  circView: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 14,
    borderColor: "#0256FF",
    borderWidth: 2,
    marginTop: 14,
    alignContent: "center",
  },
  viewtxt: {
    width: 271,
    height: 101,
    marginLeft: 12,
    marginTop: 14,
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
  },
  circView1: {
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    marginTop: 12,
    marginLeft: 10,
  },
  checkview: {
    width: 20,
    height: 20,
    backgroundColor: "#7EF295",
    borderRadius: 10,
  },
  checkIconView: {
    padding: 3,
  },
});

export default SalesInsights;
