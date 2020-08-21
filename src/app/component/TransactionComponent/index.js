import React, { Fragment, memo, useRef, useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import styles from "./indexCss";
import PropTypes from "prop-types";
import { ALL_MONTHS } from "appconstants";
import { toTitleCase } from '@utils';

import {
  numberWithCommas,
  firstLetterCapital,
  PLAID_EXPENSE_CATEGORIES,
  PLAID_EXPENSE_CUSTOM_CATEGORIES_COLORS,
  randomElement,
} from "@api";
import { Seprator } from "@components";
import Store from "@redux/store";

const computeTransaction = (singleTransaction, transactionType, categoryReduxData) => {
  let finalAmount = ``;
  let categoryButtonText = ``;
  let amount = Math.abs(singleTransaction.amount);
  let detailInfo = ``;
  categoryButtonText = `${firstLetterCapital(
    singleTransaction.clientCategory
  )}`;

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

  let touchableTextColor = "#FFF";
  let touchableBorder = "#000";
  let touchableColor = "#FFF";

  let categoryDetailsObj = categoryReduxData.find(
    (itr) => itr.id === singleTransaction.clientCategoryObjectId
  ); 
  if(categoryDetailsObj == undefined){
    categoryDetailsObj = {};
    categoryDetailsObj.customcategories = null; 
    categoryDetailsObj.categoryColor = '#FFF';
    categoryDetailsObj.categoryTextColor = '#000';
  }
  if (!categoryDetailsObj?.customcategories) {
    touchableColor = categoryDetailsObj.categoryColor;
    touchableBorder = categoryDetailsObj.categoryColor;
    touchableTextColor = categoryDetailsObj.categoryTextColor;
  } else if(categoryDetailsObj?.customcategories) {
    touchableColor = categoryDetailsObj.categoryColor;
    touchableBorder = categoryDetailsObj.categoryColor;
    touchableTextColor = categoryDetailsObj.categoryTextColor;
  }else{
    touchableColor = '#FFF';
    touchableBorder = '#000';
    touchableTextColor = '#000';
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
    onPress,
    rootTransactionObj,
    touchableTextColor,
    transactionType = "",
  } = props;
  return (
    <Fragment>
      <View style={styles.childTransactionUpperContainer}>
        <Text style={styles.transactionTitleText}>{transactionTitle}</Text>
        <Text style={styles.amountTransactionText}>{transactionAmount}</Text>
      </View>

      <View style={styles.childTransactionLowerContainer}>
        <Text style={styles.detailsInfoText}>{detailInfoText}</Text>
        <View style={{ maxWidth: "70%" }}>
          <TouchableOpacity
            onPress={() => {
              onPress(rootTransactionObj, transactionType);
            }}
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
              {toTitleCase(touchableText)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
});

const TransactionComponentDate = memo((props) => {
  const { item = null, transactionType = null, onPress, categoryReduxData } = props;
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
              transactionType,
              categoryReduxData
            );
            return (
              <View
                style={styles.parentTransactionComponent}
                key={singleTransaction._id}
              >
                <TransactionComponent
                  transactionType={transactionType}
                  onPress={onPress}
                  rootTransactionObj={singleTransaction}
                  transactionTitle={singleTransaction.name}
                  {...computedResult}
                />
                {transactions.length - 1 !== index ? <Seprator /> : null}
              </View>
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
  const [contentOffset, setContentOffset] = useState(0);
  const flatlistRef = useRef();
  const scrollOffset = useRef({ x: 0, y: 0 });
  const onEndReachedCalledDuringMomentum = useRef(false);
  const {
    items,
    transactionType = "All",
    onEndReached,
    loader,
    onPress,
    categoryReduxData
  } = props;
  // const getCurrentScrollOffset = useCallback(() => {
  //   return scrollOffset.current;
  // }, [scrollOffset.current]);
  // useImperativeHandle(refs, () => ({
  //   getData(offset) {
  //     console.log("Code works - ", offset);
  //     setTimeout(() => {
  //       // flatlistRef.current.scrollToOffset({ offset: 15450, animated: true });
  //       setContentOffset(offset+500);
  //     }, 200);
  //   },
  // }));

  return (
    <Fragment>
      <FlatList
        // contentOffset={{ y: contentOffset }}
        // ref={flatlistRef}
        // onScroll={(events) => {
        //   scrollOffset.current = events.nativeEvent.contentOffset;
        // }}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        keyExtractor={(item, index) => item.id}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            onEndReachedCalledDuringMomentum.current = true;
            onEndReached();
          }
        }}
        onEndReachedThreshold={2.0}
        data={items}
        renderItem={({ item, index }) => (
          <Fragment>
            <TransactionComponentDate
              item={item}
              transactionType={transactionType}
              loader={loader}
              onPress={onPress}
              categoryReduxData={categoryReduxData}
            />
            {items.length - 1 === index ? loader : null}
          </Fragment>
        )}
      />
    </Fragment>
  );
});

TransactionComponentWithDate.propTypes = {
  date: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};
TransactionComponentWithDate.defaultProps = {
  date: "",
  onPress: () => {
    console.log("Add On Press ");
  },
};
export { TransactionComponent, TransactionComponentWithDate };
