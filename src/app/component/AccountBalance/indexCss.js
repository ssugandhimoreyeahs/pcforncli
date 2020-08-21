import { StyleSheet } from "react-native";

import { FONTSIZE, FONT_FAMILY, getHp, getWp } from "@utils";
export default StyleSheet.create({
  commonTextStyle: {
    fontFamily: FONT_FAMILY.SFProText,
    color: "#FFF",
  },
  headingTextStyle: {
    fontSize: FONTSIZE.Text13,
    fontWeight: "500",
    lineHeight: 16,
  },
  balanceTextStyle: {
    //fontSize: 26,
    marginTop: getHp(6),
    fontSize: FONTSIZE.Text26,
    fontFamily: FONT_FAMILY.SFProBold,
    lineHeight: 31,
  },
  timeTextStyle: {
    marginTop: getHp(5),
    fontSize: FONTSIZE.Text12,
    lineHeight: 13,
  },
});
