import * as React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

class FormTextInput extends React.Component {
  render() {
    const { style, secure, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={"#090641"}
        secureTextEntry={secure}
        style={[styles.textInput, style]}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: "silver",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20
  }
});

export default FormTextInput;
