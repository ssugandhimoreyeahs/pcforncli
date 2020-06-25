import React, { Fragment, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import PropTypes from "prop-types";

import { Button_Months } from "appconstants/constants";
import styles from "./indexCss";
SimpleLineIcons.loadFont();

const TimeLineDropdown = ({ disabled, data, value, onChangeText }) => {
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const dropDownRef = React.useRef();
  const handleArrowStyle = () => {
    setDropDownStatus((prevState) => !prevState);
  };
  return (
    <TouchableOpacity
      style={styles.rootWraper}
      onPress={() => {
        dropDownRef.current.focus();
      }}
    >
      <Dropdown
        ref={dropDownRef}
        disabled={disabled}
        data={data}
        onChangeText={onChangeText}
        value={value}
        containerStyle={styles.dropDownConatinerStyle}
        renderAccessory={() => null}
        pickerStyle={{ backgroundColor: "#E6E6EC", borderRadius: 10 }}
        onBlur={() => {
          handleArrowStyle();
          Keyboard.dismiss();
        }}
        onFocus={() => {
          handleArrowStyle();
          Keyboard.dismiss();
        }}
        fontSize={11}
        inputContainerStyle={styles.dropDownInputContainerStyle}
        dropdownPosition={4.5}
      />
      <SimpleLineIcons
        name={dropDownStatus ? "arrow-up" : "arrow-down"}
        color="#030538"
      />
    </TouchableOpacity>
  );
};

TimeLineDropdown.defaultProps = {
  disabled: false,
  data: Button_Months,
  value: Button_Months[3].value,
  onChangeText: () => {},
};
TimeLineDropdown.propTypes = {
  disabled: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};

export default TimeLineDropdown;
