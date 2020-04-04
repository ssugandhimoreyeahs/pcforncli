import React, { Component, Fragment } from "react";
import { View, Text,TouchableOpacity,Alert, Keyboard, StyleSheet,ActivityIndicator,Dimensions } from "react-native";
// import {Ionicons, SimpleLineIcons} from '@expo/vector-icons';
import { Dropdown } from "react-native-material-dropdown";
import {Button_Months} from "../../.././constants/constants";
import { Button } from "react-native-elements";
import ProgressCircle from 'react-native-progress-circle'
import { connect } from "react-redux";
import { AntDesign,MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchExpensesMultipleTimesAsyncCreator } from "../../../reducers/expensecategory";
import { numberWithCommas,firstLetterCapital } from "../../../api/common";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { TERMINOLOGY } from "../../../api/message";

Ionicons.loadFont();
SimpleLineIcons.loadFont();
const gw=Dimensions.get("window").width;
class ExpenseByCategory extends Component{

    constructor(props){
        super(props)
        this.state={
            expenseCurrentMonth: "3 Months",
            arrowStyle:"arrow-down"
        }
    }

    static getDerivedStateFromProps(props, state){

        //code here
        const { expenseCurrentRange } = props.expenseByCategoryRedux;
        //console.log("testing here inside static getDerivedStatefromprops--------------------------------------");
        let renderButton;
        if(expenseCurrentRange == 1){
            renderButton = "This Month";
        }else if(expenseCurrentRange == 3){
            renderButton = "3 Months";
        }else if(expenseCurrentRange == 6){
            renderButton = "6 Months";
        }else{
            renderButton = "12 Months"
        }
        //console.log(renderButton);
        //console.log("Ends Here")
        return { expenseCurrentMonth: renderButton };
    }
    handleExpenseRangeSelection = (currentExpenseRange) => {
        const { expenseCurrentMonth:currentRange } = this.state;
        //console.log("User select expense by category filter - ",currentExpenseRange);
        if(currentRange != currentExpenseRange){
                if(currentExpenseRange == "This Month"){
                    this.props.fetchExpenseMultipleTimesByCategory(1);
                }else if(currentExpenseRange == "3 Months"){
                    this.props.fetchExpenseMultipleTimesByCategory(3);
                }else if(currentExpenseRange == "6 Months"){
                    this.props.fetchExpenseMultipleTimesByCategory(6);
                }else if(currentExpenseRange == "12 Months"){
                    this.props.fetchExpenseMultipleTimesByCategory(12);
                }
                this.setState({ expenseCurrentMonth:currentExpenseRange });
        }
        
    }
    handleReloadExpenseByCategory = () => {

        const { expenseCurrentMonth:currentExpenseRange } = this.state;
        
        
                if(currentExpenseRange == "This Month"){
                    this.props.fetchExpenseMultipleTimesByCategory(1);
                }else if(currentExpenseRange == "3 Months"){
                    this.props.fetchExpenseMultipleTimesByCategory(3);
                }else if(currentExpenseRange == "6 Months"){
                    this.props.fetchExpenseMultipleTimesByCategory(6);
                }else if(currentExpenseRange == "12 Months"){
                    this.props.fetchExpenseMultipleTimesByCategory(12);
                }
        
        

        
    }
      handleArrowStyle = () => {
        if(this.state.arrowStyle == "arrow-down"){
        this.setState({ arrowStyle: "arrow-up" });
        }else{
        this.setState({ arrowStyle: "arrow-down" });
        }
     }

     loadProgressCircle = (props) => {
        return(
            <Fragment>
                <View style={{flexDirection:'row',justifyContent:'space-evenly', width:154, height:43}}>
                        <View style={{ height:25,width:40}}>
                            <ProgressCircle 
                            percent={props.percentage}
                            radius={22}
                            borderWidth={2}
                            color="#FF7B32"
                            containerStyle={{height:40,width:40}}
                            shadowColor="#999"
                            bgColor="#FFFFFF" >
                                <Text style={{ fontSize: 15 ,color:'#151927'}}>{ `${props.percentage}%` }</Text>
                            </ProgressCircle>
                        </View>
                        <View style={{flexDirection:"column", justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:12,}}>{ props.category } </Text>
                            <Text style={{fontSize:15,}}>{ props.price }</Text>
                        </View>
                    </View>
            </Fragment>
        );
     }

