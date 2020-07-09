import React, { Fragment, memo } from "react";
import { Text, View, ScrollView } from "react-native";
import style from "./indexCss";

const QuestionCount = (props) => {
  const { questionTree, currentQuestion } = props;
  return (
    <View style={style.countContainer}>
      <Text style={style.textView}>
        Tell us more about yourself while you wait
      </Text>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.currentPointWrapper}
      >
        {questionTree.map((singleQuestionCount) => (
          <View
            style={[
              style.questionIndicator,
              singleQuestionCount._id === currentQuestion?._id
                ? style.activeQuestion
                : style.inactiveQuestion,
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(QuestionCount);
