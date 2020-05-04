import React, { Component } from "react";
import { Dimensions, View,Text } from "react-native";
import { VictoryChart, VictoryAxis, VictoryBar, VictoryTheme } from "victory-native";
import { JS_DATE_INDEX_TO_MONTH_MAP } from "../../../constants/constants";
import Moment from "moment";
import { connect } from "react-redux";
import { isInt,isFloat } from "../../../api/common";
class ChangeInCashChart extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    //covert - to +
    let composingDataLevel1 = [];
    let { cashInChangeData } = this.props;
    let { cicData } = cashInChangeData;
    let { cash } = cicData;

    if(cashInChangeData.cicCurrentRange == 1){

      for(let i=0;i<cash.length;i++){
        let obj = {};
        let incDate = new Date(cash[i].date);
        obj.x = incDate.getDate();
        obj.y = -parseInt(cash[i].amount);
        composingDataLevel1.push(obj);
      }

    }else{
      for(let i=0;i<cash.length;i++){
        let obj = {};
        obj.x = cash[i].month;
        obj.y = -parseInt(cash[i].amount);
        composingDataLevel1.push(obj);
      }
    }
    
    // console.log("Ready Array for the composeDataLevel1 - ",composingDataLevel1);
    let allPositiveValues = [];
    let allNegativeValues = [];

    for(let i=0;i<composingDataLevel1.length;i++){
      if(composingDataLevel1[i].y > 0){
        allPositiveValues.push(composingDataLevel1[i]);
      }else{
        allNegativeValues.push(composingDataLevel1[i]);
      }
    }
   
  
    // console.log("all negative value sdemo - ",allNegativeValues);

    //Logic 2 Ashwin sir idea
    let negativeFinalLabels = [];
    let positiveFinalLabels = [];
    let allPositiveMax = allPositiveValues.length > 0 ? Math.max(...allPositiveValues.map( singleData =>  singleData.y)) : 0;
    let allNegativeMax = allNegativeValues.length > 0 ? Math.abs(Math.min(...allNegativeValues.map( singleData =>  singleData.y))) : 0;
    console.log("-----------all Postiive and negative value finalization ---- ");
    console.log("allPositiveMax - ",allPositiveMax);
    console.log("allNegativeMax - ",allNegativeMax);
    console.log("--------------------------ends here-------------------");
    let aheadDataMaxValue = allPositiveMax >= allNegativeMax ? allPositiveMax : allNegativeMax;
    
    let aheadDataMaxValue25Percent = parseInt((aheadDataMaxValue + ( (aheadDataMaxValue * 25) / 100 )) / 2);

    for(let i=1;i<=2;i++){
      negativeFinalLabels.push((-aheadDataMaxValue25Percent)*i);
      positiveFinalLabels.push(aheadDataMaxValue25Percent*i);
    }

    let finalLabels = [ ...negativeFinalLabels.reverse(),0,...positiveFinalLabels ];

    //console.log("finalize label --------------",finalLabels);
    
    const gw=Dimensions.get("window").width;
    // console.log("empty cic data here --- ");
    // console.log(composingDataLevel1);
    // console.log("ends here ----------------");
    let { cicCurrentRange } = cashInChangeData;
    let barRatio = cicCurrentRange == 1 ? 0.5 : 
     cicCurrentRange == 3 ? 0.15 : 
     cicCurrentRange == 6 ? 0.20 : 
     cicCurrentRange == 12 ? 0.35 : 0.2; 

     console.log("compose data ratio here - ",composingDataLevel1);
    return (
        <View>
          <VictoryChart  
          height={270} width={gw} 
          domainPadding={{ 
            x: cashInChangeData.cicCurrentRange == 1 ? 10 : 10 
              
          }}
        >
	      
        <VictoryAxis  
        offsetY = {40}
        tickValues={composingDataLevel1.map(each => each.x)}
        style = 
        { cashInChangeData.cicCurrentRange == 1 ? 
        { axis:{ stroke:"none" },tickLabels: { fill:"#8E8E93",fontSize: 10,angle: 0 , strokeWidth: 2.0},
            grid:{ stroke: currentvalue => { 
                if(currentvalue == new Date().getDate()){
                  return "grey";
                }}, strokeDasharray: [1,3] } } : 
              { axis:{ stroke:"none" },tickLabels: {  
                fontSize:10,fill:"#8E8E93",angle: 0 , strokeWidth: 2.0} } 
        }
        
        tickFormat={(val)=>{ 
          return cashInChangeData.cicCurrentRange == 1 ?
          val % 2 == 0 ? val : ` ` : 
          val;
         }} 


        />
        <VictoryAxis 
          dependentAxis={true} 
          style={{
            axis: { stroke: "none" },
            grid: { stroke: "#EEE", strokeDasharray: "50,0" },
            tick: { display: "none" },
            tickLabels:{fontSize:10,fill:"#8E8E93"}
          }} 
          offsetX={gw+5}
          tickValues={ finalLabels } 

          tickFormat={y => {
            if(y >= 1000){

              let returnValue = (y/1000);
              if(isFloat(returnValue)){
                return `$${returnValue.toFixed(1)}K`;
              }else{
                return `$${returnValue}K`;
              }
              
            }else if(y >= 1000000){

              let returnValue = (y/1000000);
              if(isFloat(returnValue)){
                return `$${returnValue.toFixed(1)}M`;
              }else{
                return `$${returnValue}M`;
              }

            }else if(y <= -1000){

              let returnValue = (y/1000);
              if(isFloat(returnValue)){
                return `-$${Math.abs(returnValue).toFixed(1)}K`;
              }else{
                return `-$${Math.abs(returnValue)}K`;
              }
              
            }else if(y <= -1000000){
              let returnValue = (y/1000);
              if(isFloat(returnValue)){
                return `-$${Math.abs(returnValue).toFixed(1)}M`;
              }else{
                return `-$${Math.abs(returnValue)}M`;
              }
            }else{
              return y;
            }
          }}
          
          />
        <VictoryBar
            alignment="end"
            barRatio={ barRatio }
            style={{ data: { fill: (items)=>{  if(items.y < 0){return "#FF7B32" }else{ return "#1188DF" }  } } }}
            data={ composingDataLevel1 }
        />
        </VictoryChart>
        

        {/* <View style={{ marginTop:-35,marginLeft: cashInChangeData.cicCurrentRange == 1 ? 10 : 10,marginBottom:15,flexDirection:"row",justifyContent:"space-between",width:gw-95,paddingRight:-5 }}></View> */}
        {/* {
          cashInChangeData.cicCurrentRange == 1 ? null :
          <View style={{
          borderWidth:0,
          borderColor:"red", 
          alignSelf:"flex-start",
          marginTop:-27,
          flexDirection:"row",
          justifyContent:"space-between",
          marginLeft:"12%",
          width: gw-90,
          paddingLeft: cashInChangeData.cicCurrentRange == 1 ? 0 : 3
          }}>

            {
              cashInChangeData.cicCurrentRange == 1 ?
                cash.map( (singleData,index) => {
                  let showDtValue = new Date(singleData.date).getDate();
                  if(showDtValue % 2 == 0){
                    return <Text key={index} style={{ fontSize:9.5,color:"#8E8E93",fontWeight: showDtValue == new Date().getDate() ? "bold" : null }}> { showDtValue } </Text>
                  }else{
                    return null;
                  }
                })
              : cash.map( (singleData,index) => (
                <Text key={index} style={{ fontSize:9.5,color:"#8E8E93" }}> {singleData.month} </Text>
              ))
            }
           

          </View>
        } */}
       
        </View>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    cashInChangeData : state.cashInChange
  }
}
export default connect(mapStateToProps,null)(ChangeInCashChart);
