import React, { Fragment, memo } from "react";
import { Tabs, Tab } from "native-base";
import styles from "./indexCss";

const CustomTabs = (props) => {
  const { items, onChangeTab, locked = false } = props;
  return (
    <Tabs
      locked={locked}
      onChangeTab={onChangeTab}
      tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
      tabContainerStyle={styles.tabContainerStyle}
    >
      {items.map((singleTab, index) => {
        return (
          <Tab
            key={index}
            tabStyle={styles.tabStyle}
            textStyle={styles.textStyle}
            activeTextStyle={styles.activeTextStyle}
            activeTabStyle={styles.activeTabStyle}
            heading={singleTab.heading}
          >
            <singleTab.component />
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default CustomTabs;
