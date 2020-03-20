import React, { Component,Fragment,PureComponent } from "react";
import { Dimensions } from "react-native";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, Data } from "victory-native";
import Moment from "moment";
import _ from "lodash";
import { Defs, LinearGradient, Stop } from "react-native-svg";

import { JS_DATE_INDEX_TO_MONTH_MAP } from "../../../constants/constants";
import { ALL_MONTHS } from "../../../constants/constants";
import { getHealthScoreColor } from "../../../utilities/gradient";
import { getOutOfCashDate } from "../../../utilities/cash";
import { isFloat } from "../../../api/common";
export default class CashOnHandChart extends PureComponent {
  constructor(props) {
    super(props);
    //Receieve the past and future data into the props
    //cohPast={this.props.cohPast} cohFuture={this.props.cohFuture}

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
    //  VictoryNative requires data to be in the format:
    //     [
    //         { x: "2019-08-01", y: 12000 },
    //         { x: "2019-09-01", y: 11000 }
    //     ]
    // here we transform our data into this format
    // console.log("I am in chash on hand chart");
    // console.log(this.props.cashOnHandGraphData);
    // console.log("Again back");
    let applyGraph = [];
  //   if(this.props.cashOnHandGraphData.length > 0){
    
  //   for(let i=1;i<32;i++){
  //     let obj = {};
  //     let dateToBePush;
  //     obj.x = i;
  //     obj.y = 0;
  //     this.props.cashOnHandGraphData.map( singleData => {
  //         let currentDate = new Date(singleData.date);
  //         if(currentDate.getDate() == i ){
  //           obj.y = singleData.amount;
  //         }
  //     });
  //     applyGraph.push(obj);
  //   }
  //  }else{
  //   for(let i=0;i<=30;i=i+5){
  //     let obj = {};
  //     let dateToBePush;
  //     obj.x = i;
  //     obj.y = 0;
  //     applyGraph.push(obj);
  //   }
  //  }
    
     // console.log("Getting Coh Values = ",this.props.cohPast," ",this.props.cohFuture);
    //  console.log("Getting Coh Data = ",this.props.cashOnHandGraphData);
    //  console.log("-------------------------------------------------------");
       if(this.props.cohPast == 0 && this.props.cohFuture == 0){
     //    console.log("I am Successfully in Condition 1");
        if(this.props.cashOnHandGraphData.length > 0){
     //     console.log("I am Successfully in Condition 2");
          // for(let i=1;i<32;i++){
          //   let obj = {};
          //   this.props.cashOnHandGraphData.map( (singleGraph) => {
              
          //    let dateobj   = new Date(singleGraph.date);
          //    let todayDate = dateobj.getDate();
          //     console.log(singleGraph.date);
          //     if(i == todayDate){
          //       obj.x = todayDate;
          //       obj.y = singleGraph.amount;
          //       console.log("Ready x,y ",obj);
          //     }
          //   });
          //   applyGraph.push(obj);
          // }
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

    const { historicalFinances } = this.props;
    data = {};
    if (historicalFinances) {
      data = Object.keys(historicalFinances).map(key => {
        return {
          x: Moment(key, "YYYY-MM-DD").toDate(),
          y: key in historicalFinances ? historicalFinances[key].cash : 0
        };
      });
    }
    data = data.filter(Boolean);
    // we must calculate the color of each point on our line chart
    // according to runway color at that point.
    // we calculate runway length given cash, expenses, and revenue at a particular point in time
    // each runway length corresponds to a particular color
    
    var gradients = [];
    let { cashOnHandGraphData: forGradientData,cohFuture,cohPast } = this.props;
    var isLogicUtilize = 0;
    for (var i = 0; i < forGradientData.length; i++) {
      // const month = Moment(data[i].x).format("YYYY-MM-DD");
      // const cash = historicalFinances[month].cash;
      // const expenses = historicalFinances[month].expenses;
      // const revenue = historicalFinances[month].revenue;

      // calculate the position along the line chart for each data point
      // ie this point is at 17% of the total distance of the line
      const offset = Math.trunc(((i + 1) / forGradientData.length) * 100);
      const gradient = getHealthScoreColor(offset);

      if(( cohPast == 3 && cohFuture == 1) || (cohFuture == 3 && cohPast == 3)){
        let gettingCurentMonth = ALL_MONTHS[new Date().getMonth()];
       // console.log("Getting Current Month Data ",forGradientData[i].month);

        if(gettingCurentMonth == forGradientData[i].month){
          isLogicUtilize = 1;
          gradients.push(
            <Stop key={i} offset={`${offset}%`} stopColor={`#a9a9a9`} />
          );
        }else{
          if(isLogicUtilize == 1){
            gradients.push(
              <Stop key={i} offset={`${offset}%`} stopColor={`#a9a9a9`} />
            );
          }else{
            gradients.push(
              <Stop key={i} offset={`${offset}%`} stopColor={gradient} />
            );
          }
         
        }
        

      }else{
        gradients.push(
          <Stop key={i} offset={`${offset}%`} stopColor={gradient} />
        );
      }
      
    }//end of loop
    const gw=Dimensions.get("window").width;
    // const graphWidht=gw-((3/100)*gw)
    // console.log(graphWidht)
    // console.log("Start")
    // console.log(JSON.stringify(data))
    // console.log("End")
  //  console.log("rendering applyGraph ",applyGraph);
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
          

         <VictoryChart height={260} width={gw}
         minDomain={{  y: 0 }}
         // maxDomain={{x: 30, y: 1000 }}
        //  theme={VictoryTheme.material} 
        //  animate={{
        //      duration: 2000,
        //      onLoad: { duration: 1000 }
        //    }}
        
         >
           <Defs>
             <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
               {gradients}
             </LinearGradient>
           </Defs>
           <VictoryAxis
             style={{ tickLabels: { fontSize:11 } }}
             dependentAxis={true}
             tickValues={customYaxis}
             tickFormat={y => {
               if(y >= 1000){

                let returnValue = (y/1000);
                if(isFloat(returnValue)){
                  return `${returnValue.toFixed(1)}K`;
                }else{
                  return `${returnValue}K`;
                }

                //  let returnValue = parseInt(y/1000);
                //  return `${returnValue}K`;
               }else if(y >= 1000000){

                let returnValue = (y/1000000);
                if(isFloat(returnValue)){
                  return `${returnValue.toFixed(1)}M`;
                }else{
                  return `${returnValue}M`;
                }

                //  let returnValue = parseInt(y/1000000);
                //  return `${returnValue}M`;
               }else{
                 return y;
               }
             }}

             
           />
           <VictoryAxis
             tickValues={applyGraph.map(each => each.x)}
             style={{ tickLabels: {} }}
             tickFormat={x => {
              if(x%2 == 0){
                return x;
              }else{
                return "";
              }
             }
               
               //JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
             }
             style={{ tickLabels: {  fontSize: 11,angle: 0 , strokeWidth: 2.0},
                  grid:{ stroke: currentvalue => { if(currentvalue == dateObj.getDate()){ return "grey"; }  },
                  strokeDasharray: [1,3]           
                }
              }}
   
           />
           <VictoryLine
             style={{
               data: { stroke: "url(#gradient)", strokeWidth: 5 }
             }}
             data={applyGraph}
           />
         </VictoryChart>


         : <VictoryChart height={260} width={gw}
         minDomain={{  y: 0 }}
         // maxDomain={{x: 30, y: 1000 }}
        //  theme={VictoryTheme.material} 
        //  animate={{
        //      duration: 2000,
        //      onLoad: { duration: 1000 }
        //    }}
        
         >
           <Defs>
             <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
               {gradients}
             </LinearGradient>
           </Defs>
           <VictoryAxis
           style={{ tickLabels: { fontSize:11 } }}
             dependentAxis={true}
             tickValues={customYaxis}
             tickFormat={y => {
               if(y >= 1000){
                 let returnValue = parseInt(y/1000);
                 return `${returnValue}K`;
               }else if(y >= 1000000){
                 let returnValue = parseInt(y/1000000);
                 return `${returnValue}M`;
               }else{
                 return y;
               }
             }}

             
           />
           <VictoryAxis
             tickValues={applyGraph.map(each => each.x)}
             tickFormat={x =>
               x
               //JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
             }
             style={
                { tickLabels: { angle: 0 , strokeWidth: 2.0,fontSize: 11},
                  grid:{ stroke: currentvalue => { if(currentvalue == currentMonth){ return "grey"; }  },
                  strokeDasharray: [1,3],strokeWidth: 1.0

                  }
                }
            }
   
           />
           <VictoryLine
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


//the coh y axis with the custom logic

// import React, { Component,Fragment,PureComponent } from "react";
// import { Dimensions } from "react-native";
// import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, Data } from "victory-native";
// import Moment from "moment";
// import _ from "lodash";
// import { Defs, LinearGradient, Stop } from "react-native-svg";

// import { JS_DATE_INDEX_TO_MONTH_MAP } from "../../../constants/constants";
// import { ALL_MONTHS } from "../../../constants/constants";
// import { getHealthScoreColor } from "../../../utilities/gradient";
// import { getOutOfCashDate } from "../../../utilities/cash";

// export default class CashOnHandChart extends PureComponent {
//   constructor(props) {
//     super(props);
//     //Receieve the past and future data into the props
//     //cohPast={this.props.cohPast} cohFuture={this.props.cohFuture}

//   }

//   getRunwayColor(cash, expenses, sales) {
//     const oocDate = getOutOfCashDate(cash, expenses, sales);
//     const oocMonths = oocDate.diff(Moment(), "months", true);
//     return getHealthScoreColor(oocMonths, true);
//   }

//   render() {
//     let monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
//     let dateObj = new Date();
//     let currentMonth = monthArray[dateObj.getMonth()];
//     //  VictoryNative requires data to be in the format:
//     //     [
//     //         { x: "2019-08-01", y: 12000 },
//     //         { x: "2019-09-01", y: 11000 }
//     //     ]
//     // here we transform our data into this format
//     // console.log("I am in chash on hand chart");
//     // console.log(this.props.cashOnHandGraphData);
//     // console.log("Again back");
//     let applyGraph = [];
//   //   if(this.props.cashOnHandGraphData.length > 0){
    
//   //   for(let i=1;i<32;i++){
//   //     let obj = {};
//   //     let dateToBePush;
//   //     obj.x = i;
//   //     obj.y = 0;
//   //     this.props.cashOnHandGraphData.map( singleData => {
//   //         let currentDate = new Date(singleData.date);
//   //         if(currentDate.getDate() == i ){
//   //           obj.y = singleData.amount;
//   //         }
//   //     });
//   //     applyGraph.push(obj);
//   //   }
//   //  }else{
//   //   for(let i=0;i<=30;i=i+5){
//   //     let obj = {};
//   //     let dateToBePush;
//   //     obj.x = i;
//   //     obj.y = 0;
//   //     applyGraph.push(obj);
//   //   }
//   //  }
    
//       console.log("Getting Coh Values = ",this.props.cohPast," ",this.props.cohFuture);
//       console.log("Getting Coh Data = ",this.props.cashOnHandGraphData);
//       console.log("-------------------------------------------------------");
//        if(this.props.cohPast == 0 && this.props.cohFuture == 0){
//          console.log("I am Successfully in Condition 1");
//         if(this.props.cashOnHandGraphData.length > 0){
//           console.log("I am Successfully in Condition 2");
//           // for(let i=1;i<32;i++){
//           //   let obj = {};
//           //   this.props.cashOnHandGraphData.map( (singleGraph) => {
              
//           //    let dateobj   = new Date(singleGraph.date);
//           //    let todayDate = dateobj.getDate();
//           //     console.log(singleGraph.date);
//           //     if(i == todayDate){
//           //       obj.x = todayDate;
//           //       obj.y = singleGraph.amount;
//           //       console.log("Ready x,y ",obj);
//           //     }
//           //   });
//           //   applyGraph.push(obj);
//           // }
//           for(let i=1;i<31;i++){
//             let obj = {};
//             obj.x = i;
//             obj.y = null;
//             this.props.cashOnHandGraphData.map( singleMonthData => {
//               let currentDate = new Date(singleMonthData.date);
//               if(i == currentDate.getDate()){
//                 obj.x = currentDate.getDate();
//                 obj.y = singleMonthData.amount;
//               }
//             })
//             applyGraph.push(obj);
//           }
          
//         }
//         else{
//             for(let i=0;i<=5;i++){
//               let obj = {};
//               obj.x = 0;
//               obj.y = 0;
//               applyGraph.push(obj);
//             }
//            }
//        }
//        else{
//         if(this.props.cashOnHandGraphData.length > 0){
//           for(let i=0;i<this.props.cashOnHandGraphData.length;i++){
//             let obj = {};
//             this.props.cashOnHandGraphData.map( (singleGraph,index) => {
//              // console.log("Getting Index in the Map of COH chart ",index);
//               if(i == index){
//                 obj.x = singleGraph.month;
//                 if(singleGraph.Amount == null || singleGraph.Amount == undefined){
//                   obj.y = singleGraph.amount;
//                 }else{
//                   obj.y = singleGraph.Amount;
//                 }
                
              
//               }
//             });
//             applyGraph.push(obj);
//           }
//         }
//         else{
//             for(let i=0;i<=5;i++){
//               let obj = {};
//               obj.x = 0;
//               obj.y = 0;
//               applyGraph.push(obj);
//             }
//            }
//        }

//     // const { historicalFinances } = this.props;
//     // data = {};
//     // if (historicalFinances) {
//     //   data = Object.keys(historicalFinances).map(key => {
//     //     return {
//     //       x: Moment(key, "YYYY-MM-DD").toDate(),
//     //       y: key in historicalFinances ? historicalFinances[key].cash : 0
//     //     };
//     //   });
//     // }
//     // data = data.filter(Boolean);
//     // we must calculate the color of each point on our line chart
//     // according to runway color at that point.
//     // we calculate runway length given cash, expenses, and revenue at a particular point in time
//     // each runway length corresponds to a particular color
    
//     var gradients = [];
//     let { cashOnHandGraphData: forGradientData,cohFuture,cohPast } = this.props;
//     var isLogicUtilize = 0;
//     for (var i = 0; i < forGradientData.length; i++) {
//       // const month = Moment(data[i].x).format("YYYY-MM-DD");
//       // const cash = historicalFinances[month].cash;
//       // const expenses = historicalFinances[month].expenses;
//       // const revenue = historicalFinances[month].revenue;

//       // calculate the position along the line chart for each data point
//       // ie this point is at 17% of the total distance of the line
//       const offset = Math.trunc(((i + 1) / forGradientData.length) * 100);
//       const gradient = getHealthScoreColor(offset);

//       if(( cohPast == 3 && cohFuture == 1) || (cohFuture == 3 && cohPast == 3)){
//         let gettingCurentMonth = ALL_MONTHS[new Date().getMonth()];
//         console.log("Getting Current Month Data ",forGradientData[i].month);

//         if(gettingCurentMonth == forGradientData[i].month){
//           isLogicUtilize = 1;
//           gradients.push(
//             <Stop key={i} offset={`${offset}%`} stopColor={`#a9a9a9`} />
//           );
//         }else{
//           if(isLogicUtilize == 1){
//             gradients.push(
//               <Stop key={i} offset={`${offset}%`} stopColor={`#a9a9a9`} />
//             );
//           }else{
//             gradients.push(
//               <Stop key={i} offset={`${offset}%`} stopColor={gradient} />
//             );
//           }
         
//         }
        

//       }else{
//         gradients.push(
//           <Stop key={i} offset={`${offset}%`} stopColor={gradient} />
//         );
//       }
      
//     }//end of loop
//     const gw=Dimensions.get("window").width;
//     // const graphWidht=gw-((3/100)*gw)
//     // console.log(graphWidht)
//     // console.log("Start")
//     // console.log(JSON.stringify(data))
//     // console.log("End")
//     let customYaxis = [];
//     if(applyGraph.length > 0){
//       //calculate latest Logic for the Yaxis
//       let cohYAxisValue = applyGraph.map(singleCoh => singleCoh.y);
//       let maximumValue = Math.max(...cohYAxisValue);
//       let increment25Percent = parseInt(maximumValue + ( (maximumValue * 25) / 100 ));
//       console.log("maximum value on the cash on hand graph is - ",increment25Percent);
//       for(let i = 1;i<=5;i++){
//         customYaxis.push(increment25Percent*i);
//       }
//     }
//     return (
//      <Fragment>
//        {
//          (this.props.cashOnHandGraphData.length > 0) ? 
//          (this.props.cohFuture == 0 && this.props.cohPast == 0) ?
          

//          <VictoryChart height={260} width={gw}
//          minDomain={{  y: 0 }}
//          // maxDomain={{x: 30, y: 1000 }}
//         //  theme={VictoryTheme.material} 
//         //  animate={{
//         //      duration: 2000,
//         //      onLoad: { duration: 1000 }
//         //    }}
        
//          >
//            <Defs>
//              <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                {gradients}
//              </LinearGradient>
//            </Defs>
//            <VictoryAxis
//              dependentAxis={true}
//              tickValues={customYaxis}
//              tickFormat={y => {
//                if(y >= 1000){
//                  let returnValue = y/1000;
//                  if(Number.isInteger(returnValue)){
//                   return `${returnValue}K`;
//                  }else{
//                    return `${returnValue.toFixed(2)}K`
//                  }
                 
//                }else if(y >= 1000000){
//                  let returnValue = y/1000000;
//                  return `${returnValue}M`;
//                }else{
//                  return y;
//                }
//              }}

             
//            />
//            <VictoryAxis
//              tickValues={applyGraph.map(each => each.x)}
//              tickFormat={x => {
//               if(x%2 == 0){
//                 return x;
//               }else{
//                 return "";
//               }
//              }
               
//                //JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
//              }
//              style={{ tickLabels: { angle: 0 , strokeWidth: 2.0},
//                   grid:{ stroke: currentvalue => { if(currentvalue == dateObj.getDate()){ return "grey"; }  },
//                   strokeDasharray: [1,3]           
//                 }
//               }}
   
//            />
//            <VictoryLine
//              style={{
//                data: { stroke: "url(#gradient)", strokeWidth: 5 }
//              }}
//              data={applyGraph}
//            />
//          </VictoryChart>


//          : <VictoryChart height={260} width={gw}
//          minDomain={{  y: 0 }}
//          // maxDomain={{x: 30, y: 1000 }}
//         //  theme={VictoryTheme.material} 
//         //  animate={{
//         //      duration: 2000,
//         //      onLoad: { duration: 1000 }
//         //    }}
        
//          >
//            <Defs>
//              <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                {gradients}
//              </LinearGradient>
//            </Defs>
//            <VictoryAxis
//              dependentAxis={true}
//              tickFormat={y => {
//                if(y >= 1000){
//                  let returnValue = y/1000;
//                  return `${returnValue}K`;
//                }else if(y >= 1000000){
//                  let returnValue = y/1000000;
//                  return `${returnValue}M`;
//                }else{
//                  return y;
//                }
//              }}

             
//            />
//            <VictoryAxis
//              tickValues={applyGraph.map(each => each.x)}
//              tickFormat={x =>
//                x
//                //JS_DATE_INDEX_TO_MONTH_MAP[(new Date(x).getMonth() + 1) % 12]
//              }
//              style={{ tickLabels: { angle: 0 , strokeWidth: 2.0},
//                   grid:{ stroke: currentvalue => { if(currentvalue == currentMonth){ return "grey"; }  },
//                   strokeDasharray: [1,3]           
//                 }
//               }}
   
//            />
//            <VictoryLine
//              style={{
//                data: { stroke: "url(#gradient)", strokeWidth: 5 }
//              }}
//              data={applyGraph}
//            />
//          </VictoryChart>
//          : 
         
       
//          <VictoryChart height={260} width={gw}
//          theme={VictoryTheme.material} 
//          >
//            {/* <Defs>
//              <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                {gradients}
//              </LinearGradient>
//            </Defs> */}
//            <VictoryAxis
//              dependentAxis={true} 
//              tickValues={[0]}
//              />
//            <VictoryAxis
//              tickValues={[0]} /> 
//            <VictoryLine
//              style={{
//                data: { stroke: "url(#gradient)", strokeWidth: 5 }
//              }}
//              data={ [  { x:0,y:0 },{ x:0,y:0 }  ]}
//            />
//          </VictoryChart>
//        }
//      </Fragment>
//     );
//   }
// }

// const styles = {
//   margins: {
//     flex: 1,
//     paddingHorizontal: 12,
//     paddingTop: 15,
//     backgroundColor: "white",
//     marginHorizontal: 18,
//     marginVertical: 24
//   },
//   heading: {
//     flexDirection: "row",
//     justifyContent: "space-between"
//   },
//   label: {
//     fontSize: 11,
//     letterSpacing: 0.07,
//     lineHeight: 13,
//     marginBottom: 13,
//     color: "#151927"
//   },
//   data: {
//     flexDirection: "row",
//     justifyContent: "space-between"
//   }
// };