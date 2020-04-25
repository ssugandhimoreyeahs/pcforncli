import React, { Component,Fragment,PureComponent } from "react";
import { StyleSheet, TouchableOpacity, View, SafeAreaView, StatusBar,Dimensions,ScrollView,Platform, BackHandler } from "react-native";
import { Button, Card, Text, Image,Overlay } from "react-native-elements";
import { fetchQuestionsFromApi } from "../../api/api";
import DetectPlatform from "../../DetectPlatform";
import ProgressCircle from 'react-native-progress-circle'
import Spinner from 'react-native-loading-spinner-overlay';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import PlaidSecureImg from "../../assets/PlaidSecureImg.png";
import BlueLockImg from '../../assets/BlueLock.png';
import { PLAID_SECURE_MODAL } from "../../api/common";
import Entypo from "react-native-vector-icons/Entypo";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
FontAwesome.loadFont();
Entypo.loadFont();
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
      isQuestionOverlayVisible: false,
      setupUserName:"",
      onBoardingData: { isFetched: false,noneOfTheAbove: false },
      dataSecuredModal: false,
      // onBoardingData: {
      //   totalQuestions: 10,
      //   currentPercentage: 30,
      //   data: [],
      //   currentQuestion: 0,
      //   isFetched = true
      // }
    };
  }


  fetchQuestions = async () => {
    const questionsData = await fetchQuestionsFromApi();
    
    if(questionsData.result == true && questionsData.questions.length > 0){
      const { questions } = questionsData;
      let onBoardingData = {};
      onBoardingData.totalQuestions = questions.length;
      onBoardingData.currentPercentage = 0;
      onBoardingData.data = [];
      onBoardingData.isFetched = true;
      onBoardingData.currentQuestion = 0;
      onBoardingData.noneOfTheAbove = false;
      let singlePercentage = 100 / questions.length;
      for(let i=0;i<questions.length;i++){
        let data = {};
        
        data.percentage = singlePercentage * i;
        data.question = questions[i].question;
        data.expectedAns = questions[i].expectedAns;
        data.isUrl = questions[i].isUrl;
        data.isMultiple = questions[i].isMultiple == "true" ? true : false;
        data.selectedAns = [];
        if(questions[i].isMultiple == "true"){
          data.selectedAns = new Array(questions[i].expectedAns.length);
          data.selectedAns.fill(-1);
        }
        onBoardingData.data.push(data);
      }
      this.setState({ onBoardingData });
      console.log("Questions Data Recieved - ",onBoardingData);
    }
  }
  componentDidMount(){
    const setupUserName = this.props.navigation.getParam("firstName", "PocketCFO");
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
  

  handleFinishSetup = (showOverlay = false) => {
    if(showOverlay){
        if(this.state.onBoardingData.isFetched == true && this.state.onBoardingData.data.length > 0){
          this.setState({ isSpinner: true });
        setTimeout(()=>{
          this.setState((prevState)=>{ return { isSpinner: !prevState.isSpinner,
            isQuestionOverlayVisible: !prevState.isQuestionOverlayVisible } })
        },1000);
        }else{
          this.props.navigation.navigate("Dashboard");
        }
      return;
    }
    // this.setState({
    //   onBoardingData: { ...this.state.onBoardingData,currentPercentage: 100 },
    //   isQuestionOverlayVisible: false
    // },()=>{
    //   setTimeout(()=>{
    //         this.setState({ isSpinner: false });
    //         this.props.navigation.navigate("Dashboard");
    //       },3000);
    // });
    // this.setState({ isSpinner: true });
    
    this.setState((prevState)=>{
      return {
        onBoardingData: { ...prevState.onBoardingData,currentPercentage: 100
        },
      }
    },()=>{
      setTimeout(()=>{
        this.setState({ isSpinner: true,isQuestionOverlayVisible: false },()=>{
          
           this.setState({ isSpinner: false },()=>{
            setTimeout(()=>{
              this.props.navigation.navigate("Dashboard");
            },150);
           })
          
        })
      },500);
    });
  };

  chooseSingleAnswers = (currentQuestionIndex,answerIndex) => {

    let {
      totalQuestions,
      currentPercentage,
      data,
      currentQuestion,
      isFetched
    } = this.state.onBoardingData;
    
    let updatedData = data;
    updatedData[currentQuestionIndex].selectedAns = [ answerIndex ];
    this.setState({
      onBoardingData:{
        ...this.state.onBoardingData,
        data: updatedData
      }
    },()=>{
      console.log("Testing here - ");
      console.log(this.state.onBoardingData.data[currentQuestionIndex].selectedAns);
    })
    

  }

  chooseMultipleAnswers = (currentQuestionIndex,answerIndex,isNoneOfTheAbove = false) => {
    
    let {
      totalQuestions,
      currentPercentage,
      data,
      currentQuestion,
      isFetched,
      noneOfTheAbove
    } = this.state.onBoardingData;

    if(isNoneOfTheAbove){
      let updatedData = data;
      let updatedSelectedAnswer = new Array(data[currentQuestion].expectedAns.length);
      updatedSelectedAnswer.fill(-1);
      updatedData[currentQuestion].selectedAns = updatedSelectedAnswer;
      this.setState({
        onBoardingData:{
          ...this.state.onBoardingData,
          data: updatedData,
          noneOfTheAbove: true
        }
      });

      return;
    }
    let updatedData = data;
    let updatedSelectedAnswer = data[currentQuestionIndex].selectedAns;
    if(data[currentQuestionIndex].selectedAns[answerIndex] == -1){ 
        updatedSelectedAnswer[answerIndex] = answerIndex;
    }else{
      updatedSelectedAnswer[answerIndex] = -1;
    }
    

    updatedData[currentQuestionIndex].selectedAns = updatedSelectedAnswer;
    this.setState({
      onBoardingData:{
        ...this.state.onBoardingData,
        data: updatedData,
        noneOfTheAbove: false
      }
    },()=>{
      console.log("Multiple Testing here - ");
      console.log(this.state.onBoardingData.data[currentQuestionIndex].selectedAns);
    })
    

  }

  renderOnBoardingQestions = () => {
    if(this.state.onBoardingData.isFetched){
      const {
        totalQuestions,
        currentPercentage,
        data,
        currentQuestion,
        isFetched,
        noneOfTheAbove
      } = this.state.onBoardingData;
    return(
      <Fragment>

      <View style={{ alignItems:"center",alignSelf:"center",
      width:"95%",flexDirection:"row",justifyContent:"space-between" }}>

      <View style={{ width: "80%" }}><Text style={{ color:"#FFF",fontSize: 12, fontWeight: "600" }}>Tell us more about yourself while you wait</Text></View>
        
      <ScrollView  contentContainerStyle={{ alignItems:"center" }}  horizontal={true} >
      {
        data.map((singleData,index)=>{
          return <View key={ index }  style={{ marginRight:5,width:index == currentQuestion ? 9 : 6,height: index == currentQuestion ? 9 : 6,borderRadius:100,backgroundColor:"#FFF" }}></View>
        })
      }
      </ScrollView>
      
      </View>
      <View style={{ alignSelf:"center",
        borderRadius: 10,marginTop:15,
        width:"95%",
        paddingVertical: 40,
        // paddingTop:25,
        // paddingBottom:15,
        paddingHorizontal: 20, backgroundColor:"#FFF" }}>

        <View style={{ flexDirection: "column" }}> 
          <Text style={{ fontSize: 16,color:"#000" }}>{ data[currentQuestion].question }</Text>

          <View style={{ flexDirection:"row",justifyContent:"space-between",
          flexWrap:"wrap",marginTop:40,borderColor:"red",borderWidth:0 }}>

          {
            data[currentQuestion].isMultiple == false ?
            
            data[currentQuestion].expectedAns.map((singleAnswer,answerIndex)=>{
             
             return <TouchableOpacity key={answerIndex} 
             onPress={ () => { this.chooseSingleAnswers(currentQuestion,answerIndex); }} 
             style={{ paddingHorizontal:10,marginVertical:7,
             alignItems:"center",justifyContent:"center",
             width:140,height:30,borderRadius:40,
             backgroundColor: data[currentQuestion].selectedAns[0] == answerIndex ? "#007AFF" : "#E0EBFF" }}>
                <Text style = {{ 
                  color: data[currentQuestion].selectedAns[0] == answerIndex ? "#fff" : "#1D1E1F" ,
                  fontSize: 12 }}>{ singleAnswer.answer }</Text>
             </TouchableOpacity>
           
            }) : 
            
            data[currentQuestion].expectedAns.map((singleAnswer,answerIndex)=>{
             
             return <TouchableOpacity key={answerIndex} 
             onPress={ () => { this.chooseMultipleAnswers(currentQuestion,answerIndex); }} 
             style={{ paddingHorizontal:10,marginVertical:7,
             alignItems:"center",justifyContent:"center",
             width:120,height:30,borderRadius:40,
             backgroundColor: data[currentQuestion].selectedAns[answerIndex] == answerIndex ? "#007AFF" : "#E0EBFF" }}>
                <Text style = {{ 
                  color: data[currentQuestion].selectedAns[answerIndex] == answerIndex ? "#fff" : "#1D1E1F" ,
                  fontSize: 12 }}>{ singleAnswer.answer }</Text>
             </TouchableOpacity>
           
            })
          }
          
          </View>
          {
            data[currentQuestion].isMultiple == true ?
            <TouchableOpacity 
             onPress={ () => { this.chooseMultipleAnswers(0,0,true); }} 
             style={{ paddingHorizontal:23,marginVertical:8,
             alignSelf:"center",
             alignItems:"center",justifyContent:"center",
             height:35,borderRadius:40,
             backgroundColor: noneOfTheAbove == true ? "#007AFF" : "#7FBDFF" }}>
                <Text style = {{ 
                  color: noneOfTheAbove == true ? "#fff" : "#000" ,
                  fontSize: 12 }}>None of the Above</Text>
             </TouchableOpacity>
            : null
          }
        </View>

      </View>
      </Fragment>
    );
    }else{
      return null;
    }
  }
  questionOverlayRender = () => {
    const {
      isQuestionOverlayVisible,
      onBoardingData,
      setupUserName
    } = this.state;
    const {
      currentPercentage,
      isFetched,data
    } = onBoardingData;
    if(!isFetched){
      return null;
    }
    return(
     <Fragment>
       <Overlay
        overlayStyle = {{ height:"100%",
        width: "100%",marginTop: 25,
        paddingVertical:50 }}
        windowBackgroundColor="rgba(0, 0, 0, 0.7)" 
        overlayBackgroundColor="rgba(0, 0, 0, 0)" 
        isVisible = { isQuestionOverlayVisible }
       >
       <ScrollView>
        
        <View style={{marginTop:20,alignSelf:"center"}} >
                       <Text style={ styles.onBoardingTextStyle }>Sit Tight {setupUserName},</Text>
                       <Text style={{ ...styles.onBoardingTextStyle,marginTop:5 }}>We're Building Your Dashboard</Text>
        </View>


        <View style={{alignSelf:"center",marginTop:100}}>
               <ProgressCircle 
                         percent={currentPercentage}
                         radius={65}
                         borderWidth={0.5}
                         containerStyle={{height:117,width:117}}
                         color="#3399FF"
                         shadowColor="#999"
                         bgColor="#fff"
                     >
                         <Text style={{ fontSize: 18 }}>{ Math.floor(currentPercentage)+"%" }</Text>
                </ProgressCircle>
        </View>

        <View style = {{ marginTop: 130  }}>
          <this.renderOnBoardingQestions />
        </View>
       </ScrollView> 
       </Overlay>
     </Fragment>


    );
  }
  
  onSwipeLeft = (gestureState) => {
    
    const { onBoardingData } = this.state;
    if(onBoardingData.isFetched == true && this.state.isQuestionOverlayVisible){
      const {
        totalQuestions,
        currentQuestion,
        data,noneOfTheAbove
      } = this.state.onBoardingData;
      
      if(data[currentQuestion].selectedAns.length == 0 &&
        data[currentQuestion].isMultiple == false){
        return;
      }
      if(data[currentQuestion].isMultiple == true){
        let isButtonSelected = false;
        for(let i=0;i<data[currentQuestion].selectedAns.length;i++){
          if(data[currentQuestion].selectedAns[i] > -1){
            isButtonSelected = true;
            break;
          }
        }
        if(isButtonSelected){
          this.handleFinishSetup();
        }else{
          if(noneOfTheAbove){
            this.handleFinishSetup();
          }else{
            return;
          }
        }
      }
      console.log("Recieving total questions  - ",totalQuestions);
      if(currentQuestion < totalQuestions-1){
        this.setState({ 
          onBoardingData:{
            ...this.state.onBoardingData,
            currentQuestion: this.state.onBoardingData.currentQuestion+1,
            currentPercentage: data[currentQuestion+1].percentage
          }
         })
      }
    }
  }
 
  onSwipeRight = (gestureState) => {
    const { onBoardingData } = this.state;
    if(onBoardingData.isFetched == true && this.state.isQuestionOverlayVisible){
      const {
        totalQuestions,
        currentQuestion,
      } = this.state.onBoardingData;

      if(currentQuestion > 0){
        this.setState({ 
          onBoardingData:{
            ...this.state.onBoardingData,
            currentQuestion: this.state.onBoardingData.currentQuestion-1
          }
         })
      }
    }
  }
  toggleDataSecuredModal = () => {
    this.setState((prevState)=>({ dataSecuredModal: !prevState.dataSecuredModal }));
  }
  dataSecureTips = React.memo(({title,text}) => { 
    return(
      <View style={styles.overlayTipsMainView}>
        <View style={{ width: wp('9%'),justifyContent: "center" }}>
          <Image source={BlueLockImg} style={{ width:20,height:20 }}/>
        </View>
        <View style={{ width: wp('91%') }}>
           <Text style={styles.overlayTipsTitleStyle}>{`${title}`}</Text>
           <Text style={styles.overlayTipsTextStyle}>{`${text}`}</Text>
        </View>
      </View>
    );
  });
  dataSecuredModal = React.memo(({ isVisible: isModalVisible }) => {
    return(
       <Overlay
        overlayStyle = {styles.dataSecureOverlay}
        windowBackgroundColor="rgba(0, 0, 0, 0.7)" 
        overlayBackgroundColor="rgba(0, 0, 0, 0)" 
        isVisible = {isModalVisible}>
         <View style={styles.dataSecureoverlayMainContainer}>
             <View style={{ marginTop: 8,alignItems:"center" }}>
              <Image source={PlaidSecureImg} style={{ height:70,width: 70 }} />
             </View>
             <Text style={styles.upperOverlayUpperText}>
                {'We partner with Plaid to \n securely link your account'}
              </Text>

              <View style={styles.overlayTipsContainer}>
              {
                PLAID_SECURE_MODAL.map((singleModal,index)=>{
                    return <this.dataSecureTips title={singleModal.title} text={singleModal.text} key={index} />
                })
              }
              </View>

           </View>
       
       <TouchableOpacity style={{ 
         marginTop:20,
         justifyContent:"center",alignItems:"center",alignSelf:"center",
         height:60,width:60,borderRadius:100,backgroundColor:"#4E5050"
       }}
       onPress={this.toggleDataSecuredModal}>
         <Entypo name={"cross"} size={35} color={"#FFF"} />
       </TouchableOpacity>
       </Overlay>
    );
  });
  render() {
    
    const firstName = this.props.navigation.getParam("firstName", "PocketCFO");
    const { questionsData,isQuestionOverlayVisible,isSpinner,dataSecuredModal } = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <ScrollView style={{ 
        width: "100%",paddingBottom: 0,
     }}>
        <Spinner
          visible={isSpinner}
        />
        { dataSecuredModal == true ? <this.dataSecuredModal isVisible={dataSecuredModal} /> : null}
        <Text h3 style={{marginTop:40,textAlign:"center"}}>{`Welcome, ${firstName}`}</Text>
        { this.state.onBoardingData.isFetched == true && this.state.isQuestionOverlayVisible == true ?
          <GestureRecognizer
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
          config={config}
          style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
          }}>
        <this.questionOverlayRender />
        </GestureRecognizer> : null
         }
        <Text h4 style={{ textAlign:"center" }}>Let's set up your PocketCFO</Text>
        
        <View style={styles.cardContainer}>
        {this.state.hasSetupBusinessProfile ? (
                <View style={{flexDirection:"row",alignSelf:"flex-end",flex:1,marginTop:0,position:"absolute",zIndex:10 }}>
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
                  <Text style={{fontSize:12,marginTop: 7}}>provide information on your business.</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          </View>
          <View style={styles.cardContainer2}>
          {this.state.hasSetupBankingIntegration ? (
                <View style={{flexDirection:"row",alignSelf:"flex-end",flex:1,marginTop:10,position:"absolute",zIndex:10 }}>
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
                  <View style={styles.dataSecuredParentContainer}>
                    <Text style={styles.bold}>Bank integration</Text>
                    <TouchableOpacity onPress={this.toggleDataSecuredModal} style={styles.dataSecuredContainer}>
                      <FontAwesome name={"lock"} color={"#7C7C7C"} />
                      <Text style={{ color:"#7C7C7C",fontSize: 10,textAlign:"right" }}>Data Secured</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{fontSize:12,marginTop: 7}}>connect your business bank account.</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          </View>
          <View style={styles.cardContainer2}>
          {this.state.hasSetupAccountingIntegration ? (
                <View style={{flexDirection:"row",alignSelf:"flex-end",flex:1,marginTop:10,position:"absolute",zIndex:10 }}>
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
                  <Text style={{fontSize:12,marginTop: 7}}>connect your accounting software.</Text>
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
          containerStyle={{ marginTop: "13%", width: "85%", height: "15%",alignSelf:"center" }}
          title="Finish"
          onPress={()=>{ this.handleFinishSetup(true); }}
        />
      </ScrollView>
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
    backgroundColor: "#F1F3F5",
    flex: 1,
  },
  cardContainer: {
    width: "90%",
    marginTop: "13%",
    alignSelf:"center"
  },
  cardContainer2: {
    width: "90%",
    marginTop: 5,
    alignSelf:"center"
  },
  flexRow: { flexDirection: "row", marginLeft: "-8.5%" },
  flexCol: { flexDirection: "column" },
  textContainer: {
    flexDirection: "column",
    marginLeft: "2.5%"
  },
  onBoardingTextStyle: {
    textAlign:"center", color:"#FFFFFF",fontWeight:"bold",fontSize:20,lineHeight:22
  },
  dataSecuredContainer: {
    marginLeft:6,
    paddingHorizontal:8,
    width: 95,
    height: 23,
    backgroundColor:"#EBEBEB",
    borderRadius: 50,
    alignItems:"center",
    flexDirection: "row",
    justifyContent:"space-between"
  },
  dataSecuredParentContainer: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  dataSecureOverlay: {
    height: hp('100%'),
    width:wp('100%'),
    justifyContent:"center" 
  },
  dataSecureoverlayMainContainer: {
      paddingVertical:30,
      alignSelf:"center",
      width: wp('85%'),
      backgroundColor:"#FFF",
      borderRadius: 10
  },
  upperOverlayUpperText: { 
    textAlign: 'center',
    marginTop: 25,
    fontSize: 14,
    lineHeight: 20,
    color:"#1D1E1F",
    fontWeight: '600' 
  },
  overlayTipsContainer: {
    marginTop: 15,
    borderColor:"red",
    borderWidth: 0,
    alignSelf: "center",
    width: wp('60%')
   },
   overlayTipsMainView: { 
     flexDirection:"row",
     justifyContent: "space-between",
     marginVertical:10 
  },
  overlayTipsTextStyle: {
    marginTop: 5,
    width: wp("50%"),
    opacity: 0.5,
    color: "#000",
    fontSize: 12,
    textAlign: "left",
    lineHeight: 18
  },
  overlayTipsTitleStyle: { 
    color: '#1D1E1F',
    fontSize: 13,
    fontWeight:"600" 
  }

});


export default DetectPlatform(Setup,styles.container);