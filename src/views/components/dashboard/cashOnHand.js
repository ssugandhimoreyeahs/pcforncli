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

Ionicons.loadFont();
SimpleLineIcons.loadFont();
export default class CashOnHand extends PureComponent {
  constructor(props) {
    super(props);
    this.state={

      months:'3 Months',
      arrowStyle:"arrow-down",
    }
    this.dropdownRef = React.createRef();
  }
  getOutOfCashDateLabel(cash, expenses, sales) {
    const rate = sales - expenses;
    if (rate === 0) {
      return "Cash Flow Neutral";
    } else if (rate > 0) {
      return "Cash Flow Positive";
    } else {
      const ooc = getOutOfCashDate(cash, expenses, sales);
      return ooc.format("MMM D, YYYY");
    }
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
handleSelectShowGraphDropDown = (recieveText) => { 
  //console.log("Receiving Text  ",recieveText);
  
     if(this.state.months != recieveText){
       this.setState(()=>{ return { months: recieveText } });
       this.props.handleGraphChangeFunction(recieveText);
     }
  
  
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
  render() {
    
    const gw=Dimensions.get("window").width;

    let isCOHGraphEmpty = true;

    for(let i=0;i<this.props.cashOnHandGraphData.length; i++){
    
      if( this.props.cashOnHandGraphData[i].amount != 0 && this.props.cashOnHandGraphData[i].amount > 0 ){
    
        isCOHGraphEmpty = false;
        break;
      }
    }
    
    return (
      <View style={{alignSelf:'center',marginTop:-20, width:'95%'}}>
        {
          this.props.healthScoreIndicator == true ?
          <View
          style={{
            borderRadius:5,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 15,
            paddingHorizontal: 15,
            height:48,width:'100%',
            }}></View> :
        <View
        style={{
          backgroundColor: this.getRunwayColor(
            0,
            0,
            0
          ),
          borderRadius:5,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 15,
          paddingHorizontal: 15,
          height:48,width:'100%',
          elevation:10,shadowColor:'#000',
          backgroundColor:'#FF7749',

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
          {/* {`${this.getOutOfCashDateLabel(
            currentCashOnHand,
            currentExpenses,
            currentRevenue
          ) || ""}`} */}{ `${this.props.outOfCashDate}` }
        </Text>
     </View> 
        }
        
      <View style={styles.margins}/>
        {
          this.props.isCOHLoadedOnce == false ?
          <View style={{ height:340,width:'100%', backgroundColor:'white',elevation:10,shadowColor:'#000',justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size="large" color="#070640" />
          </View>
          :

        <View style={{ 
          height:340,
          width:'100%',
          backgroundColor:'#FFF',
          elevation:10,
          shadowColor:'#000',
          paddingVertical:20}}>
        {
          this.props.showCOHChartLoader == true ?
          <View style={{height:"90%",width:'100%',justifyContent:"center",alignItems:"center"}}>
            <ActivityIndicator size="large" color="#070640" />
          </View>
          :
          <View style={{ height: "90%" }}>
            <View style={styles.heading}>
          <TouchableOpacity onPress={this.showAlert2}>
          <View style={{flexDirection:'row'}}>
            <Text style={{ fontSize: 12 }}>CASH ON HAND</Text>
            <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
          </View>
          </TouchableOpacity>
          <Text style={{ textAlign:"right",fontSize: 22, fontWeight: "bold" }}>
            {`$${ numberWithCommas(this.props.userCurrentBalance) || 0.0}`}
          </Text>
        </View>
        {
          isCOHGraphEmpty == true ?

          <View style={{height:"66%",justifyContent:"center",alignItems:"center"}} accessible={true} pointerEvents="none">
           <Text style={{ color:"#070640" }}>No Data Available!</Text>
          </View>

          :

          <View style={{marginTop:"-4.9%",marginLeft:"3%"}} accessible={true} pointerEvents="none">
            <CashOnHandChart 
            cashOnHandGraphData={this.props.cashOnHandGraphData} 
            cohPast={this.props.cohPast} 
            cohFuture={this.props.cohFuture} />
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
                        onChangeText={this.handleSelectShowGraphDropDown}
                        value={this.state.months}
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
    marginVertical:10,
    
  },
  heading: {
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15
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
