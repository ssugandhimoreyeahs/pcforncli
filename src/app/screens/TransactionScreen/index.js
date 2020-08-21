import React, { Fragment, Component } from "react";
import { Text, View, ScrollView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Button } from "native-base";

import { Root, TransactionTile, Seprator } from "@components";
import styles from "./indexCss";

import { AccountBalance, AccountType } from "@components";

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
  }
  transactionHeader = () => {
    return (
      <View style={styles.transactionHeaderContainer}>
        <View style={styles.transactionHeaderChildContainer}>
          <AccountBalance />
          <AccountType />
        </View>
      </View>
    );
  };
  renderTransactions = () => {
    return (
      <View style={styles.transactionTileContainer}>
        <TransactionTile />
        <Seprator />
        <TransactionTile />
        <Seprator />
        <TransactionTile />
        <Seprator />
        <TransactionTile />
        <Seprator />
        <TransactionTile />
        <Seprator />
        <TransactionTile />
        <Seprator />
        <TransactionTile />
        <Seprator />
        <TransactionTile />
      </View>
    );
  };
  transactionFilterPlate = () => {
    return (
      <View style={styles.transactionFilterContainer}>
        <View style={styles.transactionFilterChildContainer1}>
          <View style={styles.activeTabViewFilter}>
            <Text
              style={[
                styles.transactionFilterPlateText,
                styles.transactionFilterActivePlateText,
              ]}
            >
              All
            </Text>
          </View>
          <View style={styles.inactiveTabViewFilter}>
            <Text style={styles.transactionFilterPlateText}>Outflow</Text>
          </View>
          <View style={styles.inactiveTabViewFilter}>
            <Text style={styles.transactionFilterPlateText}>Inflow</Text>
          </View>
          <View style={styles.inactiveTabViewFilter}>
            <Text style={styles.transactionFilterPlateText}>Transfer</Text>
          </View>
        </View>
        <View>
          <Button rounded style={styles.filterButtonStyle}>
            <Text style={styles.filterBtnTextStyle}>Filters</Text>
          </Button>
        </View>
      </View>
    );
  };
  render() {
    const { spinner } = this.state;
    return (
      <Root headerColor={"#090643"} footerColor={"#FFF"} barStyle={"light"}>
        <Spinner visible={spinner} textStyle={styles.spinnerTextStyle} />
        <View style={styles.container}>
          <this.transactionHeader />
          <this.transactionFilterPlate />
          <ScrollView>
            <this.renderTransactions />
          </ScrollView>
        </View>
      </Root>
    );
  }
}

export default TransactionScreen;
