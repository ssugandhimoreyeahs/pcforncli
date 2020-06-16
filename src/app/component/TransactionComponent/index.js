import React, { Fragment, memo, useRef } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import styles from "./indexCss";
import PropTypes from "prop-types";
import { ALL_MONTHS } from "@constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  numberWithCommas,
  firstLetterCapital,
  PLAID_EXPENSE_CATEGORIES,
} from "@api";
import { Seprator } from "@components";

const computeTransaction = (singleTransaction, transactionType) => {
  let finalAmount = ``;
  let categoryButtonText = ``;
  let amount = Math.abs(singleTransaction.amount);
  let detailInfo = ``;
  let categoryBackgroundColor = `#FFF`;
  //add category button text
  if (
    singleTransaction.clientCategory == singleTransaction.clientDefaultCategory
  ) {
    categoryButtonText = `+ Category`;
    detailInfo = firstLetterCapital(singleTransaction.clientCategory);
  } else {
    detailInfo = `Detail Info`;
    categoryButtonText = `${firstLetterCapital(
      singleTransaction.clientCategory
    )}`;
  }

  if (transactionType == "INFLOW") {
    finalAmount = `$${numberWithCommas(amount)}`;
  } else if (transactionType == "OUTFLOW") {
    finalAmount = `-$${numberWithCommas(amount)}`;
  } else {
    if (singleTransaction.transactionType == "Debit") {
      finalAmount = `-$${numberWithCommas(amount)}`;
    } else {
      finalAmount = `$${numberWithCommas(amount)}`;
    }
  }

  if (categoryButtonText !== "+ Category") {
    for (let i = 0; i < PLAID_EXPENSE_CATEGORIES.length; i++) {
      if (
        singleTransaction.clientCategory.toLowerCase() ===
        PLAID_EXPENSE_CATEGORIES[i].categoryName.toLowerCase()
      ) {
        categoryBackgroundColor = PLAID_EXPENSE_CATEGORIES[i].categoryColor;
        break;
      }
    }
  }
  let touchableTextColor = "#FFF";
  let touchableBorder = categoryBackgroundColor;
  let touchableColor = categoryBackgroundColor;
  if (categoryButtonText === "+ Category") {
    touchableTextColor = "#000";
    touchableBorder = "#000";
    touchableColor = "#FFF";
  }
  return {
    transactionAmount: finalAmount,
    touchableText: categoryButtonText,
    detailInfoText: detailInfo,
    touchableColor,
    touchableBorder,
    touchableTextColor,
  };
};
const TransactionComponent = memo((props) => {
  let {
    transactionTitle,
    transactionAmount,
    detailInfoText,
    touchableText,
    touchableColor,
    touchableBorder,
    touchableOnPress,
    touchableTextColor,
  } = props;

  return (
    <Fragment>
      <View style={styles.parentTransactionComponent}>
        <View style={styles.childTransactionUpperContainer}>
          <Text style={styles.transactionTitleText}>{transactionTitle}</Text>
          <Text style={styles.amountTransactionText}>{transactionAmount}</Text>
        </View>

        <View style={styles.childTransactionLowerContainer}>
          <Text style={styles.detailsInfoText}>{detailInfoText}</Text>

          <TouchableOpacity
            style={{
              ...styles.touchableOpacityStyles,
              backgroundColor: touchableColor,
              borderColor: touchableBorder,
            }}
          >
            <Text
              style={{
                ...styles.touchableOpacityTextStyle,
                color: touchableTextColor,
              }}
            >
              {touchableText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
});

const TransactionComponentDate = memo((props) => {
  const { item = null, transactionType = null, loader } = props;
  if (item != null) {
    const { date, transactions } = item;
    let splitDate = date.split("-");
    let transformDate = `${ALL_MONTHS[parseInt(splitDate[1]) - 1]} ${
      splitDate[2]
    }, ${splitDate[0]}`;

    return (
      <Fragment>
        <View style={styles.dateParentWrapper}>
          <Text style={styles.dateTextWrapper}>{transformDate}</Text>
        </View>
        <View style={{ marginVertical: 30 }}>
          {transactions.map((singleTransaction, index) => {
            let computedResult = computeTransaction(
              singleTransaction,
              transactionType
            );
            return (
              <Fragment key={singleTransaction._id}>
                <TransactionComponent
                  transactionTitle={singleTransaction.name}
                  {...computedResult}
                />
                {transactions.length - 1 !== index ? <Seprator /> : null}
              </Fragment>
            );
          })}
        </View>
      </Fragment>
    );
  } else {
    <Fragment>
      <View style={styles.dateParentWrapper}>
        <Text style={styles.dateTextWrapper}>{transformDate}</Text>
      </View>
    </Fragment>;
  }
});
const TransactionComponentWithDate = memo((props) => {
  const onEndReachedCalledDuringMomentum = useRef(false);
  const { items, transactionType = "All", onEndReached, loader } = props;
  return (
    <Fragment>
      <FlatList
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        keyExtractor={(item, index) => item.id}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            onEndReached();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onEndReachedThreshold={1.0}
        data={items}
        renderItem={({ item, index }) => (
          <Fragment>
            <TransactionComponentDate
              item={item}
              transactionType={transactionType}
              loader={loader}
            />
            {items.length - 1 === index ? loader : null}
          </Fragment>
        )}
      />
    </Fragment>
  );
});

TransactionComponentWithDate.defaultProps = {
  date: PropTypes.string.isRequired,
};
export { TransactionComponent, TransactionComponentWithDate };
