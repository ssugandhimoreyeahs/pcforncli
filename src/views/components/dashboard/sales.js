import React, { Component, Fragment } from "react";
import { View, Text,TouchableOpacity,Alert, Keyboard,ActivityIndicator, Dimensions } from "react-native";
import Moment from "moment";
import SalesChart from "../charts/salesChart";
// import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import { Dropdown } from "react-native-material-dropdown";
//import {Button_Months} from "../../../constants/constants";
import { Button } from "react-native-elements";
import { numberWithCommas } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { connect } from 'react-redux';
import { salesAsyncCreator } from "../../../reducers/sales";

SimpleLineIcons.loadFont();
//MaterialCommunityIcons.loadFont();
Ionicons.loadFont();
AntDesign.loadFont();
const gw=Dimensions.get("window").width;

const Button_Months = [
  // { value: "This Month" },
  { value: "3 Months" },
  { value: "6 Months" },
  { value: "12 Months" }
  
];

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state={
      months:'3 Months',
      arrowStyle:"arrow-down"
    }
    this.dropdownRef = React.createRef();
  }
  
  static getDerivedStateFromProps(props,state){
     //code here
     const { salesCurrentRange } = props.salesRedux;
     
     let renderButton;
     if(salesCurrentRange == 1){
         renderButton = "This Month";
     }else if(salesCurrentRange == 3){
         renderButton = "3 Months";
     }else if(salesCurrentRange == 6){
         renderButton = "6 Months";
     }else{
         renderButton = "12 Months"
     }
     return { months: renderButton };
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
  
  handleSalesChangeRequest = (salesMonthIncomming) => {

    
      const { months:currentSalesMonth } = this.state;
      if(currentSalesMonth != salesMonthIncomming){
  
        this.setState({ months: salesMonthIncomming });
        if(salesMonthIncomming == "This Month"){
          this.props.fetchSalesMultiple(1);
        }else if(salesMonthIncomming == "3 Months"){
          this.props.fetchSalesMultiple(3);
        }else if(salesMonthIncomming == "6 Months"){
          this.props.fetchSalesMultiple(6);
        }else{
          this.props.fetchSalesMultiple(12);
        }
  
      }
      
    

  }

  handleErrorReloadSales = () => {
    const { months: salesMonthIncomming } = this.state;
    if(salesMonthIncomming == "This Month"){
      this.props.fetchSalesMultiple(1);
    }else if(salesMonthIncomming == "3 Months"){
      this.props.fetchSalesMultiple(3);
    }else if(salesMonthIncomming == "6 Months"){
      this.props.fetchSalesMultiple(6);
    }else{
      this.props.fetchSalesMultiple(12);
    }
  }
  render() {
    // console.log("sales testing ------------------");
    // console.log(this.props.salesData);
    // console.log("------------------ ends here---");
    let isSalesGraphEmpty = true;
    let { error,salesData:reduxObj,isFetched, masterLoader, childLoader, salesCurrentRange } = this.props.salesRedux;
    let totalSalesAmount = 0;
    let salesData = [];
    if(isFetched == true){
      totalSalesAmount = reduxObj.finalAmount;
      salesData = reduxObj.datamonth;
      for(let i=0; i< salesData.length;i++){
        if(salesData[i].amount != 0 && salesData[i].amount > 0){
          isSalesGraphEmpty = false;
          break;
        }
      }
    }
    //error = true;
    return (
      <View style={{width:'95%', alignSelf:'center' }}>
        <View style={styles.margins}>
        </View>
       {
         masterLoader == true ?
         <View style={{height:340,width:'100%', backgroundColor:'white',elevation:10,shadowColor:'#000',justifyContent:"center",alignItems:"center"}}>
         <ActivityIndicator size="large" color="#070640" />
       </View> :

         error == true ?
         <View style={{ height:375,width:'100%', backgroundColor:'white', alignSelf:'center',justifyContent:"center",elevation:10,shadowColor:'#000' }}>
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
              <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
              <Text style={{ marginLeft:10,alignSelf:"center" }}>Oops Error Try Again!</Text>
          </View> 
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
              <TouchableOpacity onPress={()=>{ this.handleErrorReloadSales(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                  <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><SimpleLineIcons style={{ marginTop:4 }} name='reload' size={18} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
              </TouchableOpacity>
           </View>
        </View>  
         :
         <View>
         <View style={{ height:340,width:'100%', backgroundColor:'white', alignSelf:'center',elevation:10,shadowColor:'#000' }}>
         {
          childLoader == true ? 
            <View style={{height:280,width:gw,justifyContent:"center",alignSelf:"center"}}>
              <ActivityIndicator size="large" color="#070640" />
            </View> : 

            <Fragment>
            <View style={styles.heading}>
          <TouchableOpacity onPress={this.showAlert}>
            <View style={{flexDirection:'row'}}>
              <Text style={{ fontSize: 12 }}>SALES</Text>
              <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            {/* {`$${this.calculateCurrentMonthSales(historicalFinances) || "-"}`} */}
            {`$${numberWithCommas(totalSalesAmount)}`}
            
          </Text>
        </View>

        <View style={{ width:"100%",flexDirection:"row",justifyContent:"flex-end",marginTop:-11,marginLeft:-15, }}>
              <Text style={{ color:"#1D1E1F",fontSize:12 }}>{` ${this.state.months}`}</Text>
        </View>

        <View style={{marginTop:"-10%",marginLeft:"3%"}} accessible={true} pointerEvents="none">
        {
            
            isSalesGraphEmpty == true ?  
            <View style={{height:260,justifyContent:"center",alignItems:"center"}} accessible={true} pointerEvents="none">
              <Text style={{ color:"#070640" }}>No Data Available!</Text>
            </View>
            :
            <SalesChart 
                salesCurrentRange={salesCurrentRange} 
                salesData={salesData} />
          }

          
        
        
        </View>
            </Fragment>
         }
         
            
        
        <View style = {styles.buttonview}>
          <TouchableOpacity style={styles.Toucha} onPress = { () =>  {  this.dropdownRef.current.focus()  } }>
           <Dropdown
                ref = {this.dropdownRef}
                data={Button_Months}
                onChangeText={(month)=> { this.handleSalesChangeRequest(month); }}
                value={this.state.months}
                containerStyle={styles.dropdown}
                renderAccessory={() => null}
                pickerStyle={{backgroundColor:"#E6E6EC",borderRadius:10,}}
                onBlur={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                onFocus={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                inputContainerStyle={styles.detailsInputContainer}
                dropdownPosition={3.5}
                fontSize={11} />
                <SimpleLineIcons name={this.state.arrowStyle} color="#030538" style={{marginTop:10, marginRight:20,}}/>
          </TouchableOpacity>
          <View style={{width:"40%",height:"100%",}}>
          <Button title="View Insights" type="solid" buttonStyle={styles.btnstyle1} titleStyle={styles.buttontextt1}
           //onPress={()=>this.props.navigation.navigate("SalesInsights")}
           onPress={()=>{  
            // Alert.alert("Message","Coming Soon!");  
            Alert.alert("Coming soon",
            "We are building your personalized Pocket Insights. We will notify you when they are ready.",[ { text: "Okay"  } ],false);
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

const mapStateToProps = (state) => {
  return {
    salesRedux: state.salesReducer
  }
}

const mapDispatchToProps = dispatch => {
  return{
    fetchSalesMultiple : (salesCurrentRange) => {
       dispatch( salesAsyncCreator(salesCurrentRange) ) 
    }
  }
}
  
export default connect(mapStateToProps,mapDispatchToProps)(Sales);