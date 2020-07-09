import React, { Fragment, memo } from "react";
import { TouchableOpacity, View, Text } from "react-native";

import style from "./indexCss";

const OnboardingAnswer = (props) => {
  const { expectedAns, onPress } = props;
  return (
    <TouchableOpacity
      style={[
        style.answerContainer,
        expectedAns.isSelected ? style.selectedAnswer : style.notSelectedAnswer,
      ]}
      onPress={() => {
        onPress(expectedAns);
      }}
    >
      <Text
        style={[
          style.answerText,
          expectedAns.isSelected
            ? style.selectedAnswerText
            : style.notSelectedAnswerText,
        ]}
      >
        {expectedAns.answer}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(OnboardingAnswer);
