import React, { Fragment } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";

const InsightButton = ({ title, type, onPress }) => {
  return (
    <Button
      title={title}
      type={type}
      buttonStyle={styles.buttonStyle}
      titleStyle={styles.titleStyle}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 6,
    backgroundColor: "#85B1FF",
  },
  titleStyle: {
    fontSize: 11,
    color: "#FFFFFF",
  },
});

InsightButton.defaultProps = {
  title: "View Insights",
  type: "solid",
  onPress: () => {},
};
InsightButton.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default React.memo(InsightButton);
