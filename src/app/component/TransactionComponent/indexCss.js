import { StyleSheet } from "react-native";

export default StyleSheet.create({
  dateParentWrapper: {
    width: "100%",
    height: 33,
    backgroundColor: "#F6F7F8",
    justifyContent: "center",
  },
  dateTextWrapper: {
    marginLeft: 20,
    fontSize: 12,
    color: "#000",
  },
  parentTransactionComponent: {
    width: "90%",
    alignSelf: "center",
  },
  childTransactionUpperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionTitleText: {
    color: "#1D1E1F",
    fontSize: 15,
    width: "60%",
  },
  amountTransactionText: {
    fontSize: 17,
    color: "#1D1E1F",
    width: "40%",
    textAlign: "right",
  },
  childTransactionLowerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    //   borderWidth: 1,
    //   borderColor: 'red',
    alignItems: "center",
  },
  detailsInfoText: {
    color: "#1D1E1F",
    fontSize: 11,
    width: "40%",
    opacity: 0.5,
  },

  touchableOpacityStyles: {
    height: 27,
    paddingHorizontal: 15,
    borderColor: "#A599EC",
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  touchableOpacityTextStyle: { fontSize: 11, color: "#000" },
});
