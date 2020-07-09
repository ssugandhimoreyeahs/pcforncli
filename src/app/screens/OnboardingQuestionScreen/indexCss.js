import { StyleSheet } from "react-native";
import { deviceWidth, deviceHeight, getWp, getHp } from "@utils";
export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  greetingText: {
    fontSize: getWp(17),
    lineHeight: getWp(23),
    textAlign: "center",
    color: "white",
    marginTop: getHp(80),
    fontWeight: "700",
  },
  loaderContainer: {
    alignSelf: "center",
    marginTop: getHp(45),
  },
  contentView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    // marginBottom: getHp(40),
    // borderColor: "red",
    // borderWidth: 1,
    // marginTop: getHp(120),
  },
  questionAnswerContainer: {
    marginTop: getHp(15),
    width: "100%",
    paddingHorizontal: getWp(30),
    backgroundColor: '#FFF',
    borderRadius: getWp(10),
    paddingVertical: getHp(40),
    marginBottom: getHp(20)
  },
  answerContainer: {
    marginTop: getHp(30)
  },
  answerParentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  }
});
