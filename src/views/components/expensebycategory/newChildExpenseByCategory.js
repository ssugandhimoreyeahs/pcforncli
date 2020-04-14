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

            subCategoryRequestType: {
                current: 0,
                maximum: 5,
                minimum: 0
            },
            currentExpenseCategory: {},
            error: false,
            loading: true,
            subExepenseByCategory: {},
            currentExpenseType: 0
        }
    }
    
    triggerExpenseSubCategoryServer = () => {
        const { categoryId } = this.state.currentExpenseCategory;
        const { subCategoryRequestType } = this.state;
        const { current } = subCategoryRequestType;
        getExpenseByCategorySubScreenPromise(current,categoryId)
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
    getCurrentExecutingMonthString = () => {
        const { currentExpenseCategory } = this.state;
        const date = new Date();
        date.setMonth(date.getMonth() - currentExpenseCategory.expenseType);
        return ALL_MONTHS[date.getMonth()];
    }
    componentDidMount = () => {
        
        const currentExpenseCategory = this.props.navigation.getParam("currentExpenseCategory");
        let { subCategoryRequestType } = this.state;
        subCategoryRequestType.current = currentExpenseCategory.expenseType;
        this.setState({ currentExpenseCategory,subCategoryRequestType,currentExpenseType:currentExpenseCategory.expenseType },()=>{
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
    getCurrentExecutingMonth = () => {
        const { current } = this.state.subCategoryRequestType;
        const date = new Date();
        date.setMonth( date.getMonth() - current);
        return date.getMonth();
    }
    changeSubCategory = ( actionType = "prev") => {
        let { subCategoryRequestType } = this.state;
        let { 
            current,maximum,minimum
         } = subCategoryRequestType;

        if(actionType == "prev"){
            if(current < maximum){
                subCategoryRequestType.current = current + 1;
                this.setState({ subCategoryRequestType,
                loading: true },()=>{
                    this.triggerExpenseSubCategoryServer();
                });
            }
        }else{
            if(current > minimum){
                subCategoryRequestType.current = current - 1;
                this.setState({ subCategoryRequestType,
                loading: true },()=>{
                    this.triggerExpenseSubCategoryServer();
                });
            }
        }
    }
    renderCurrentButton = () => {
        const { subCategoryRequestType } = this.state;
        const { current,maximum,minimum } = subCategoryRequestType;
        return(
            <View style={{  paddingHorizontal:7,alignItems:"center",         
                borderWidth:0,borderColor:"red",height:35,
                backgroundColor:"#E6E6EC",borderRadius:8,
                width: 130,alignSelf:"center",
                justifyContent:"space-between",flexDirection:"row" }}>

                <TouchableOpacity 
                style={{ opacity: current == maximum ? 0.3 : 1 }}
                disabled={ current == maximum ? true : false}
                onPress={()=>{
                    this.changeSubCategory("prev");
                }}>
                    <AntDesign name={"left"} size={17} />
                </TouchableOpacity>
                <Text>{ `${ALL_MONTHS[this.getCurrentExecutingMonth()]}` }</Text>
                <TouchableOpacity 
                style={{ opacity: current == minimum ? 0.3 : 1 }}
                disabled={ current == minimum ? true : false}
                onPress={()=>{
                    this.changeSubCategory("next");
                }}>
                    <AntDesign name={"right"} size={17}/>
                </TouchableOpacity>
            </View>
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
                    
                    offsetY={255}
                    style={{
                        axis: { stroke: '#ffffff' },
                        tickLabels: { fontSize: 12,fill: (data) => {
                            return data == this.getCurrentExecutingMonthString() ? `#1D1E1F` : `#8E8E93`;
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
                        
                        if(data._y == -3){
                            return 1;
                        }else{
                            return 0.3;
                        }
                    } } }}
                    data={[
                        { x:1,y:-1.4},
                        { x:2,y:-1.5},
                        { x:3,y:-2.2},
                        { x:4,y:-2.15},
                        { x:5,y:-2.5},
                        { x:6,y:-3},
                    ]}

                    events={[{
                    target: "data",
                    eventHandlers: {
                        onPress: () => {
                        return [
                            {
                            target: "data",
                            mutation: (props) => {
                                console.log("------Props here ------");
                                console.log(props.datum);
                                
                                // const fill = props.style && props.style.fill;
                                // return fill === "black" ? null : { style: { fill: "black" } };
                            }
                            }
                        ];
                        }
                    }
                    }]}
                />
                </VictoryChart>
            </View>
        );
    }
    bodyChart = () => {
        const { subExepenseByCategory } = this.state;
        const { ExpenseSubCategory } = subExepenseByCategory;
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
        let isSubCategoryEmpty = ExpenseSubCategory.length == 0 ? true : false;
        return(
            <Fragment>
                <View style={{ height: 380,backgroundColor: "#FFF",
                    borderWidth:0,borderColor:"red" }} >
                {
                    isSubCategoryEmpty == false ?
                    <View style={{ height:250,alignSelf: "center",marginTop: 30 }}>
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
                    </View> : <View
                    style = {{
                        borderWidth:0, borderColor:"red",
                        height:280,justifyContent:"center",alignItems:"center"
                    }}
                    >
                         <Text style={{ color:"#070640" }}>You have not spent anything this month.</Text>
                    </View>
                }
                <View style={{ marginTop: 10 }}>
                    {/* <this.renderBarChart /> */}
                    <this.renderCurrentButton />
                </View>
                </View>
            </Fragment>
        );
    }
    renderTransaction = ({ transaction,index,totalIndex }) => {
        //console.log("Total Index - ",totalIndex," inde - ",index);
        let currentTransactionDateObj = transaction.date.split("-");
        return(
            <Fragment>
                 <View style={{ width: "85%",alignSelf:"center" }}>
                <View style={{ flexDirection: "row",justifyContent: "space-between" }}>

                <Text style={{ fontSize:15, color:"#1D1E1F" }}>
                    {`${transaction.name}`}
                </Text>
                <Text style={{ fontSize:15, color:"#1D1E1F" }}>
                    {`-$${numberWithCommas(transaction.amount)}`}
                </Text>
                </View>
                <View style={{ marginLeft:2,flexDirection: "row",justifyContent: "space-between",marginTop:10  }}>
                <Text style={{ fontSize:11,color:"#1D1E1F",opacity:0.5 }}>
                {`${ALL_MONTHS[ parseInt(currentTransactionDateObj[1]) - 1 ]} ${currentTransactionDateObj[2]}, ${currentTransactionDateObj[0]}`}
                </Text></View>
                </View>
                {
                    index < totalIndex - 1  ?
                    <this.transactionSeprator /> : null
                }
            </Fragment>
        );
    }

    triggerSubCategoryClick = (index) => {
        
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
            transaction
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
        
        return(
            <View style={{ backgroundColor:"#FFF",
            flexDirection:"column",width:"100%",alignSelf: "center"}}>
                <View style={{ width: "90%",alignSelf:'center' }}>
                <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View style={{ flexDirection:"row",alignItems:"flex-end" }}>
                    <TouchableOpacity 
                      disabled={ transaction.length > 0 ? false : true }
                      style={{ flexDirection: "row" }} 
                      onPress={()=>{ 
                          this.triggerSubCategoryClick(index);
                        }}>
                        <Text style={{ color: "#1D1E1F",fontSize: 15,fontWeight:"600" }}>
                        {`${firstLetterCapital(subCategory)}`}
                        </Text>
                        {
                            transaction.length > 0 ?
                            <AntDesign name={ isVisible == true ? 'up' : 'down' } size={15} style={{ marginLeft:5,marginTop:2,opacity: 0.4 }} color={'#030538'}/>
                            : null
                        }
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
                    {
                        transaction.map((singleTransaction,index)=>{
                            return <Fragment>
                            <this.renderTransaction 
                                transaction={{ ...singleTransaction }}
                                index={index}
                                totalIndex={transaction.length}
                            />
                            </Fragment>
                        })
                    }
                    </View>
                    : <this.seprator />
                }

            </View>
        );
    }
    renderNoCategoryTransaction = ({ singleTransaction,index }) => {
        let currentTransactionDateObj = singleTransaction.date.split("-");
        return(
            <Fragment>
                <View style={{ flexDirection:"row",
                justifyContent:"space-between" }}>
                    <Text style={{ 
                        borderWidth:0,
                        borderColor:"yellow",
                        color: "#1D1E1F",
                        fontSize: 15,
                        textAlign: "left",
                        width: "70%"
                    }}>{`${singleTransaction.name}`}</Text>
                    <Text style={{
                        borderWidth:0,
                        borderColor:"yellow",
                        color: "#1D1E1F",
                        fontSize: 15,
                        textAlign: "right",
                        width: "30%"
                    }}
                    >{`-$${numberWithCommas(singleTransaction.amount)}`}</Text>
                </View>

                <View style={{ marginTop:8,flexDirection:"row",
                justifyContent:"space-between" }}>
                    <Text style={{ color: "#1D1E1F",
                        opacity: 0.5,fontSize:11,textAlign:"left"
                     }}>
                         {`${ALL_MONTHS[ parseInt(currentTransactionDateObj[1]) - 1 ]} ${currentTransactionDateObj[2]}, ${currentTransactionDateObj[0]}`}
                     </Text>
                </View>
                <this.seprator />
            </Fragment>
        );
    }
    renderWhenNoSubCategory = ({ category, index }) => {
        const {
            transaction
        } = category;
        if(transaction.length == 0){
            return null;
        }
        return(
            <View style={{
                borderColor:"red",
                borderWidth:0,
                alignSelf:"center",
                width:"90%",
                backgroundColor:"#FFF"
            }}>
                {
                    transaction.map((singleTransaction,index)=>{
                        return <this.renderNoCategoryTransaction 
                                singleTransaction={{ ...singleTransaction }}
                                key={index}
                                index={index}
                        />
                    })
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

                        if(singleCategory.subCategory.toLowerCase() === "subcategory unavailable"){
                            return <this.renderWhenNoSubCategory 
                                category={{ ...singleCategory }}
                                index={index}
                                key={index}
                            />
                        }
                        return <this.renderSubCategory key={index} index={index}
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
        const { ExpenseSubCategory } = this.state.subExepenseByCategory;
        return(
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <this.header />
                <this.bodyChart />
                {
                    ExpenseSubCategory.length > 0 ?
                    <this.bodyTransaction /> : <View style={{ height: 25, backgroundColor: "#EEEFF1" }}></View>
                }
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