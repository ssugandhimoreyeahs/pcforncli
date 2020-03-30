import React, { Component } from "react";
import PlaidAuthenticator from "react-native-plaid-link";
import { post } from "../../api/api";
import { PLAID } from "../../constants/constants";
import { sendPlaidToken,saveBankData } from "../../api/api";
import { AsyncStorage,Alert,BackHandler,} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import DetectPlatform from "../../DetectPlatform";

export default class BankIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpinner:false
    }
  }

  onMessage = async (data, companyName) => {
    if (data.action === "plaid_link-undefined::exit") {
      this.props.navigation.goBack();
      //console.log("inside if plaid link undefined");
      
    } else if (data.action === "plaid_link-undefined::connected") {
      try{
        this.setState({ isSpinner:true });
        //console.log(data);
        publicToken = data.metadata.public_token;
        institution = data.metadata.institution;
        accounts = data.metadata.accounts;
    
      console.log("Bank Details all");
        console.log(publicToken);
        console.log(institution);
        console.log(accounts);
      console.log("Bank Details all ");
      const triggerPlaidPublicToken = await sendPlaidToken(publicToken,institution,accounts);
      console.log("Mongo sendPlaidToken new response",triggerPlaidPublicToken);
      // const triggerSaveBankData = await saveBankData(publicToken,institution,accounts);
      // console.log("Mongo saveBankDetails  ",triggerSaveBankData);
      if(triggerPlaidPublicToken.result == true){
        // if(this.props.navigation.getParam("reloadDashBoardData")){
        //   this.props.navigation.getParam("reloadDashBoardData")();
        // }
  
        if(this.props.navigation.getParam("createBankIntegration") ){
            this.setState({ isSpinner: false },()=>{
              this.props.navigation.getParam("createBankIntegration")();
            this.props.navigation.navigate("AccountConnected",{ 
              redirectTo: () => {
                this.props.navigation.navigate("Setup")
              }
             });
            });
        }
        if(this.props.navigation.getParam("comeFromTimeout")){
          // if(this.props.navigation.getParam("reloadDashBoardData")){
          //   this.props.navigation.getParam("reloadDashBoardData")();
          // }
          this.setState({ isSpinner:false },()=>{
            this.props.navigation.navigate("AccountConnected",{ 
              redirectTo: () => {
                this.setState({ isSpinner: true },()=>{
                  setTimeout(()=>{
                  this.props.navigation.getParam("reloadDashBoardData")();
                  setTimeout(()=>{
                    this.props.navigation.navigate("Dashboard")
                  },1000);
                  },7000);
                })
                
                
              }
             });
          })
        }
        if(this.props.navigation.getParam("comeFromInnerIntegration")){
          // if(this.props.navigation.getParam("reloadDashBoardData")){
          //   this.props.navigation.getParam("reloadDashBoardData")();
          // }
          this.setState({ isSpinner:false },()=>{
            this.props.navigation.navigate("AccountConnected",{ 
              redirectTo: () => {
                  this.setState({ isSpinner: true },()=>{
                    setTimeout(()=>{
                      this.props.navigation.getParam("reloadDashBoardData")();
                      
                      setTimeout(()=>{
                        this.props.navigation.getParam("reloadInnerIntegrationScreen")();
                         setTimeout(()=>{
                          //this.props.navigation.navigate("Integration");
                          //change some flow on 28-mar-2020
                          this.props.navigation.navigate("Contact");
                         },1000);
                      },1500);
                    },6000);
                  })
                  
              }
             });
          })
        }
        //this.setState({ isSpinner:false });
      } 
      else{
        //console.log(error);
        this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
          

          this.props.navigation.navigate("OopsSorry",{ executeOperation : () => {
                      if(this.props.navigation.getParam("createBankIntegration")){
                       // this.props.navigation.getParam("createBankIntegration")();
                        this.props.navigation.navigate("Setup");
                      }
                      if(this.props.navigation.getParam("comeFromTimeout")){
                        this.props.navigation.navigate("Dashboard");
                      }
                      if(this.props.navigation.getParam("comeFromInnerIntegration")){
                        this.props.navigation.navigate("Contact");
                      }
          } });


          // Alert.alert(
          //   "Error",
          //   "Error While Connecting Try Again", [{
          //       text: 'OK',
          //       //onPress: () => console.log('Cancel Pressed'),
          //       onPress : () => {
          //         if(this.props.navigation.getParam("createBankIntegration")){
          //           this.props.navigation.getParam("createBankIntegration")();
          //           this.props.navigation.navigate("Setup");
          //         }
          //         if(this.props.navigation.getParam("comeFromTimeout")){
          //           this.props.navigation.navigate("Dashboard");
          //         }
          //         if(this.props.navigation.getParam("comeFromInnerIntegration")){
          //           this.props.navigation.navigate("Contact");
          //         }
          //       },
          //       style: 'cancel'
          //   },],{
          //       cancelable: false
          //   })

        },100) });
      }
      
      }catch(error){
        console.log(error);
        this.setState((prevState)=>{ return { isSpinner:!prevState.isSpinner } },()=>{ setTimeout(()=>{
          

          this.props.navigation.navigate("OopsSorry",{ executeOperation : () => {
                      if(this.props.navigation.getParam("createBankIntegration")){
                       // this.props.navigation.getParam("createBankIntegration")();
                        this.props.navigation.navigate("Setup");
                      }
                      if(this.props.navigation.getParam("comeFromTimeout")){
                        this.props.navigation.navigate("Dashboard");
                      }
                      if(this.props.navigation.getParam("comeFromInnerIntegration")){
                        this.props.navigation.navigate("Contact");
                      }
          } });


          // Alert.alert(
          //   "Error",
          //   "Error While Connecting Try Again", [{
          //       text: 'OK',
          //       //onPress: () => console.log('Cancel Pressed'),
          //       onPress : () => {
          //         if(this.props.navigation.getParam("createBankIntegration")){
          //           this.props.navigation.getParam("createBankIntegration")();
          //           this.props.navigation.navigate("Setup");
          //         }
          //         if(this.props.navigation.getParam("comeFromTimeout")){
          //           this.props.navigation.navigate("Dashboard");
          //         }
          //         if(this.props.navigation.getParam("comeFromInnerIntegration")){
          //           this.props.navigation.navigate("Contact");
          //         }
          //       },
          //       style: 'cancel'
          //   },],{
          //       cancelable: false
          //   })

        },100) });
      }
    }
  };

  componentDidMount(){
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
        nav.goBack();
        return true;
      }
    }

  render() {
    return (
      <React.Fragment>
          <Spinner
          visible={this.state.isSpinner}
        />
      <PlaidAuthenticator
        onMessage={data => {
          this.onMessage(data);
        }} 
        publicKey={PLAID.publicKey}
        env={PLAID.env}
        product={PLAID.product}
        clientName={PLAID.clientName}
        selectAccount={PLAID.selectAccount}
        //connected={console.log("Completed")}
      />
      </React.Fragment>
    );
  }
}

const styles = {
  container: {
    alignItems: "center",
    backgroundColor: "#F1F3F5",
    flex: 1,
    justifyContent: "center",
    paddingBottom: "20%"
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: "10%"
  },
  text: {
    textAlign: "center",
    marginBottom: "15%"
  }
};