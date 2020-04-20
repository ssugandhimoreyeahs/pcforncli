// updated


import React, { Component } from "react";
import { View , Image,Text, ScrollView, TextInput, StyleSheet,Alert, TouchableOpacity, BackHandler, StatusBar, ActivityIndicator} from "react-native";
import { Ionicons} from '@expo/vector-icons';
//import { AntDesign,SimpleLineIcons} from '@expo/vector-icons';
import AntDesign from "react-native-vector-icons/AntDesign";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Constants from 'expo-constants';
import { Button } from "react-native-elements";
import Spinner from 'react-native-loading-spinner-overlay';
import { getUserTransactions, getUser, fetchCurrentBalance, getUserOutFlowTransactions,getUserInflowTransactions } from "../../../api/api";
import Timeout from "./timeout";
import { SafeAreaView } from "react-navigation";
//import { getUser } from "../../../api/api";
import DetectPlatform from "../../../DetectPlatform";
import { numberWithCommas,firstLetterCapital,PLAID_EXPENSE_CATEGORIES } from "../../../api/common";
import { connect } from "react-redux";
import { fetchCurrentBalancePromise } from "../../../api/api";
import { ALL_MONTHS } from "../../../constants/constants";
import { fetchExpensesAsyncCreator  } from "../../../reducers/expensecategory";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";

SimpleLineIcons.loadFont();
AntDesign.loadFont();

function Separator() {
  return <View style={styles.separator} />;
}



const TransactionComponent = (props) => {
  console.log("props recieve here - for the testin - ",props);
  const { userData } = props;
  let readyAmount = ``;
  let categoryButtonText = ``;
  let amount = Math.abs(props.price);
  let detailInfo = ``;
  //add category button text
  if(props.fullTransactionObj.category == props.fullTransactionObj.defaultCategory){
    categoryButtonText = `+ Category`;
    detailInfo = props.fullTransactionObj.category;
  }else{
    detailInfo = `Detail Info`;
    categoryButtonText = `${props.fullTransactionObj.category}`;
  }

  if(props.transactionTypes == "INFLOW"){
    readyAmount = `$${amount}`;
  }else if(props.transactionTypes == "OUTFLOW"){
    readyAmount = `-$${amount}`;
  }else{

    if(props.fullTransactionObj.transactionType == "Debit"){
      readyAmount = `-$${numberWithCommas(amount)}`;
    }else{
      readyAmount = `$${numberWithCommas(amount)}`;
    }

  }
  let categoryBackgroundColor = `#6C5BC1`;
  for(let i=0; i<PLAID_EXPENSE_CATEGORIES.length; i++){
    if(props.fullTransactionObj.category.toLowerCase() === PLAID_EXPENSE_CATEGORIES[i].categoryName.toLowerCase()){
      categoryBackgroundColor = PLAID_EXPENSE_CATEGORIES[i].categoryColor;
      break;
    }
  }
  
  return(
    <React.Fragment>
      <View style={{ marginTop:20,
        borderWidth:0,borderColor:"red",
        width: "90%",
        alignSelf:"center" }}>

        <View style={{ flexDirection:"row",justifyContent:"space-between",
        
         }}>
         <Text style={{ 
           color:"#1D1E1F",fontSize:15,
           width: "60%" }}>{ props.name }</Text>
         <Text style={{ fontSize:17,
          color:"#1D1E1F",width:"40%",textAlign:"right"
          }}>{ readyAmount }</Text>
         </View>
      
        <View style={{ marginTop:15,
          borderWidth:0,borderColor:"blue",
          flexDirection:"row",
          justifyContent:"space-between" }} >

          <View style={{ justifyContent:"center",alignItems:"center" }}><Text style={{
            fontSize:11,opacity:0.5,color:"#1D1E1F"
          }}>{ detailInfo }</Text></View>

          <TouchableOpacity 
            onPress={()=>{
              if(userData.bankStatus == "linked"){
                //console.log("Full transaction obj - ",props.fullTransactionObj);
                props.navigation.navigate("NCategoryScreen",{ 
                  showEditTray: true,
                  currentExecutingTransaction:props.fullTransactionObj,
                  resetTransactionScreen: (reciever1 = false,reciever2 = false) => { 
                    props.resetTransactionScreen(); 
                  }});
              }else{
                Alert.alert(
                       'Bank Disconnected',
                       `Your bank account has been disconnected. Please reconnect again.`,
                       [
                         {text: 'Cancel'},
                         {
                           text: 'Reconnect',
                           onPress: () =>{ props.navigation.navigate("Integration") },
                           style: 'cancel',
                         }
                         
                       ],
                       {cancelable: false},
                     );
              }
            }}
            style={{ backgroundColor: categoryButtonText == "+ Category" ? "#FFF" : categoryBackgroundColor,
            borderColor: categoryButtonText == "+ Category" ? "#000" : categoryBackgroundColor,
            borderWidth:0.3,
            height: 24,justifyContent:"center",
            alignItems:'center',
            paddingHorizontal: 20,
            borderRadius:50,
           }}>

            <Text style={{ fontSize:11,
              color: categoryButtonText == "+ Category" ? "#000" : "#FFF"
            }}>{ firstLetterCapital(categoryButtonText) }</Text>

          </TouchableOpacity>

        </View>
      </View>

      <View style={{ 
        borderBottomColor:"#1D1E1F",borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.2,width:"90%",alignSelf:"center",
        marginTop: 15 }}></View>
    </React.Fragment>
  );
}
const ShowDateHeadings = ({date}) => {
  ////console.log("Date Recieved in Transactions - ",date);
  //let currentTransactionDateObj = new Date(date);
  let currentTransactionDateObj = date.split("-");
  //console.log("Test here - ",currentTransactionDateObj);
  // return(
  // <Text style={{width: 100, height:13, fontSize:11,color:"#000000", marginTop:14,marginLeft:18,paddingHorizontal:5}}>{`${ALL_MONTHS[currentTransactionDateObj.getMonth()]} ${currentTransactionDateObj.getDate()}, ${currentTransactionDateObj.getFullYear()}`}</Text>
  // );

  //update using the split logic
  return(
    <Text style={{width: 100, height:13, fontSize:11,color:"#000000", marginTop:14,marginLeft:18,paddingHorizontal:5}}>{`${ALL_MONTHS[ parseInt(currentTransactionDateObj[1]) - 1 ]} ${currentTransactionDateObj[2]}, ${currentTransactionDateObj[0]}`}</Text>
  );
};
class Checking extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      userAccountType:'',
      isNoAllTransaction: false,
      activityIndicatorColor:'#070640',
      isSpinner:true,
      transactions:[],
      isBodyLoaded:false,
      isUserLinkedWithBank:false,
      showTimeoutScreen:false,
      seprateDate:[],
      currentBalance:"0",

      //states for managing the pagination
      skipPoint:0,
      limitPoint:25,
      totalSlotsForCovering:0,
      currentSlot:0,
      remaningTransactions:0,
      totalNumOfTransactions:0,
      fetchTransactionsPerScroll : 25,
      isShowActivityIndicator:true,

      allowStartSearch: true,

      outflowinflowstate: {

        currentAction: 'All',
        
        inflowData: { 
            isNoInflowTransactions:false,
            seprateDate:[],
            inflowTransactions:[],
  
            isFetchedFirstTime:false,
            inflowTotalTransactions:0,
            totalTransactionSlotsToBeCovered:0,
            skipPoint:0,
            limitPoint:25,
  
            lastTransactionalSlot:0,
            inflowIndicator: true,
            currentExecutingSlot:0,
            isAllActionCompleted:false
        },
        outflowData: { 
          isNoOutflowTransactions: false,
          seprateDate:[],
          outflowTransactions:[],

          isFetchedFirstTime:false,
          outflowTotalTransactions:0,
          totalTransactionSlotsToBeCovered:0,
          skipPoint:0,
          limitPoint:25,

          lastTransactionalSlot:0,
          outflowIndicator: true,
          currentExecutingSlot:0,
          isAllActionCompleted:false
        },
        outflowinflowSpinner: false
      }
    }
  }


  resetState = () => {

    return {
      isNoAllTransaction: false,
      activityIndicatorColor:'#070640',
      isSpinner:true,
      transactions:[],
      isBodyLoaded:false,
      isUserLinkedWithBank:false,
      showTimeoutScreen:false,
      seprateDate:[],
      currentBalance:"0",

      //states for managing the pagination
      skipPoint:0,
      limitPoint:25,
      totalSlotsForCovering:0,
      currentSlot:0,
      remaningTransactions:0,
      totalNumOfTransactions:0,
      fetchTransactionsPerScroll : 25,
      isShowActivityIndicator:true,

      allowStartSearch: true,

      outflowinflowstate: {

        currentAction: 'All',
        
        inflowData: { 
            isNoInflowTransactions:false,
            seprateDate:[],
            inflowTransactions:[],
  
            isFetchedFirstTime:false,
            inflowTotalTransactions:0,
            totalTransactionSlotsToBeCovered:0,
            skipPoint:0,
            limitPoint:25,
  
            lastTransactionalSlot:0,
            inflowIndicator: true,
            currentExecutingSlot:0,
            isAllActionCompleted:false
        },
        outflowData: { 
          isNoOutflowTransactions: false,
          seprateDate:[],
          outflowTransactions:[],

          isFetchedFirstTime:false,
          outflowTotalTransactions:0,
          totalTransactionSlotsToBeCovered:0,
          skipPoint:0,
          limitPoint:25,

          lastTransactionalSlot:0,
          outflowIndicator: true,
          currentExecutingSlot:0,
          isAllActionCompleted:false
        },
        outflowinflowSpinner: false
      }
    }

  }
  resetTransactionScreen = () => { 
      this.setState(this.resetState(),()=>{
        setTimeout(()=>{
          this.readyTransactionPage();
          setTimeout(()=>{ this.props.fetchExpenseByCategory(3);
            //for the expenses inner screen
            this.props.fetchMainExepenseByCategory(0);
          },500);
        },100);
      });

      
  }
   getUnique= (array) => {
    var uniqueArray = [];
    
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}

