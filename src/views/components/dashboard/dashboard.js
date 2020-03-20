import React, { Component,useContext, PureComponent } from "react";
import { Alert, BackHandler } from "react-native";
import { NavigationEvents } from "react-navigation";
import { StyleSheet } from "react-native";
import IncomingAR from "../charts/incomingAR";
import BottomNavLayout from "../../../controls/bottom-nav-layout";
import HealthScore from "../charts/healthScore";
import { HISTORICAL_FINANACES } from "../../../utilities/stub";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import CashOnHand from "./cashOnHand";
import ChangeInCash from "./changeInCash";
import Sales from "./sales";
import { listFinancials } from "../../../reducers/financials";
import { fetchUserAsyncActionCreator,fetchUserSuccess } from "../../../reducers/getUser";

import { 
  getCashOnHandGraph,
  getSalesData,
  userLoginCounter,
  getHealthScoreUsingPromise,
  getCashOnHandGraphPromiseBased,
  getCashOutOfDatePromise,
  fetchCurrentBalancePromise,
  validatePlaidTokenPromise,getSalesDataPromise,getHealthScoreUsingWithOutQbPromise,getExpenseByCategoryPromise,getUserPromise } from "../../../api/api";

import Spinner from 'react-native-loading-spinner-overlay';
import TryAgainScreen from "../../ftux/somethingWrong";
import { logger } from "../../../api/logger";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
//expense by category Dev priya
import ExpenseByCategory from "./expenseByCategory";
import { fetchExpensesAsyncCreator  } from "../../../reducers/expensecategory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
import { cicAsynCreator } from "../../../reducers/cashinchange";
import { fetchArAsyncCreator } from "../../../reducers/incommingar";
import { fetchInsightsAsyncCreator } from "../../../reducers/insights";
import { fetchForecastAsyncCreator } from "../../../reducers/forecast";
const TIMEOUT_POPUP = 60000;
class Dashboard extends PureComponent {
  
  constructor(props){
    super(props);
    this.state = {
      isSalesLoadedOnce:false,
      isCOHLoadedOnce:false,
      healthScoreIndicator:true,
      userData:{},
      isSpinner:true,
      tryAgainScreen:false,
      cashOnHandGraph:[],
      userCurrentBalance:0,
      //states for managing the graph data
      
      showCOHChartLoader:false,
      past:3,
      future:1,
      healthScore:0,

      //salesData
      salesData:[],
      showSalesChartLoader:true,
      salesTotalAmount: 0,
      outOfCashDate: 'NA',
      isCountApiTriggered: false,

      //expensebycategory data
      expenseByCategory:{ exponseCategoryIndicator:true },
    }

    this.popupInterval = null;
  }

