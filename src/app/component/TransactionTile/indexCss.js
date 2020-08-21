import { StyleSheet } from "react-native";

import { getWp, getHp, FONTSIZE, FONT_FAMILY } from "@utils";

export default StyleSheet.create({
  upperContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionTileText: {
    fontFamily: FONT_FAMILY.SFProText,
    fontSize: FONTSIZE.Text15,
    textAlign: "left",
    width: "55%",
    color: "#1D1E1F",
    // borderWidth:1,
    // // borderColor: "red",
  },
  transactionAmountText: {
    textAlign: "right",
    color: "#1D1E1F",
    fontSize: FONTSIZE.Text17,
    width: "40%",
    // fontFamily:FONT_FAMILY.SFProText,
    // borderWidth:1,
    // borderColor: "green",
  },
  lowerContainer: {
    marginTop: getHp(13),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDateText: {
    // borderWidth: 1,
    // borderColor: "red",
    fontFamily: FONT_FAMILY.SFProText,
    color: "#1D1E1F",
    opacity: 0.5,
    fontSize: FONTSIZE.Text11,
  },
  transactionBtn: {
    paddingHorizontal: getWp(23),
    borderWidth: getWp(0.4),
    height: getWp(27),
  },
  transactionBtnText: {
    color: "#1D1E1F",
    fontSize: FONTSIZE.Text11,
    letterSpacing: 0.7, 
    fontFamily: FONT_FAMILY.SFProText, 
    height:getWp(15)
  },
});
