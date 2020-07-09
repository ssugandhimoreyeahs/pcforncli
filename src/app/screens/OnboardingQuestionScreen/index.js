import React, { Fragment, Component, memo } from "react";
import { View, Text, SafeAreaView, Platform, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { deviceWidth, deviceHeight, getWp, getHp } from "@utils";
import styles from "./indexCss";
import { Circle } from "react-native-progress";
import {
  OnboardingQuestionCount,
  OnboardingQuestion,
  OnboardingAnswer,
} from "@components";
import GestureRecognizer from "react-native-swipe-gestures";
import { fetchQuestionsFromApi } from "@api/api";

let WrapperComponent = Platform.OS === "ios" ? SafeAreaView : View;
const gestureConfig = {
  velocityThreshold: 0.5,
  directionalOffsetThreshold: 500,
};
class OnboardingQuestionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onboardingQuestions: [],
      currentQuestionIndex: 0,
    };
  }
  fetchOnBoardingQuestions = async () => {
    const onboardingQuestionResponse = await fetchQuestionsFromApi();
    if (onboardingQuestionResponse.result) {
      const updatedOnboardingQuestions = onboardingQuestionResponse.questions.map(
        (singleQuestion, index) => {
          let isMultiple = singleQuestion.isMultiple === "false" ? false : true;
          let updateExpectedAns = singleQuestion.expectedAns.map((itr) => ({
            ...itr,
            isSelected: false,
          }));
          let expectedAns = isMultiple
            ? [
                ...updateExpectedAns,
                {
                  answerId: "None of Above",
                  answer: "None of Above",
                  isSelected: false,
                },
              ]
            : updateExpectedAns;
          return {
            ...singleQuestion,
            expectedAns,
            isMultiple,
          };
        }
      );
      this.setState({
        onboardingQuestions: updatedOnboardingQuestions,
      });
    }
  };
  componentDidMount() {
    this.fetchOnBoardingQuestions();
  }
  renderProgressBar = memo(() => {
    return (
      <View style={styles.loaderContainer}>
        <Circle
          //borderColor={"rgba(0, 0, 0, 0)"}
          size={getHp(100)}
          color={"#FFFFFF"}
          //unfilledColor={"#4A4A4B"}
          indeterminateAnimationDuration={1500}
          indeterminate={true}
          borderWidth={7}
        />
      </View>
    );
  });
  handleOnPress = (expectedAnsProp) => {
    let { onboardingQuestions, currentQuestionIndex } = this.state;
    let currentQuestionDetails = onboardingQuestions[currentQuestionIndex];
    let updatedExpectedAns = [];
    if (currentQuestionDetails.isMultiple) {
      if (expectedAnsProp.answerId === "None of Above") {
        updatedExpectedAns = currentQuestionDetails.expectedAns.map(
          (singleExp, index) => {
            if (index === currentQuestionDetails.expectedAns.length - 1) {
              singleExp.isSelected = true;
              return singleExp;
            } else {
              singleExp.isSelected = false;
              return singleExp;
            }
          }
        );
      } else {
        updatedExpectedAns = currentQuestionDetails.expectedAns.map(
          (singleExp) => {
            if (singleExp.answerId === expectedAnsProp.answerId) {
              singleExp.isSelected = !singleExp.isSelected;
              return singleExp;
            } else {
              return singleExp;
            }
          }
        );
        updatedExpectedAns[
          currentQuestionDetails.expectedAns.length - 1
        ].isSelected = false;
      }
    } else {
      updatedExpectedAns = currentQuestionDetails.expectedAns.map(
        (singleExp) => {
          if (singleExp.answerId === expectedAnsProp.answerId) {
            singleExp.isSelected = true;
            return singleExp;
          } else {
            singleExp.isSelected = false;
            return singleExp;
          }
        }
      );
    }
    onboardingQuestions[currentQuestionIndex].expectedAns = updatedExpectedAns;
    this.setState({ onboardingQuestions });
  };
  renderAnswers = () => {
    const { onboardingQuestions, currentQuestionIndex } = this.state;
    return (
      <View style={styles.answerParentContainer}>
        {onboardingQuestions[currentQuestionIndex].expectedAns.map(
          (expectedAns, index) => {
            return (
              <OnboardingAnswer
                key={index}
                expectedAns={{ ...expectedAns }}
                currentQuestion={onboardingQuestions[currentQuestionIndex]}
                onPress={this.handleOnPress}
              />
            );
          }
        )}
      </View>
    );
  };
  renderScreen = () => {
    const { onboardingQuestions, currentQuestionIndex } = this.state;
    const { userData } = this.props;
    return (
      <WrapperComponent style={styles.container}>
        <Text style={styles.greetingText}>
          {`Sit tight ${userData.firstname}, \nwe’re building your dashboard`}
        </Text>
        <this.renderProgressBar />
        {onboardingQuestions.length > 0 ? (
          <Fragment>
            <View style={styles.contentView}>
              <OnboardingQuestionCount
                questionTree={onboardingQuestions}
                currentQuestion={onboardingQuestions[currentQuestionIndex]}
              />
            </View>
            <View style={styles.questionAnswerContainer}>
              <OnboardingQuestion
                question={onboardingQuestions[currentQuestionIndex].question}
              />

              <View style={styles.answerContainer}>
                <this.renderAnswers />
              </View>
            </View>
          </Fragment>
        ) : null}
      </WrapperComponent>
    );
  };
  onSwipeLeft = () => {
    const { onboardingQuestions, currentQuestionIndex } = this.state;
    if (onboardingQuestions.length > 0) {
      if (currentQuestionIndex < onboardingQuestions.length - 1) {
        this.setState((prevState) => {
          return {
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
          };
        });
      }
    }
  };
  onSwipeRight = () => {
    const { currentQuestionIndex, onboardingQuestions } = this.state;
    if (onboardingQuestions.length > 0) {
      if (currentQuestionIndex >= 1) {
        this.setState((prevState) => {
          return {
            currentQuestionIndex: prevState.currentQuestionIndex - 1,
          };
        });
      }
    }
  };
  render() {
    const { isVisible } = this.props;
    return (
      <Fragment>
        {isVisible ? (
          <GestureRecognizer
            onSwipeLeft={this.onSwipeLeft}
            onSwipeRight={this.onSwipeRight}
            config={gestureConfig}
            style={{ flex: 1 }}
          >
            <Modal
              coverScreen={true}
              isVisible={true}
              deviceHeight={deviceHeight}
              deviceWidth={deviceWidth}
              backdropColor={"rgba(0, 0, 0, 0.7)"}
            >
              <this.renderScreen />
            </Modal>
          </GestureRecognizer>
        ) : null}
      </Fragment>
    );
  }
}

export default OnboardingQuestionScreen;
