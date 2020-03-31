import React,{ Component } from "react";
import { Text,View,TouchableOpacity,StyleSheet, ScrollView } from "react-native";
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
                <Text style={{ fontSize: 16, color: "#000",textAlign: 'left' }}>
                    { blockText }                
                </Text>
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
                    
                    <this.renderBlock 
                        marginTop={true}
                        blockNo={1}
                        blockText = {`Actionable insight copy - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.`}
                    />

                    <this.renderBlock 
                        blockNo={2}
                        blockText = {`Actionable insight copy - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.`}
                    />
                </View>
                <View style = {{ backgroundColor: "#EEEFF1",height: 15,marginTop: 40 }}/>

                <View style={{  paddingVertical: 40,justifyContent:'center',alignItems:"center", }}>
                <Text style={{ fontSize:13, color:'#1D1E1F' }}>How do you like the insights?</Text> 
                <View style={{ width:"100%",flexDirection:"row",justifyContent:"space-around",marginTop: 30 }}>
                    <TouchableOpacity
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
})
export default DetectPlatform(ExpenseByCategoryInsights,styles.container);