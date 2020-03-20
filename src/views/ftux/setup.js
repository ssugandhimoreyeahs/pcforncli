import React, { Component,Fragment,PureComponent } from "react";
import { StyleSheet, TouchableOpacity, View, SafeAreaView, StatusBar,Dimensions,ScrollView,Platform, BackHandler } from "react-native";
import { Button, Card, Text, Image,Overlay } from "react-native-elements";
import { fetchQuestionsFromApi } from "../../api/api";
import axios from "axios";
// import { ScrollView } from "react-native-gesture-handler";

import DetectPlatform from "../../DetectPlatform";
import ProgressCircle from 'react-native-progress-circle'
import Spinner from 'react-native-loading-spinner-overlay';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


 class Setup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCodeForNoneOfAbove: false,
      showFinishButton: false,
      isOneTimeNoQbSend: false,
      hasSetupBusinessProfile: false,
      hasSetupBankingIntegration: false,
      hasSetupAccountingIntegration: false,
      isSpinner: false,
      isQuestionOverlayVisible:false,
      questionsData:[],
      currentQuestion:0,
      percentageIndicator:0,
      setupUserName:"",
      //code here for the button switching

      button1Selected:false,
      button2Selected:false,
      button3Selected:false,
      button4Selected:false,
      button5Selected:false,
      button6Selected:false,

      answer1:false,
      answer2:false,
      answer3:false,
      answer4:false,
      answer5:false,
      answer6:false,
      
      answersData:{},
      multipleAnswersData:{
        answer1:false,
        answer2:false,
        answer3:false,
        answer4:false,
        answer5:false,
        answer6:false,
      }
    };
  }


  fetchQuestions = async () => {
    const questionsData = await fetchQuestionsFromApi();
    //console.log(questionsData);
    if(questionsData.result == true && questionsData.questions.length > 0){
      console.log("Recieve Questions",questionsData);
      this.setState({ questionsData:questionsData.questions });

    }else{
      
    }
  }
  componentDidMount(){
    const setupUserName = this.props.navigation.getParam("firstName", "Testing");
    this.setState({ setupUserName });
    this.fetchQuestions();
    BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }
   componentWillUnmount(){
     BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
   }
 
   handleBackButton=(nav)=> {
     if (!nav.isFocused()) {
       BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
       return false;
     }else{
       //nav.goBack();
       return true;
     }
   }

  handlePressCreateBusinessProfile = () => {
    this.props.navigation.navigate("BusinessProfile", {
      createBusinessProfile: () =>
        this.setState({ hasSetupBusinessProfile: true }),
      userId: this.props.navigation.getParam("userId", "")
    });
  };

  handlePressCreateBankIntegration = () => {
    this.props.navigation.navigate("BankIntegration",{
      createBankIntegration: () => {
        this.setState({ hasSetupBankingIntegration:true,showFinishButton: true });
      },
      companyName: this.props.navigation.getParam("companyName", "")
    })
  }

  handlePressLedgetIntegration = () => {
    this.props.navigation.navigate("LedgerIntegration",{
        isOneTimeNoQbSend:this.state.isOneTimeNoQbSend,
        createLedgerIntegration: () => {
          this.setState({ hasSetupAccountingIntegration: true,isOneTimeNoQbSend:true })
        },
        hasSuccessfullyExecutedNoQb: () => {
          this.setState({ isOneTimeNoQbSend: true });
        }
    });
  }
  

  handleFinishSetup = () => {
    if(this.state.questionsData.length == 0){
      this.props.navigation.navigate("Dashboard");
    }
    else{
      this.setState({ isSpinner: true });
     
    setTimeout(()=>{
      this.setState((prevState)=>{ return { isSpinner:false,isQuestionOverlayVisible:true } })
    },1000);
    }
    
    
  };


  chooseSingleAnswer = (buttonSerial) => {

    let totalAnswers = this.state.questionsData[this.state.currentQuestion].expectedAns.length;
    let currentExecutingQuestion = "question"+this.state.currentQuestion;
    let answerSelected = "answer"+buttonSerial;
    let selectedButton = 'button'+buttonSerial+'Selected';
      for(let i=1;i<=totalAnswers;i++){
        let allSelect = 'button'+i+'Selected';
        let allAnswerSelect = "answer"+i;
        if(buttonSerial == i){
          this.setState( (prevState) => ( { [selectedButton] : !prevState[selectedButton], answersData:{ ...this.state.answersData,[currentExecutingQuestion]: answerSelected } } ) );
        }else{
          this.setState( { [allSelect]: false,[allAnswerSelect]: false } );
        }
      }

      
        // setTimeout(()=>{
          
        //   let questionsTotalLength = this.state.questionsData.length;
        //   let percentageToBeCovered = 100 / questionsTotalLength;
        //   let currentPercentage = percentageToBeCovered*(this.state.currentQuestion+1);
        //   this.setState({percentageIndicator: currentPercentage},()=>{
        //     if(this.state.currentQuestion < this.state.questionsData.length-1){
        //       this.setState({ [selectedButton]: false  });

              
        //     }
        //   });
          
        // },250);

        // if(this.state.currentQuestion == this.state.questionsData.length-1){
          
        //   setTimeout( () => {
        //       this.setState({ isQuestionOverlayVisible:false,isSpinner:true });

        //       setTimeout( () => {  this.setState({ isSpinner:false }); this.props.navigation.navigate("Dashboard") }, 1000) ;
        //   }, 700);
        // }
      
  }


  chooseMultipleAnswer = (buttonSerial) => {
    if(this.state.isCodeForNoneOfAbove == true){
      this.setState({ isCodeForNoneOfAbove: false });
    }
    let totalAnswers = this.state.questionsData[this.state.currentQuestion].expectedAns.length;
    let currentExecutingQuestion = "question"+this.state.currentQuestion;
    let answerSelected = "answer"+buttonSerial;
    let selectedButton = 'button'+buttonSerial+'Selected';
      for(let i=1;i<=totalAnswers;i++){
        let allSelect = 'button'+i+'Selected';
        let allAnswerSelect = "answer"+i;
        if(buttonSerial == i){
          this.setState( (prevState) => {
              if(prevState.multipleAnswersData[answerSelected] === true){
                return { [answerSelected] : !prevState.multipleAnswersData[answerSelected], multipleAnswersData:{ ...this.state.multipleAnswersData,[answerSelected]: false } }
              }else{
                return { [answerSelected] : !prevState.multipleAnswersData[answerSelected], multipleAnswersData:{ ...this.state.multipleAnswersData,[answerSelected]: true } };
              }
          });
        }
      }

      
        // setTimeout(()=>{
          
        //   let questionsTotalLength = this.state.questionsData.length;
        //   let percentageToBeCovered = 100 / questionsTotalLength;
        //   let currentPercentage = percentageToBeCovered*(this.state.currentQuestion+1);
        //   this.setState({percentageIndicator: currentPercentage},()=>{
        //     if(this.state.currentQuestion < this.state.questionsData.length-1){
        //       this.setState({ [selectedButton]: false  });

              
        //     }
        //   });
          
        // },100);

        // if(this.state.currentQuestion == this.state.questionsData.length-1){
          
        //   setTimeout( () => {
        //       this.setState({ isQuestionOverlayVisible:false,isSpinner:true });

        //       setTimeout( () => {  this.setState({ isSpinner:false }); this.props.navigation.navigate("Dashboard") }, 1000) ;
        //   }, 700);
        // }
      
  }


  questionOverlayRender = () => {
    const { isQuestionOverlayVisible,setupUserName,percentageIndicator,questionsData,currentQuestion } = this.state;
    
    const mar=Platform.OS == "ios"?"25%":0;
    return(
     <Fragment>
       <Overlay overlayStyle={{width:"90%",height:"100%",justifyContent:"center",flexDirection:"column"}}   windowBackgroundColor="rgba(0, 0, 0, 0.7)" overlayBackgroundColor="rgba(0, 0, 0, 0)" isVisible={isQuestionOverlayVisible} >
            {/* <Fragment> */}
            <ScrollView contentContainerStyle={{alignItems:"center",marginTop:mar,flex:1}}>
                  <View style={{marginTop:25,alignItems:"center"}} >
                      <Text style={{color:"#FFFFFF",fontWeight:"bold",fontSize:17,lineHeight:22}}>Sit Tight {setupUserName},</Text>
                      <Text style={{color:"#FFFFFF",fontWeight:"bold",fontSize:17,lineHeight:22}}>We're Building Your Dashboard</Text>
                  </View>
                  <View style={{alignSelf:"center",marginTop:80}}>
                  <ProgressCircle 
                        percent={percentageIndicator}
                        radius={65}
                        borderWidth={0.5}
                        containerStyle={{height:117,width:117}}
                        
                        color="#3399FF"
                        shadowColor="#999"
                        bgColor="#fff"
                    >
                        <Text style={{ fontSize: 18 }}>{ Math.floor(percentageIndicator)+"%" }</Text>
                    </ProgressCircle>
                  
                  </View>
                  <View style={{width:"95%", alignItems:'center',flexDirection:"row",justifyContent:"space-between",alignSelf:'flex-end',marginTop:105}}>
                      <View><Text style={{color:"#FFFFFF",fontWeight:"bold",fontSize:12}}>Tell us more about yourself while you wait</Text></View>
                      <View style={{marginRight: 20}}>
                      <View style={{ width:20,marginTop:6,flexDirection:"row",justifyContent:"space-between", }}>
                          
                          {
                              questionsData.map( ( currentQues,dotIndex ) => {
                              if(currentQuestion == dotIndex){
                                return (
                                  <View key={dotIndex} style={{ height:11,width:11,borderRadius:50,borderWidth:1,borderColor:"#FFFFFF",backgroundColor:"#FFFFFF",marginRight:5 }}></View>
                                  );
                              }else{
                                return (
                                  <View key={dotIndex} style={{ height:6,width:6,borderRadius:50,borderWidth:1,borderColor:"#FFFFFF",marginRight:5,marginTop:2 }}></View>
                                  );
                              }
                              
                              }
                              )
                          }
                          
                      </View>
                      </View>
                      {/* <Text style={{color:"#FFFFFF",fontWeight:"bold"}}>....</Text> */}
                  </View>
                  { this.renderQuestionsAndAnswers() }
                  </ScrollView>
                  {/* </Fragment> */}
        </Overlay>
     </Fragment>
    );
  }
  renderQuestionsAndAnswers = () => {
    const { questionsData,currentQuestion,button1Color,button2Color,button3Color,button4Color,text1Color,text2Color,text3Color,text4Color } = this.state;
    const totalRowsForButton = questionsData[currentQuestion].expectedAns.map( singleAnswer => singleAnswer );
    return(
      <Fragment>
          <View style={{
          height:totalRowsForButton.length == 6 ? "40%" : totalRowsForButton.length == 2 ?  "32%" : "35%",
          width:"100%",
          alignSelf:"center",
          marginTop: totalRowsForButton.length == 6 ? "3%" : "8%",
          backgroundColor:"#FFFFFF",
          borderRadius:10}}>
                                
                                <View style={{margin:25,width:"90%",flexDirection:"column"}} >
                                      <Text style={{color:"#000000",fontSize:15,lineHeight:25}}>{  questionsData[currentQuestion].question }</Text>
                                      {/* <Text>Dummy</Text> */}
              
                                { (totalRowsForButton.length == 2) && this.questionsTwoAnswerRender() }
                                { (totalRowsForButton.length == 4) && this.questionsFourAnswerRender() }
                                { (totalRowsForButton.length == 6) && this.questionsSixAnswerRender() }
                                </View>
              
            </View>
      </Fragment>
    );
  }
  questionsTwoAnswerRender = () => {
    const { questionsData,currentQuestion,button1Selected, button2Selected, answer1, answer2, answersData } = this.state;
    const currentExecutingFunction = "question"+currentQuestion;

    let button1BackgroundColor;
    let button2BackgroundColor;
    let text1BackgroundColor;
    let text2BackgroundColor
    if(answersData[currentExecutingFunction] != undefined){

      if(answersData[currentExecutingFunction] == "answer1"){

        button1BackgroundColor = "#007AFF";
        text1BackgroundColor = "#ffffff";

        button2BackgroundColor = "#E0EBFF";
        text2BackgroundColor = "#000000";

      }else if(answersData[currentExecutingFunction] == "answer2"){

        button2BackgroundColor = "#007AFF";
        text2BackgroundColor = "#ffffff";

        button1BackgroundColor = "#E0EBFF";
        text1BackgroundColor = "#000000";

      }

    }else{
    
      button1BackgroundColor =  button1Selected ? "#007AFF" : "#E0EBFF";
      button2BackgroundColor =  button2Selected ? "#007AFF" : "#E0EBFF";
      text1BackgroundColor =  button1Selected ? "#ffffff" : "#000000";
      text2BackgroundColor =  button2Selected ? "#ffffff" : "#000000";
    
    }
    return(
      <Fragment>
      <View style={{flexDirection:"row",width:"95%",height:"25%",justifyContent:"space-between",marginTop:80}}>
              <TouchableOpacity  style={{width:"40%",height:"80%",borderRadius:20,backgroundColor: button1BackgroundColor }} onPress={()=>{ this.chooseSingleAnswer(1) }}>
                    <Text style={{  color: text1BackgroundColor,textAlign:'center',marginTop:9,fontSize:12,lineHeight:16}}> { questionsData[currentQuestion].expectedAns[0].answer } </Text>
                    {/* <Text style={{  color:text1Color,textAlign:'center',marginTop:10,fontSize:12,}}> Text Dummy 1 </Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{width:"40%",height:"80%",borderRadius:20,backgroundColor: button2BackgroundColor }} onPress={()=>{ this.chooseSingleAnswer(2) }}>
                    <Text style={{  color: text2BackgroundColor,textAlign:'center',marginTop:9,fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[1].answer }</Text>
                    {/* <Text style={{  color:text1Color,textAlign:'center',marginTop:10,fontSize:12,}}> Text Dummy 2 </Text> */}
              </TouchableOpacity>
      </View>
      <View style={{marginTop:15}} ></View>
      </Fragment>
    );
  }
  questionsFourAnswerRender = () => {
    const { questionsData,currentQuestion,button1Selected, button2Selected,button3Selected,button4Selected, answer1, answer2, answer3, answer4, answersData } = this.state;
    const currentExecutingFunction = "question"+currentQuestion;

    let button1BackgroundColor;
    let button2BackgroundColor;
    let button3BackgroundColor;
    let button4BackgroundColor;

    let text1BackgroundColor;
    let text2BackgroundColor;
    let text3BackgroundColor;
    let text4BackgroundColor;
    if(answersData[currentExecutingFunction] != undefined){

      if(answersData[currentExecutingFunction] == "answer1"){

        button1BackgroundColor = "#007AFF";
        text1BackgroundColor = "#ffffff";

        button4BackgroundColor = "#E0EBFF";
        text4BackgroundColor = "#000000";

        button2BackgroundColor = "#E0EBFF";
        text2BackgroundColor = "#000000";

        button3BackgroundColor = "#E0EBFF";
        text3BackgroundColor = "#000000";

      }else if(answersData[currentExecutingFunction] == "answer2"){

        button2BackgroundColor = "#007AFF";
        text2BackgroundColor = "#ffffff";

        button1BackgroundColor = "#E0EBFF";
        text1BackgroundColor = "#000000";

        button4BackgroundColor = "#E0EBFF";
        text4BackgroundColor = "#000000";

        button3BackgroundColor = "#E0EBFF";
        text3BackgroundColor = "#000000";

      }

      else if(answersData[currentExecutingFunction] == "answer3"){

        button3BackgroundColor = "#007AFF";
        text3BackgroundColor = "#ffffff";

        button1BackgroundColor = "#E0EBFF";
        text1BackgroundColor = "#000000";

        button2BackgroundColor = "#E0EBFF";
        text2BackgroundColor = "#000000";

        button4BackgroundColor = "#E0EBFF";
        text4BackgroundColor = "#000000";

      }

      else if(answersData[currentExecutingFunction] == "answer4"){

        button4BackgroundColor = "#007AFF";
        text4BackgroundColor = "#ffffff";

        button1BackgroundColor = "#E0EBFF";
        text1BackgroundColor = "#000000";

        button2BackgroundColor = "#E0EBFF";
        text2BackgroundColor = "#000000";

        button3BackgroundColor = "#E0EBFF";
        text3BackgroundColor = "#000000";

      }

    }else{
    
      button1BackgroundColor =  button1Selected ? "#007AFF" : "#E0EBFF";
      button2BackgroundColor =  button2Selected ? "#007AFF" : "#E0EBFF";
      button3BackgroundColor =  button3Selected ? "#007AFF" : "#E0EBFF";
      button4BackgroundColor =  button4Selected ? "#007AFF" : "#E0EBFF";
      
      text1BackgroundColor =  button1Selected ? "#ffffff" : "#000000";
      text2BackgroundColor =  button2Selected ? "#ffffff" : "#000000";
      text3BackgroundColor =  button1Selected ? "#ffffff" : "#000000";
      text4BackgroundColor =  button2Selected ? "#ffffff" : "#000000";
      
    
    }
    return(
      <Fragment>
        <ScrollView>
      <View style={{flexDirection:"row",width:"95%",height:"30%",justifyContent:"space-between",marginTop:25}}>
              <TouchableOpacity  style={{width:"45%",height:"100%",borderRadius:20, backgroundColor: button1BackgroundColor  }} onPress={()=>{ this.chooseSingleAnswer(1) }}>
                    <Text style={{  color: text1BackgroundColor,textAlign:'center',marginTop:8,fontSize:12,lineHeight:16}}> { questionsData[currentQuestion].expectedAns[0].answer } </Text>
                    {/* <Text style={{  color:text1Color,textAlign:'center',marginTop:10,fontSize:12,}}> Text Dummy 1 </Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20,backgroundColor: button2BackgroundColor }} onPress={()=>{ this.chooseSingleAnswer(2) }}>
                    <Text style={{  color: text2BackgroundColor,textAlign:'center',marginTop:8,fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[1].answer }</Text>
                    {/* <Text style={{  color:text1Color,textAlign:'center',marginTop:10,fontSize:12,}}> Text Dummy 2 </Text> */}
              </TouchableOpacity>
      </View>
      <View style={{flexDirection:"row",width:"95%",height:"30%",justifyContent:"space-between",marginTop:15}}>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20,backgroundColor: button3BackgroundColor }} onPress={()=>{ this.chooseSingleAnswer(3) }}>
                    <Text style={{  color: text3BackgroundColor,textAlign:'center',marginTop:8,fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[2].answer }</Text>
                    {/* <Text style={{  color:text3Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 3</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20,backgroundColor: button4BackgroundColor }} onPress={()=>{ this.chooseSingleAnswer(4) }}>
                    <Text style={{  color: text4BackgroundColor,textAlign:'center',marginTop:8,fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[3].answer }</Text>
                    {/* <Text style={{  color:text4Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 4</Text> */}
              </TouchableOpacity>
      </View>
      <View style={{marginTop:15}} ></View>
      </ScrollView>
      </Fragment>
    );
  }
 
  questionsSixAnswerRender = () => {
    const { questionsData,currentQuestion, multipleAnswersData } = this.state;
    const { answer1,answer2,answer3,answer4,answer5,answer6 } = multipleAnswersData;
    
    // let answer1 = (multipleAnswersData.answer1 != undefined && multipleAnswersData.answer1 == true) ? true : false;
    // let answer2 = (multipleAnswersData.answer2 != undefined && multipleAnswersData.answer2 == true) ? true : false;
    // let answer3 = (multipleAnswersData.answer3 != undefined && multipleAnswersData.answer3 == true) ? true : false;
    // let answer4 = (multipleAnswersData.answer4 != undefined && multipleAnswersData.answer4 == true) ? true : false;
    // let answer5 = (multipleAnswersData.answer5 != undefined && multipleAnswersData.answer5 == true) ? true : false;
    // let answer6 = (multipleAnswersData.answer6 != undefined && multipleAnswersData.answer6 == true) ? true : false;
    return(
      <Fragment>
        
      <View style={{flexDirection:"row",width:"95%",height:30,justifyContent:"space-between",marginTop:25}}>
              <TouchableOpacity  style={{width:"45%",height:"100%",borderRadius:20, backgroundColor:answer1 ? "#007AFF" : "#E0EBFF",justifyContent:"center",alignItems:"center"  }} onPress={()=>{ 
                if( this.state.isCodeForNoneOfAbove == false ){
                  this.chooseMultipleAnswer(1); 
                }else{
                  this.chooseMultipleAnswer(1); 
                }
                
                }}>
                    <Text style={{  color:answer1 ? "#ffffff" : "#000000",textAlign:'center',fontSize:12,lineHeight:16}}> { questionsData[currentQuestion].expectedAns[0].answer } </Text>
                    {/* <Text style={{  color:text1Color,textAlign:'center',marginTop:10,fontSize:12,}}> Text Dummy 1 </Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20, backgroundColor:answer2 ? "#007AFF" : "#E0EBFF",justifyContent:"center",alignItems:"center" }} onPress={()=>{ 
                if( this.state.isCodeForNoneOfAbove == false ){
                  this.chooseMultipleAnswer(2);
                }else{
                  this.chooseMultipleAnswer(2);
                }
                 }}>
                    <Text style={{  color:answer2 ? "#ffffff" : "#000000",textAlign:'center',fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[1].answer }</Text>
                    {/* <Text style={{  color:text1Color,textAlign:'center',marginTop:10,fontSize:12,}}> Text Dummy 2 </Text> */}
              </TouchableOpacity>
      </View>
      <View style={{flexDirection:"row",width:"95%",height:30,justifyContent:"space-between",marginTop:15}}>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20, backgroundColor:answer3 ? "#007AFF" : "#E0EBFF",justifyContent:"center",alignItems:"center" }} onPress={()=>{ 
                if( this.state.isCodeForNoneOfAbove == false ){
                  this.chooseMultipleAnswer(3);
                }else{
                  this.chooseMultipleAnswer(3);
                }
                 }}>
                    <Text style={{  color:answer3 ? "#ffffff" : "#000000",textAlign:'center',fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[2].answer }</Text>
                    {/* <Text style={{  color:text3Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 3</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20, backgroundColor:answer4 ? "#007AFF" : "#E0EBFF",justifyContent:"center",alignItems:"center" }} onPress={()=>{ 
                if( this.state.isCodeForNoneOfAbove == false ){
                  this.chooseMultipleAnswer(4);
                }else{
                  this.chooseMultipleAnswer(4);
                }
                 }}>
                    <Text style={{  color:answer4 ? "#ffffff" : "#000000",textAlign:'center',fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[3].answer }</Text>
                    {/* <Text style={{  color:text4Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 4</Text> */}
              </TouchableOpacity>
      </View>
      <View style={{flexDirection:"row",width:"95%",height:30,justifyContent:"space-between",marginTop:15}}>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20, backgroundColor:answer5 ? "#007AFF" : "#E0EBFF",justifyContent:"center",alignItems:"center" }} onPress={()=>{ 
                 if( this.state.isCodeForNoneOfAbove == false ){
                  this.chooseMultipleAnswer(5);
                }else{
                  this.chooseMultipleAnswer(5);
                }
                 }}>
                    <Text style={{  color:answer5 ? "#ffffff" : "#000000",textAlign:'center',fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[4].answer }</Text>
                    {/* <Text style={{  color:text3Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 3</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={{width:"45%",height:"100%",borderRadius:20, backgroundColor:answer6 ? "#007AFF" : "#E0EBFF",justifyContent:"center",alignItems:"center" }} onPress={()=>{ 
                if( this.state.isCodeForNoneOfAbove == false ){
                  this.chooseMultipleAnswer(6);
                }else{
                  this.chooseMultipleAnswer(6);
                }
                 }}>
                    <Text style={{  color:answer6 ? "#ffffff" : "#000000",textAlign:'center',fontSize:12,lineHeight:16}}>{ questionsData[currentQuestion].expectedAns[5].answer }</Text>
                    {/* <Text style={{  color:text4Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 4</Text> */}
              </TouchableOpacity>
      </View>
      <View style={{ flexDirection:"row",width:"95%",justifyContent:"center",alignItems:"center",marginTop:20,height:35 }}>
      <TouchableOpacity style={{width:"70%",height:"100%",borderRadius:20, backgroundColor: this.state.isCodeForNoneOfAbove  ? "#007AFF" : "#7FBDFF",justifyContent:"center",alignItems:"center" }} onPress={()=>{ 

          this.setState({ isCodeForNoneOfAbove: !this.state.isCodeForNoneOfAbove },()=>{
            if(this.state.isCodeForNoneOfAbove == true){
              let multipleAnswersData = {
                answer1:false,
                answer2:false,
                answer3:false,
                answer4:false,
                answer5:false,
                answer6:false,
              }
              this.setState({ multipleAnswersData });
            }
          });

       }}>
            <Text style={{  color: this.state.isCodeForNoneOfAbove ? "#ffffff" : "#000000",textAlign:'center',fontSize:14,lineHeight:16}}>{ `None of the above` }</Text>
                    {/* <Text style={{  color:text3Color,textAlign:'center',marginTop:10,fontSize:12,}}>Text Dummy 3</Text> */}
              </TouchableOpacity>
      </View>
      <View style={{marginTop:15}} ></View>
      
      </Fragment>
    );
  }

  resetAllButtonToDefault = () => {

    let totalAnswers = this.state.questionsData[this.state.currentQuestion].expectedAns.length;
    
      for(let i=1;i<=totalAnswers;i++){
        let allSelect = 'button'+i+'Selected';
        
          this.setState( (prevState) => ( { [allSelect] : false } ) );
        
      }

  }
  onSwipeLeft = (gestureState) => {
    const { currentQuestion,questionsData,answersData } = this.state;
    //console.log(questionsData.length);
    let currentExecutingQuestion = "question"+currentQuestion;    
    if(currentQuestion < questionsData.length-1 ){

           if(answersData[currentExecutingQuestion] != undefined){
            let questionsTotalLength = this.state.questionsData.length;
            let percentageToBeCovered = 100 / questionsTotalLength;
            let currentPercentage = percentageToBeCovered*(this.state.currentQuestion+1);
            this.setState({percentageIndicator: currentPercentage});
  
            this.setState( (prevState) => ({ currentQuestion: prevState.currentQuestion + 1 }), ()=>{ this.resetAllButtonToDefault(); } );
           }
    }else if(currentQuestion < questionsData.length){
        const { multipleAnswersData } = this.state;
        const { answer1,answer2,answer3,answer4,answer5,answer6 } = multipleAnswersData;
        if(  answer1 || answer2 || answer3 || answer4 || answer5 || answer6 || this.state.isCodeForNoneOfAbove ){

          let questionsTotalLength = this.state.questionsData.length;
          let percentageToBeCovered = 100 / questionsTotalLength;
          let currentPercentage = percentageToBeCovered*(this.state.currentQuestion+1);
          this.setState({percentageIndicator: currentPercentage },()=>{ setTimeout(()=>{ this.setState( (prevState)=>{ return { isQuestionOverlayVisible:!prevState.isQuestionOverlayVisible, isSpinner: !prevState.isSpinner } } ) },100); });

          setTimeout(()=>{ this.setState( (prevState)=>{ return { isSpinner:!prevState.isSpinner,hasSetupBusinessProfile: false,hasSetupBankingIntegration: false,hasSetupAccountingIntegration: false } },()=>{ this.props.navigation.navigate("Dashboard") } ) }, 1000 );
        }
    }
  }
 
  onSwipeRight = (gestureState) => {
    const { currentQuestion,questionsData } = this.state;
    if(currentQuestion > 0 ){
      this.setState( (prevState) => ({ currentQuestion: prevState.currentQuestion - 1 }) );
    }
    
  }

  render() {
    
    const firstName = this.props.navigation.getParam("firstName", "");
    const { questionsData } = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <React.Fragment>
        <Spinner
          visible={this.state.isSpinner}
          textStyle={styles.spinnerTextStyle}
        />
        <Text h3 style={{marginTop:40}}>{`Welcome, ${firstName}`}</Text>
        { questionsData.length > 0 && 
        <GestureRecognizer
        onSwipeLeft={this.onSwipeLeft}
        onSwipeRight={this.onSwipeRight}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <this.questionOverlayRender />
        </GestureRecognizer>
         }
        <Text h4>Let's set up your PocketCFO</Text>
        
        <View style={styles.cardContainer}>
        {this.state.hasSetupBusinessProfile ? (
                <View style={{flexDirection:"row",alignSelf:"flex-end",flex:1,marginTop:0,position:"relative",zIndex:10 }}>
                  <Image
                  source={require("../../assets/icon_checked.png")}
                  style={{
                    width: 25,
                    height: 25,
                    
                  }}
                  
                />
                  </View>
              ) : null}
          <TouchableOpacity onPress={this.handlePressCreateBusinessProfile}>
         
            <Card
              containerStyle={styles.cardEnabled}
              onPress={this.handlePress}
            >
              
              <View style={styles.flexRow}>
                <Image
                  source={require("../../assets/create_business_profile.png")}
                  style={{ width: 50, height: 50 }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.bold}>Create business profile</Text>
                  <Text style={{fontSize:12}}>provide information on your business.</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          {this.state.hasSetupBankingIntegration ? (
                <View style={{flexDirection:"row",alignSelf:"flex-end",flex:1,marginTop:10,position:"relative",zIndex:10 }}>
                  <Image
                  source={require("../../assets/icon_checked.png")}
                  style={{
                    width: 25,
                    height: 25,
                    
                  }}
                  
                />
                  </View>
              ) : null}
          <TouchableOpacity
            onPress={this.handlePressCreateBankIntegration}
            disabled={!this.state.hasSetupBusinessProfile}
          >
            <Card
              containerStyle={
                this.state.hasSetupBusinessProfile
                  ? styles.cardEnabled
                  : styles.cardDisabled
              }
            >
              
              <View style={styles.flexRow}>
                <Image
                  source={require("../../assets/bank_integration.png")}
                  style={{ width: 50, height: 50 }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.bold}>Bank integration</Text>
                  <Text style={{fontSize:12}}>connect your business bank account.</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          {this.state.hasSetupAccountingIntegration ? (
                <View style={{flexDirection:"row",alignSelf:"flex-end",flex:1,marginTop:10,position:"relative",zIndex:10 }}>
                  <Image
                  source={require("../../assets/icon_checked.png")}
                  style={{
                    width: 25,
                    height: 25,
                    
                  }}
                  
                />
                  </View>
              ) : null}
          <TouchableOpacity
            onPress={this.handlePressLedgetIntegration}
            disabled={!this.state.hasSetupBankingIntegration}
          >
            <Card
              containerStyle={
                this.state.hasSetupBankingIntegration
                  ? styles.cardEnabled
                  : styles.cardDisabled
              }
            >
              
              <View style={styles.flexRow}>
                <Image
                  source={require("../../assets/accounting_integration.png")}
                  style={{ width: 50, height: 50 }}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.bold}>Accounting integration</Text>
                  <Text style={{fontSize:12}}>connect your accounting software.</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
        <Button
          // disabled={
          //   !this.state.hasSetupBusinessProfile ||
          //   !this.state.hasSetupBankingIntegration ||
          //   !this.state.hasSetupAccountingIntegration
          // }
          disabled = { !this.state.showFinishButton }
          loading={this.state.isSpinner}
          buttonStyle={{ borderRadius: 20 }}
          containerStyle={{ marginTop: "18%", width: "85%", height: "15%" }}
          title="Finish"
          onPress={this.handleFinishSetup}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    fontSize:15,
  },
  cardDisabled: {
    padding: 30,
    borderColor: "white",
    borderRadius: 5,
    opacity: 0.6,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.15
  },
  cardEnabled: {
    padding: 30,
    borderColor: "white",
    borderRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "black",
    shadowOpacity: 0.15
  },
  container: {
    alignItems: "center",
    backgroundColor: "#F1F3F5",
    flex: 1,
    justifyContent: "center"
  },
  cardContainer: {
    width: "90%",
    marginTop: "18%"
  },
  flexRow: { flexDirection: "row", marginLeft: "-5%" },
  flexCol: { flexDirection: "column" },
  textContainer: {
    flexDirection: "column",
    marginLeft: "5%"
  }
});


export default DetectPlatform(Setup,styles.container);