import React, { Fragment, memo } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";

import styles from "./indexCss";
const AccountBalance = (props) => {
  const { heading, balance, time } = props;
  return (
    <View style={styles.acContainer}>
      <Text style={[styles.headingTextStyle, styles.commonTextStyle]}>
        {heading}
      </Text>
      <Text style={[styles.commonTextStyle, styles.balanceTextStyle]}>
        {balance}
      </Text>
      <Text style={[styles.timeTextStyle, styles.commonTextStyle]}>{time}</Text>
    </View>
  );
};

AccountBalance.propTypes = {
  heading: PropTypes.string,
  balance: PropTypes.string,
  time: PropTypes.string,
};

AccountBalance.defaultProps = {
  heading: "ACCOUNT BALANCE",
  balance: "$210,829.23",
  time: "27 minutes ago",
};
export default memo(AccountBalance);
