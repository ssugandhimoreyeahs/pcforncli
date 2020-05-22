import React, { Component } from "react";
import { View , Text, ScrollView,  StyleSheet, TouchableOpacity,BackHandler, ActivityIndicator} from "react-native";
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { connect } from "react-redux";
import { fetchInsightsAsyncCreator } from "../../../reducers/insights";


 class CashOnHandinsights extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        isUsefulTouched:false
      }
    }

    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    }
  
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    }
  
    handleBackButton=(nav)=> {
      if (!nav.isFocused()) {
        BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
        return false;
      }else{
        nav.goBack();
        return true;
      }
    }

    useFulComponent = () => {
      return(
        <View style={{width:"100%", backgroundColor:'#FFFFFF', height:150,marginTop:40,marginBottom:10}}>
               <Text style={{width:166, height:16,marginTop:20, alignSelf:'center', fontSize:12}}>How do you like the insights?</Text>
    
         <View style={{backgroundColor:'#FFFFFF', flexDirection:'row', justifyContent:'space-between', marginTop:24, marginLeft:60,marginRight:60,}}>
              <TouchableOpacity style={styles.Buttondesign} activeOpacity = { .5 } onPress={()=>{ this.setState({ isUsefulTouched:true }) }}>
                <View style={{flexDirection:'row',justifyContent:'flex-start', alignSelf:'center', marginTop:12,}}>
                 <Feather name='thumbs-up' size={15} color='#1D1E1F' ></Feather>
                 <Text style={styles.buttontxt}>Useful</Text></View>
              </TouchableOpacity>
    
                <TouchableOpacity style={styles.Buttondesign} activeOpacity = {.5} onPress={()=>{ this.setState({ isUsefulTouched:true }) }} >
                <View style={{flexDirection:'row',justifyContent:'space-around', alignSelf:'center', marginTop:12, marginLeft:10}}>
                 <Feather name='thumbs-down' size={14} color='#1D1E1F'></Feather>
                <Text style={styles.buttontxt}>Not Useful</Text>
                </View>
                </TouchableOpacity>
          </View>    
        </View>
      );
    }
    feedbackComponent = () => {
      return(
        <View style={{width:"100%", backgroundColor:'#FFFFFF',marginTop:40, marginBottom:10, height:130,}}>
        <Text style={{width:166, height:16, alignSelf:'center',marginTop:20, fontSize:12}}>How do you like the insights?</Text>
    
        <TouchableOpacity style={styles.Buttondesign1}>
              <View style={styles.circView1}>
                  <View style={styles.checkview}>
                     <AntDesign name='check' size={15} color='#1D1E1F' style={styles.checkIconView}></AntDesign>
                  </View>
                  <Text style={styles.buttontxt1}>Thanks for the feedback!</Text>
              </View>    
        </TouchableOpacity>
       </View>
      )
    }
    
    loadCohInsights = () => {
      
      let { error,insightsData,isFetched,masterLoader } = this.props.insightsRedux;
          insightsData = {
            "success": true,
            "Coh": {
                "insightText": false,
                "insightData": [
                    2
                ],
                "type": 50
            }
        }
      if(insightsData == undefined || insightsData.Coh == undefined || insightsData.Coh.type== undefined || insightsData == null || insightsData.Coh == null || insightsData.Coh.type == null){
        return(
          <View>

          <View style={{flexDirection:'row', width:'70%',height:45,marginTop:'3%',alignSelf:"flex-start",justifyContent:'space-between',}}>
                            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                              <AntDesign size={25} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
                            </TouchableOpacity>
                            <Text style={styles.header}>Cash on Hand Insights</Text>
                          </View>

                    <View style={{ justifyContent:"center",alignItems:"center", marginTop:"60%" }}>


                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
                        <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
                        <Text style={{ marginLeft:10,alignSelf:"center" }}>No Data Available!</Text>
                    </View> 
                    {/* <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
                        <TouchableOpacity onPress={()=>{ this.handleReloadInsightsData(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                            <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Reload</Text></View>
                        </TouchableOpacity>
                    </View> */}

                    </View>

          </View>
        );
      }else{
        //let cohType = insightsData.Coh.type == 50 ? `50%` :  insightsData.Coh.type == 10 ?  `10%` : undefined;
        let cohType = insightsData.Coh.type == 50 ? `50%` : `10%` ;
      //   insightsData = {
      //     "success": true,
      //     "Coh": {
      //         "insightText": true,
      //         "insightData": [
      //             2
      //         ],
      //         "type": 50
      //     }
      // }
        return(
          <ScrollView>
          <View style={{flexDirection:'row', width:'70%',height:45,marginTop:'3%',alignSelf:"flex-start",justifyContent:'space-between',}}>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
              <AntDesign size={25} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
            </TouchableOpacity>
            <Text style={styles.header}>Cash on Hand Insights</Text>
          </View>
         <View style={{width:"100%", height:131, flexDirection:'column', backgroundColor: insightsData.Coh.insightText == false ? '#FFE8DD' : '#E5FCEA', alignItems:'center',}}>
           <View style={{marginTop:42,}}>
            
            <Text style={styles.text1 } >{ `${cohInsightsContent[cohType].insightText}` }</Text>
            
            
            </View>
         </View>
      
          <View style={{width:"100%",flexDirection:'column', backgroundColor:'#FFFFFF',}}>
                   <Text style={styles.text3}>How to improve</Text>
                   
            {
              insightsData.Coh.insightData.map(( singleApiCohData,index1 ) => {
                  return <View key={index1} style={styles.viewdes}>
                  <View style={styles.circView}>
                    <Text style={styles.imgtxt}>{`${index1+1}`}</Text>
                  </View>  
                <Text style={styles.viewtxt}> { `${cohInsightsContent[cohType].insightData[singleApiCohData]}` }</Text> 
             </View>
              })
            }
             
            {/* <View style={styles.viewdes}>
                  <View style={styles.circView}>
                       <Text style={styles.imgtxt}>3</Text>
                  </View>
                  <Text style={styles.viewtxt}>Actionable insight copy - Lorem ipsum dolor sit amet, 
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</Text> 
             </View> */}
      
          </View>
            { (this.state.isUsefulTouched) ? this.feedbackComponent() : this.useFulComponent() } 
      </ScrollView>
        );

      }
      
    }

    handleReloadInsightsData = () => {
      this.props.fetchInsights();
    }
    render(){
      console.log("i am here ------------------ for the insights ----");
      console.log(this.props.insightsRedux);
      console.log("ends here");

      let { error,insightsData,isFetched,masterLoader } = this.props.insightsRedux;
      error = false;
      masterLoader = false;
      isFetched = true;
  return(
    <View style={styles.margins}>
      {
        error == true ?
        <View>

        <View style={{flexDirection:'row', width:'70%',height:45,marginTop:'3%',alignSelf:"flex-start",justifyContent:'space-between',}}>
                  <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                    <AntDesign size={25} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
                  </TouchableOpacity>
                  <Text style={styles.header}>Cash on Hand Insights</Text>
                </View>

          <View style={{ justifyContent:"center",alignItems:"center", marginTop:"60%" }}>


          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
              <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
              <Text style={{ marginLeft:10,alignSelf:"center" }}>Error Try Again!</Text>
          </View> 
          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
              <TouchableOpacity onPress={()=>{ this.handleReloadInsightsData(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                  <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Reload</Text></View>
              </TouchableOpacity>
           </View>

          </View>
          
        </View>
        : masterLoader == true ?  
        <View>
        <View style={{flexDirection:'row', width:'70%',height:45,marginTop:'3%',alignSelf:"flex-start",justifyContent:'space-between',}}>
                  <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                    <AntDesign size={25} name='left' style={{alignSelf:'flex-start', marginLeft: 10,}} />
                  </TouchableOpacity>
                  <Text style={styles.header}>Cash on Hand Insights</Text>
                </View>
          <View style={{ justifyContent:"center",alignItems:"center", marginTop:"60%" }}>
            <ActivityIndicator size="large" color="#070640" />
          </View>
        </View>
        : isFetched == true ? <this.loadCohInsights /> : null
      }
    </View>
  
  );
}}

const styles = StyleSheet.create({
    margins: {
      flex: 1,
      backgroundColor:"#F8F8F8",
    },

    text1:{
        color:'#1D1E1F',
        fontSize:17,
        fontWeight:'bold', 
       
    },
    text2:{
      color:'#1D1E1F',
      fontSize:17,
      fontWeight:'bold', 
        
  },
  text3:{
    color:'#1D1E1F',
    fontSize:17,
    fontWeight:'bold', 
    marginTop:36,
    marginLeft:24,    
},

    buttontxt:{
        color:'#07053E',
        textAlign:'center',
        marginLeft:10,
        fontSize:12,
        
    },
     Buttondesign:{
        width:114,
        height:40, 
        borderRadius:20, 
        backgroundColor:"#E0EBFF",
        
      
     },
     Buttondesign1:{
        width:"75%",
        height:40, 
        borderRadius:20, 
        backgroundColor:"#E5FCEA",
        marginTop:24, 
        alignSelf:'center',
       
     },
     buttontxt1:{
        color:'#1D1E1F',
        textAlign:'center',
        marginLeft:10,
        
    },
   img:{
        width:43,
        height:43,
        backgroundColor:'#FFF1EA',
        marginLeft:20,
        justifyContent:"center",
        alignItems:'center'
    },
 imgtxt:{
   color:'#185DFF',
    textAlign:'center',
      },

 viewdes:{
          width:"90%", 
          flexDirection:'row',
          backgroundColor:'#E0EBFF',
          marginTop:12,
          height:129,
          alignSelf:'center',
          borderRadius:6,
        },
 circView:{
           width:20, 
           height:20, 
           borderRadius:10,
           marginLeft:14,
           borderColor:'#0256FF',
           borderWidth:2,
           marginTop:14,
           alignContent:'center'
         },
  viewtxt:{
         width:271, 
         height:101,
         marginLeft:12,
         marginTop:14,

         },
  header: {
          fontSize: 17,
          fontWeight: "bold",
          },
  circView1:{
          borderRadius:10,
          flexDirection:'row',
          justifyContent:'space-around',
          alignSelf:'center',
          marginTop:12,
          marginLeft:10
        },
  checkview:{
          width:20, 
          height:20, 
          backgroundColor:'#7EF295',
          borderRadius:10,
          
        },
  checkIconView:{
          padding:3
        }

});

const mapStateToProps = (state) => {
  return{
    insightsRedux: state.insightsRedux
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchInsights: () => { dispatch(fetchInsightsAsyncCreator()); }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(CashOnHandinsights);

const cohInsightsContent = {

  "50%" :  {
    "colorCode": "orange",
    "insightText" : `Your cash balance has decreased \n more than 50% from last month.`,
    "insightData" : {
      1 :  " Review your Accounts Receivable balances and collect your largest amounts outstanding first. This will help improve your cash balances in the bank and extend your runway.",
      2 :  " Review your key cash expenses here to see if there are any large expenses that were unforeseen or not approved.",
      3 :  " Review your revenue numbers to be sure they're accurate and all accounts receivable have been recorded and or collected. This will help improve your cash balance and extend your runway."
    }
  },


  "10%" :  {
    "colorCode": "orange",
    "insightText" : `Your cash balance has decreased \n more than 10% from last month.`,
    "insightData" : {
      1 :  " Review your Accounts Receivable balances and collect the largest outstanding balances first. This will help increase your cash balance as well as make the best use of your time and efforts.",
      2 :  " Review your cash expenses looking for abnormalities or errand charges.",
      3 :  " Review your revenue numbers to be sure they're accurate and all accounts receivable have been recorded and or collected. This will help improve your cash balance and extend your runway."
    }
  },

}