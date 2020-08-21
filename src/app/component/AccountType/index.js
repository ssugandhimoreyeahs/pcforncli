import React, { Fragment, memo } from "react";
import { Text, View } from "react-native";
import PropTypes from "prop-types";
import { Button } from "native-base";
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from "./indexCss"; 

AntDesign.loadFont();

const AccountType = (props) => {
  const { types } = props;
  return (
    <View>
      <Button rounded style={styles.selectButtonStyle}>
        <Text style={styles.typeTextStyle}>{types[0].value}</Text> 
        <AntDesign name={"caretdown"} />
      </Button>
    </View>
  );
};

AccountType.defaultProps = {
  types: [{ value: "Checking (...2392)" }],
};
AccountType.propTypes = {
  types: PropTypes.array,
};
export default memo(AccountType);
