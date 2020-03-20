import React, { Component } from "react";
import { StyleSheet, View, TouchableHighlight, Text } from "react-native";

export default class SelectableTag extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={this.props.selected ? styles.selected : styles.unselected}
          onPress={() =>
            this.props.onPress && this.props.onPress(!this.props.selected)
          }
        >
          <Text
            style={this.props.selected ? { color: "#FFF" } : { color: "#000" }}
          >
            {this.props.text}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 0,
    marginRight: 10,
    marginLeft: 10,
    flex: 1
  },
  unselected: {
    borderRadius: 30,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center"
  },
  selected: {
    borderRadius: 30,
    borderWidth: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    backgroundColor: "#007AFF"
  }
});
