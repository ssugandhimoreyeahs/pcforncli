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
            
            this.setState({
                error: false,
                loading: false,
                subExepenseByCategory: response.subCategoryExpenseData
            });
        })
        .catch((error)=>{
            
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
        const { subExepenseByCategory } = this.state;
        let iconObj = {};
        iconObj.visible = false;
        iconObj.type = ``;
        iconObj.color = ``;
        iconObj.text = ``;
        if(subExepenseByCategory.isUp != null && subExepenseByCategory.isDown == null){
            iconObj.visible = true;
            iconObj.type = `arrow-up`;
            iconObj.color = `#FF784B`;
            iconObj.text = subExepenseByCategory.isUp;
        }else if(subExepenseByCategory.isUp == null && subExepenseByCategory.isDown != null){
            iconObj.visible = true;
            iconObj.type = `arrow-down`;
            iconObj.color = `#1188DF`;
            iconObj.text = subExepenseByCategory.isDown;
        }
        return(
            <Fragment>
                <View style={{ height: 380,backgroundColor: "#FFF",
                    borderWidth:0,borderColor:"red" }} >
                <View style={{ alignSelf: "center",marginTop: 30 }}>
                    <Text style={{ textAlign:"center",color: "#1D1E1F",fontSize: 22,fontWeight: "bold" }}>
                        { `-$${numberWithCommas(subExepenseByCategory.totalAmount)}` }
                    </Text>
                    {
                        iconObj.visible == true ?
                        <View style={{ marginTop:8,flexDirection:"row",alignSelf:"center" }}>
                        <FontAwesome name={`${iconObj.type}`} color={`${iconObj.color}`} />
                        <Text style={{ textAlign:"center",color: "#1D1E1F",fontSize: 10,paddingLeft: 5 }}>
                            { `${iconObj.text} since last month` }
                        </Text>
                        </View> : <View style={{ marginTop: 8 }} />
                    }
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

    triggerSubCategoryClick = (index) => {
        console.log("Trigger here for the sub tra - ",index);
        const { subExepenseByCategory } = this.state;
        let { ExpenseSubCategory } = subExepenseByCategory;
        ExpenseSubCategory[index].isVisible = !ExpenseSubCategory[index].isVisible;
        this.setState({
            subExepenseByCategory: {
                ...subExepenseByCategory,
                ExpenseSubCategory
            }
        });
    }
    renderSubCategory = ({ category,index }) => { 
        const {
            subCategory,
            total,
            percentage,
            isUp,
            isDown,
            isVisible,
            ExpenseSubCategory
        } = category;
        const currentExpenseCategory = this.state.currentExpenseCategory;
        
        let iconObj = {};
        iconObj.visible = false;
        iconObj.type = ``;
        iconObj.color = ``;
        iconObj.text = ``;
        if(isUp != null && isDown == null){
            iconObj.visible = true;
            iconObj.type = `arrow-up`;
            iconObj.color = `#FF784B`;
            iconObj.text = isUp;
        }else if(isUp == null && isDown != null){
            iconObj.visible = true;
            iconObj.type = `arrow-down`;
            iconObj.color = `#1188DF`;
            iconObj.text = isDown;
        }
        //iconObj.visible = false;
        return(
            <View style={{ backgroundColor:"#FFF",flexDirection:"column",width:"100%",alignSelf: "center"}}>
                <View style={{ width: "90%",alignSelf:'center' }}>
                <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View style={{ flexDirection:"row",alignItems:"flex-end" }}>
                    <TouchableOpacity style={{ flexDirection: "row" }} 
                      onPress={()=>{ 
                          this.triggerSubCategoryClick(index);
                        }}>
                        <Text style={{ color: "#1D1E1F",fontSize: 15,fontWeight:"600" }}>
                        {`${firstLetterCapital(subCategory)}`}
                        </Text>
                        <AntDesign name={ isVisible == true ? 'up' : 'down' } size={15} style={{ marginLeft:10,opacity: 0.4 }} color={'#030538'}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 15, color: "#1D1E1F" }}>
                        {`-$${numberWithCommas(total)}`}
                    </Text>
                </View>
                <View style={{ marginTop:12,flexDirection:"row",justifyContent:"space-between" }}>
                    <View style={{ 
                        width:"55%",
                        borderWidth:0,borderColor:"red",flexDirection:"row" }}>
                        {
                            iconObj.visible == true ?
                            <Fragment>
                            <FontAwesome size={10}
                            name={`${iconObj.type}`} 
                            color={`${iconObj.color}`} />
                            <Text style={{ color:"#1D1E1F",fontSize:10,paddingLeft:4 }}>
                                 { `${iconObj.text}% since previous month` }
                            </Text>
                            </Fragment> : null
                        }
                    </View>
                    <Text style={{ 
                        textAlign:'right',
                        borderColor:"red",borderWidth:0,
                        color:"#1D1E1F",fontSize:10,width:"45%", }}>
                     { `${percentage}% of ${firstLetterCapital(currentExpenseCategory.category)}` }
                    </Text>
                </View>
                </View>

                {/* code for the transactions */}
                {
                    isVisible == true ?
                    <View style={{ 
                        marginVertical:25,
                        paddingVertical:25,
                        backgroundColor:"#EEEFF1" 
                    }}>
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
        const { subExepenseByCategory } = this.state;
        const { ExpenseSubCategory } = subExepenseByCategory;
        return(
            <Fragment>
            <View style={{ height: 25, backgroundColor: "#EEEFF1" }}></View>
            <View style={{ paddingVertical:30,backgroundColor:"#FFF" }}>
                 {
                    ExpenseSubCategory.map((singleCategory,index)=>{
                        return <this.renderSubCategory index={index}
                            category={{ ...singleCategory }}
                        />
                    })
                 }
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