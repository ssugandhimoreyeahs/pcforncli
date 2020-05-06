import React,{ Component } from "react";
import { Text,View,TouchableOpacity,StyleSheet, ScrollView, Alert } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";

Feather.loadFont();
AntDesign.loadFont();
class ExpenseByCategoryInsights extends Component{

    renderBlock = ({ blockNo,blockText,marginTop }) => {

        return(
            <View style={{ 
                marginTop: marginTop == true ? 25 : 14,
                borderRadius:8,
                backgroundColor:"#E0EBFF",
                flexDirection: "row",
                justifyContent:"space-between",
                padding:17 }}>

            
                <View style={{ 
                    marginTop:3,
                    borderRadius:50,
                    borderColor:"#185DFF",
                    borderWidth:2,
                    height:21,
                    width:21,justifyContent:"center",alignItems:"center"
                }}><Text style={{ fontWeight:"700",textAlign:'center',fontSize: 10,color: '#185DFF' }}>{ blockNo }</Text></View>
            

            <View style={{ width:"87%" }}>
                { blockText }
            </View>
            </View>
        );
    }
    render(){

        return(
            <ScrollView>
                
                <View style={{ height:70,width:"100%",flexDirection:"row"}}>
                    <View style={{ flexDirection:"row",width:"100%" }}>
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"flex-end" }}>
                            <TouchableOpacity  onPress={()=>{ this.props.navigation.goBack(); }} >
                                <AntDesign name='left' size={25} color={'#000000'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width:"80%",justifyContent:"center",alignItems:"center" }}>
                        <Text style={{ fontSize:18,color:"#000",fontWeight: "600" }}>{ 'Expense Insights' }</Text>
                            
                        </View>
                    </View>
                </View> 

                <View style={{ marginTop: 3,
                backgroundColor:"#FFE8DD",
                height: 150,
                justifyContent:'center',alignItems:'center'}}>
                <Text style={{ width:"80%",textAlign:'left',color:'#1D1E1F',fontSize: 17,fontWeight:"bold" }}>{'Your cash balance has decreased more than 50% from last month.'}</Text>
                </View>


                <View style = {{ marginTop: 40,width:"90%",alignSelf:"center" }}>
                    <View style={{ alignSelf:'flex-start' }}>
                        <Text style={{ color: '#1D1E1F',fontSize: 17, fontWeight: "bold" }}>
                            { 'How to improve' }
                        </Text>
                    </View>
                    
                    
                    {
                        staticInsight.map((singleInsight,index)=>{
                            return  <this.renderBlock key={index}
                                marginTop={index == 0 ? true : false}
                                blockNo={singleInsight.sequence}
                                blockText = {singleInsight.data(this.props.navigation)}
                            />
                        })
                    }
                    {/* <this.renderBlock 
                        marginTop={true}
                        blockNo={staticInsight[0].sequence}
                        blockText = {staticInsight[0].data}
                    /> */}

                    
                </View>
                <View style = {{ backgroundColor: "#EEEFF1",height: 15,marginTop: 40 }}/>

                <View style={{  paddingVertical: 40,justifyContent:'center',alignItems:"center", }}>
                <Text style={{ fontSize:13, color:'#1D1E1F' }}>How do you like the insights?</Text> 
                <View style={{ width:"100%",flexDirection:"row",justifyContent:"space-around",marginTop: 30 }}>
                    <TouchableOpacity
                    disabled={true}
                    style ={{ 
                        paddingHorizontal: 15,
                        flexDirection:'row',
                        backgroundColor:'#E0EBFF',
                        height:40, width: 114, 
                        borderRadius: 50, 
                        justifyContent:'center',
                        alignItems:'center' }}
                    >
                    <Feather name='thumbs-up' size={17} color='#1D1E1F' ></Feather>
                    <Text style={{ fontSize: 12,paddingLeft:8,  }}>useful</Text></TouchableOpacity>

                    <TouchableOpacity
                    disabled={true}
                    style ={{ paddingHorizontal:15,flexDirection:'row',backgroundColor:'#E0EBFF',height:40, width: 114, borderRadius: 50, justifyContent:'center',alignItems:'center' }}
                    >
                    <Feather name='thumbs-down' size={17} color='#1D1E1F' 
                    style={{paddingTop:6,transform: [{rotateX: '360deg'},{rotateY: '180deg'}]}}
                    ></Feather>
                    <Text style={{ fontSize: 12,paddingLeft:8,  }}>not useful</Text></TouchableOpacity>

                </View>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});

let staticInsight = [
    {
        sequence: 1,
        data: (navigation) => {
            return <Text style={{ fontSize: 16, color: "#000",textAlign: 'left' }}>
            { `Evaluate the highest`}
            <Text onPress={()=>{ navigation.navigate("NewExpenseByCategoryParent") }} style={{ fontWeight: "bold" }}>{ `  expenses  `}</Text> 
             { `(non rent) and reduce unnecessary` } 
             <Text onPress={()=>{ navigation.navigate("NewExpenseByCategoryParent") }} style={{ fontWeight: "bold" }}>{ `  expenses  `}</Text> 
             { `to extend your runway. Identify one time`} 
             <Text onPress={()=>{ navigation.navigate("NewExpenseByCategoryParent") }} style={{ fontWeight: "bold" }}>{ `  expenses  `}</Text> 
             { `that are unlikely to be monthly` } 
             <Text onPress={()=>{ navigation.navigate("NewExpenseByCategoryParent") }} style={{ fontWeight: "bold" }}>{ `  expenses  `}</Text> 
             { `going forward. ` }         
        </Text>
        }
    },
    {
        sequence: 2,
        data: (navigation) => {
            return <Text style={{ fontSize: 16, color: "#000",textAlign: 'left' }}>
            { `These`}
            <Text onPress={()=>{ navigation.navigate("NewExpenseByCategoryParent") }} style={{ fontWeight: "bold" }}>{ `  expenses  `}</Text> 
             { `may be expected as you're growing the business, but keeping an eye on them monthly will help keep them in perspective. ` }         
        </Text>
        }
    }
]

export default DetectPlatform(ExpenseByCategoryInsights,styles.container);