import React, { Component } from "react";
import { StyleSheet, View, Text,TouchableOpacity,Alert,Fragment,ActivityIndicator } from "react-native";
import { AntDesign,MaterialCommunityIcons } from "@expo/vector-icons";
import { BarGraph } from "./BarGraph";
import * as accounting from "accounting-js";
// import {Ionicons} from '@expo/vector-icons';
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { fetchArAsyncCreator } from "../../../reducers/incommingar";
import { numberWithCommas,isFloat } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
Ionicons.loadFont();

class IncomingAR extends Component {
  showAlert() {  
    Alert.alert(  
        'INCOMING A/R',  
        'Accounts receivable (AR) is the balance of money due to a firm for goods or services delivered or used but not yet paid for by customers. Accounts receivables are listed on the balance sheet as a current asset. AR is any amount of money owed by customers for purchases made on credit.',  
        [  
            {  
                text: 'Cancel',  
                onPress: () => console.log('Cancel Pressed'),  
                style: 'cancel',
                  
            },  
        ]  
    );  
  }

  incommingArBody = ({ composeArData }) => {
    // let total = composeArData.overDue.total + composeArData.notYetDue.total;
    // total = parseFloat(total).toFixed(2);

    //testing manually

    // composeArData = {
    //   "notYetDue": {
    //     "1-30": "10.00",
    //     "31-60": "80.00",
    //     "60+": "10.00",
    //     "total": "100.00",
    //   },
    //   "overDue": {
    //     "1-30": "1000.02",
    //     "31-60": "5000.00",
    //     "61-90": "3000.00",
    //     "90+": "1000.50",
    //     "total": "10000.52",
    //   },
    //   "total": "1100.00",
    // }
    //testing ends here
    let finalTotal = numberWithCommas(isFloat(composeArData.total) ? composeArData.total.toFixed(2) : composeArData.total);
    let isAllZero = parseInt(composeArData.overDue.total) == 0 && parseInt(composeArData.notYetDue.total) == 0 && parseInt(composeArData.total) == 0;
    let overDueIsZero = parseInt(composeArData.overDue["1-30"]) == 0 && parseInt(composeArData.overDue["31-60"]) == 0 && parseInt(composeArData.overDue["61-90"]) == 0 && parseInt(composeArData.overDue["90+"]) == 0;
    let notYetDueIsZero = parseInt(composeArData.notYetDue["1-30"]) == 0 && parseInt(composeArData.notYetDue["31-60"]) == 0 && parseInt(composeArData.notYetDue["60+"]) == 0;
    console.log("overDueIsZero = ",overDueIsZero);
    console.log("notYetDueIsZero = ",notYetDueIsZero);
    return(
      <View>
        {
          isAllZero == true ?
          <View style={{ justifyContent:"center",alignItems:"center",alignSelf:"center",width:"100%",height:"100%"  }}>
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
              <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
              <Text style={{ marginLeft:10,alignSelf:"center" }}>No Incomming AR Data Available!</Text>
          </View> 
          {/* <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
              <TouchableOpacity onPress={()=>{ this.handleReloadIncomingAr(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                  <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Reload</Text></View>
              </TouchableOpacity>
           </View> */}
        </View> :
          <View>

          <View style={styles.heading}>
                  <TouchableOpacity 
                    
                    onPress={this.showAlert}
                  >
                    <View style={{flexDirection:'row'}}>
                      <Text style={[styles.titleText, styles.text]}>INCOMING A/R</Text>
                      <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.moneyTotal}>
                      {`$${ finalTotal }`}
                    </Text>
                    <Text style={[styles.text, styles.total]}>Total</Text>
                  </View>
                </View>
                <View style={styles.data}>
                  <View>
                    <Text style={[styles.label, { marginTop: 28 }]}>Overdue</Text>
                    {
                      overDueIsZero == false ?
                      <BarGraph
                      style={styles.barChart}
                      data={ [ parseInt(composeArData.overDue["1-30"]),parseInt(composeArData.overDue["31-60"]),parseInt(composeArData.overDue["61-90"]),parseInt(composeArData.overDue["90+"]) ] }
                      //data={[10,20,30]}
                      legend={["20-40", "50-60", "70-80"]}
                      barColors={["#E84500", "#FF7B32", "#FF9E6C","#FFC0A0"]}
                      width={215}
                      height={8}
                      barWidth={8}
                      backgroundGradientFrom={"#ffffff"}
                      backgroundGradientTo={"#ffffff"}
                      backgroundColor={"#ffffff"}
                      chartColor={"#000000"}
                    />: null
                    }
                    <Text style={[styles.label, { marginTop: 26 }]}>Not yet due</Text>
                    {
                      notYetDueIsZero == false ?
                    <BarGraph
                      style={styles.barChart}
                      data={[10,20,30]}
                      data={[ parseInt(composeArData.notYetDue["1-30"]),parseInt(composeArData.notYetDue["31-60"]),parseInt(composeArData.notYetDue["60+"]) ]}
                      barColors={["#137BC8", "#5DBAFF", "#B0DDFF"]}
                      width={150}
                      height={8}
                      barWidth={8}
                      backgroundGradientFrom={"#ffffff"}
                      backgroundGradientTo={"#ffffff"}
                      backgroundColor={"#ffffff"}
                      chartColor={"#000000"}
                    />
                      : null
                    }
                  </View>
                  <View style={{ marginTop: 44 ,width:95}}>
                    <Text style={[styles.currency,]}>
                      {   
                          parseInt(composeArData.overDue.total) == 0 ?
                          `$0`
                          : `$${numberWithCommas(composeArData.overDue.total)}` 
                      }
                    </Text>
                    <Text
                      style={[styles.currency, {  marginTop: 40 ,}]}
                    >
                      { 
                        parseInt(composeArData.notYetDue.total) == 0 ? 
                          `$0`
                        : `$${numberWithCommas(composeArData.notYetDue.total)}`
                      }
                    </Text>
                  </View>
                  
                </View>
                <View style={{width:"40%",height:"100%", marginTop:"20%", alignSelf:'flex-end'}}>
                  <Button title="View Insights" type="solid" buttonStyle={styles.btnstyle1} titleStyle={styles.buttontextt1}
                  onPress={()=>{ 
                    //this.props.navigation.navigate("IncomingARInsights")
                    Alert.alert("Message","Coming Soon!");
                  
                  }}/>
                </View>

          </View>
        }
      </View>
    );
  }

  handleReloadIncomingAr = () => {
    this.props.fetchIncommingAr();
  }
  render() {
    
    let composeArData = {};
    let { arData, isFetched, masterLoader, error} = this.props.incommingArRedux
    if(isFetched == true){
       let { overDue,notYetDue,total } = arData;
       composeArData = { ...composeArData,overDue,notYetDue,total };
    }
    
    // error = true;
    return (
      <View>
        {
          error == true ? <View style={{ ...styles.margins,justifyContent:"center"  }}>
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
              <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
              <Text style={{ marginLeft:10,alignSelf:"center" }}>Oops Error Try Again!</Text>
          </View> 
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
              <TouchableOpacity onPress={()=>{ this.handleReloadIncomingAr(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                  <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
              </TouchableOpacity>
           </View>
        </View>
          :
          isFetched == true && masterLoader == false ?
            <View style={styles.margins}>
              <this.incommingArBody composeArData={composeArData} />
            </View>
          : <View style={{ ...styles.margins,justifyContent:"center" }}>
          <ActivityIndicator size="large" color="#070640" />
       </View> 

        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margins: {
    paddingHorizontal: 12,
    paddingTop: 15,
    backgroundColor: "white",
    marginVertical: 18,
    height:300,
    width:'95%',
    alignSelf:'center',
    elevation:10,
    shadowColor:'#000'
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.07,
    lineHeight: 13,
    marginBottom: 13,
    color: "#151927"
  },
  data: {
    flexDirection: "row",
    justifyContent: "space-between",
    height:101,
    width:'100%',
  },
  currency: {
    color: "#151927",
    fontSize: 15,
    lineHeight: 20,
    textAlign: "right",
    letterSpacing: -0.24,
    color: "#151927"
  },
  text: {
    color: "#1D1E1F",
    fontSize: 12,
    lineHeight: 16
  },
  titleText: {
    width: 90
  },
  moneyTotal: {
    fontWeight: "bold",
    color: "#1D1E1F",
    fontSize: 22,
    letterSpacing: 0.32,
    lineHeight: 26,
    height: 26
  },
  total: {
    textAlign: "right",
    marginTop: 4
  },
  barChart: {
    borderRadius: 16,
    backgroundColor: "white"
  },
  buttonview:{
    height:32,
    width:'90%',
    marginTop:'10%',
    flexDirection:"row",
    justifyContent:"flex-end",
    alignSelf:"center" 
  },
  btnstyle1:{
    width:"100%",
    borderRadius:6, 
    backgroundColor:"#85B1FF",
  },
  buttontextt1:{
    fontSize:11,
  },
});

const mapStateToProps = (state) => {
  return{
    incommingArRedux: state.incommingArRedux
  }
}
const mapDispatchToProps = (dispatch) => {
  return{
    fetchIncommingAr: () => { dispatch(fetchArAsyncCreator()); }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(IncomingAR);