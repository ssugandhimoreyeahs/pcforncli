import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import TimeLineDropdown from "../TimelineDropdown";
import InsightButton from "../InsightButton";
import PropTypes from "prop-types";


const CartFooter = ({
  disabled,
  data,
  value,
  onChangeText,
  viewInsightOnPress,
}) => {
  return (
    <View style={styles.cartFooter}>
      <TimeLineDropdown
        disabled={disabled}
        data={data}
        value={value}
        onChangeText={onChangeText}
      />
      <View style={styles.insightButtonWidth}>
        <InsightButton onPress={viewInsightOnPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartFooter: {
    borderColor: "green",
    borderWidth: 0,
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insightButtonWidth: {
    width: "38%",
  },
});
CartFooter.defaultProps = {
  disabled: true,
};

export default React.memo(CartFooter);