  updateSalesChartOnly = async () => {
    this.props.fetchUserDispatch();
    const salesDataResponse = await getSalesData();
   // console.log("getting sales chart - ",salesDataResponse);
    if(salesDataResponse.result == true && salesDataResponse.salesChartData.length > 0 && salesDataResponse.salesChartData[0] != null){
      this.setState({ salesData:salesDataResponse.salesChartData,salesTotalAmount: salesDataResponse.response.finalAmount });
    }else{
      this.setState({ salesData:[] });
    }
  }
  fetchUser = () =>{

    
    
    let triggerValidPlaidToken = {}
    getUserPromise().then((userResponse)=>{
      console.log("Dashboard user - ",userResponse);
      if(userResponse.result == true){
        this.props.updateUserReduxTree(userResponse.userData)
        if(userResponse.userData.bankIntegrationStatus == false){
          this.setState({ showCOHChartLoader: false, healthScoreIndicator: false },()=>{});
        }
        if(userResponse.userData.qbIntegrationStatus == false){
          this.setState({ salesData:[],showSalesChartLoader:false });
        }
  
        if(userResponse.userData.bankIntegrationStatus == true){
  
           //Approcahes using promises 
            getCashOnHandGraphPromiseBased(this.state.past,this.state.future).then((cashOnHandGraphData)=>{
              console.log("cashOnHand Response Here -------------------- ");
              console.log(cashOnHandGraphData);
              console.log("----------------------------------------------------------------");
              if(cashOnHandGraphData.result == true && cashOnHandGraphData.response.length > 0){
                this.setState({ cashOnHandGraph:cashOnHandGraphData.response,isCOHLoadedOnce: true });
               }else{
                this.setState({ cashOnHandGraph: [],showCOHChartLoader:false,isCOHLoadedOnce: true });
               }
            }).catch((error)=>{
              
              this.setState({ cashOnHandGraph: [],showCOHChartLoader:false,isCOHLoadedOnce: true });
            });
            //const cashOnHandGraphData = await getCashOnHandGraph(this.state.past,this.state.future);
            getCashOutOfDatePromise().then((cashOutOfDateResponse)=>{
              if(cashOutOfDateResponse.result == true){
                this.setState({ outOfCashDate: cashOutOfDateResponse.outOfCashDate });
              }else{
                this.setState({ outOfCashDate: 'NA' });
              }
            }).catch((error)=>{ 
              this.setState({ outOfCashDate: 'NA' });
            });
      
            fetchCurrentBalancePromise().then((userBalance)=>{
              if(userBalance.result == true){
                this.setState({ userCurrentBalance: userBalance.available_balance,showCOHChartLoader:false });
              }    
            }).catch((error)=>{
                console.log("current Balance promise error - resposne - ",error);
                this.setState({ userCurrentBalance: 0,showCOHChartLoader:false });
            })
          
                this.props.fetchExpenseByCategory(3);
                this.props.fetchCashInChange(3);
                this.props.fetchInsights();
                if(userResponse.userData.bankIntegrationStatus == true && userResponse.userData.qbIntegrationStatus == true){
                        
                  getHealthScoreUsingPromise().then((response)=>{
                    //console.log("health score api response - ",response);
                    if(response.result == true){
                      this.setState({  healthScore :response.HealthScore,healthScoreIndicator: false });
                    }else{
                      this.setState({  healthScore :0,healthScoreIndicator: false });
                    }
                  }).catch((error)=>{
                      this.setState({  healthScore :0,healthScoreIndicator: false });
                  });
                  
            }
  
  
            if(userResponse.userData.bankIntegrationStatus == true && userResponse.userData.qbIntegrationStatus == false){
  
              getHealthScoreUsingWithOutQbPromise().then((response)=>{
                if(response.result == true){
                  this.setState({  healthScore :response.HealthScore,healthScoreIndicator: false });
                }else{
                  this.setState({  healthScore :0,healthScoreIndicator: false });
                }
              }).catch((error) =>{
                console.log("error on getHealthScoreUsingWithOutQbPromise() - ",error);
                this.setState({  healthScore :0,healthScoreIndicator: false });
              })
            }
  
            validatePlaidTokenPromise().then((triggerValidPlaidToken)=>{
              if(triggerValidPlaidToken.result == true && triggerValidPlaidToken.response.isValidPlaidToken != true){
                setTimeout(()=>{
                  Alert.alert("Message","Bank Credentials Changed Please Connect to Bank Again",
                  [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed on the crendentials change')},
                    {
                      text: 'Connect Here',
                      //onPress: () => { this.props.navigation.navigate("Integration"); },
                      onPress: () => { this.props.navigation.navigate("Integration",{ reloadDashBoardData: () => { this.fetchUser(); }    }) },
                      style: 'cancel',
                    }
                  ],
                  {cancelable: false}
                  );
                },3000);
              }
            }).catch((error)=>{
              console.log("Validate Plaid Token Promise error - ",error);
            });
  
            //strategy 2 fire command using redux for the expenses
            // getExpenseByCategoryPromise().then((response)=>{
            //   console.log("---------------------------------------expense by category response -----------------------------");
            //   console.log(response);
            //   console.log("----------------------------------------");
            // }).catch((error)=>{
            //   console.log("getExpenseByCategoryPromise() - dashboard error ",error);
            // })
            
        }
        //this.props.fetchForecast();
  
        if(userResponse.userData.qbIntegrationStatus == true){
  
          getSalesDataPromise().then((salesDataResponse)=>{
            if(salesDataResponse.result == true && salesDataResponse.salesChartData.length > 0 ){
              this.setState({ isSalesLoadedOnce:true,salesData:salesDataResponse.salesChartData,salesTotalAmount: salesDataResponse.response.finalAmount,showSalesChartLoader:false });
            }else{
              this.setState({ salesData:[],showSalesChartLoader:false,isSalesLoadedOnce:true });
            }
          }).catch((error)=>{
            this.setState({ salesData:[],showSalesChartLoader:false,isSalesLoadedOnce:true });
          })
        
          this.props.fetchIncommingAr();
          
        
        }
        
  
        this.setState({  userData:userResponse.userData,isSpinner:false,tryAgainScreen:false,isBodyLoaded:true },()=>{
          if(userResponse.userData.bankIntegrationStatus == true){
            this.props.fetchPlaidCategoryDispatch();
          }
          if(this.state.isCountApiTriggered == false){
              
                if(userResponse.userData.bankIntegrationStatus == false){

                 setTimeout(()=>{
                  Alert.alert("Info","You're Not Connected To The Bank Please Connect To Bank",[ 
                    { text:"Cancel" },
                    { text:"Connect Here", onPress:()=>{ this.props.navigation.navigate("Integration",{ reloadDashBoardData: () => { this.fetchUser(); }    }) } }
                  ]);
                 },1000);
                  
                //  setTimeout(()=>{
                  this.popupInterval = setInterval(()=>{

                    //code here for the interval of the pop-up

                    Alert.alert("Info","You're Not Connected To The Bank Please Connect To Bank",[ 
                      //{ text:"Feedback",onPress:()=>{ this.props.navigation.navigate("Feedback") } },
                      { text:"Cancel" },
                      { text:"Connect Here", onPress:()=>{ this.props.navigation.navigate("Integration",{ reloadDashBoardData: () => { this.fetchUser(); }    }) } }
                    ])

                  },TIMEOUT_POPUP);
                //  },TIMEOUT_POPUP);
                }
              
              this.setState({ isCountApiTriggered: true });
              setTimeout(()=>{
                userLoginCounter();
              },6000);
              
            }
        });
      }else{
        this.setState({ isSpinner:false,tryAgainScreen: true, isBodyLoaded:true });  
      }
    }).catch((error)=>{
      this.setState({ isSpinner:false,tryAgainScreen: true, isBodyLoaded:true });  
    })
    
  


    
  }
  componentDidMount = async () => {
    //console.log("State length Test ",this.state.cashOnHandGraph.length);
    BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    //this.setState(()=>{ return { healthScore:Math.floor(Math.random()*100) } });
    await AsyncStorage.setItem("isUserLoggedInStorage","true");
    if(this.props.navigation.getParam("readyValuePropAfterLogout")){
      this.props.navigation.getParam("readyValuePropAfterLogout")();
    }
    this.fetchUser();
}

