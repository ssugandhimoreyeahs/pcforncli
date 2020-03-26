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

    var countGraphToBeDisplay = 0;
    let{ salesData: forOnlyLoop } = this.props;
    for(let i=0;i<forOnlyLoop.length;i++){
      if(forOnlyLoop[i].amount == 0){
        countGraphToBeDisplay++;
      }
    }
    //console.log("Sales Data length - ",this.props.salesData.length);
    if(this.props.salesData.length > 0){
     // console.log(this.props.salesData);
     // console.log("inside the true condition");
      this.props.salesData.map( singleSalesData => {
          let obj = {};
          obj.x = singleSalesData.month
          obj.y = singleSalesData.amount
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
    return (
      <Fragment>
        {
          this.props.salesData.length > 0 ?
                  countGraphToBeDisplay < 12 ?
                  <VictoryChart height={260} width={gw}
                  // theme={VictoryTheme.material} 
                  domainPadding={{ x: this.props.salesCurrentRange == 3 ? 35 : 20 }}
                  // animate={{
                  //   duration: 4000,
                  //   onLoad: { duration: 2000 }
                  // }}
                    >
                  <VictoryAxis
                    dependentAxis={true}
                    style={{ tickLabels: { fontSize:11 },
                    grid: { stroke: "#EEE", strokeDasharray: "50,0" },
                     }}
                    tickValues={customYAXISValues}
                      tickFormat={y => {
                        if(y >= 1000){

                          let returnValue = (y/1000);
                          if(isFloat(returnValue)){
                            return `${returnValue.toFixed(1)}K`;
                          }else{
                            return `${returnValue}K`;
                          }
                          // //let returnValue = (y/1000).toFixed(1);
                          // let returnValue = parseInt(y/1000);
                          // return `${returnValue}K`;
                        }else if(y >= 1000000){

                          let returnValue = (y/1000000);
                          if(isFloat(returnValue)){
                            return `${returnValue.toFixed(1)}M`;
                          }else{
                            return `${returnValue}M`;
                          }

                          // let returnValue = y/1000000;
                          // return `${returnValue}M`;
                        }else{
                          return y;
                        }
                      }}
                  />
                  <VictoryAxis
                    
                    tickValues={applySalesGraph.x}
                    tickFormat={x => {
                        // let xDate = new Date(x);
                        // let readyDate = ``;
                        // readyDate = readyDate+xDate.getDate()+" "+monthArray[xDate.getMonth()];
                        return x;
                    }
                      // JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
                    }
                    style={{
                      tickLabels: { angle: 0, stroke: "#8E8E93", strokeWidth: 0.5, fontSize: 11 }
                    }}
                  />
                  <VictoryBar barRatio={0.3} data={applySalesGraph} style={{ data: { fill: "#1188DF" } }} />
          </VictoryChart>
          :

                <VictoryChart height={260} width={gw}
                // theme={VictoryTheme.material} 
                domainPadding={{ x: 10 }}
                // animate={{
                //   duration: 4000,
                //   onLoad: { duration: 2000 }
                // }}
                  >
            <VictoryAxis
            dependentAxis={true}
            tickValues={[0]}
            />
            <VictoryAxis
            tickValues={applySalesGraph.x}
            tickFormat={x => {
            // let xDate = new Date(x);
            // let readyDate = ``;
            // readyDate = readyDate+xDate.getDate()+" "+monthArray[xDate.getMonth()];
            return x;
            }
            // JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
            }
            style={{
            tickLabels: { angle: 0, stroke: "#8E8E93", strokeWidth: 0.5 }
            }}
            />
            <VictoryBar barRatio={0.1} data={applySalesGraph} style={{ data: { fill: "#1188DF" } }} />
            </VictoryChart>

             :

              <VictoryChart height={260} width={gw}
              theme={VictoryTheme.material} 
              >
              <VictoryAxis
                dependentAxis={true} 
                tickValues={[0]}
                />
              <VictoryAxis
                tickValues={[0]} /> 
              <VictoryBar
                style={{
                  data: { stroke: "url(#gradient)", strokeWidth: 5 }
                }}
                data={ [    ]}
              />
            </VictoryChart>
        }
      </Fragment>
    );
  }
}




















//code commit here old code before 13-02-2020 of build 2.1.30

// import React, { Component, Fragment } from "react";
// import { Dimensions } from "react-native";
// import { VictoryChart, VictoryAxis, VictoryBar, VictoryTheme } from "victory-native";
// import { JS_DATE_INDEX_TO_MONTH_MAP } from "../../../constants/constants";
// import Moment from "moment";

// export default class SalesChart extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
    
    
//     let applySalesGraph = [];

//     var countGraphToBeDisplay = 0;
//     let{ salesData: forOnlyLoop } = this.props;
//     for(let i=0;i<forOnlyLoop.length;i++){
//       if(forOnlyLoop[i].amount == 0){
//         countGraphToBeDisplay++;
//       }
//     }
//     console.log("Sales Data length - ",this.props.salesData.length);
//     if(this.props.salesData.length > 0){
//       console.log(this.props.salesData);
//       console.log("inside the true condition");
//       this.props.salesData.map( singleSalesData => {
//           let obj = {};
//           obj.x = singleSalesData.month
//           obj.y = singleSalesData.amount
//           applySalesGraph.push(obj);
//       });
//     }

//     //old logic not be used in the development or production builds
//     const { historicalFinances } = this.props;
//     let data = {};
//     if (historicalFinances) {
//       data = Object.keys(historicalFinances).map(currentMonthKey => {
//         const currentMonth = Moment(currentMonthKey, "YYYY-MM-DD");

//         return {
//           x: currentMonth.toDate(),
//           y: historicalFinances[currentMonthKey]
//             ? historicalFinances[currentMonthKey].revenue
//             : 0
//         };
//       });
//       //old logic not be used in the development or production builds
//     }
//     const gw=Dimensions.get("window").width;
//     return (
//       <Fragment>
//         {
//           this.props.salesData.length > 0 ?
//                   countGraphToBeDisplay < 12 ?
//                   <VictoryChart height={260} width={gw}
//                   // theme={VictoryTheme.material} 
//                   domainPadding={{ x: 10 }}
//                   // animate={{
//                   //   duration: 4000,
//                   //   onLoad: { duration: 2000 }
//                   // }}
//                     >
//                   <VictoryAxis
//                     dependentAxis={true}
//                       tickFormat={y => {
//                         if(y >= 1000){
//                           let returnValue = y/1000;
//                           return `${returnValue}K`;
//                         }else if(y >= 1000000){
//                           let returnValue = y/1000000;
//                           return `${returnValue}M`;
//                         }else{
//                           return y;
//                         }
//                       }}
//                   />
//                   <VictoryAxis
//                     tickValues={applySalesGraph.x}
//                     tickFormat={x => {
//                         // let xDate = new Date(x);
//                         // let readyDate = ``;
//                         // readyDate = readyDate+xDate.getDate()+" "+monthArray[xDate.getMonth()];
//                         return x;
//                     }
//                       // JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
//                     }
//                     style={{
//                       tickLabels: { angle: 0, stroke: "#8E8E93", strokeWidth: 0.5 }
//                     }}
//                   />
//                   <VictoryBar barRatio={0.3} data={applySalesGraph} style={{ data: { fill: "#1188DF" } }} />
//           </VictoryChart>
//           :

//                 <VictoryChart height={260} width={gw}
//                 // theme={VictoryTheme.material} 
//                 domainPadding={{ x: 10 }}
//                 // animate={{
//                 //   duration: 4000,
//                 //   onLoad: { duration: 2000 }
//                 // }}
//                   >
//             <VictoryAxis
//             dependentAxis={true}
//             tickValues={[0]}
//             />
//             <VictoryAxis
//             tickValues={applySalesGraph.x}
//             tickFormat={x => {
//             // let xDate = new Date(x);
//             // let readyDate = ``;
//             // readyDate = readyDate+xDate.getDate()+" "+monthArray[xDate.getMonth()];
//             return x;
//             }
//             // JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
//             }
//             style={{
//             tickLabels: { angle: 0, stroke: "#8E8E93", strokeWidth: 0.5 }
//             }}
//             />
//             <VictoryBar barRatio={0.1} data={applySalesGraph} style={{ data: { fill: "#1188DF" } }} />
//             </VictoryChart>

//              :

//               <VictoryChart height={260} width={gw}
//               theme={VictoryTheme.material} 
//               >
//               <VictoryAxis
//                 dependentAxis={true} 
//                 tickValues={[0]}
//                 />
//               <VictoryAxis
//                 tickValues={[0]} /> 
//               <VictoryBar
//                 style={{
//                   data: { stroke: "url(#gradient)", strokeWidth: 5 }
//                 }}
//                 data={ [    ]}
//               />
//             </VictoryChart>
//         }
//       </Fragment>
//     );
//   }
// }
