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
    return (
        <View>
          <VictoryChart  
          style={{
            parent: { marginLeft: -40 }
          }}
          height={270} width={gw} 
          domainPadding={{ x: cashInChangeData.cicCurrentRange == 1 ? 0 : 20 }}
        >
	      
        <VictoryAxis  style={{ axis: { stroke: '#000' } }} tickFormat={()=>{ return "" }} />
        <VictoryAxis 
          dependentAxis={true} 
          style={{
            axis: { stroke: "none" },
            grid: { stroke: "#EEE", strokeDasharray: "5,5" },
            tick: { display: "none" }
          }} 
          offsetX={gw}
          tickValues={ finalLabels } 

          tickFormat={y => {
            if(y >= 1000){

              let returnValue = (y/1000);
              if(isFloat(returnValue)){
                return `${returnValue.toFixed(1)}K`;
              }else{
                return `${returnValue}K`;
              }
              
            }else if(y >= 1000000){

              let returnValue = (y/1000000);
              if(isFloat(returnValue)){
                return `${returnValue.toFixed(1)}M`;
              }else{
                return `${returnValue}M`;
              }

            }else if(y <= -1000){

              let returnValue = (y/1000);
              if(isFloat(returnValue)){
                return `${returnValue.toFixed(1)}K`;
              }else{
                return `${returnValue}K`;
              }
              
            }else if(y <= -1000000){
              let returnValue = (y/1000);
              if(isFloat(returnValue)){
                return `${returnValue.toFixed(1)}M`;
              }else{
                return `${returnValue}M`;
              }
            }else{
              return y;
            }
          }}
          
          />
        <VictoryBar
            barRatio={0.5}
            style={{ data: { fill: (items)=>{  if(items.y < 0){return "#FF7B32" }else{ return "#1188DF" }  } } }}
            data={ composingDataLevel1 }
        />
        </VictoryChart>
        

        {/* <View style={{ marginTop:-35,marginLeft: cashInChangeData.cicCurrentRange == 1 ? 10 : 10,marginBottom:15,flexDirection:"row",justifyContent:"space-between",width:gw-95,paddingRight:-5 }}></View> */}
        <View style={{ marginTop:-35,marginLeft: cashInChangeData.cicCurrentRange == 1 ? 10 : 10,marginBottom:15,flexDirection:"row",justifyContent:"space-between",width:gw-105,paddingRight:-5 }}>

            {
              cashInChangeData.cicCurrentRange == 1 ?
                cash.map( (singleData,index) => (
                  <Text key={index} style={{ fontSize:6,color:"#000" }}> {new Date(singleData.date).getDate() } </Text>
                ))
              : cash.map( (singleData,index) => (
                <Text key={index} style={{ fontSize:9,color:"#000" }}> {singleData.month} </Text>
              ))
            }
           

          </View>
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
//client code

 /* <VictoryChart height={260} width={gw}>
      <VictoryAxis
        dependentAxis={true}
        tickFormat={() => ""}
        style={{
          axis: { stroke: "none" },
          grid: { stroke: "#EEE", strokeDasharray: "5,5" },
          tick: { display: "none" }
        }}
      />
      <VictoryAxis
        tickValues={data.map(each => {
          return each.x;
        })}
        offsetY={40}
        // tickFormat={x =>
        //   JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
        // }
        style={{
          tickLabels: { angle: 315, stroke: "#8E8E93", strokeWidth: 0.5 }
        }}
      />
      <VictoryBar data={data} style={{ data: { fill: "#FF7B32" } }} />
      </VictoryChart> 
      
      //  VictoryNative requires data to be in the format:
    //     [
    //         { x: "2019-08-01", y: 12000 },
    //         { x: "2019-09-01", y: 11000 }
    //     ]
    // here we transform our data into this format

    const { historicalFinances } = this.props;
    let data = {};
    if (historicalFinances) {
      data = Object.keys(historicalFinances).map(currentMonthKey => {
        const currentMonth = Moment(currentMonthKey, "YYYY-MM-DD");
        const monthPriorKey = currentMonth
          .subtract(1, "month")
          .format("YYYY-MM-DD");
        if (
          monthPriorKey in historicalFinances &&
          currentMonthKey in historicalFinances
        ) {
          return {
            x: currentMonth.toDate(),
            y:
              historicalFinances[currentMonthKey].cash -
              historicalFinances[monthPriorKey].cash
          };
        }
      });
    }
      
      */




        //Logic 1 Based on the 25 percent
    //positive labels data - 
    // let positiveFinalLabels = [];
    // const maxPositiveValue = allPositiveValues.map( (singlePositive) => { return singlePositive.y } );
    // const maxPositiveValues = Math.max(...maxPositiveValue);
    // let incrementMaxPositive25Percent = parseInt(maxPositiveValues + ( (maxPositiveValues * 25) / 100 ));
    // let divideMaxPositiveBy5 = parseInt(incrementMaxPositive25Percent / 3);
    // for(let i=0;i<3;i++){
    //   positiveFinalLabels.push(divideMaxPositiveBy5*i);
    // }

    // //negative labels data - 
    // let negativeFinalLabels = [];
    // const maxNegativeValue = allNegativeValues.map( (singleNegative) => { return singleNegative.y });
    // const maxNegativeValues = Math.min(...maxNegativeValue);
    // const incrementMaxNegative25Percent = parseInt(maxNegativeValues + ( (maxNegativeValues * 25) / 100 ));
    // const divideMaxNegativeBy5 = parseInt(  incrementMaxNegative25Percent / 2 );
    // for(let i=1;i<=2;i++){
    //   negativeFinalLabels.push(divideMaxNegativeBy5*i);
    // }