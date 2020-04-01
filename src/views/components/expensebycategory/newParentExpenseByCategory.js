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

                    
                    
                    <RenderPieChart />
                    
               </View>

               <this.renderCategory />
           </Fragment>
        );
    }

    renderCategory = () => {

        return(
            <View style={{ alignItems:"center" }}>
                    <View style={ styles.categoryCart }>
                        <View style={{ paddingVertical:35,width: "92%",alignSelf:"center" }}>
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
                borderWidth:0,borderColor:"red",
                height:45,flexDirection:"row"}}>

                <View style={{ 
                    borderWidth:0,borderColor:"violet",
                    flexDirection:"row",width:"69%" }}>
                    
                    {/* Image View Here */}
                    <View style={{ justifyContent:"center",
                    alignItems:"center",
                    borderRadius:50,height: 40,width: 40,
                    backgroundColor:"#FEBC0F" }}
                    ><Text style={{ color:"#FFF" }}>Icon</Text></View>

                    <View style={{ marginLeft:10,justifyContent:"space-between" }}>
                        <Text style={{ color:"#1D1E1F",fontSize:15 }}>Payroll</Text>
                        <View style={{ flexDirection:"row" }}>
                        <FontAwesome name={'arrow-up'} color={"#FF784B"} />
                        <Text style={{ color:"#1D1E1F",fontSize: 10,marginLeft:5 }}>
                            2.7% since previous month
                        </Text>
                        </View>
                    </View>

                </View>

                <View style={{ 
                    borderWidth:0,borderColor:"indigo",
                    flexDirection:"row",width:"30%" }}>

                    <View style={{ width:"72%",justifyContent:"space-between"
                    ,flexDirection:"column",alignItems:"flex-end"
                    }}>

                    <Text style={{ textAlign:"right",color:"#1D1E1F",fontSize:15 }}>-$6,500</Text>
                    <Text style={{ textAlign:"right",color:"#1D1E1F",fontSize: 10 }}>40% of total</Text>
                    </View>
                    
                    <View style={{ width:"26%",justifyContent:"center",alignItems:"flex-end"}}>
                    <TouchableOpacity onPress={()=>{ this.props.navigation.goBack(); }} >
                                <AntDesign
                                style={{ opacity: 30 }} 
                                name='right' size={14} color={'#030538'}/>
                    </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
    seprator = () => {
        
        return(
            <View style={ styles.seprator }/>
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
        elevation:10,
        shadowColor:"#F0F0F0",
        borderBottomColor:"#F0F0F0",borderBottomWidth: 2,
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






class RenderPieChart extends React.PureComponent {

    render() {

        const data = [
            {
                key: 1,
                amount: 35,
                svg: { fill: '#FBBC10' },
            },
            {
                key: 2,
                amount: 30,
                svg: { fill: '#FB7E01' }
            },
            {
                key: 3,
                amount: 15,
                svg: { fill: '#A599EC' }
            },
            {
                key: 4,
                amount: 10,
                svg: { fill: '#7785E9' }
            },
            {
                key: 5,
                amount: 5,
                svg: { fill: '#EA727A' }
            }
        ]

        const Labels = ({ slices, height, width,data }) => {
            console.log("data recieved - ",data);
            return slices.map((slice, index) => {
                if(data[index].amount > 25){
                    const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <G
                        key={index}
                        x={labelCentroid[ 0 ]}
                        y={labelCentroid[ 1 ]}
                    >
                        <Circle
                            r={15}
                            fill={'white'}
                        />
                        <Image
                            source={{ url: `https://image.shutterstock.com/image-vector/letter-c-negative-space-logo-600w-503463199.jpg` }}
                            x={-10}
                            y={10}
                            width={10}
                            height={10}
                            preserveAspectRatio="xMidYMid slice"
                            opacity="1"
                            
                        />
                    </G>
                )
                }
            })
        }

        return (
            <View style={{  }}>
                <PieChart
                style={{ height: 360,marginTop: -45 }}
                valueAccessor={({ item }) => item.amount}
                data={data}
                // spacing={10}
                outerRadius={'60%'}
                innerRadius={'50%'}
            >   
                <Text style={{ position:"relative" }}>hello</Text>
                <Labels/>
                
            </PieChart>
            </View>
        )
    }

}


