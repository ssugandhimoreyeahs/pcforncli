import React, { Component } from "react";
import { View, Text,TouchableOpacity,Alert, Keyboard,ActivityIndicator, Dimensions } from "react-native";
import Moment from "moment";
import SalesChart from "../charts/salesChart";
// import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import { Dropdown } from "react-native-material-dropdown";
import {Button_Months} from "../../../constants/constants";
import { Button } from "react-native-elements";
import { numberWithCommas } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

const gw=Dimensions.get("window").width;
export default class ChangeInCash extends Component {
  constructor(props) {
    super(props);
    this.state={
      months:'6 Months',
      arrowStyle:"arrow-down"
    }
    this.dropdownRef = React.createRef();
  }
 
  calculateCurrentMonthSales(historicalFinances) {
    // find data for the current month
    currentMonthKey = Object.keys(historicalFinances).filter(monthKey => {
      const monthKeyMoment = Moment(monthKey, "YYYY-MM-DD");
      if (
        monthKeyMoment.month() === Moment().month() &&
        monthKeyMoment.year() === Moment().year()
      ) {
        return monthKey;
      }
    });

    return historicalFinances[currentMonthKey]
      ? historicalFinances[currentMonthKey].revenue
      : 0;
  }


  showAlert() {  
    Alert.alert(  
        'Sales',  
        'Revenue is the income generated from normal business operations and includes discounts and deductions for returned product or services. It is the top line or gross income figure from which costs are subtracted to determine net income.',  
        [  
            {  
                text: 'Cancel',  
                onPress: () => console.log('Cancel Pressed'),  
                style: 'cancel',
                  
            },  
        ]  
    );  
  }

  handleArrowStyle = () => {
    if(this.state.arrowStyle == "arrow-down"){
      this.setState({ arrowStyle: "arrow-up" });
    }else{
      this.setState({ arrowStyle: "arrow-down" });
    }
  }
  

  render() {
    // console.log("sales testing ------------------");
    // console.log(this.props.salesData);
    // console.log("------------------ ends here---");
    let isSalesGraphEmpty = true;
    for(let i=0; i<this.props.salesData.length;i++){
      if(this.props.salesData[i].amount != 0 && this.props.salesData[i].amount > 0){
        isSalesGraphEmpty = false;
        break;
      }
    }
    const { historicalFinances } = this.props;
    return (
      <View style={{width:'95%', alignSelf:'center' }}>
        <View style={styles.margins}>
        </View>
       {
         this.props.isSalesLoadedOnce == false ?
         <View style={{height:340,width:'100%', backgroundColor:'white',elevation:10,shadowColor:'#000',justifyContent:"center",alignItems:"center"}}>
         <ActivityIndicator size="large" color="#070640" />
       </View>

         :
         <View>
            <View style={{ height:340,width:'100%', backgroundColor:'white', alignSelf:'center',elevation:10,shadowColor:'#000' }}>
        <View style={styles.heading}>
          <TouchableOpacity onPress={this.showAlert}>
            <View style={{flexDirection:'row'}}>
              <Text style={{ fontSize: 12 }}>SALES</Text>
              <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {/* {`$${this.calculateCurrentMonthSales(historicalFinances) || "-"}`} */}
            {`$${numberWithCommas(this.props.salesTotalAmount)}`}
            
          </Text>
        </View>

        <View style={{ width:"100%",flexDirection:"row",justifyContent:"flex-end",marginTop:-11,marginLeft:-15, }}>
                     <Text style={{ color:"#1D1E1F",fontSize:12 }}>
                         {
                             ` ${this.state.months}`
                         }
                     </Text>
                 </View>

        <View style={{marginTop:"-10%",marginLeft:"3%"}} accessible={true} pointerEvents="none">
        {
            this.props.showSalesChartLoader == true ? 
            <View style={{height:260,width:gw,justifyContent:"center",alignSelf:"center"}}>
              <ActivityIndicator size="large" color="#070640" />
            </View> : 
            isSalesGraphEmpty == true ?  
            <View style={{height:255,justifyContent:"center",alignItems:"center"}} accessible={true} pointerEvents="none">
              <Text style={{ color:"#070640" }}>No Data Available!</Text>
            </View>
            :
            <SalesChart historicalFinances={historicalFinances} salesData={this.props.salesData} />
          }

          
        
        
        </View>
        <View style = {styles.buttonview}>
          <TouchableOpacity style={styles.Toucha} onPress = { () =>  {  this.dropdownRef.current.focus()  } }>
           <Dropdown
                ref = {this.dropdownRef}
                data={Button_Months}
                onChangeText={(data)=> this.setState({months:data}) }
                value={this.state.months}
                containerStyle={styles.dropdown}
                renderAccessory={() => null}
                pickerStyle={{backgroundColor:"#E6E6EC",borderRadius:10,}}
                onBlur={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                onFocus={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                inputContainerStyle={styles.detailsInputContainer}
                dropdownPosition={4.5}
                disabled={true}
                fontSize={11} />
                <SimpleLineIcons name={this.state.arrowStyle} color="#030538" style={{marginTop:10, marginRight:20,}}/>
          </TouchableOpacity>
          <View style={{width:"40%",height:"100%",}}>
          <Button title="View Insights" type="solid" buttonStyle={styles.btnstyle1} titleStyle={styles.buttontextt1}
           //onPress={()=>this.props.navigation.navigate("SalesInsights")}
           onPress={()=>{  
            // Alert.alert("Message","Coming Soon!");  
            Alert.alert("Message","Coming Soon!",[ { text: "Cancel"  } ],false);
            }}
           />
          </View>
        </View>

          </View>
        </View>
       }
      </View>
    );
  }
}

const styles = {
  margins: {
    backgroundColor: "#EEEFF1",
    marginVertical:8
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  buttonview:{
    height:"10%",
    width:'90%',
    flexDirection:"row",
    justifyContent:"space-between",
    alignSelf:"center",
  },
  Toucha:{
    width:"40%",
    height:"100%",
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
  },
  detailsInputContainer: {
    borderBottomWidth: 0,
   
  },
  iconsty:{
    height:12,
    width:12,
    margin:6,
  },
  
};