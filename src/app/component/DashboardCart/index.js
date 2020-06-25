import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";
import CartHeader from "./Header";
import CartFooter from "./Footer";

Ionicons.loadFont();
 
const DashboardCart = ({ children, heading, amount, status, height }) => {
  return (
    <View style={styles.rootCart}>
      <View style={{ height, borderWidth: 0, borderColor: "red" }}>
        <CartHeader heading={heading} amount={amount} status={status} />
        {children}
      </View>
      <View style={styles.footerView}>
        <CartFooter />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootCart: {
    height: 340,
    width: "90%",
    alignSelf: "center",
    marginVertical: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    elevation: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    paddingVertical: 20,
    borderColor: "red",
    borderWidth: 0,
  },
  footerView: {
    height: "15%",
    borderWidth: 0,
    borderColor: "orange",
    justifyContent: "flex-end",
  },
});

DashboardCart.defaultProps = {
  heading: "",
  amount: "",
  status: "",
  height: "85%",
};
DashboardCart.propTypes = {
  heading: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  heightRatio: PropTypes.string.isRequired,
};
export default React.memo(DashboardCart);
