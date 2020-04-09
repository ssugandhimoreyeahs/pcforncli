import React, { Component,useContext, PureComponent } from "react";
import { Alert, BackHandler } from "react-native";
import { NavigationEvents } from "react-navigation";
import { StyleSheet } from "react-native";
import IncomingAR from "../charts/incomingAR";
import BottomNavLayout from "../../../controls/bottom-nav-layout";
import HealthScore from "../charts/healthScore";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import CashOnHand from "./cashOnHand";
import ChangeInCash from "./changeInCash";
import Sales from "./sales";
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
import { salesAsyncCreator } from "../../../reducers/sales";


class Dashboard extends PureComponent {
  
  constructor(props){
    super(props);
    this.onDashBoardFocused = true;
    this.showQuickBooksPopupFlag = false;
    this.showBankNotConnectedPopupFlag = false;
    this.showBankCredentialChangePopupFlag = false;

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

 
  resetFlags = () => {
    this.showBankCredentialChangePopupFlag = false;
    this.showBankNotConnectedPopupFlag = false;
    this.showQuickBooksPopupFlag = false;
  }
  reloadPlaid = () => {
    this.resetFlags();

    //reload code only if the user connected to the plaid

    getUserPromise().then((userResponse)=>{
      console.log("Dashboard user - ",userResponse);
      if(userResponse.result == true){
        this.props.updateUserReduxTree(userResponse.userData)
        if(userResponse.userData.bankIntegrationStatus == false){
          this.showBankNotConnectedPopupFlag = true;
          this.setState({ showCOHChartLoader: false, healthScoreIndicator: false },()=>{});
        }
        if(userResponse.userData.qbIntegrationStatus == false){
          this.setState({ salesData:[],showSalesChartLoader:false });
        }
  
        if(userResponse.userData.bankIntegrationStatus == true){
          this.showBankNotConnectedPopupFlag = false;
           //Approcahes using promises 
            
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
            setTimeout(()=>{
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
            },1000);
            this.props.fetchCashInChange(3);
            this.props.fetchExpenseByCategory(3);
            // this.props.fetchInsights();
            if( userResponse.userData.qbIntegrationStatus == true  ){
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
            if( userResponse.userData.qbIntegrationStatus == false ){
  
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
            isValidTokenApiCalled = true;
            
        }
        this.setState({  userData:userResponse.userData },()=>{
          if(userResponse.userData.bankIntegrationStatus == true){
            this.props.fetchPlaidCategoryDispatch();
          }
        });
      }else{
        this.setState({ isSpinner:false,tryAgainScreen: true, isBodyLoaded:true });  
      }
    }).catch((error)=>{
      this.setState({ isSpinner:false,tryAgainScreen: true, isBodyLoaded:true });  
    });
  }
  reloadQuickbooks = () => {
    this.resetFlags();

    getUserPromise().then((userResponse)=>{
      console.log("Dashboard user - ",userResponse);
      if(userResponse.result == true){
        this.props.updateUserReduxTree(userResponse.userData)
        if(userResponse.userData.bankIntegrationStatus == false){
          this.showBankNotConnectedPopupFlag = true;
          this.setState({ showCOHChartLoader: false, healthScoreIndicator: false },()=>{});
        }
        if(userResponse.userData.qbIntegrationStatus == false){
          this.setState({ salesData:[],showSalesChartLoader:false });
        }
        if(userResponse.userData.qbIntegrationStatus == true){
            this.props.fetchSales();
            this.props.fetchIncommingAr();
        }
        
  
        this.setState({  userData:userResponse.userData });
      }else{
        this.setState({ isSpinner:false,tryAgainScreen: true, isBodyLoaded:true });  
      }
    }).catch((error)=>{
      this.setState({ isSpinner:false,tryAgainScreen: true, isBodyLoaded:true });  
    });
  }
  fetchUser = () =>{
    this.resetFlags();
    let isValidTokenApiCalled = false;

    getUserPromise().then((userResponse)=>{
      console.log("Dashboard user - ",userResponse);
      if(userResponse.result == true){
        this.props.updateUserReduxTree(userResponse.userData)
        if(userResponse.userData.bankIntegrationStatus == false){
          this.showBankNotConnectedPopupFlag = true;
          this.setState({ showCOHChartLoader: false, healthScoreIndicator: false },()=>{});
        }
        if(userResponse.userData.qbIntegrationStatus == false){
          this.setState({ salesData:[],showSalesChartLoader:false });
        }
  
        if(userResponse.userData.bankIntegrationStatus == true){
          this.showBankNotConnectedPopupFlag = false;
           //Approcahes using promises 
            
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
            this.props.fetchCashInChange(3);
            this.props.fetchExpenseByCategory(3);
            // this.props.fetchInsights();
            if( userResponse.userData.qbIntegrationStatus == true  ){
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
            if( userResponse.userData.qbIntegrationStatus == false ){
  
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
            isValidTokenApiCalled = true;
            validatePlaidTokenPromise().then((triggerValidPlaidToken)=>{
              if(triggerValidPlaidToken.result == true){
                if(triggerValidPlaidToken.response.isValidPlaidToken == false){
                    //this.showBankCredentialChangePopupFlag = true;
                    let isshowQBPopupFlag = userResponse.userData.qbIntegrationStatus == true && triggerValidPlaidToken.response.IsQuickbookToken == false ? true : false;
                    if(this.onDashBoardFocused){
                      this.showBankCredentialChangePopup(isshowQBPopupFlag);
                    }
                }else{
                  if(userResponse.userData.qbIntegrationStatus == true && triggerValidPlaidToken.response.IsQuickbookToken == false){
                    //this.showQuickBooksPopupFlag = true;
                    if(this.onDashBoardFocused){
                      this.showQBPopup();
                    }
                  }
                }
              }
             }).catch((error)=>{
              console.log("Validate Plaid Token Promise error 1 - ",error);
            });
        }
        if(userResponse.userData.qbIntegrationStatus == true){
            this.props.fetchSales();
            this.props.fetchIncommingAr();
            
        }
        
  
        this.setState({  userData:userResponse.userData,isSpinner:false,tryAgainScreen:false,isBodyLoaded:true },()=>{
          if(userResponse.userData.bankIntegrationStatus == true){
            this.props.fetchPlaidCategoryDispatch();
          }
          if(this.state.isCountApiTriggered == false){
              if(userResponse.userData.bankIntegrationStatus == false){

                  if(userResponse.userData.qbIntegrationStatus == true){
                    validatePlaidTokenPromise().then((triggerValidPlaidToken)=>{
                      if(triggerValidPlaidToken.result == true){
                        
                          let isShowQBPopup = triggerValidPlaidToken.response.IsQuickbookToken == false ? true : false;
                          setTimeout(()=>{
                           if(this.onDashBoardFocused){
                            this.showConnectBankPopup(isShowQBPopup);
                           }
                          },300);
  
                      }else{
                        setTimeout(()=>{
                          if(this.onDashBoardFocused){
                            this.showConnectBankPopup(false);
                          }
                        },300);
                      }
                    }).catch((error)=>{
                      setTimeout(()=>{
                        if(this.onDashBoardFocused){
                          this.showConnectBankPopup(false);
                        }
                      },300);
                    }); 
                  }else{
                    setTimeout(()=>{
                      if(this.onDashBoardFocused){
                        this.showConnectBankPopup(false);
                      }
                    },300);
                  }
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
    });
    
  }

  showQBPopup = () => {
    Alert.alert("Message","Somethings went wrong with Quickbooks Please Reconnect Quickbooks",[
                    {text: 'Cancel'},
                    {
                      text: 'Connect Here',
                      onPress: () => { 
                        this.props.navigation.navigate("Integration",{ 
                          reloadPlaid:()=>{ this.reloadPlaid(); },
                          reloadQuickbooks:()=>{ this.reloadQuickbooks(); }
                        });
                      }
                    }
                  ],
                  {cancelable: false}
                  );
  }
  showBankCredentialChangePopup = (isShowQBPopup = false) => {
    Alert.alert("Message","Bank Credentials Changed Please Connect to Bank Again",
    [
      { text: 'Cancel', onPress: () => {
        if(isShowQBPopup){
          //this.showQuickBooksPopupFlag = true;
          setTimeout(()=>{
            this.showQBPopup();
          },100);
        }
      }},
      { text: 'Connect Here',
        onPress: () => { 
          if(isShowQBPopup){
            this.showQuickBooksPopupFlag = true;
          }
          this.props.navigation.navigate("Integration",{ 
            reloadPlaid:()=>{ this.reloadPlaid(); },
            reloadQuickbooks:()=>{ this.reloadQuickbooks(); }
          });
        }}
    ],{cancelable: false});
  }
  showConnectBankPopup = (isShowQBPopup = false) => {
    Alert.alert("Info","You're Not Connected To The Bank Please Connect To Bank",[ 
      { text:"Cancel", onPress: () => {
        if(isShowQBPopup){
            // this.showQuickBooksPopupFlag = true;
            setTimeout(()=>{
              this.showQBPopup();
            },100);
        }
      }},{ text:"Connect Here", onPress:()=>{ 
        if(isShowQBPopup){
            this.showQuickBooksPopupFlag = true;
        }
        this.props.navigation.navigate("Integration",{ 
          reloadPlaid:()=>{ this.reloadPlaid(); },
          reloadQuickbooks:()=>{ this.reloadQuickbooks(); }
        });
      }}
    ]);
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

    if(this.showQuickBooksPopupFlag){
      setTimeout(()=>{
        this.showQBPopup();
      },500);
      this.showQuickBooksPopupFlag = false;
    }
    else if(this.showBankNotConnectedPopupFlag){
      setTimeout(()=>{
        this.showConnectBankPopup();
      },500);
    }
    
   
  }
  render(){
    
    const financials = this.props.financials;
    const { isSpinner } = this.state;
    const { bankIntegrationStatus,qbIntegrationStatus } = this.state.userData;
    return (
      <React.Fragment>
          <NavigationEvents
            
            onWillFocus={(payload)=>{ 
            this.onDashBoardFocused = true;
            if(this.state.isBodyLoaded == true){ 
              this.callAgainForThePopup(); 
              } 
            }}
            onWillBlur={(payload) => { 
              this.onDashBoardFocused=false; 
              }}
          />
         <Spinner
          visible={ isSpinner }
          textStyle={styles.spinnerTextStyle}
        />
        {
          this.state.isBodyLoaded == true ?  this.state.tryAgainScreen ?  <TryAgainScreen navigation={this.props.navigation} handleButton={this.handleTryAgainButton} showLoggedOutButton = {true} /> :  
          <BottomNavLayout navigation={this.props.navigation}>
              <HealthScore  
               
               healthScoreIndicator={this.state.healthScoreIndicator} 
               outOfCashDate={this.state.outOfCashDate} 
               healthScore={this.state.healthScore} 
               navigation={this.props.navigation} 
               userCurrentBalance={this.state.userCurrentBalance}  
               userData={this.props.reduxUserData.userData}  
               reloadPlaid = { () => { this.reloadPlaid(); } }
               reloadQuickbooks = { () => { this.reloadQuickbooks(); } }
               
               />
              { bankIntegrationStatus == true ? <CashOnHand 
              healthScoreIndicator={this.state.healthScoreIndicator} 
              isCOHLoadedOnce={this.state.isCOHLoadedOnce} 
              outOfCashDate={this.state.outOfCashDate} 
              isEnableDropDownForSwitchingGraph={ 
                this.state.cashOnHandGraph.length == 0 ? true : false  
              } 
              showCOHChartLoader={this.state.showCOHChartLoader} 
              handleGraphChangeFunction={this.handleGraphChangeFunction} 
              userCurrentBalance={this.state.userCurrentBalance} 
              navigation={this.props.navigation} 
              cashOnHandGraphData={this.state.cashOnHandGraph} 
              cohPast={this.state.past} cohFuture={this.state.future} /> : null }
              { bankIntegrationStatus == true ? <ChangeInCash  
              navigation={this.props.navigation}/> : null }
              { bankIntegrationStatus == true ? <ExpenseByCategory 
              navigation={this.props.navigation} /> : null }
              { qbIntegrationStatus == true ? <Sales 
              navigation={this.props.navigation} /> : null }
              { qbIntegrationStatus == true ? <IncomingAR 
              style={styles.incomingAR} 
              navigation={this.props.navigation}/> : null }
          </BottomNavLayout>
          : null
        }
        </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
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
  fetchForecast: () => { dispatch(fetchForecastAsyncCreator()); },
  fetchSales: (salesCurrentRange = 3, isMultiple = false) => { 
      dispatch(salesAsyncCreator(salesCurrentRange,isMultiple)); 
    }
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

