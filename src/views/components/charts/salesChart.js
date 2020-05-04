import React, { Component, Fragment } from "react";
import { Dimensions } from "react-native";
import { VictoryChart, VictoryAxis, VictoryBar, VictoryTheme } from "victory-native";
import { JS_DATE_INDEX_TO_MONTH_MAP } from "../../../constants/constants";
import Moment from "moment";
import { isFloat } from "../../../api/common";

export default class SalesChart extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let applySalesGraph = [];
    if(this.props.salesData.length > 0){
     // console.log(this.props.salesData);
     // console.log("inside the true condition");
      this.props.salesData.map( singleSalesData => {
          let obj = {};
          obj.x = this.props.salesCurrentRange == 1 ? new Date(singleSalesData.date).getDate() : singleSalesData.month;
          //console.log(obj.x);
          obj.y = parseFloat(singleSalesData.amount);
          applySalesGraph.push(obj);
      });
    }
    let YAXISValue = applySalesGraph.map(singleSalesValue => singleSalesValue.y);
    let maxYAxisValue = Math.max(...YAXISValue);
    let maxYAxis10PercentValue = maxYAxisValue + ( (maxYAxisValue * 15) / 100 );
    let customYAXISValues = [];
    let divideValueBy5 = parseInt(maxYAxis10PercentValue/5);
    for(let i=0;i<=5;i++){
      customYAXISValues.push(divideValueBy5*i);
    }
    //old logic not be used in the development or production builds
    // console.log("----------------------------------------------------");
    // console.log("Getting custom y Axis here - ",customYAXISValues);
    // console.log("----------------------------------------------------");
    
    
    const gw=Dimensions.get("window").width;
    let { salesCurrentRange } = this.props;
    let barRatio = salesCurrentRange == 1 ? 0.5 : 
    salesCurrentRange == 3 ? 0.1 : 
    salesCurrentRange == 6 ? 0.15 : 
    salesCurrentRange == 12 ? 0.25 : 0.2; 
    return (
      <Fragment>
        {
          this.props.salesData.length > 0 ?
                  
            <VictoryChart height={260} width={gw}
                  domainPadding={{ x: salesCurrentRange == 3 ? 20 : 8 }}
                  animate={{
                    duration: 700,
                    onLoad: { duration: 100 }
                  }}
                    >
                  <VictoryAxis
                    offsetX={gw-1}
                    dependentAxis={true}
                    style={{ 
                      axis:{ stroke:"none" },
                      tickLabels: { fontSize:10,fill:"#8E8E93" },
                      grid: { stroke: "#EEE", strokeDasharray: "50,0" },
                     }}
                    tickValues={customYAXISValues}
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

                          // let returnValue = y/1000000;
                          // return `${returnValue}M`;
                        }else{
                          return y;
                        }
                      }}
                  />
                  <VictoryAxis
                    
                    tickValues={applySalesGraph.map(each => each.x)}
                    tickFormat={x => {
                        if(this.props.salesCurrentRange == 1){
                          let render = "";
                          render = x % 2 == 0 ? x : "";
                          return render;
                        }else{
                          return x;
                        }}}
                    style={{
                      axis:{ stroke:"none" },
                      tickLabels: { 
                          angle: 0, 
                          stroke: "#8E8E93", 
                          strokeWidth: 0.5, 
                          fontSize:10,
                          fill:"#8E8E93", 
                        }
                    }}
                  />
                  <VictoryBar barRatio={ barRatio } data={applySalesGraph} style={{ data: { fill: "#1188DF" } }} />
          </VictoryChart>
          


             : null
        }
      </Fragment>
    );
  }
}