showUserIsNotConnectedToBankAlert = () => {
  Alert.alert(
    'Bank Disconnected',
    `Your bank account has been disconnected. Please reconnect again.`,
    [
      {text: 'Cancel'},
      {
        text: 'Reconnect',
        onPress: () =>{ this.props.navigation.navigate("Integration") },
        style: 'cancel',
      }
      
    ],
    {cancelable: false},
  );
}

fetchTransactionsOnEachScroll = async (isDisableActivityIndicator = false,isDisableSearch = false) => {
  if(isDisableSearch == false){
    const userTransactions = await  getUserTransactions(this.state.skipPoint,this.state.limitPoint);
      ////console.log(userTransactions.transactions.allTransactions.transactions[0]);
      if(userTransactions.result == true){
        const seprateDates = [];
      userTransactions.transactions.map( res => {
          seprateDates.push(res.date);
      });
      const seprateDate = this.getUnique([...seprateDates]);
      ////console.log("Current Slot ",this.state.currentSlot);
      this.setState({ seprateDate:[...this.state.seprateDate,...seprateDate],transactions:[...this.state.transactions,...userTransactions.transactions] },()=>{
        if(isDisableActivityIndicator == true){
          this.setState({ isShowActivityIndicator: false });
        }
      });
    }
  }
}
fetchTransactionsFirstTime = async (userData) => {
      const userTransactions = await  getUserTransactions(this.state.skipPoint,this.state.limitPoint);
      ////console.log(userTransactions.transactions.allTransactions.transactions[0]);
      if(userTransactions.result == true){
        if(userTransactions.accountType != undefined && userTransactions.accountType != null && userTransactions.accountType != ""){
          this.setState({ userAccountType: userTransactions.accountType });
        }
        if(userTransactions.totalTransactions == 0){
            this.setState({
              isNoAllTransaction:true,
              allowStartSearch: false,
              isShowActivityIndicator: false,
              isSpinner:false,isUserLinkedWithBank: true,isBodyLoaded:true,
              outflowinflowstate: {
                ...this.state.outflowinflowstate,
                inflowData: {
                  ...this.state.outflowinflowstate.inflowData,
                  inflowIndicator: false
                }
              }
            })

            if(userData.bankStatus != "linked"){
              setTimeout(()=>{
                this.showUserIsNotConnectedToBankAlert();
              },200);
            }
        }else if(userTransactions.totalTransactions <= this.state.fetchTransactionsPerScroll){
            
            const seprateDates = [];
            userTransactions.transactions.map( res => {
                seprateDates.push(res.date);
            });
            const seprateDate = this.getUnique(seprateDates);
            // //console.log("Total slots to be covering ",totalSlotsForCovering);
            this.setState({ isShowActivityIndicator:false,allowStartSearch:false,seprateDate,transactions:userTransactions.transactions,totalNumOfTransactions:userTransactions.totalTransactions,isSpinner:false,isUserLinkedWithBank: true,isBodyLoaded:true },()=>{

          //code for showing alert that the user is not connected to the bank
          if(userData.bankStatus != "linked"){
            setTimeout(()=>{
              this.showUserIsNotConnectedToBankAlert();
            },200);
          }

      });
        }else{
          const seprateDates = [];
      userTransactions.transactions.map( res => {
          seprateDates.push(res.date);
      });
      const seprateDate = this.getUnique(seprateDates);

      const totalSlotsForCovering = parseInt(userTransactions.totalTransactions / this.state.fetchTransactionsPerScroll);
      const remaningTransactions = parseInt(userTransactions.totalTransactions % this.state.fetchTransactionsPerScroll);
      ////console.log("Total slots to be covering ",totalSlotsForCovering);
      this.setState({ seprateDate,transactions:userTransactions.transactions,totalSlotsForCovering,remaningTransactions,totalNumOfTransactions:userTransactions.totalTransactions,isSpinner:false,isUserLinkedWithBank: true,isBodyLoaded:true },()=>{

          //code for showing alert that the user is not connected to the bank
          if(userData.bankStatus != "linked"){
            setTimeout(()=>{
              this.showUserIsNotConnectedToBankAlert();
            },200);
          }

      });
        }
        
      }else{
        this.setState({
          isSpinner: false
        },()=>{
          setTimeout(()=>{
            Alert.alert("Message","Error Try Again!",[
              { text: 'Ok',
            onPress:()=>{
              this.props.navigation.goBack();
            } }
            ],{
              cancelable: false
            });
          },100); 
        })
      }
  }
  
  readyTransactionPage = () => {
    const { userData } = this.props.reduxState.userData;
    if(userData.bankIntegrationStatus == true){
      

      fetchCurrentBalancePromise().then((userBalance)=>{
        if(userBalance.result == true){
          this.setState({ currentBalance: userBalance.available_balance });
        }    
      }).catch((error)=>{
          //console.log("current Balance promise error - on the checking transaction page resposne - ",error);
          this.setState({ currentBalance: 0 });
      })

      
      this.fetchTransactionsFirstTime(userData);
    
    }else{
      this.setState({ isSpinner: false,showTimeoutScreen:true });
    }
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    //const response = await getUser();
    this.readyTransactionPage();
    
  }

  componentWillUnmount(){
    this.setState({ isBodyLoaded:false,
      isUserLinkedWithBank:false,
      showTimeoutScreen:false });
    BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }

  handleBackButton=(nav)=> {
    if (!nav.isFocused()) {
      BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
      return false;
    }else{
      nav.goBack();
      ////console.log("Transaction")
      return true;
    }
  }
  handleScroll = (event) => {
     // //console.log(event.nativeEvent.contentOffset.y);
     
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    //console.log("---------------------------------------onScroll testing-----------------------------");
    //console.log(layoutMeasurement.height);
    //console.log(contentOffset.y);
    //console.log(contentSize.height);
    //console.log("--------------------------------------------------------------------------------------");
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  triggerOutflowInflowFetch = async () => {
    const { currentAction } = this.state.outflowinflowstate;

    if(currentAction == 'All'){
      this.setState((prevState)=>{
        return {
          outflowinflowstate:{ ...prevState.outflowinflowstate,currentAction: "All",outflowinflowSpinner:false  },
        }
      })
    }else if(currentAction == 'Outflow'){
      //console.log("Triggering outflow 1st Time");
      if(this.state.outflowinflowstate.outflowData.isFetchedFirstTime == false){
        const outflowResponse = await getUserOutFlowTransactions(this.state.outflowinflowstate.outflowData.skipPoint,this.state.outflowinflowstate.outflowData.limitPoint);
        
      if(outflowResponse.result == true){

        if(outflowResponse.outflowTransactions.totalTransactions == 0){
          this.setState((prevState)=>{
            return {
              outflowinflowstate: {
                ...prevState.outflowinflowstate,
                outflowData:{
                  ...prevState.outflowinflowstate.outflowData,
                  outflowIndicator: false,
                  isNoOutflowTransactions:true,
                  isFetchedFirstTime:true,
                  isAllActionCompleted:true
                },
                outflowinflowSpinner: false
              }
            }
          });
        }

        else if(outflowResponse.outflowTransactions.totalTransactions > 0){

          if(outflowResponse.outflowTransactions.totalTransactions <= this.state.fetchTransactionsPerScroll){

            //console.log("outflow total transaction length triggered less than or equal to 25- ",outflowResponse.outflowTransactions.totalTransactions);
            let seprateOutflowDates = []
          outflowResponse.outflowTransactions.transactions.map( singleOutflowTransaction => {
              seprateOutflowDates.push(singleOutflowTransaction.date);
          })

          let filteredSepreateOutflowDates = this.getUnique(seprateOutflowDates);

          let totalTransactionSlotsToBeCovered = parseInt(outflowResponse.outflowTransactions.transactions.length / this.state.fetchTransactionsPerScroll);
          let lastTransactionalSlot = outflowResponse.outflowTransactions.transactions.length % this.state.fetchTransactionsPerScroll;
          this.setState((prevState)=>{
              return {
                outflowinflowstate: {
                  ...prevState.outflowinflowstate,
                  outflowData: { 
                    ...prevState.outflowinflowstate.outflowData,
                    seprateDate:filteredSepreateOutflowDates,
                    outflowTransactions: outflowResponse.outflowTransactions.transactions,
                    
                    isFetchedFirstTime: true,
                    outflowTotalTransactions:outflowResponse.outflowTransactions.totalTransactions,
                    totalTransactionSlotsToBeCovered:0 ,

                    skipPoint:25,
                    limitPoint:25,

                    lastTransactionalSlot: 0,

                    outflowIndicator: false,

                    currentExecutingSlot:0,
                    isAllActionCompleted:true

                  },
                  outflowinflowSpinner: false
                }
              }
          })

          

          }else{

            //console.log("outflow total transaction length triggered more than 25- ",outflowResponse.outflowTransactions.totalTransactions);
            let seprateOutflowDates = []
          outflowResponse.outflowTransactions.transactions.map( singleOutflowTransaction => {
              seprateOutflowDates.push(singleOutflowTransaction.date);
          })

          let filteredSepreateOutflowDates = this.getUnique(seprateOutflowDates);

          let totalTransactionSlotsToBeCovered = parseInt(outflowResponse.outflowTransactions.totalTransactions / this.state.fetchTransactionsPerScroll);
          let lastTransactionalSlot = outflowResponse.outflowTransactions.totalTransactions % this.state.fetchTransactionsPerScroll;
          this.setState((prevState)=>{
              return {
                outflowinflowstate: {
                  ...prevState.outflowinflowstate,
                  outflowData: { 
                    ...prevState.outflowinflowstate.outflowData,
                    seprateDate:filteredSepreateOutflowDates,
                    outflowTransactions: outflowResponse.outflowTransactions.transactions,
                    isFetchedFirstTime: true,
                    outflowTotalTransactions:outflowResponse.outflowTransactions.totalTransactions,
                    totalTransactionSlotsToBeCovered ,
                    lastTransactionalSlot,
                    currentExecutingSlot:1,
                    

                  },
                  outflowinflowSpinner: false
                }
              }
          })
          }
        }else{
          this.setState((prevState)=>{
            return {
              outflowinflowstate: {
                ...prevState.outflowinflowstate,
                outflowinflowSpinner: false
              }
            }
          });
        }
      }
      }else{
        this.setState((prevState)=>{
          return {
            outflowinflowstate: {
              ...prevState.outflowinflowstate,
              outflowinflowSpinner: false,
              outflowData: {
                ...prevState.outflowinflowstate.outflowData,
                isFetchedFirstTime:true,
                isAllActionCompleted:true,
                isNoOutflowTransactions: true
              }
            }
          }
        });
      }
      
    }else{

     
      //code here for the inflow transactions to be fetched from the api once time

      //console.log("Triggering inflow transactions 1st Time");
      if(this.state.outflowinflowstate.inflowData.isFetchedFirstTime == false){
        const inflowResponse = await getUserInflowTransactions(this.state.outflowinflowstate.inflowData.skipPoint,this.state.outflowinflowstate.inflowData.limitPoint);
        
      if(inflowResponse.result == true){

        if(inflowResponse.inflowTransactions.totalTransactions == 0){
          this.setState((prevState)=>{
            return {
              outflowinflowstate: {
                ...prevState.outflowinflowstate,
                inflowData:{
                  ...prevState.outflowinflowstate.inflowData,
                  inflowIndicator: false,
                  isNoInflowTransactions:true,
                  isFetchedFirstTime:true,
                  isAllActionCompleted:true
                },
                outflowinflowSpinner: false
              }
            }
          });
        }
        else if(inflowResponse.inflowTransactions.totalTransactions > 0){

          if(inflowResponse.inflowTransactions.totalTransactions <= this.state.fetchTransactionsPerScroll){

            //console.log("inflow total transaction length triggered less than or equal to 25- ",inflowResponse.inflowTransactions.totalTransactions);
            let seprateOutflowDates = []
            inflowResponse.inflowTransactions.transactions.map( singleOutflowTransaction => {
              seprateOutflowDates.push(singleOutflowTransaction.date);
          })

          let filteredSepreateInflowDates = this.getUnique(seprateOutflowDates);

          // let totalTransactionSlotsToBeCovered = parseInt(outflowResponse.outflowTransactions.transactions.length / this.state.fetchTransactionsPerScroll);
          // let lastTransactionalSlot = outflowResponse.outflowTransactions.transactions.length % this.state.fetchTransactionsPerScroll;
          this.setState((prevState)=>{
              return {
                outflowinflowstate: {
                  ...prevState.outflowinflowstate,
                  inflowData:{ 
                    ...prevState.outflowinflowstate.inflowData,
                    seprateDate:filteredSepreateInflowDates,
                    inflowTransactions: inflowResponse.inflowTransactions.transactions,
                    
                    isFetchedFirstTime: true,
                    inflowTotalTransactions:inflowResponse.inflowTransactions.totalTransactions,
                    totalTransactionSlotsToBeCovered:0 ,

                    skipPoint:25,
                    limitPoint:25,

                    lastTransactionalSlot: 0,

                    inflowIndicator: false,

                    currentExecutingSlot:0,
                    isAllActionCompleted:true

                  },
                  outflowinflowSpinner: false
                }
              }
          })

          

          }else{

            //console.log("inflow total transaction length triggered more than 25- ",inflowResponse.inflowTransactions.totalTransactions);
            let seprateOutflowDates = []
            inflowResponse.inflowTransactions.transactions.map( singleOutflowTransaction => {
              seprateOutflowDates.push(singleOutflowTransaction.date);
          })

          let filteredSepreateInflowflowDates = this.getUnique(seprateOutflowDates);

          let totalTransactionSlotsToBeCovered = parseInt(inflowResponse.inflowTransactions.totalTransactions / this.state.fetchTransactionsPerScroll);
          let lastTransactionalSlot = inflowResponse.inflowTransactions.totalTransactions % this.state.fetchTransactionsPerScroll;
          this.setState((prevState)=>{
              return {
                outflowinflowstate: {
                  ...prevState.outflowinflowstate,
                  inflowData: { 
                    ...prevState.outflowinflowstate.inflowData,
                    seprateDate:filteredSepreateInflowflowDates,
                    inflowTransactions: inflowResponse.inflowTransactions.transactions,
                    isFetchedFirstTime: true,
                    inflowTotalTransactions:inflowResponse.inflowTransactions.totalTransactions,
                    totalTransactionSlotsToBeCovered ,
                    lastTransactionalSlot,
                    currentExecutingSlot:1,
                    

                  },
                  outflowinflowSpinner: false
                }
              }
          })
          }
        }else{
          this.setState((prevState)=>{
            return {
              outflowinflowstate: {
                ...prevState.outflowinflowstate,
                outflowinflowSpinner: false
              }
            }
          });
        }
      }
      }else{
        this.setState((prevState)=>{
          return {
            outflowinflowstate: {
              ...prevState.outflowinflowstate,
              outflowinflowSpinner: false
            }
          }
        });
      }
      


    }
  }
  chooseTransactionSelectType = (actionType) => {
    const { currentAction } = this.state.outflowinflowstate;
    if(currentAction != actionType){
      if(actionType == "Outflow" && this.state.outflowinflowstate.outflowData.isFetchedFirstTime == false){

        this.setState((prevState)=>{
          return {
            outflowinflowstate:{ ...prevState.outflowinflowstate,currentAction: actionType,outflowinflowSpinner:true  },
            
          }
        },()=>{
          this.triggerOutflowInflowFetch();
        })


      }else if(actionType == "Inflow" && this.state.outflowinflowstate.inflowData.isFetchedFirstTime == false){


        this.setState((prevState)=>{
          return {
            outflowinflowstate:{ ...prevState.outflowinflowstate,currentAction: actionType,outflowinflowSpinner:true  },
            
          }
        },()=>{
          this.triggerOutflowInflowFetch();
        })

        

      }else{

        this.setState((prevState)=>{
          return {
            outflowinflowstate:{ ...prevState.outflowinflowstate,currentAction: actionType  },
            
          }
        })

      }
    }
  } 


  fetchInflowTransactionsOnEachScroll = async (isAllLoaded = false) => {

    const appendStateData =  isAllLoaded == true ? {  isAllActionCompleted:true,inflowIndicator: false } : {};
    
    const inflowResponse = await getUserInflowTransactions(this.state.outflowinflowstate.inflowData.skipPoint,this.state.outflowinflowstate.inflowData.limitPoint);
   
    if(inflowResponse.result == true){
      
      if(inflowResponse.inflowTransactions.transactions.length > 0){
         
          let seprateOutflowDates = []
          inflowResponse.inflowTransactions.transactions.map( singleOutflowTransaction => {
              seprateOutflowDates.push(singleOutflowTransaction.date);
          })

          let filteredSepreateInflowDates = this.getUnique([...this.state.outflowinflowstate.inflowData.seprateDate,...seprateOutflowDates]);

          this.setState((prevState)=>{
              return {
                outflowinflowstate: {
                  ...prevState.outflowinflowstate,
                  inflowData:{ 
                    ...prevState.outflowinflowstate.inflowData,
                    seprateDate:filteredSepreateInflowDates,
                    inflowTransactions:[ ...this.state.outflowinflowstate.inflowData.inflowTransactions,...inflowResponse.inflowTransactions.transactions ],
                    currentExecutingSlot: prevState.outflowinflowstate.inflowData.currentExecutingSlot + 1,
                    ...appendStateData

                  },
                  outflowinflowSpinner: false
                }
              }
          })
      }else{
        this.setState({ outflowinflowstate: {
          ...this.state.outflowinflowstate,
          inflowData: {
            ...this.state.outflowinflowstate.inflowData,
            inflowIndicator: false
          }
        } })
      }
        }else{
          this.setState({ outflowinflowstate: {
            ...this.state.outflowinflowstate,
            inflowData: {
              ...this.state.outflowinflowstate.inflowData,
              inflowIndicator: false
            }
          } })
        }


  }
  fetchOutFlowTransactionsOnEachScroll = async (isAllLoaded = false) => {
    
    const appendStateData =  isAllLoaded == true ? {  isAllActionCompleted:true,outflowIndicator: false } : {};
    
    const outflowResponse = await getUserOutFlowTransactions(this.state.outflowinflowstate.outflowData.skipPoint,this.state.outflowinflowstate.outflowData.limitPoint);
   // //console.log("outflow responses - ",outflowResponse.result);
    if(outflowResponse.result == true){
      
      if(outflowResponse.outflowTransactions.transactions.length > 0){
          //console.log("Getting outflow transactions on each scroll length - ",outflowResponse.outflowTransactions.transactions.length);
          let seprateOutflowDates = []
          outflowResponse.outflowTransactions.transactions.map( singleOutflowTransaction => {
              seprateOutflowDates.push(singleOutflowTransaction.date);
          })

          let filteredSepreateOutflowDates = this.getUnique([...this.state.outflowinflowstate.outflowData.seprateDate,...seprateOutflowDates]);

          this.setState((prevState)=>{
              return {
                outflowinflowstate: {
                  ...prevState.outflowinflowstate,
                  outflowData: { 
                    ...prevState.outflowinflowstate.outflowData,
                    seprateDate:filteredSepreateOutflowDates,
                    outflowTransactions: [ ...this.state.outflowinflowstate.outflowData.outflowTransactions,...outflowResponse.outflowTransactions.transactions ],
                    currentExecutingSlot: prevState.outflowinflowstate.outflowData.currentExecutingSlot + 1,
                    ...appendStateData

                  },
                  outflowinflowSpinner: false
                }
              }
          })
      }else{
        this.setState({ outflowinflowstate: {
          ...this.state.outflowinflowstate,
          outflowData: {
            ...this.state.outflowinflowstate.outflowData,
            outflowIndicator: false
          }
        } })
      }
        }else{
          this.setState({ outflowinflowstate: {
            ...this.state.outflowinflowstate,
            outflowData: {
              ...this.state.outflowinflowstate.outflowData,
              outflowIndicator: false
            }
          } })
        }
  }
  checkingBody = () => {
    const { currentAction } = this.state.outflowinflowstate;
    const { userData } = this.props.reduxState.userData;
    return(
    <React.Fragment>
      <View style={ StyleSheet.absoluteFill }>
        <View style={{flexDirection:'column',backgroundColor:'#070640', width:"100%",height:120}}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{ flexDirection:'row',backgroundColor:'#070640', width:50,height:44, marginTop:10,marginLeft:14 }}>
              
                <AntDesign name='left' size={24} alignSelf='center' color='#FFFFFF'/>
              
            </TouchableOpacity>
            <View style={{flexDirection:'row',backgroundColor:'#070640',justifyContent:'space-between', marginTop:4, marginRight:19, marginLeft:18}}>
              <Text style={{width:"35%",fontSize:20,color:"#FFFFFF", height:23 }}>${ numberWithCommas(this.state.currentBalance) }</Text>
              {
                this.state.userAccountType.length > 2 ? 
                <TouchableOpacity disabled={true} style={{ ...styles.SubmitButtonStyle }} activeOpacity = { .5 }>
                  <Text style={{ ...styles.TextStyle,paddingHorizontal:20}}>{ `${firstLetterCapital(this.state.userAccountType)} Account` }</Text>
                </TouchableOpacity> : null
              }
            </View>
            <View style={{flexDirection:'row',backgroundColor:'#070640', marginTop:11,marginLeft:18}}>
              <Text style={{width:121,height:16, fontSize:12,color:"#FFFFFF",}}>CASH</Text>
            </View>
          </View>
          
          
          <ScrollView 
          
          onScroll={({ nativeEvent }) => {
        const { currentAction } = this.state.outflowinflowstate;
           if(currentAction == 'All'){
            if (this.isCloseToBottom(nativeEvent)) {
              //fetch Transaction on each Scroll
              if(this.state.allowStartSearch == true){
                if(this.state.currentSlot < this.state.totalSlotsForCovering-1){
                  this.setState((prevState)=>{
                      return { skipPoint:prevState.skipPoint+this.state.fetchTransactionsPerScroll,limitPoint: this.state.fetchTransactionsPerScroll,currentSlot: this.state.currentSlot+1 }
                  },()=>{
                    setTimeout(()=>{
                      this.fetchTransactionsOnEachScroll();
                    },50);
                  })
                }else if(this.state.currentSlot == this.state.totalSlotsForCovering-1){
                  this.setState((prevState)=>{
                    return { skipPoint:prevState.skipPoint+this.state.fetchTransactionsPerScroll,limitPoint: this.state.remaningTransactions,currentSlot: this.state.currentSlot+1 }
                },()=>{
                  setTimeout(()=>{
                    this.fetchTransactionsOnEachScroll(true);
                  },50);
                })
                }else{
                  this.fetchTransactionsOnEachScroll(true,true);
                }
              }
            }
           }else if(currentAction == "Outflow"){
            if (this.isCloseToBottom(nativeEvent)){
              const { outflowinflowstate } = this.state;
              const { outflowData  } = outflowinflowstate;
              if(outflowData.isAllActionCompleted == false){
                  
                  if(outflowData.currentExecutingSlot < outflowData.totalTransactionSlotsToBeCovered){
                    //console.log("Checking slot in side true - ",outflowData.currentExecutingSlot);
                    this.setState((prevState)=>{
                      return{
                        outflowinflowstate: {
                          ...prevState.outflowinflowstate,
                          outflowData: {
                            ...prevState.outflowinflowstate.outflowData,
                            skipPoint: prevState.outflowinflowstate.outflowData.skipPoint + 25 ,
                            
                          }
                        }
                      }
                    },()=>{
                      this.fetchOutFlowTransactionsOnEachScroll(false);
                    })
                  }else{
                    //console.log("Checking slot in side false - ",outflowData.currentExecutingSlot);
                    this.setState((prevState)=>{
                      return{
                        outflowinflowstate: {
                          ...prevState.outflowinflowstate,
                          outflowData: {
                            ...prevState.outflowinflowstate.outflowData,
                            skipPoint: prevState.outflowinflowstate.outflowData.skipPoint + 25 ,
                            limitPoint: prevState.outflowinflowstate.outflowData.lastTransactionalSlot
                          }
                        }
                      }
                    },()=>{
                      this.fetchOutFlowTransactionsOnEachScroll(true);
                    })
                  }
              }
            }
              

           }else{

            if (this.isCloseToBottom(nativeEvent)){
              const { outflowinflowstate } = this.state;
              const { inflowData  } = outflowinflowstate;
              if(inflowData.isAllActionCompleted == false){
                  
                  if(inflowData.currentExecutingSlot < inflowData.totalTransactionSlotsToBeCovered){
                   // //console.log("Checking slot in side true - ",outflowData.currentExecutingSlot);
                    this.setState((prevState)=>{
                      return{
                        outflowinflowstate: {
                          ...prevState.outflowinflowstate,
                          inflowData: {
                            ...prevState.outflowinflowstate.inflowData,
                            skipPoint: prevState.outflowinflowstate.inflowData.skipPoint + 25 ,
                            
                          }
                        }
                      }
                    },()=>{
                      this.fetchInflowTransactionsOnEachScroll(false);
                    })
                  }else{
                    ////console.log("Checking slot in side false - ",outflowData.currentExecutingSlot);
                    this.setState((prevState)=>{
                      return{
                        outflowinflowstate: {
                          ...prevState.outflowinflowstate,
                          inflowData: {
                            ...prevState.outflowinflowstate.inflowData,
                            skipPoint: prevState.outflowinflowstate.inflowData.skipPoint + 25 ,
                            limitPoint: prevState.outflowinflowstate.inflowData.lastTransactionalSlot
                          }
                        }
                      }
                    },()=>{
                      this.fetchInflowTransactionsOnEachScroll(true);
                    })
                  }
              }
            }


           }
          }
          } >

<View style={{backgroundColor:'#FFFFFF',height:80,width:'99%',justifyContent:'space-between',alignSelf:'center'}}>
            <View style={{flexDirection:'row', width:"99%",marginTop:'3%',justifyContent:'space-between',alignSelf:'center', alignContent:'center'}}>
              <View style={{flexDirection:'row', width:'60%', height:26, marginLeft:'2%' }}> 

                <TouchableOpacity onPress={()=>{ this.chooseTransactionSelectType('All') }} style={{width:'20%', height: '99.9%', backgroundColor:currentAction == 'All' ? '#070640': '#FFFFFF', justifyContent:'center',borderColor:'#737373',borderWidth:1,}}>
                  <Text style={{fontSize:12, color: currentAction == 'All' ? "#fff" : "#07053E", textAlign:'center'}}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ this.chooseTransactionSelectType('Outflow') }} style={{width:'30%',height:'99.9%',borderWidth:1,borderColor:'#737373', justifyContent:'center',  backgroundColor:currentAction == 'Outflow' ? '#070640': '#FFFFFF'}}>
                <Text style={{fontSize:12, color: currentAction == 'Outflow' ? "#fff" : "#07053E", textAlign:'center'}}>Outflow</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ this.chooseTransactionSelectType('Inflow') }} style={{width:'30%', height:'99.9%',borderWidth: 1,borderColor:'#737373', justifyContent:'center', backgroundColor:currentAction == 'Inflow' ? '#070640': '#FFFFFF',}}>
                <Text style={{fontSize:12, color: currentAction == 'Inflow' ? "#fff" : "#07053E", textAlign:'center'}}>Inflow</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity disabled={true} style={{width:'30%', height: '99.9%', backgroundColor:currentAction == 'Transfer' ? '#070640': '#FFFFFF', justifyContent:'center',borderColor:'#737373',borderWidth:1,}}>
                  <Text style={{fontSize:12, color: currentAction == 'Transfer' ? "#fff" : "#07053E", textAlign:'center'}}>Transfer</Text>
                </TouchableOpacity> */}
              </View>
              
              {/* <Button title="Uncategoried" type="outline" 
                buttonStyle={{flexDirection:'row-reverse'}}
                containerStyle={{height:26, marginRight:'2%',justifyContent:'space-between',width:'28%',borderRadius:5,
                borderColor:'#318FE9'}}
                titleStyle={{color:'#4A90E2',fontSize:12,marginTop:-6}} 
                icon={<SimpleLineIcons name="arrow-down" size={10} color="#4A90E2" style={{marginTop:-3}} />} /> */}
                
            </View>
            {/* <Text style={{color:'#1D1E1F', width:93,height:15,fontSize:11,alignSelf:"flex-end",marginBottom:13,marginRight:'2%'}}>26 uncategorized</Text> */}
          </View>
          
          {
            !this.state.outflowinflowstate.outflowinflowSpinner ? 
            this.state.outflowinflowstate.currentAction == 'All' ?
            <React.Fragment>
                {
                     this.state.seprateDate.map( (singleDate,dateIndex )=> {
                        return <React.Fragment key={dateIndex}>
                          <ShowDateHeadings key={dateIndex} date={singleDate} />
                          <View style={{marginTop:20,
                          backgroundColor:"#FFFFFF", 
                          flexDirection:'column',width:"100%", alignSelf:'center'}}>
                        {  this.state.transactions.map( (transaction,transactionIndex) => {
                            if(singleDate === transaction.date){
                            
                              return(
                                <TransactionComponent transactionTypes={"ALL"} resetTransactionScreen={this.resetTransactionScreen}  navigation={this.props.navigation} userData={userData} navigation={this.props.navigation} key={transactionIndex} name={transaction.name}  date={transaction.category} price={transaction.amount} fullTransactionObj={transaction}/>
                              )
                            }
                          })
                        }
                        </View>
                        </React.Fragment>
                          
                      }) 
                }
              { this.state.isShowActivityIndicator ? <ActivityIndicator size="large" style={{ paddingVertical:30 }} color={this.state.activityIndicatorColor} /> : null  }
              { this.state.isNoAllTransaction == true ? 
              <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:35 }} ><AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/><Text style={{ marginLeft:10,alignSelf:"center" }}>Oops There are No Transactions!</Text></View> : null }
            </React.Fragment>
            
            : this.state.outflowinflowstate.currentAction == 'Outflow' ?  
            
              <React.Fragment>

