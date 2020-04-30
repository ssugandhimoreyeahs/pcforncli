import React, { Component, PureComponent } from "react";
import { View, Text,TouchableOpacity, Alert,BackHandler , StyleSheet, FlatList, Keyboard, ActivityIndicator, Dimensions} from "react-native";
import Moment, { months } from "moment";
import { getHealthScoreColor } from "../../../utilities/gradient";
import { getOutOfCashDate } from "../../../utilities/cash";
import CashOnHandChart from "../charts/cashOnHandChart";
// import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Dropdown } from 'react-native-material-dropdown'; 
import {Button_Months} from "../../../constants/constants";
import { Button } from "react-native-elements";
import { numberWithCommas } from "../../../api/common";
import { TERMINOLOGY,INSIGHTS } from "../../../api/message";
import { connect } from "react-redux";
import { cohAsyncCreator } from "../../../reducers/cashonhand";

Ionicons.loadFont();
SimpleLineIcons.loadFont();
 
class CashOnHand extends PureComponent {
  constructor(props) {
    super(props);
    this.state={

      months:'3 Months',
      arrowStyle:"arrow-down",
    }
    this.dropdownRef = React.createRef();
  }
 

  getRunwayColor(cash, expenses, sales) {
    const oocDate = getOutOfCashDate(cash, expenses, sales);
    const oocMonths = oocDate.diff(Moment(), "months", true);
    return getHealthScoreColor(oocMonths, true);
  }

showAlert1() {  
    Alert.alert(  
        TERMINOLOGY.OUTOFCASHDATE.title,  
        TERMINOLOGY.OUTOFCASHDATE.message,[{  
                text: TERMINOLOGY.OUTOFCASHDATE.button1,style:"cancel" }]);  
}  

showAlert2() {  
  Alert.alert(  
      TERMINOLOGY.CASHONHAND.title,  
      TERMINOLOGY.CASHONHAND.message,[{  
              text: TERMINOLOGY.CASHONHAND.button1,  
              style: 'cancel'}]);  
} 
handleArrowStyle = () => {
  if(this.state.arrowStyle == "arrow-down"){
    this.setState({ arrowStyle: "arrow-up" });
  }else{
    this.setState({ arrowStyle: "arrow-down" });
  }
}
triggerCohRequest = (userRequest) => {
  const { cohCurrentRange } = this.props.cashOnHandRedux;
  let monthRequestType = userRequest == "This Month" ? 1 :
                  userRequest == "3 Months" ? 3 :
                  userRequest == "6 Months" ? 6 : 12;
  if(monthRequestType != cohCurrentRange){
    this.props.triggerCohRequestApi(monthRequestType);
  }              
  
}
parentLoader = React.memo(()=>{
  return(
    <View style={{ marginVertical:10,height:340,width:'100%', backgroundColor:'white',elevation:10,shadowColor:'#000',justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size="large" color="#070640" />
      </View>
  );
})
childLoader = React.memo(()=>{
  return(
    <View style={{height:"90%",width:'100%',justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size="large" color="#070640" />
    </View>
  );
})
emptyGraph = React.memo(()=>{
  return(
    <View style={{height:"66%",justifyContent:"center",alignItems:"center"}} accessible={true} pointerEvents="none">
           <Text style={{ color:"#070640" }}>No Data Available!</Text>
    </View>
  );
})
render() {
  const { outOfCashDateResponse,fetched: outOfCashDateIsFetched } = this.props.outOfCashDateRedux;
    const gw=Dimensions.get("window").width;
    const { isFetched,cohData,parentLoader,childLoader,cohCurrentRange } = this.props.cashOnHandRedux;
    let instanceObj = { past: 0, future: 0 };
    instanceObj = cohCurrentRange == 1 ? { past: 0, future: 0 } :
                  cohCurrentRange == 3 ? { past: 3, future: 1 } :
                  cohCurrentRange == 6 ? { past: 3, future: 3 } :
                  { past: 12, future: 0 };
    
    let cashOnHandGraphData = isFetched == true ? cohData.data : [];
    let isCOHGraphEmpty = true;
    let btnText = cohCurrentRange == 1 ? "This Month" : cohCurrentRange == 3 ? "3 Months" : cohCurrentRange == 6 ? "6 Months" : "12 Months";
    for(let i=0;i<cashOnHandGraphData.length; i++){
    
      if( cashOnHandGraphData[i].amount != 0 && cashOnHandGraphData[i].amount > 0 ){
    
        isCOHGraphEmpty = false;
        break;
      }
    }
    
    let outOfCashDate = "";
    if(outOfCashDateIsFetched){
      outOfCashDate = outOfCashDateResponse.days;
    }
    return (
      <View style={{alignSelf:'center',marginTop:-20, width:'95%'}}>
        {
          this.props.healthScoreIndicator == true ?
          <View style={ styles.offOutOfCashDate }></View> :
        <View style={{
          backgroundColor: this.getRunwayColor(
            0,
            0,
            0
          ),...styles.outOfCashDateDateStyle
        }}>
         <TouchableOpacity onPress={this.showAlert1} >
          <View style={{flexDirection:'row'}}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#FFF" }}>
          Out-of-Cash Date
        </Text>
        <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:4,color:'#fff'}}/>
          </View>
          </TouchableOpacity>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#FFF" }}>
          { `${outOfCashDate}` }
        </Text>
     </View> 
        }
        
      <View style={styles.margins}/>
        {
          parentLoader == true ? <this.parentLoader /> :
        <View style={ styles.cashOnHandCart }>
        {
          childLoader == true ? <this.childLoader /> :
          <View style={{ height: "90%" }}>
            <View style={styles.heading}>
          <TouchableOpacity onPress={this.showAlert2}>
          <View style={{flexDirection:'row'}}>
            <Text style={{ fontSize: 12 }}>CASH ON HAND</Text>
            <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
          </View>
          </TouchableOpacity>
          <Text style={{ textAlign:"right",fontSize: 22, fontWeight: "bold" }}>
            {`$${ numberWithCommas(cohData.currentBalance) || 0.0}`}
          </Text>
        </View>
        {
          isCOHGraphEmpty == true ? <this.emptyGraph /> :
          <View style={{marginTop:"-4.9%",marginLeft:"3%"}} accessible={true} pointerEvents="none">
            <CashOnHandChart 
            cashOnHandGraphData={cashOnHandGraphData} 
            cohPast={instanceObj.past} 
            cohFuture={instanceObj.future} />
          </View>
        }
        </View>
        }
        <View style = {styles.buttonview}>
          <TouchableOpacity style={styles.Toucha} onPress={()=>{ this.dropdownRef.current.focus(); }}>
                <Dropdown
                        ref={this.dropdownRef}
                        //disabled={this.props.isEnableDropDownForSwitchingGraph}
                        disabled={ false }
                        data={Button_Months}
                        onChangeText={this.triggerCohRequest}
                        value={btnText}
                        containerStyle={styles.dropdown}
                        renderAccessory={() => null}
                        pickerStyle={{backgroundColor:"#E6E6EC",borderRadius:10,}}
                        onBlur={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                        onFocus={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                        fontSize={11}
                        inputContainerStyle={styles.detailsInputContainer}
                        dropdownPosition={4.5} />
                <SimpleLineIcons name={this.state.arrowStyle} color="#030538" style={{marginTop:10, marginRight:20,}}/>
          </TouchableOpacity>
          <View style={{width:"40%",height:"100%",}}>
          <Button title="View Insights" type="solid" buttonStyle={styles.btnstyle1} titleStyle={styles.buttontextt1}
           onPress={()=>{
            // this.props.navigation.navigate("CashOnHandinsights")
            Alert.alert(INSIGHTS.title,INSIGHTS.message,[ { text: INSIGHTS.button1  } ],false);
           }
            }/>
          </View>
        </View>

        </View>
        }
      </View>
    );
  }
}

const styles =  StyleSheet.create({
  margins: {
    backgroundColor: "#EEEFF1",
    marginTop:10,
    
  },
  offOutOfCashDate: {
    borderRadius:5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    height:48,width:'100%',
    },
    outOfCashDateDateStyle: {
    borderRadius:5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    height:48,width:'100%',
    elevation:10,shadowColor:'#000',
    backgroundColor:'#FF7749',
  },
  heading: {
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15
  },
  cashOnHandCart: {
    marginVertical:8, 
    height:340,
    width:'100%',
    backgroundColor:'#FFF',
    elevation:10,
    shadowColor:'#000',
    paddingVertical:20
  },
  buttonview:{
    height:"10%",
    width:'100%',
    flexDirection:"row",
    justifyContent:"space-between",
    alignSelf:"center",
    paddingHorizontal:15
  },
  Toucha:{
    width:"40%",
    height:32,
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

});

const mapStateToProps = state => {
  return {
    cashOnHandRedux: state.cohReducer,
    outOfCashDateRedux: state.outOfCashDateReducer,
    healthScoreIndicator: !state.healthScoreReducer.isFetched
  }
}
const mapDispatchToProps = dispatch => {
  return {
    triggerCohRequestApi: (cohCurrentRange) => { dispatch(cohAsyncCreator(cohCurrentRange)); }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(CashOnHand);
