import { StyleSheet } from "react-native";
import { deviceWidth, deviceHeight, getWp, getHp } from "@utils";

export default StyleSheet.create({
  answerContainer: {
    width: getWp(125),
    height: getHp(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: getWp(20),
    marginVertical: getWp(7)
  },
  selectedAnswer: {
    backgroundColor: "#007AFF",
  },
  notSelectedAnswer: {
    backgroundColor: "#E0EBFF",
  },
  answerText: {
    fontSize: getWp(12),
  },
  selectedAnswerText: {
    color: "#FFF",
  },
  notSelectedAnswerText: {
    color: "#1D1E1F",
  },
});
