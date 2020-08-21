import { StyleSheet } from "react-native";

import { getHp, getWp, FONTSIZE, FONT_FAMILY } from "@utils";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  transactionHeaderContainer: {
    height: getHp(200),
    width: "100%",
    backgroundColor: "#090643",
    borderBottomRightRadius: getWp(30),
    borderBottomLeftRadius: getWp(30),
  },
  transactionHeaderChildContainer: {
    marginTop: getHp(55),
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionTileContainer: {
    marginTop: 40,
    width: "90%",
    alignSelf: "center",
  },
  transactionFilterContainer: {
    marginTop: getHp(25),
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  transactionFilterChildContainer1: {
    shadowColor: "#FFF",
    elevation: 1,
    shadowRadius: getWp(10),
    shadowOffset: {
      height: getHp(10),
      width: getWp(20)
    },  
    borderRadius: getWp(100),
    backgroundColor: "#E6E6EC",
    height: getHp(35),
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    paddingHorizontal: getWp(1.9),
    alignItems: "center",
  },
  transactionFilterPlateText: {
    fontWeight: "500",
    color: "#40404D",
    fontSize: FONTSIZE.Text14,
  },
  transactionFilterActivePlateText: {
    color: "#000000",
  },
  activeTabViewFilter: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: getWp(15),
    backgroundColor: "#FFF",
    height: getHp(30),
    borderColor: "#FFF",
    borderWidth: getWp(1.5),
    borderRadius: getWp(35),
    elevation: 5,
    shadowOpacity: 0.15,
    shadowOffset: {
      height: -2,
      width: 2,
    },
  },
  inactiveTabViewFilter: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: getWp(10),
  },
  filterButtonStyle: {
    backgroundColor: "#FFF",
    borderWidth: getWp(1),
    borderColor: "#E8E8E8",
    paddingHorizontal: getWp(25),
    height: getHp(35),
    justifyContent: "center",
    alignItems: "center",
  },
  filterBtnTextStyle: {
    fontFamily: FONT_FAMILY.SFProText,
    fontSize: FONTSIZE.Text14,
    color: "#000",
    height: getHp(21)
  },
});