     renderCategoryWithPercentage = ({ percentage,category,price }) => {

        return(
            <View style={{ flexDirection:"row",paddingBottom:20, }}>

                  <ProgressCircle 
                            percent={percentage}
                            radius={24}
                            borderWidth={2}
                            color="#FF7B32"
                            containerStyle={{height:40,width:40}}
                            shadowColor="#EFEEEE"
                            bgColor="#FFFFFF" >
                                <Text style={{ fontSize: 15 ,color:'#151927'}}>{ `${percentage}%` }</Text>
                    </ProgressCircle>

                    <View style={{ paddingLeft:14 }}>
                        <Text style={{ textAlign:"left",fontSize:12,color:"#151927" }}>{ `${category}` }</Text>
                        <Text style={{ paddingTop:7,textAlign:"left",fontSize:15,color:"#151927" }}>{`${price}`}</Text>
                    </View>
                  
                  </View>
        );
     }
     showExpenseByCategoryTerminology = () => {
        Alert.alert(  
                TERMINOLOGY.EXPENSEBYCATEGORY.title,  
                TERMINOLOGY.EXPENSEBYCATEGORY.message,[{  
                        text: TERMINOLOGY.EXPENSEBYCATEGORY.button1,  
                        style: 'cancel', }]);  
     }
     renderExepensesByCategory = () => {
        const { expenseByCategoryRedux:expenseByCategory } = this.props;
        const { expenseCurrentMonth } = this.state;
         return(
            <Fragment>
            <View style={{ 
                height:350,
                width:'100%', 
                backgroundColor:'white', 
                alignSelf:'center',
                elevation:10,
                shadowColor:'#000',
                paddingVertical:15,paddingHorizontal:13 }}>
            {
                 expenseByCategory.childLoader == false ? <Fragment>
                  
                  <View style={{
                      //borderWidth:1,borderColor:"red",
                      height: "15%",flexDirection:"row",justifyContent:"space-between"
                  }}>
                     <TouchableOpacity onPress={()=>{ this.showExpenseByCategoryTerminology(); }} style={{ flexDirection:"row" }}>
                        <Text style={{ fontSize:12,color:"#1D1E1F" }}>EXPENSE BY CATEGORY</Text>
                        <Ionicons 
                        style={{ paddingTop:1,paddingLeft:3,height:13,width:13,color:"#1D1E1F" }}
                        name='md-information-circle-outline' />
                    </TouchableOpacity>
                  
                    <View style={{ flexDirection:"column",justifyContent:"space-between" }}>
                        <TouchableOpacity onPress={()=>{ this.props.navigation.navigate("ExpenseScreenParent"); }}>
                        <Text style={{ textAlign:'right',fontSize:22,color:"#1D1E1F",fontWeight:"600" }}>
                        { expenseByCategory.totalExpense == undefined || expenseByCategory.totalExpense == null || expenseByCategory.totalExpense == 0 ? `$0` : `-$${numberWithCommas(expenseByCategory.totalExpense)}`}
                        </Text>
                        </TouchableOpacity>
                        <Text style={{ textAlign:"right",color:"#1D1E1F",fontSize:12 }}>
                            {
                              `Total ${expenseCurrentMonth}`
                            }
                        </Text>                    
                    </View>
                  </View>

                  <View style={{
                      justifyContent:"space-between",
                      flexDirection:"row",
                      flexWrap:"wrap",
                      paddingTop:25,
                      borderWidth:0,borderColor:"red",
                      height: "73%"
                  }}>

                    {
                        expenseByCategory.expense.length > 0 ?
                        expenseByCategory.expense.map( (singleExpense,index,fullArray) => { 
                            if(index < 6){
                            return <this.renderCategoryWithPercentage key={index}
                                percentage={parseInt(fullArray[index].percentage)} 
                                category = {firstLetterCapital(fullArray[index].category)} 
                                price = {`-$${numberWithCommas(fullArray[index].amount)}`} 
                            />
                            }else{
                                return null;
                            }
                        })
                        :
                        <View style={{ width:"100%",justifyContent:"center",alignItems:"center" }}>
                             <Text style={{ color:"#070640" }}>You have not spent anything this month.</Text>
                         </View>
                    }
                    
                </View>
             
             </Fragment> :  <View style={{height:"88%",width:gw,justifyContent:"center",alignSelf:"center"}}>
              <ActivityIndicator size="large" color="#070640" />
            </View>
            }
      

        <View style = {{
                height:"10%",
                width:'100%',
                flexDirection:"row",
                justifyContent:"space-between",
                alignSelf:'center'
            }}>
            <View style={styles.Toucha}>
            <Dropdown
                    disabled={false}
                    data={Button_Months}
                    onChangeText={ this.handleExpenseRangeSelection }
                    value={ this.state.expenseCurrentMonth }
                    containerStyle={styles.dropdown}
                    renderAccessory={() => null}
                    pickerStyle={{backgroundColor:"#E6E6EC",borderRadius:10,}}
                    onBlur={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                    onFocus={()=>{ this.handleArrowStyle(); Keyboard.dismiss(); }}
                    inputContainerStyle={styles.detailsInputContainer}
                    dropdownPosition={4.5}
                    fontSize={11} />
                    <SimpleLineIcons name={this.state.arrowStyle} color="#030538" style={{marginTop:10, marginRight:20,}}/>
            </View>
            <View style={{width:"40%",height:"100%",}}>
            <Button 
                title="View Insights" 
                type="solid" 
                buttonStyle={styles.btnstyle1} 
                titleStyle={styles.buttontextt1}
                onPress={()=>{ 
                    Alert.alert("Coming soon",
                        "We are building your personalized Pocket Insights. We will notify you when they are ready.",
                        [ { text: "Okay"  } ],
                        false);
                }}
            />
            </View>
        </View>
        </View>
            </Fragment> 
         );
     }
render(){
        // console.log("-----------------------------------------Render Exepense By Category ------------------------------");
        // console.log(this.props.expenseByCategoryRedux);
        // console.log("-----------------------------------------Render Exepense By Category ------------------------------");
        const { expenseByCategoryRedux:expenseByCategory } = this.props;
        
        return(
        
         <View style={{width:'95%', alignSelf:'center' }}>
            <View style={styles.margins}></View>

            {
                expenseByCategory.error == true ?
                <View style={{ height:350,width:'100%', backgroundColor:'white', alignSelf:'center',justifyContent:"center",elevation:10,shadowColor:'#000' }}>
                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
                        <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
                        <Text style={{ marginLeft:10,alignSelf:"center" }}>Oops Error Try Again!</Text>
                    </View> 
                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
                        <TouchableOpacity onPress={()=>{ this.handleReloadExpenseByCategory(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                            <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
                        </TouchableOpacity>
                    </View>
                </View> 
                :
                expenseByCategory.loading == true ?
                <View style={{ height:350,width:'100%', backgroundColor:'white', alignSelf:'center',justifyContent:"center",elevation:10,shadowColor:'#000' }}>
                    <ActivityIndicator size="large" color="#070640" />
                </View> 
                :
                expenseByCategory.isFetched == true ?
                this.renderExepensesByCategory() : null

            }
                

          
      </View> 
     
      )
    }
}

const mapStateToProps = (state) => {
    return {
        expenseByCategoryRedux: state.expenseByCategory
    }
}
const mapDispatchToProps = (dispatch) => {
    return{
        fetchExpenseMultipleTimesByCategory: (expenseFetchRange = 1) => { dispatch(fetchExpensesMultipleTimesAsyncCreator(expenseFetchRange)); }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ExpenseByCategory);
const styles = StyleSheet.create({
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
        marginTop:38,
        alignSelf:'center'
      },
      Toucha:{
        width:"40%",
        height:32,
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


})
