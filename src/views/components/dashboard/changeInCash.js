import React, { Component, Fragment } from "react";
import { View, Text,TouchableOpacity, Alert , Keyboard,ActivityIndicator,Dimensions } from "react-native";
import Moment from "moment";
// import {Ionicons, SimpleLineIcons,AntDesign,MaterialCommunityIcons} from '@expo/vector-icons';
import { Dropdown } from "react-native-material-dropdown";
import {Button_Months} from "../../../constants/constants";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import ChangeInCashChart from "../charts/changeInCashChart";
import { cicAsynCreator } from "../../../reducers/cashinchange";
import { numberWithCommas } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { INSIGHTS,TERMINOLOGY } from "../../../api/message";

Ionicons.loadFont();
SimpleLineIcons.loadFont();
AntDesign.loadFont();
MaterialCommunityIcons.loadFont();

const gw=Dimensions.get("window").width;
class ChangeInCash extends Component {
  constructor(props) {
    super(props);
    this.state={
      cocMonths:'This Month',
      arrowStyle:"arrow-down",
      showInsightsCart: true
    }
    this.dropdownRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state){

    
    const { cicCurrentRange } = props.cashInChangeData;
    
    let renderButton;
    if(cicCurrentRange == 1){
        renderButton = "This Month";
    }else if(cicCurrentRange == 3){
        renderButton = "3 Months";
    }else if(cicCurrentRange == 6){
        renderButton = "6 Months";
    }else{
        renderButton = "12 Months"
    }
    
    return { cocMonths: renderButton };
}

  changeCashInChangeData = (cocMonths) => {
    const { cocMonths:cocMonthsState } = this.state;
    if(cocMonthsState != cocMonths){

      this.setState({ cocMonths });
      if(cocMonths == "This Month"){
        this.props.fetchCashInChange(1);
      }else if(cocMonths == "3 Months"){
        this.props.fetchCashInChange(3);
      }else if(cocMonths == "6 Months"){
        this.props.fetchCashInChange(6);
      }else{
        this.props.fetchCashInChange(12);
      }

    }
    
  }
  

  showAlert() {  
    Alert.alert( TERMINOLOGY.CHANGEINCASH.title,TERMINOLOGY.CHANGEINCASH.message,[  
            { text: TERMINOLOGY.CHANGEINCASH.button1,style: 'cancel' }]);  
  }

  handleArrowStyle = () => {
    if(this.state.arrowStyle == "arrow-down"){
      this.setState({ arrowStyle: "arrow-up" });
    }else{
      this.setState({ arrowStyle: "arrow-down" });
    }
  }
  
  handleReloadChangeInCash = () => {

    
    this.props.fetchCashInChange();
  }

