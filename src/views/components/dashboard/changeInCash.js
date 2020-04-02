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
      arrowStyle:"arrow-down"
    }
    this.dropdownRef = React.createRef();
  }

  static getDerivedStateFromProps(props, state){

    //code here
    const { cicCurrentRange } = props.cashInChangeData;
    // //console.log("testing here inside static getDerivedStatefromprops--------------------------------------");
    // console.log("getting cic Current range here ---------------",cicCurrentRange);
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
    // console.log("render button ----------------------",renderButton);
    //console.log("Ends Here")
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
  calculateCurrentMonthChangeInCash(historicalFinances) {
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

    priorMonthKey = Moment(currentMonthKey, "YYYY-MM-DD")
      .subtract(1, "months")
      .format("YYYY-MM-DD");
    if (
      priorMonthKey in historicalFinances &&
      currentMonthKey in historicalFinances
    ) {
      return (
        historicalFinances[currentMonthKey].cash -
        historicalFinances[priorMonthKey].cash
      );
    }
  }

  showAlert() {  
    Alert.alert(  
        'CHANGE IN CASH',  
        'The change in cash is the difference between the inflows (deposits, accounts receivables, equity or debt proceeds) and outflows (debits for bills, etc). ',  
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
  
  handleReloadChangeInCash = () => {

    //fetchCashInChange: () => { dispatch(cicAsynCreator()) }
    this.props.fetchCashInChange();
  }
  render() {

    
    let { cashInChangeData } = this.props;
    let total = 0;
    if(cashInChangeData.cicData.totalCash != undefined && cashInChangeData.cicData.totalCash != null){
      total = cashInChangeData.cicData.totalCash;
    }
    const { historicalFinances } = this.props;
    
    // cashInChangeData.error = false;
    // //cashInChangeData.isFetched = false;
    // cashInChangeData.masterLoader = false;
    // cashInChangeData.childLoader = true;

   // console.log("code test here ----------------------------------");
    let isCICGraphEmpty = true;
    if(cashInChangeData.isFetched == true){
      for(let i = 0;i < cashInChangeData.cicData.cash.length; i++ ){

        if(cashInChangeData.cicData.cash[i].amount != 0 && cashInChangeData.cicData.cash[i].amount != -0){
          isCICGraphEmpty = false;
          break;
        }

      }
    }
    

    //total = 15000;
    //console.log("ends here ----------------------------- new here");
    return (
      <View>
        <View style={styles.margins}>
        </View>
      <View style={{ height:375,width:'95%', backgroundColor:'white', alignSelf:'center',elevation:10,shadowColor:'#000' }}>
        {
          cashInChangeData.error == true ?  <View style={{ height:375,width:'100%', backgroundColor:'white', alignSelf:'center',justifyContent:"center",elevation:10,shadowColor:'#000' }}>
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
              <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
              <Text style={{ marginLeft:10,alignSelf:"center" }}>Oops Error Try Again!</Text>
          </View> 
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
              <TouchableOpacity onPress={()=>{ this.handleReloadChangeInCash(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                  <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
              </TouchableOpacity>
           </View>
        </View> 
          :  cashInChangeData.masterLoader == false ?
          <Fragment>
            {
              cashInChangeData.childLoader == false ?
              <Fragment>

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
                     <Text style={{ color:"#1D1E1F",fontSize:12 }}>
                         {
                            
                            this.state.cocMonths
                         }
                     </Text>
                 </View>
                 {
                   isCICGraphEmpty == true ?
                    <View style={{height:238,justifyContent:"center",alignItems:"center"}} accessible={true} pointerEvents="none">
                        <Text style={{ color:"#070640" }}>You have not spent anything this month.</Text>
                    </View>
                   :
                   
                   <View style={{marginTop:"-5%",marginLeft:"3%"}} accessible={true} pointerEvents="none">
                    <ChangeInCashChart historicalFinances={historicalFinances} />
                   </View>
                 }
                        
              </Fragment> : <View style={{height:298,width:gw,justifyContent:"center",alignSelf:"center"}}>
              <ActivityIndicator size="large" color="#070640" />
            </View>
            }
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
            //onPress={()=>this.props.navigation.navigate("ChangeInCashInsights")}
            onPress={()=>{ 
              Alert.alert("Coming soon",
              "We are building your personalized Pocket Insights. We will notify you when they are ready.",[ { text: "Okay"  } ],false);
              }
              }
            
            />
          </View>
        </View>
          </Fragment>
          :  <View style={{ height:375,width:'100%', backgroundColor:'white', alignSelf:'center',justifyContent:"center",elevation:10,shadowColor:'#000' }}>
            <ActivityIndicator size="large" color="#070640" />
         </View> 
        }
        
       </View>
      </View>
    );
  }
}

const styles = {
  margins: {
    backgroundColor: "#EEEFF1",
    marginVertical: 8
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
    marginTop:18
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