  componentWillUnmount(){
    clearInterval(this.popupInterval);
    BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }

  handleBackButton=(nav)=> {
    if (!nav.isFocused()) {
      //nav.goBack();
      clearInterval(this.popupInterval);
      return true;
    }else{
    Alert.alert(
      'Exit App',
      'Do you want to Exit..', [{
          text: 'Cancel',
          onPress: () => logger('Cancel Pressed'),
          style: 'cancel'
      }, {
          text: 'Exit',
          onPress: () => BackHandler.exitApp()
      }, ], {
          cancelable: false
      })
      
      return true;
    }
  }

  reloadGraphAsPerCondition = async () => { 
    if(this.props.reduxUserData.userData.bankIntegrationStatus == true){
      const cashOnHandGraphData = await getCashOnHandGraph(this.state.past,this.state.future);
     // console.log(`Getting COH On past=${this.state.past}&future=${this.state.future}`,cashOnHandGraphData);
      if(cashOnHandGraphData.result == true){
        this.setState({ cashOnHandGraph:cashOnHandGraphData.response,showCOHChartLoader:false });
      }else{
        this.setState({ showCOHChartLoader:false });
      }
    }else{
      this.setState({ showCOHChartLoader:false });
    }
   
  }
  handleTryAgainButton = () => {
    this.setState({ isSpinner:true });
    this.fetchUser();
  }
  handleGraphChangeFunction = (recieveText) => {
    this.setState(()=>{
      return { showCOHChartLoader: true }
    },()=>{
      if(recieveText == "3 Months"){
        this.setState(()=>{ return { past:3,future: 1 } },()=>{
          this.reloadGraphAsPerCondition();
        })
      }else if(recieveText == "This Month"){
        this.setState(()=>{ return { past:0,future: 0 } },()=>{
          this.reloadGraphAsPerCondition();
        })
      }else if(recieveText == "6 Months"){
        this.setState(()=>{ return { past:3,future: 3 } },()=>{
          this.reloadGraphAsPerCondition();
        })
      }else if(recieveText == "12 Months"){
        this.setState(()=>{ return { past:12,future: 0 } },()=>{
          this.reloadGraphAsPerCondition();
        })
      }
    });
    
  }
  callAgainForThePopup = () => {
    if(this.state.userData.bankIntegrationStatus == false){
      
      // setTimeout(()=>{
        Alert.alert("Info","You're Not Connected To The Bank Please Connect To Bank",[ 
          //{ text:"Feedback",onPress:()=>{ this.props.navigation.navigate("Feedback") } },
          { text:"Cancel" },
          { text:"Connect Here", onPress:()=>{ this.props.navigation.navigate("Integration",{ reloadDashBoardData: () => { this.fetchUser(); }    }) } }
        ]);



        
          this.popupInterval = setInterval(()=>{
    
            //code here for the interval of the pop-up
      
            Alert.alert("Info","You're Not Connected To The Bank Please Connect To Bank",[ 
              //{ text:"Feedback",onPress:()=>{ this.props.navigation.navigate("Feedback") } },
              { text:"Cancel" },
              { text:"Connect Here", onPress:()=>{ this.props.navigation.navigate("Integration",{ reloadDashBoardData: () => { this.fetchUser(); }    }) } }
            ])
      
          },TIMEOUT_POPUP);
        

      // },2000);
      
    }
  }
  render() {
    // console.log("_______________________________________________________________________________________________________");
    // console.log(this.props.reduxUserData.userData.bankIntegrationStatus);
    // console.log("_______________________________________________________________________________________________________");
    const financials = this.props.financials;
    const { isSpinner } = this.state;
    const { bankIntegrationStatus,qbIntegrationStatus } = this.state.userData;
    return (
      <React.Fragment>
          <NavigationEvents
            onWillFocus={(payload)=>{ if(this.state.isBodyLoaded == true){ this.callAgainForThePopup(); } }}
            //onWillBlur={(payload) => { if(this.state.userData.bankIntegrationStatus == false){ clearInterval(this.popupInterval); } }}
            onWillBlur={(payload) => {  clearInterval(this.popupInterval); }}
          />
         <Spinner
          visible={ isSpinner }
          textStyle={styles.spinnerTextStyle}
        />
        {
          this.state.isBodyLoaded == true ?  this.state.tryAgainScreen ?  <TryAgainScreen navigation={this.props.navigation} handleButton={this.handleTryAgainButton} showLoggedOutButton = {true} /> :  
          <BottomNavLayout navigation={this.props.navigation}>
              <HealthScore  healthScoreIndicator={this.state.healthScoreIndicator} outOfCashDate={this.state.outOfCashDate} healthScore={this.state.healthScore} navigation={this.props.navigation} userCurrentBalance={this.state.userCurrentBalance}  userData={this.props.reduxUserData.userData}  updateSalesChartOnly = {() => { this.updateSalesChartOnly(); }}  reloadDashBoardData={ () => { this.fetchUser(); }   }/>
              { bankIntegrationStatus == true ? <CashOnHand healthScoreIndicator={this.state.healthScoreIndicator} isCOHLoadedOnce={this.state.isCOHLoadedOnce} outOfCashDate={this.state.outOfCashDate} isEnableDropDownForSwitchingGraph={ this.state.cashOnHandGraph.length == 0 ? true : false  } showCOHChartLoader={this.state.showCOHChartLoader} handleGraphChangeFunction={this.handleGraphChangeFunction} userCurrentBalance={this.state.userCurrentBalance} historicalFinances={financials.breakdown} navigation={this.props.navigation} cashOnHandGraphData={this.state.cashOnHandGraph} cohPast={this.state.past} cohFuture={this.state.future} /> : null }
              { bankIntegrationStatus == true ? <ChangeInCash historicalFinances={financials.breakdown} navigation={this.props.navigation}/> : null }
              { bankIntegrationStatus == true ? <ExpenseByCategory navigation={this.props.navigation} /> : null }
              { qbIntegrationStatus == true ? <Sales isSalesLoadedOnce={this.state.isSalesLoadedOnce} showSalesChartLoader={this.state.showSalesChartLoader} salesTotalAmount={this.state.salesTotalAmount} historicalFinances={financials.breakdown} navigation={this.props.navigation} salesData={this.state.salesData} /> : null }
              { qbIntegrationStatus == true ? <IncomingAR style={styles.incomingAR} ar={financials.ar} navigation={this.props.navigation}/> : null }
          </BottomNavLayout>
          : null
        }
        </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    financials: state.financials.financials,
    reduxUserData: state.userData,
    
  };
};

const mapDispatchToProps = dispatch => {
 return {
  listFinance : (token) => { dispatch(listFinancials(token)); },
  fetchUserDispatch : () => { dispatch(fetchUserAsyncActionCreator()); },
  fetchPlaidCategoryDispatch: () => {  dispatch(triggerPlaidCategoryAsync())  },
  updateUserReduxTree: (userData) => { dispatch(fetchUserSuccess(userData)) },
  fetchExpenseByCategory: (type = 1) => { dispatch(fetchExpensesAsyncCreator(type)); },
  fetchMainExepenseByCategory: (type = 1) => { dispatch(fetchMainExpenseAsyncCreator(type)) },
  fetchCashInChange: ( cicCurrentRange = 0 ) => { dispatch(cicAsynCreator(cicCurrentRange)) },
  fetchIncommingAr: () => { dispatch(fetchArAsyncCreator()); },
  fetchInsights: () => { dispatch(fetchInsightsAsyncCreator()); },
  fetchForecast: () => { dispatch(fetchForecastAsyncCreator()); }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

const styles = StyleSheet.create({
  groundUp: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "#F8F9FA"
  },
  menu: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  }
});
