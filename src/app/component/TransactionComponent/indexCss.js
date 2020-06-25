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
    fontSize: 15,
    color: "#1D1E1F",
    maxWidth: "60%",
    textAlign: "left",
  },
  amountTransactionText: {
    fontSize: 17,
    color: "#1D1E1F",
    maxWidth: "40%",
    textAlign: "right",
    marginRight: 10,
  },
  childTransactionLowerContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsInfoText: {
    alignSelf: "center",
    fontSize: 11,
    color: "#1D1E1F",
    opacity: 0.5,
    maxWidth: "30%",
  },

  touchableOpacityStyles: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#A599EC",
    borderColor: "#A995F3",
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  touchableOpacityTextStyle: { fontSize: 11, color: "#000" },
});
