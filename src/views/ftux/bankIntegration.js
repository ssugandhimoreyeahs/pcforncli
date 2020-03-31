import React, { Component } from "react";
import PlaidAuthenticator from "react-native-plaid-link";
import { PLAID } from "../../constants/constants";
import { sendPlaidToken } from "../../api/api";
import { BackHandler,} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';


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
        
      
      const triggerPlaidPublicToken = await sendPlaidToken(publicToken,institution,accounts);
      console.log("Send Plaid Details Response",triggerPlaidPublicToken);
      if(triggerPlaidPublicToken.result == true){
        if(this.props.navigation.getParam("createBankIntegration") ){
            this.setState({ isSpinner: false },()=>{
              if(this.props.navigation.getParam("createBankIntegration")){
                this.props.navigation.getParam("createBankIntegration")();
              }
            this.props.navigation.navigate("AccountConnected",{ 
              redirectTo: () => {
                this.props.navigation.navigate("Setup")
              }
             });
            });
        }
        else if(this.props.navigation.getParam("comeFromTimeout")){
          this.setState({ isSpinner:false },()=>{
            this.props.navigation.navigate("AccountConnected",{ 
              redirectTo: () => {
                this.setState({ isSpinner: true },()=>{
                  setTimeout(()=>{
                  if(this.props.navigation.getParam("reloadDashBoardData")){
                    this.props.navigation.getParam("reloadDashBoardData")();
                  }
                  setTimeout(()=>{
                    this.setState({ isSpinner: false });
                    this.props.navigation.navigate("Dashboard")
                  },1500);
                  },7000);
                })
                
                
              }
             });
          })
        }
        else if(this.props.navigation.getParam("comeFromInnerIntegration")){
          this.setState({ isSpinner:false },()=>{
            this.props.navigation.navigate("AccountConnected",{ 
              redirectTo: () => {
                  this.setState({ isSpinner: true },()=>{
                    setTimeout(()=>{
                      if(this.props.navigation.getParam("reloadPlaid")){
                        this.props.navigation.getParam("reloadPlaid")();
                      }
                      
                      setTimeout(()=>{
                        // if(this.props.navigation.getParam("reloadInnerIntegrationScreen")){
                        //   this.props.navigation.getParam("reloadInnerIntegrationScreen")();
                        // }
                         setTimeout(()=>{
                          //this.props.navigation.navigate("Integration");
                          //change some flow on 28-mar-2020
                          this.setState({ isSpinner: false });
                          this.props.navigation.navigate("Contact");
                         },1000);
                      },1500);
                    },6000);
                  })
                  
              }
             });
          })
        }
        
      } 
      else{
        
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
                        this.props.navigation.navigate("Integration");
                      }
          } });


         

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
                        this.props.navigation.navigate("Integration");
                      }
          } });


         

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