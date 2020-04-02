import React,{ Component, Fragment } from "react";
import { Text,View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart } from 'react-native-svg-charts'
import { Circle, G, Image } from 'react-native-svg'



FontAwesome.loadFont();
AntDesign.loadFont();

const deviceWidth = Dimensions.get('window').width

class ExpenseByCategory extends Component{

    data = [
        {
            key: 1,
            amount: 40,
            svg: { fill: '#FBBC10' },
            image: require("../../../assets/CategoryIcon/vehicle2.png")
        },
        {
            key: 2,
            amount: 40,
            svg: { fill: '#E89200' },
            image: require("../../../assets/CategoryIcon/payroll2.png")
        },
        {
            key: 3,
            amount: 15,
            svg: { fill: '#AA9637' },
            image: require("../../../assets/CategoryIcon/membership2.png")
        },
        {
            key: 4,
            amount: 8,
            svg: { fill: '#7785E9' },
            image: require("../../../assets/CategoryIcon/charitable3.png")
        },
         {
            key: 5,
            amount: 5,
            svg: { fill: '#EA727A' },
            image: require("../../../assets/CategoryIcon/charitable3.png")
        }
    ]
    header = () => {
        return(
            <View style={ styles.header }>
                    <View style={{ flexDirection:"row",width:"100%",marginTop:20 }}>
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"center" }}>
                            <TouchableOpacity  onPress={()=>{ this.props.navigation.goBack(); }} >
                                <AntDesign name='left' size={22} color={'#000000'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width:"80%",justifyContent:"center",alignItems:"center" }}>
                        <Text style={{ fontSize:17,color:"#000",fontWeight: "600" }}>{ `Expense by Category` }</Text>
                            
                        </View>
                    </View>
                </View> 
        );
    }
    expensePie = () => { 
        return(
           <Fragment>
               <View style={{ height: 350,backgroundColor:"#FFF" }}>
                    <this.RenderPieChart />

                    <View style={{ paddingHorizontal:15,alignItems:"center",borderRadius:10,height:40,backgroundColor:"#E6E6EC",
                    alignSelf:"center",marginTop: -45,width: 150,flexDirection:"row",justifyContent:"space-between" }}>

                        <TouchableOpacity><AntDesign color={"#030538"} name={"left"} size={15}></AntDesign></TouchableOpacity>
                        <Text style={{ color:"#030538",fontSize: 12 }}>This Month</Text>
                        <TouchableOpacity><AntDesign name={"right"} color={"#030538"} size={15}></AntDesign></TouchableOpacity>

                    </View>
               </View>
              <this.renderCategory />
           </Fragment>
        );
    }

    renderCategory = () => {

        return(
            <View style={{ alignItems:"center" }}>
                    <View style={ styles.categoryCart }>
                        <View style={{ paddingVertical:35,width: "91%",alignSelf:"center" }}>
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            <this.seprator />
                            <this.renderSingleCategory  />
                            
                            </View>
                     </View>
            </View>
        );
    }

    renderSingleCategory = () => {
        
        return(
            <View style={{ 
                //borderWidth:1,borderColor:"#000",
                flexDirection: "row", justifyContent:"space-between"
             }}>

             <View style={{ width:"16%",
                 borderColor: "red",borderWidth: 0
             }}>
             <View style={{ height: 50, width: 50, borderRadius: 50,
                backgroundColor: "#A599EC" 
             }}></View>
             </View>


                <View style={{ paddingLeft:3,paddingRight:10,width: "80%",justifyContent:"space-between",
                    borderColor:"#000",borderWidth:0
                 }}>
                     <View style={{ flexDirection:"row",justifyContent:"space-between" }}>
                         <Text style={{ fontWeight:"600",fontSize:15,color: "#1D1E1F" }}>
                         {'Employee Benefits'} </Text>
                         <Text style={{ fontSize:15,color: "#1D1E1F" }}>
                         {'-$4,290.00'}</Text>
                    </View>

                    <View style={{ flexDirection:"row",justifyContent:"space-between" }}>
                         <Text style={{ fontSize:10,color: "#1D1E1F" }}>
                         <FontAwesome name={"arrow-up"} color={"#FF784B"}/>
                         {' 2.7% since previous month'} </Text>
                         <Text style={{ fontSize:10,color: "#1D1E1F" }}>
                         {'33% of total'}</Text>
                    </View>
                 </View>
             

             <TouchableOpacity style={{ justifyContent: "center",width: "4%",
                borderColor: "red",borderWidth: 0
             }}>
                 <AntDesign size={17} name={"right"} color={"#030538"} style={{ opacity: 0.5 }} />
             </TouchableOpacity>

            </View>
        );
    }
    seprator = () => {
        
        return(
            <View style={ styles.seprator }/>
        );
    }
    Labels = ({ slices, height, width }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                if(data.amount < 14)
                    return;
                return (
                    <G
                        key={index}
                        x={labelCentroid[ 0 ]}
                        y={labelCentroid[ 1 ]}
                    >
                        <Image
                            href={data.image}
                            x={-17}
                            y={-17}
                            height={35}
                            width={35}
                            preserveAspectRatio="xMidYMid slice"
                            opacity="1"
                            
                        />
                    </G>
                );
            });
    }
    RenderPieChart = () => {
        
        return(
            <PieChart
                style={{ height: 390,marginTop: -65 }}
                valueAccessor={({ item }) => item.amount}
                data={this.data}
                // spacing={10}
                outerRadius={'57%'}
                // innerRadius={'50%'}
            >   
                <this.Labels/>
                <View style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ textAlign:"center",color: "#1D1E1F",opacity: 0.5,marginTop:0 }}>{ `Total Spending\nin March` }</Text>

                    <Text style={{ color: "#1D1E1F",fontSize: 23,marginVertical:18,fontWeight:"bold" }}>-$52,112.27</Text>
                
                    <View style={{ 
                        borderColor:"blue",borderWidth:0,
                        flexDirection:"row",
                        justifyContent:"space-between" }}>
                    <FontAwesome name={'arrow-up'} color={"#FF784B"} size={14}/>
                    <Text style={{ fontSize:12,color:"#1D1E1F",paddingLeft:5 }}>7.21%</Text>
                    </View>
                    <Text style={{ textAlign:"center",color:"#1D1E1F",opacity:0.5 }}>since last month</Text>
                </View>
            </PieChart>
        );
    }
    render(){
        return(
            <ScrollView>
                <this.header />
                <this.expensePie />
                
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#EEEFF1",
        height:"100%",width:"100%"
    },
    header: { 
        elevation:5,
        shadowColor:"#F0F0F0",
        borderBottomColor:"#F0F0F0",borderBottomWidth: 1.5,
        height:70,backgroundColor:"#F8F8F8",flexDirection:"row"
    },
    categoryCart: { 
        backgroundColor:"#FFF",borderRadius:5,
        width:"90%",marginVertical: 25,
        borderColor:"black",borderWidth:0,
        shadowColor:"#000",shadowOpacity: 0.3,
        shadowRadius: 4,shadowOffset: { height:1,width:1 },elevation:5
    },
    seprator: { 
        alignSelf:"center",
        marginVertical: 25,
        borderBottomColor:"#1D1E1F",
        width:"95%",
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})
export default DetectPlatform(ExpenseByCategory,styles.container);






