import { StyleSheet } from "react-native";

import { getWp, getHp, FONTSIZE,FONT_FAMILY } from "@utils"; 

export default StyleSheet.create({
  selectButtonStyle: {
    width: getWp(160),
    height: getHp(38),
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: getWp(15),
    justifyContent: "space-between",
  },
  typeTextStyle: {
    fontSize: FONTSIZE.Text13,
    fontWeight: "500",
    fontFamily: FONT_FAMILY.SFProText
  }, 
});