  cashInChangeError = React.memo(() => {

    return(
      <View style={ styles.cicErrorMain }>
        <View style={ styles.cicErrorSub } >
          <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
          <Text style={{ marginLeft:10,alignSelf:"center" }}>Oops Error Try Again!</Text>
        </View> 
        <View style={ styles.cicErrorButton }>
            <TouchableOpacity onPress={()=>{ this.handleReloadChangeInCash(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
            </TouchableOpacity>
        </View>
  </View> 
    );
  });

  changeInCashMasterLoader = React.memo(()=>{
    return(
      <View style={ styles.cicMasterLoader }><ActivityIndicator size="large" color="#070640" /></View>  
    );
  });
  renderCicGraphEmpty = React.memo(()=>{
    return(
        <View style={ styles.cicGraphEmpty } accessible={true} pointerEvents="none">
                      <Text style={{ color:"#070640" }}>You have not spent anything this month.</Text>
        </View>
    );
  });

  renderCicChildLoader = React.memo(({ height })=>{
    return(
      <View style={{height,width:gw,justifyContent:"center",alignSelf:"center"}}>
            <ActivityIndicator size="large" color="#070640" />
      </View>
    );
  })

  renderCiCBody = React.memo(({ height,isCICGraphEmpty,total,historicalFinances })=>{
    return(
      <View style={{ height }}>
            <View style={styles.heading}>
                <TouchableOpacity disabled={false} onPress={this.showAlert}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{ fontSize: 12 }}>CHANGE IN CASH</Text>
                          <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
                    </View>
                </TouchableOpacity>
                      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                          {/* {`$${numberWithCommas(total * (-1))}`} */}
                          { total > 0 ? `-$${numberWithCommas(total)}` : `$${numberWithCommas(Math.abs(total))}` }
                      </Text>
            </View>
            <View style={{ width:"100%",flexDirection:"row",justifyContent:"flex-end",marginTop:-11,marginLeft:-15, }}>
                <Text style={{ paddingTop:15,color:"#1D1E1F",fontSize:12 }}>{ this.state.cocMonths } </Text>
            </View>
                 {
                   isCICGraphEmpty == true ? <this.renderCicGraphEmpty /> :
                   <View style={{ marginTop:"-5.5%",marginLeft:"-10%" }} accessible={true} pointerEvents="none">
                    <ChangeInCashChart historicalFinances={historicalFinances} />
                   </View>
                 }
                        
      </View>
    );
  })
  cicInsightFooter = React.memo(({ insightText,insightButtonText,backgroundColor })=>{

    return(
      <View style={{ ...styles.insightCartBody,backgroundColor }}>
      <Text style={styles.insightCartBodyText}>{ insightText } </Text>

      <TouchableOpacity style={styles.insightCartBodyGotoButton}>
        <Text style={styles.insightCartBodyGotoButtonText}>{ insightButtonText }</Text>
        <AntDesign name='right' style={styles.insightCartBodyGotoButtonIcon} 
        size={14} color={'#000000'}/>
      </TouchableOpacity>
      </View> 
    );
  });
  cicFooter = React.memo(({  }) => {
    return(
      <Fragment>
        <View style = {styles.buttonview}>
         <TouchableOpacity style={styles.Toucha} onPress = { () => { this.dropdownRef.current.focus(); } }>
           <Dropdown
              ref = {this.dropdownRef}
              data={Button_Months}
              onChangeText={(cocMonths)=>{ this.changeCashInChangeData(cocMonths); }}
              value={this.state.cocMonths}
              containerStyle={styles.dropdown}
              renderAccessory={() => null}
              pickerStyle={{backgroundColor:"#E6E6EC",borderRadius:10,}}
              onBlur={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
              onFocus={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
              fontSize={11}
              inputContainerStyle={styles.detailsInputContainer}
              dropdownPosition={4.5} 
              //disabled={true}
              />
            <SimpleLineIcons name={this.state.arrowStyle} color="#030538" style={{marginTop:10, marginRight:20,}}/>
          </TouchableOpacity>
          <View style={{width:"40%",height:"100%",}}>
            <Button title="View Insights" type="solid" buttonStyle={styles.btnstyle1} titleStyle={styles.buttontextt1}
               onPress={()=>{ Alert.alert(INSIGHTS.title,INSIGHTS.message,[ { text: INSIGHTS.button1  } ],false); }}
            />
          </View>
        </View>
        <this.cicInsightFooter 
            backgroundColor={"#E5FCEA"}
            insightText={"Your cash balance has increased from last months cash balance."}
            insightButtonText={"Keep on improving"}
        />
      </Fragment>
    );
  });
  render() {

    const { showInsightsCart } = this.state;
    let heightRatio = showInsightsCart ? "68%" : "90%"
    let { cashInChangeData } = this.props;
    let total = 0;
    if(cashInChangeData.cicData.totalCash != undefined && cashInChangeData.cicData.totalCash != null){
      total = cashInChangeData.cicData.totalCash;
    }
    const { historicalFinances } = this.props;
    
   
    let isCICGraphEmpty = true;
    if(cashInChangeData.isFetched == true){
      for(let i = 0;i < cashInChangeData.cicData.cash.length; i++ ){

        if(cashInChangeData.cicData.cash[i].amount != 0 && cashInChangeData.cicData.cash[i].amount != -0){
          isCICGraphEmpty = false;
          break;
        }

      }
    }
    
    

    
    return (
      
        
      <View style={{ ...styles.cicCharts,height: showInsightsCart ? 480 : 360 }}>
        {
          cashInChangeData.error == true ?  <this.cashInChangeError /> :  
            cashInChangeData.masterLoader == false ?
          <Fragment>
            {
              cashInChangeData.childLoader == false ?
               <this.renderCiCBody 
               isCICGraphEmpty={isCICGraphEmpty}
               height={heightRatio}
               total={total}
               historicalFinances={historicalFinances} /> : 
               <this.renderCicChildLoader height={heightRatio} />
            }
          <this.cicFooter />
          </Fragment>
          : <this.changeInCashMasterLoader />
        }
        
       </View>
      
    );
  }
}

const styles = {
  margins: {
    backgroundColor: "#EEEFF1",
    marginVertical: 8
  },
  cicCharts: { 
    borderColor:"red",borderWidth:0,
    marginVertical:8,
    height:375,width:'95%', 
    backgroundColor:'#FFF', 
    alignSelf:'center',
    elevation:10,
    shadowColor:'#000',paddingVertical:20 
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  buttonview:{
    width:'100%',
    flexDirection:"row",
    justifyContent:"space-between",
    alignSelf:"center",
    paddingHorizontal:15
  },
  Toucha:{
    width:"40%",
    height:34,
    borderRadius:10, 
    backgroundColor:"#E6E6EC",
    flexDirection:'row',
    justifyContent:'space-around',
  
  },
  dropdown: {
    
    width:"71%",
    marginLeft:22,
    marginTop:-25,
    borderBottomColor:"#FFF",
    borderBottomWidth:0,
  },
   btnstyle1:{
    width:"100%",
    borderRadius:6, 
    backgroundColor:"#85B1FF",
  },

  buttontextt1:{
    fontSize:11,
    color:'#FFFFFF',
  },
  detailsInputContainer: {
    borderBottomWidth: 0,
   },
  iconsty:{
    height:12,
    width:12,
    margin:6,
  },
  cicErrorMain: { 
    height:375,
    width:'100%', 
    backgroundColor:'white', 
    alignSelf:'center',
    justifyContent:"center",
    elevation:10,
    shadowColor:'#000' 
  },
  cicErrorSub: { 
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center" 
  },
  cicErrorButton: { 
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    marginTop:15 
  },
  cicGraphEmpty: {
    height:"66%",
    justifyContent:"center",
    alignItems:"center"
  },
  cicMasterLoader : { 
    height:"100%",
    width:'100%',
    justifyContent:"center"   
  },
  insightCartBody: { 
    borderRadius:6,
    marginTop:16,
    backgroundColor: "#FFE8DD",
    width:"91%",
    alignSelf:"center",
    padding:16 
  },
  insightCartBodyText: { 
    fontSize:13, 
    color:"#1D1E1F",
    fontWeight:"500" 
  },
  insightCartBodyGotoButton: { 
    flexDirection:"row",
    alignSelf:"flex-end",
    marginTop:12 
  },
  insightCartBodyGotoButtonText: { 
    alignSelf:"center",
    fontSize:13,
    color:"#1D1E1F",
    fontWeight:"500" 
  },
  insightCartBodyGotoButtonIcon: {
    marginLeft:3,
    marginTop: 3
  }
};

const mapStateToProps = (state) => {
  return{
    cashInChangeData : state.cashInChange
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    fetchCashInChange: ( cicCurrentRange = 0 ) => { dispatch(cicAsynCreator(cicCurrentRange)) }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ChangeInCash);