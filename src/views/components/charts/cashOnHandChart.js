import React, { Component,Fragment,PureComponent } from "react";
import { Dimensions } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, Data } from "victory-native";
import Moment from "moment";
import _ from "lodash";
import { Defs, LinearGradient, Stop } from "react-native-svg";

import { JS_DATE_INDEX_TO_MONTH_MAP } from "../../../constants/constants";
import { ALL_MONTHS } from "../../../constants/constants";
import { getHealthScoreColor, CUSTOM_GRADIENT } from "../../../utilities/gradient";
import { getOutOfCashDate } from "../../../utilities/cash";
import { isFloat } from "../../../api/common";
export default class CashOnHandChart extends PureComponent {
  constructor(props) {
    super(props);
  }

  getRunwayColor(cash, expenses, sales) {
    const oocDate = getOutOfCashDate(cash, expenses, sales);
    const oocMonths = oocDate.diff(Moment(), "months", true);
    return getHealthScoreColor(oocMonths, true);
  }

  render() {
    let monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    let dateObj = new Date();
    let currentMonth = monthArray[dateObj.getMonth()];
    let applyGraph = [];
  
       if(this.props.cohPast == 0 && this.props.cohFuture == 0){
     
        if(this.props.cashOnHandGraphData.length > 0){
     
          for(let i=1;i<31;i++){
            let obj = {};
            obj.x = i;
            obj.y = null;
            this.props.cashOnHandGraphData.map( singleMonthData => {
              let currentDate = new Date(singleMonthData.date);
              if(i == currentDate.getDate()){
                obj.x = currentDate.getDate();
                obj.y = singleMonthData.amount;
              }
            })
            applyGraph.push(obj);
          }
          
        }
        else{
            for(let i=0;i<=5;i++){
              let obj = {};
              obj.x = 0;
              obj.y = 0;
              applyGraph.push(obj);
            }
           }
       }
       else{
        if(this.props.cashOnHandGraphData.length > 0){
          for(let i=0;i<this.props.cashOnHandGraphData.length;i++){
            let obj = {};
            this.props.cashOnHandGraphData.map( (singleGraph,index) => {
             // console.log("Getting Index in the Map of COH chart ",index);
              if(i == index){
                obj.x = singleGraph.month;
                if(singleGraph.Amount == null || singleGraph.Amount == undefined){
                  obj.y = singleGraph.amount;
                }else{
                  obj.y = singleGraph.Amount;
                }
                
              
              }
            });
            applyGraph.push(obj);
          }
        }
        else{
            for(let i=0;i<=5;i++){
              let obj = {};
              obj.x = 0;
              obj.y = 0;
              applyGraph.push(obj);
            }
           }
       }

   
    
    
    var gradients = [];
    let { cashOnHandGraphData: forGradientData,cohFuture,cohPast } = this.props;
    
    let precentForCurrentMonth = 3;
    let percentForThreeMonth = 25;
    let percentForSixMonth = 15;
    let percentForTeweleMonth = 7;
    for (var i = 0; i < forGradientData.length; i++) {
      
      
      //const gradient = getHealthScoreColor(offset);
      if( cohPast == 0 && cohFuture == 0 ){
        let getAmmount = forGradientData[i].amount;
        
        if( i == forGradientData.length - 1 ){
          if(getAmmount > 0){
            gradients.push(
              <Stop key={i} offset={`${precentForCurrentMonth*i}%`} stopColor={CUSTOM_GRADIENT["1"][i]} />
            );
          }else{
            gradients.push(
              <Stop key={i} offset={`${precentForCurrentMonth*i}%`} stopColor={`#df0c0c`} />
            );
          }
        }else{
          gradients.push(
            <Stop key={i} offset={`${precentForCurrentMonth*i}%`} stopColor={CUSTOM_GRADIENT["1"][i]} />
          );
        }
      }else if( cohPast == 3 && cohFuture == 1){
        
        if(i > 2){
          gradients.push(
            <Stop key={i} offset={`${percentForThreeMonth*i}%`} stopColor={`#C8C8C8`} />
          );
        }else{
          gradients.push(
            <Stop key={i} offset={`${percentForThreeMonth*i}%`} stopColor={CUSTOM_GRADIENT["3"][i]} />
          );
        }
        
      }else if( cohPast == 3 && cohFuture == 3 ){
        
        if(i > 2){
          gradients.push(
            <Stop key={i} offset={`${percentForSixMonth*i}%`} stopColor={`#C8C8C8`} />
          );
        }else{
          gradients.push(
            <Stop key={i} offset={`${percentForSixMonth*i}%`} stopColor={CUSTOM_GRADIENT["6"][i]} />
          );
        }
        
      }else{
        let getAmmount = forGradientData[i].amount;
        
        if( i == forGradientData.length - 1 ){
          if(getAmmount > 0){
            gradients.push(
              <Stop key={i} offset={`${percentForTeweleMonth*i}%`} stopColor={CUSTOM_GRADIENT["12"][i]} />
            );
          }else{
            gradients.push(
              <Stop key={i} offset={`${percentForTeweleMonth*i}%`} stopColor={CUSTOM_GRADIENT["12"][i+1]} />
            );
          }
        }else{
          gradients.push(
            <Stop key={i} offset={`${percentForTeweleMonth*i}%`} stopColor={CUSTOM_GRADIENT["12"][i]} />
          );
        }
      }
      
    }//end of loop
    const gw=Dimensions.get("window").width;
  let customYaxis = [];
  if(applyGraph.length > 0){
          //calculate latest Logic for the Yaxis
          let cohYAxisValue = applyGraph.map(singleCoh => singleCoh.y);
          let maximumValue = Math.max(...cohYAxisValue);
          let increment25Percent = parseInt(maximumValue + ( (maximumValue * 25) / 100 ));
          let divide25Percent = parseInt(increment25Percent / 4);
          //console.log("maximum value on the cash on hand graph is - ",divide25Percent);
          for(let i = 0;i<=4;i++){
            customYaxis.push(divide25Percent*i);
          }
        }

    return (
     <Fragment>
       {
         (this.props.cashOnHandGraphData.length > 0) ? 
         (this.props.cohFuture == 0 && this.props.cohPast == 0) ?
          <VictoryChart height={265} width={gw}
            animate={{
                duration: 700,
                onLoad: { duration: 100 }
              }}>
           <Defs>
             <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
               {gradients}
             </LinearGradient>
           </Defs>
           <VictoryAxis
              style={{ 
                axis: { stroke: "none" }, 
                tickLabels: { fontSize:10,fill:"#8E8E93" },
                grid: { stroke: "#EEE", strokeDasharray: "50,0" } 
              }}
             offsetX={gw-3}
             dependentAxis={true}
             tickValues={customYaxis}
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
                }}else{
                 return y;
               }
             }}/>
           <VictoryAxis
             tickValues={applyGraph.map(each => each.x)}
             tickFormat={x => x % 2 == 0 ? x : ` ` }
             style={{ 
                  axis: { stroke: "none" }, 
                  tickLabels: {  fill:"#8E8E93",fontSize: 10,angle: 0 , strokeWidth: 2.0},
                  grid:{ stroke: currentvalue => { 
                    if(currentvalue == dateObj.getDate()){ 
                      return "grey"; 
                    }},
                  strokeDasharray: [1,3]           
                }
              }}/><VictoryLine
             style={{
               data: { stroke: "url(#gradient)", strokeWidth: 5 }
             }}
             data={applyGraph}
           />
         </VictoryChart>
          : 
         <VictoryChart height={260} width={gw}
         animate={{
             duration: 700,
             onLoad: { duration: 100 }
           }}>
           <Defs>
             <LinearGradient id="gradient" >
               {gradients}
             </LinearGradient>
           </Defs>
           <VictoryAxis
              style={{ 
                axis: { stroke: "none" }, 
                tickLabels: { fontSize:10,fill:"#8E8E93" },
                grid: { stroke: "#EEE", strokeDasharray: "50,0" } 
              }}
             offsetX={gw-2}
             dependentAxis={true}
             tickValues={customYaxis}
             tickFormat={y => {
               if(y >= 1000){
                 let returnValue = parseInt(y/1000);
                 return `$${returnValue}K`;
               }else if(y >= 1000000){
                 let returnValue = parseInt(y/1000000);
                 return `$${returnValue}M`;
               }else{
                 return y;
               }
             }}

             
           />
           <VictoryAxis
             tickValues={applyGraph.map(each => each.x)}
             style={{ axis: { stroke: "none" },tickLabels: { fill:"#8E8E93",angle: 0 , strokeWidth: 2.0,fontSize: 10},
                  grid:{ stroke: currentvalue => currentvalue == currentMonth ? "grey" : null,
                  strokeDasharray: [1,3],strokeWidth: 1.0
                  }
                }
            }/><VictoryLine
             style={{
               data: { stroke: "url(#gradient)", strokeWidth: 5 }
             }}
             data={applyGraph}
           />
         </VictoryChart>
         : 
         
       
         <VictoryChart height={260} width={gw}
         theme={VictoryTheme.material} 
         >
           {/* <Defs>
             <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
               {gradients}
             </LinearGradient>
           </Defs> */}
           <VictoryAxis
             dependentAxis={true} 
             tickValues={[0]}
             />
           <VictoryAxis
             tickValues={[0]} /> 
           <VictoryLine
             style={{
               data: { stroke: "url(#gradient)", strokeWidth: 5 }
             }}
             data={ [  { x:0,y:0 },{ x:0,y:0 }  ]}
           />
         </VictoryChart>
       }
     </Fragment>
    );
  }
}

const styles = {
  margins: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 15,
    backgroundColor: "white",
    marginHorizontal: 18,
    marginVertical: 24
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
    justifyContent: "space-between"
  }
};