{
                     this.state.outflowinflowstate.outflowData.seprateDate.map( (singleDate,dateIndex )=> {
                        return <React.Fragment key={dateIndex}>
                          <ShowDateHeadings key={dateIndex} date={singleDate} />
                          <View style={{marginTop:20,backgroundColor:"#FFFFFF", flexDirection:'column',width:"100%", alignSelf:'center'}}>
                        {  this.state.outflowinflowstate.outflowData.outflowTransactions.map( (transaction,transactionIndex) => {
                            if(singleDate === transaction.date){
                            
                              return(
                                <TransactionComponent transactionTypes={"OUTFLOW"} resetTransactionScreen={this.resetTransactionScreen} navigation={this.props.navigation} userData={userData} navigation={this.props.navigation} key={transactionIndex} name={transaction.name}  date={transaction.category} price={transaction.amount} fullTransactionObj={transaction}/>
                              )
                            }
                          })
                        }
                        </View>
                        </React.Fragment>
                          
                      }) 
                }
                <ActivityIndicator animating={this.state.outflowinflowstate.outflowData.outflowIndicator} color={this.state.activityIndicatorColor} size={`large`} style={{ paddingVertical:10 }}/>
                { this.state.outflowinflowstate.outflowData.isNoOutflowTransactions == true ? 
                <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/><Text style={{ marginLeft:10,alignSelf:"center" }}>Oops There are No Outflow Transactions!</Text></View> : null }
              </React.Fragment>    


            : 
            
            <React.Fragment>

            {
                                 this.state.outflowinflowstate.inflowData.seprateDate.map( (singleDate,dateIndex )=> {
                                    return <React.Fragment key={dateIndex}>
                                      <ShowDateHeadings key={dateIndex} date={singleDate} />
                                      <View style={{marginTop:20,backgroundColor:"#FFFFFF", flexDirection:'column',width:"100%", alignSelf:'center'}}>
                                    {  this.state.outflowinflowstate.inflowData.inflowTransactions.map( (transaction,transactionIndex) => {
                                        if(singleDate === transaction.date){
                                        
                                          return(
                                            <TransactionComponent transactionTypes={"INFLOW"} resetTransactionScreen={this.resetTransactionScreen} navigation={this.props.navigation} userData={userData} navigation={this.props.navigation} key={transactionIndex} name={transaction.name}  date={transaction.category} price={transaction.amount} fullTransactionObj={transaction}/>
                                          )
                                        }
                                      })
                                    }
                                    </View>
                                    </React.Fragment>
                                      
                                  }) 
                            }
                             <ActivityIndicator animating={this.state.outflowinflowstate.inflowData.inflowIndicator} color={this.state.activityIndicatorColor} size={`large`} style={{ paddingVertical:10 }}/>
                             { this.state.outflowinflowstate.inflowData.isNoInflowTransactions == true ? 
                             <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/><Text style={{ marginLeft:10,alignSelf:"center" }}>Oops There are No Inflow Transactions!</Text></View> : null }
                          </React.Fragment>  
            
            
            
            :

            <ActivityIndicator animating={this.state.outflowinflowstate.outflowinflowSpinner} color={this.state.activityIndicatorColor} style={{ paddingVertical:30 }} size={'large'} /> 
          }
          </ScrollView>
      </View>
    </React.Fragment>
    );
  }
  render(){
    const { transactions,isBodyLoaded } = this.state;
    return(
        <React.Fragment>
        <Spinner
            visible={this.state.isSpinner}
            textStyle={styles.spinnerTextStyle}
        />

        {  (this.state.isUserLinkedWithBank) ? isBodyLoaded && this.checkingBody() : null }

        { this.state.showTimeoutScreen && <Timeout navigation={this.props.navigation} reloadDashBoardData={ () => { 
          if(this.props.navigation.getParam("reloadDashBoardData")){
            this.props.navigation.getParam("reloadDashBoardData")();
          }
         } } /> }        
      </React.Fragment>
      );
    }}

