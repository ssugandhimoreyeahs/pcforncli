import React, { Fragment, memo } from "react";
import { Text, View } from "react-native";

const OnboardingQuestion = (props) => {
  return <Text>{props.question}</Text>;
};


export default memo(OnboardingQuestion);