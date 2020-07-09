import { StyleSheet } from "react-native";
import { getWp, getHp } from "@utils";
export default StyleSheet.create({
  countContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textView: {
    fontSize: getWp(13),
    color: "#FFF",
    width: "77%",
  },
  questionIndicator: {
    backgroundColor: "#FFF",
    borderRadius: getWp(10),
    marginStart: getWp(5),
  },
  activeQuestion: {
    height: getWp(9),
    width: getWp(9),
  },
  inactiveQuestion: {
    height: getWp(6),
    width: getWp(6),
  },

  currentPointWrapper: {
    flexDirection: "row",
    alignItems: "center",
    //width: "27%",
    // borderWidth: 1,
    // borderColor: 'red',
    justifyContent: "flex-end",
  },
});
