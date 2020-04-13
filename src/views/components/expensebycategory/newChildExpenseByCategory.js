import React,{ Component,Fragment } from "react";
import { Text,View,TouchableOpacity,StyleSheet,ScrollView,Dimensions,ActivityIndicator } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ALL_MONTHS } from "../../../constants/constants";
import { numberWithCommas,firstLetterCapital } from "../../../api/common";
import { VictoryBar,VictoryAxis,VictoryChart,VictoryTheme } from "victory-native";
import { getExpenseByCategorySubScreenPromise } from "../../../api/api";
FontAwesome.loadFont();
AntDesign.loadFont();
MaterialCommunityIcons.loadFont();

const deviceWidth = Dimensions.get("window").width;
class ExpenseByCategoryChild extends Component{

    constructor(props){
        super(props);

        this.state = {
            showTransaction: false,
            currentExpenseCategory: {},
            error: false,
            loading: true,
            subExepenseByCategory: {}
        }
    }
    triggerExpenseSubCategoryServer = () => {
        const { expenseType,categoryId } = this.state.currentExpenseCategory;
        getExpenseByCategorySubScreenPromise(expenseType,categoryId)
        .then((response)=>{
            console.log("Trigger the sub response - ",JSON.stringify(response));
            this.setState({
                error: false,
                loading: false,
                subExepenseByCategory: response.subCategoryExpenseData
            });
        })
        .catch((error)=>{
            console.log("Error here - ",error);
            this.setState({
                error: true,
                loading: false,
                subExepenseByCategory: {}
            });
        });
    }
    componentDidMount = () => {
        const currentExpenseCategory = this.props.navigation.getParam("currentExpenseCategory");
        this.setState({ currentExpenseCategory },()=>{
            this.triggerExpenseSubCategoryServer();
        });
        
    }
    header = () => {
        const { category } = this.props.navigation.getParam("currentExpenseCategory");
        return(
            <View style={ styles.header }>
                    <View style={ styles.headerChild }>
                        <TouchableOpacity onPress={()=>{ this.props.navigation.goBack(); }} 
                        style={ styles.headerBack }>
                            <AntDesign name='left' size={22} color={'#000000'}/>
                        </TouchableOpacity>
                        <View style={{ width:"80%",justifyContent:"center",alignItems:"center" }}>
                        <Text style={{ fontSize: 19,color:"#000",fontWeight: "600" }}>
                            { `${firstLetterCapital(category)}` }
                        </Text>
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

    transactionSeprator = () => {
        return(
            <View style={ styles.seprator2 }/>
        );
    }
    renderBarChart = () => {
        const { backgroundColor: graphFillColor } = this.props.navigation.getParam("currentExpenseCategory");
       
        const fill = graphFillColor;
        const data   = [ -10,-20,-30,-40,-50,-60 ]
        return(
            <View style={{ width: "100%" }}>
                <VictoryChart width={deviceWidth - 5}
                height={270}
                domainPadding={10}
                style={{ parent: { marginLeft: -20 } }} >
                <VictoryAxis 
                    tickValues={[ 
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                        'Jan',
                        'Feb','Mar' ]}
                    
                    offsetY={255}
                    style={{
                        axis: { stroke: '#ffffff' },
                        tickLabels: { fontSize: 12,fill: (data) => {
                            return data == "Mar" ? `#1D1E1F` : `#8E8E93`;
                        } 
                        },
                    }} />
                <VictoryAxis dependentAxis
                                offsetX={deviceWidth+2}
                                style={{ 
                                    grid: { stroke: "#EEE", strokeDasharray: "50,0" },
                                    axis: { stroke: '#ffffff' },
                                    tickLabels: { fontSize: 12,fill: "#8E8E93" },
                                    }}
                                tickValues= {[ -0,-1,-2,-3,-4 ]}
                                tickFormat={(value)=>{ return `-$${-value}K`  }}
                                /> 
                <VictoryBar
                    style={{ data: { fill,opacity: (data) => {
                        console.log("-----");
                        console.log(data);
                        if(data._y == -3){
                            return 1;
                        }else{
                            return 0.3;
                        }
                    } } }}
                    data={[
                        { y:-0},
                        { y:-1},
                        { y:-1.4},
                        { y:-1.5},
                        { y:-2.2},
                        { y:-2.15},
                        { y:-2.5},
                        { y:-3},
                    ]}
                />
                </VictoryChart>
            </View>
        );
    }
    bodyChart = () => {
        
        return(
            <Fragment>
                <View style={{ height: 380,backgroundColor: "#FFF",
                    borderWidth:0,borderColor:"red" }} >

                <View style={{ alignSelf: "center",marginTop: 30 }}>

                    <Text style={{ color: "#1D1E1F",fontSize: 22,fontWeight: "bold" }}>-$3,000.00</Text>
                    <View style={{ marginTop:8,flexDirection:"row",alignSelf:"center" }}>
                        <FontAwesome name={'arrow-up'} color={"#FF784B"} />
                        <Text style={{ textAlign:"center",color: "#1D1E1F",fontSize: 10,paddingLeft: 5 }}>12% since last month</Text>
                    </View>
                </View>

                <View style={{ marginTop: 10 }}>
                    <this.renderBarChart />
                </View>
                </View>
            </Fragment>
        );
    }
    renderTransaction = () => {

        return(
            
                
                <View style={{ width: "85%",alignSelf:"center" }}>
                <View style={{ flexDirection: "row",justifyContent: "space-between" }}>

                <Text style={{ fontSize:15, color:"#1D1E1F" }}>Transaction Title</Text>
                <Text style={{ fontSize:15, color:"#1D1E1F" }}>-$500</Text>
                </View>
                <View style={{ marginLeft:2,flexDirection: "row",justifyContent: "space-between",marginTop:10  }}>
                <Text style={{ fontSize:11,color:"#1D1E1F",opacity:0.5 }}>Mar 6</Text></View>
                </View>
            
        );
    }
    renderSubCategory = () => { 

        return(
            <View style={{ backgroundColor:"#FFF",flexDirection:"column",width:"100%",alignSelf: "center"}}>
                <View style={{ width: "90%",alignSelf:'center' }}>
                <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View style={{ flexDirection:"row",alignItems:"flex-end" }}>
                    <TouchableOpacity style={{ flexDirection: "row" }} onPress={()=>{ this.setState({ showTransaction: !this.state.showTransaction }) }}>
                        <Text style={{ color: "#1D1E1F",fontSize: 15,fontWeight:"600" }}>
                        Subcategory Name
                        </Text>
                        <AntDesign name={ this.state.showTransaction == true ? 'up' : 'down' } size={15} style={{ marginLeft:10,opacity: 0.4 }} color={'#030538'}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 15, color: "#1D1E1F" }}>
                        -$1,200.00
                    </Text>
                </View>
                <View style={{ marginTop:12,flexDirection:"row",justifyContent:"space-between" }}>
                    <View style={{ flexDirection:"row" }}>
                        <FontAwesome name={"arrow-down"} color={"#FF784B"} size={10} />

                        <Text style={{ color:"#1D1E1F",fontSize:10,paddingLeft:4 }}>2.7% since previous month</Text>
                    </View>
                    <Text style={{ color:"#1D1E1F",fontSize:10 }}>
                    30% of Advertising & Marketing
                    </Text>
                </View>
                </View>

                {/* code for the transactions */}
                {
                    this.state.showTransaction == true ?
                    <View style={{ marginVertical:25,paddingVertical:25,backgroundColor:"#EEEFF1" }}>
                    <this.renderTransaction />
                        <this.transactionSeprator />
                    <this.renderTransaction />
                    </View>
                    : <this.seprator />
                }

            </View>
        );
    }
    bodyTransaction = () => {

        return(
            <Fragment>

            <View style={{ height: 25, backgroundColor: "#EEEFF1" }}></View>
            <View style={{ paddingVertical:30,backgroundColor:"#FFF" }}>
                            
                            

                            <this.renderSubCategory />
                            <this.renderSubCategory />
                            
                            

                    </View>
            </Fragment>
        );
    }
    handleReloadSubScreen = () => {
        this.setState({
            loading: true,
            error: false,
        },()=>{
            setTimeout(()=>{
                this.triggerExpenseSubCategoryServer();
            },500);
        });
    }
    loadingView = () => {

        return(
            <View style={{ flex: 1 }}>
                <this.header /> 
                <View style={{ flex:0.9,justifyContent:"center" }}>
                    <ActivityIndicator animating={true} size={"large"} color={`#070640`} />
                </View>
            </View>
        );
    }
    errorView = () => {

        return(
            <View style={{ flex : 1  }}>
                <this.header />
                <View style={{ flex:0.9,justifyContent:"center",alignItems:"center" }}>
                         <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
                        <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
                        <Text style={{ marginLeft:10,alignSelf:"center" }}>Something went wrong!</Text>
                    </View> 
                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
                        <TouchableOpacity onPress={()=>{ 
                            this.handleReloadSubScreen(); 
                            }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                            <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
                        </TouchableOpacity>
                    </View>
            </View>
            </View>
        );
    }
    renderBody = () => {

        return(
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <this.header />
                <this.bodyChart />
                <this.bodyTransaction />
            </ScrollView>
        );
    }
    render(){
        let { loading,error } = this.state;
        
        return(
            <Fragment>
                {
                    error == true ? <this.errorView /> :
                    loading == true ? <this.loadingView /> : <this.renderBody /> 
                }
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#FFF",
        width:"100%"
    },
    header: { 
        elevation:5,
        shadowColor:"#F0F0F0",
        borderBottomColor:"#F0F0F0",
        borderBottomWidth: 0.9,
        height:70,
        backgroundColor:"#F8F8F8",
        flexDirection:"row"
    },
    headerChild: { 
        flexDirection:"row",
        width:"100%",
        marginTop:20 
    },
    headerBack: { 
        paddingLeft:15,
        borderWidth:0,
        borderColor:"red",
        width:"10%",
        justifyContent:"center",
        alignItems:"flex-start" 
    },
    seprator: { 
        alignSelf:"center",
        marginVertical: 25,
        borderBottomColor:"#1D1E1F",
        width:"100%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.3
    },
    seprator2: {
        alignSelf:"center",
        marginVertical: 20,
        borderBottomColor:"#1D1E1F",
        width:"90%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.2
    }
});
export default DetectPlatform(ExpenseByCategoryChild,styles.container);