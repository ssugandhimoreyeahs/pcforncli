import React, { Fragment } from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import Ionicons from "react-native-vector-icons/Ionicons";

Ionicons.loadFont();
const DashboardCartHeader = ({ heading, amount, status }) => {
  return (
    <View style={[styles.cartHeader]}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.cartHeadingText}>{`${heading}`}</Text>
        <Ionicons
          name="md-information-circle-outline"
          style={styles.infoIcon}
        />
      </View>
      <View>
        <Text style={styles.amountText}>{`${amount}`}</Text>
        <Text style={styles.statusText}>{`${status}`}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cartHeader: {
    borderColor: "green",
    borderWidth: 0,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartHeadingText: {
    marginTop:3,
    fontSize: 13,
    color: "#1D1E1F",
  },
  infoIcon: {
    height: 12,
    width: 12,
    marginLeft: 3,
    marginTop: 1.5+3,
  },
  amountText: {
    fontSize: 22,
    color: "#1D1E1F",
  },
  statusText: {
    marginTop: 6,
    textAlign: "right",
    fontSize: 12,
    color: "#1D1E1F",
  },
});
DashboardCartHeader.defaultProps = {
  heading: "",
  amount: "",
  status: "",
};
DashboardCartHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
export default React.memo(DashboardCartHeader);