const styles = StyleSheet.create({
    margins: {
      flex: 1,
      backgroundColor: "#F6F7F8",
    },
    btn: {
        paddingHorizontal: 10,
        height:24, 
        borderRadius:12, 
        backgroundColor:"#FFFFFF",
        borderWidth: 1,
        borderColor: '#737373',
        justifyContent:"center",
        alignItems:"center"
    },
    separator: {
        marginTop: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginLeft:18,
      },
      SubmitButtonStyle: {
        backgroundColor:'#FFFFFF',
        borderRadius:20,
        // width:139,
        height:25,
        justifyContent:"center",
        alignItems:"center"
       },
      TextStyle:{
          color:'#07053E',
          textAlign:'center',
          
      },
      uncategorized:{
        width:80, 
        height:17, 
        color:'#4A90E2', 
        fontSize:12,
      },
      SubmitButtonStyle1: {
        width:116,
        height:25,
        borderRadius:4, 
        borderColor:'#4A90E2',
        backgroundColor:"#FFFFFF",
      },
      TextStyle1:{
        color:'#4A90E2',
        textAlign:'center',
      },
      viewtext:{
        fontSize:12, 
        color:"#07053E", 
        textAlign:'center'
      },
    });

    //const mapStateToProps = state =>  ({ reduxState:state });

    const mapStateToProps = state => {
      return {
          reduxState:state,
          categoryReduxData: state.plaidCategoryData
      }
  }
  
  const mapDispatchToProps = dispatch => {
      return {
          fetchPlaidCategoryDispatch: () => {  dispatch(triggerPlaidCategoryAsync())  },
          fetchExpenseByCategory: (type = 1) => { dispatch(fetchExpensesAsyncCreator(type)); },
          fetchMainExepenseByCategory: (type = 1) => { dispatch(fetchMainExpenseAsyncCreator(type)) }
      }
  }
    export default connect(mapStateToProps,mapDispatchToProps)(DetectPlatform(Checking,styles.margins));