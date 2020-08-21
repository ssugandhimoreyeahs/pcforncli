import React, { Fragment,memo } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import {Button} from 'native-base';

import styles from "./indexCss";
const TransactionTile = (props) => {
  const {
    transactionTitle,
    transactionAmount,
    transactionDate,
    transactionBtn,
  } = props;
  const {
      backgroundColor
  } = transactionBtn;
  let borderColor = backgroundColor == "#FFF" ? "#000" : backgroundColor;
  return (
    <Fragment>
      <View style={styles.upperContainer}>
        <Text style={styles.transactionTileText}>{transactionTitle}</Text>
        <Text style={styles.transactionAmountText}>{transactionAmount}</Text>
      </View>
      <View style={styles.lowerContainer}>
        <Text style={styles.transactionDateText}>{transactionDate}</Text>
        <Button rounded style={[styles.transactionBtn,{ backgroundColor,borderColor  }]}>
            <Text style={styles.transactionBtnText}>{transactionBtn.text}</Text>
        </Button>
      </View>
    </Fragment>
  );
};
TransactionTile.defaultProps = {
  transactionTitle: "Transaction Title",
  transactionAmount: "$2,700.00",
  transactionDate: "Aug 14, 2020",
  transactionBtn: {
    text: "+ Category",
    backgroundColor: "#FFF",
  },
};
TransactionTile.propTypes = {
  transactionTitle: PropTypes.string.isRequired,
  transactionAmount: PropTypes.string.isRequired,
  transactionDate: PropTypes.string.isRequired,
  transactionBtn: PropTypes.object.isRequired,
};
export default memo(TransactionTile);
