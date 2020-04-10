import React,{ Component, Fragment } from "react";
import { Text,View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart } from 'react-native-svg-charts'
import { Circle, G, Image } from 'react-native-svg'
import { connect } from "react-redux";
import { ALL_MONTHS,FULL_MONTH } from "../../../constants/constants";
import CategoryFactory from "./categoryFactory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";

FontAwesome.loadFont();
AntDesign.loadFont();

const deviceWidth = Dimensions.get('window').width

class ExpenseByCategory extends Component{

    constructor(props){
        super(props);

        this.state = {

            requestType:{
                current: 0,
                maximum: 5,
                minimum: 0
            }
        }
    }
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
            image: require("../../../assets/CategoryIcon/membership_fees2.png")
        },
        {
            key: 4,
            amount: 8,
            svg: { fill: '#7785E9' },
            image: require("../../../assets/CategoryIcon/charitable_contributions2.png")
        },
         {
            key: 5,
            amount: 5,
            svg: { fill: '#EA727A' },
            image: require("../../../assets/CategoryIcon/charitable_contributions2.png")
        }
    ]
    getDynamicMonth = () => {
        let { requestType } = this.state;
        let currentDateObj = new Date();
        currentDateObj.setMonth( currentDateObj.getMonth() - requestType.current);
        return currentDateObj.getMonth();
    }   
    componentDidMount = () => {
        
    }
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

    switchExpenseNextRequest = () => {

        let { requestType } = this.state;
        let { current,maximum,minimum } = requestType;
        if( current >= minimum ){
            requestType.current = requestType.current-1;
            this.setState({ requestType });
        }

    }
    switchExpensePrevRequest = () => {

        let { requestType } = this.state;
        let { current,maximum,minimum } = requestType;
        if( current < maximum ){
            requestType.current = requestType.current+1;
            this.setState({ requestType });
        }
        
    }
    expensePie = () => { 
        const { requestType } = this.state;
        const { current,maximum,minimum } = requestType;
        return(
           <Fragment>
               <View style={{ height: 350,backgroundColor:"#FFF" }}>
                    
                    <this.RenderPieChart />

                    <View style={ styles.filterButton }>

                        <TouchableOpacity
                        onPress={() => {
                            this.switchExpensePrevRequest();
                        }}
                        disabled = { current == maximum }
                        style={{ opacity: current == maximum ? 0 : 1,justifyContent:"center",
                            borderColor:"red",borderWidth:0 }}
                        ><AntDesign color={"#030538"} name={"left"} size={15}></AntDesign></TouchableOpacity>
                        <Text style={{ alignSelf:"center",color:"#030538",fontSize: 12 }}>
                        {
                            current == 0 ? "This Month" : ALL_MONTHS[this.getDynamicMonth()]
                        }
                        </Text>
                        <TouchableOpacity
                        onPress={() => {
                            this.switchExpenseNextRequest();
                        }}
                        disabled = { current == minimum }
                        style={{ opacity: current == 0 ? 0 : 1,justifyContent:"center",
                            borderColor: "red", borderWidth:0 }}
                        ><AntDesign name={"right"} color={"#030538"} size={15}></AntDesign>
                        </TouchableOpacity>
                        
                    </View>
                    <Text style={{ textAlign:"center" }}>{ `\n${current}` }</Text>
               </View>
              <this.renderCategory />
           </Fragment>
        );
    }

    renderCategory = () => {

        return(
                <View style={ styles.categoryCart }>
                    <View style={ styles.categoryCartChild1 }>
                        <this.renderSingleCategory  />
                        <this.seprator />
                    </View>
                </View>
        );
    }

    renderSingleCategory = () => {
        
        return(
            <View style={{ flexDirection: "row", justifyContent:"space-between" }}>

             <View style={ styles.categoryIconStyle }>
             <View style={{ height: 50, width: 50, borderRadius: 50,
                backgroundColor: "#A599EC" 
             }}></View>
             </View>
            
            <View style={ styles.categoryRenderStyle }>
                     <View style={ styles.categoryTitleAmount }>
                         <Text style={ styles.categoryText }>
                         {'Employee Benefits'} </Text>
                         <Text style={ styles.categoryAmount }>
                         {'-$9,290,256'}</Text>
                    </View>

                    <View style={ styles.categoryTitleAmount }>
                         <Text style={ styles.categoryHikeStyle }>
                         <FontAwesome name={"arrow-up"} color={"#FF784B"}/>
                         {' 2.7% since previous month'} </Text>
                         <Text style={ styles.categoryHikeStyle }>
                         {'33% of total'}</Text>
                    </View>
                 </View>
             

             <TouchableOpacity style={ styles.nextButtonStyle }>
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
                <View style={styles.piechartText}>
                    <Text style={ styles.piechartUpperText }>
                        { `Total Spending\nin ${FULL_MONTH[this.getDynamicMonth()]}` }
                    </Text>
                    <Text style={ styles.piechartCenterText}>-$52,112.27</Text>
                
                    <View style={ styles.piechartButtomTextView }>
                    <FontAwesome name={'arrow-up'} color={"#FF784B"} size={14}/>
                    <Text style={{ textAlign:"center",fontSize:12,color:"#1D1E1F",paddingLeft:5 }}>7.21%</Text>
                    </View>
                    <Text style={{ textAlign:"center",color:"#1D1E1F",opacity:0.5 }}>since last month</Text>
                </View>
            </PieChart>
        );
    }
    render(){
        console.log("------here - ");
        console.log(this.props.mainExpenseByCategoryRedux);
        return(
            <ScrollView style={{ flex:1 }}>
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
        borderBottomColor:"#F0F0F0",
        borderBottomWidth: 1.5,
        height:70,
        backgroundColor:"#F8F8F8",
        flexDirection:"row"
    },
    categoryCart: { 
        backgroundColor:"#FFF",
        borderRadius:5,
        width:"93%",
        marginVertical: 25,
        borderColor:"#000",borderWidth:0,
        shadowColor:"#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { height:1,width:1 },
        elevation:5,
        alignSelf:"center"
    },
    seprator: { 
        alignSelf:"center",
        marginVertical: 25,
        borderBottomColor:"#1D1E1F",
        width:"95%",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    filterButton:{
        paddingHorizontal:12,
        borderRadius:10,
        height:40,
        backgroundColor:"#E6E6EC",
        alignSelf:"center",
        marginTop: -50,
        width: 160,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    categoryIconStyle:{ 
        width:"16%",
        borderColor: "red",
        borderWidth: 0
    },
    categoryRenderStyle: { 
        paddingHorizontal:3,
        width: "76%",
        justifyContent:"space-between",
        borderColor:"#000",borderWidth:0
    },
    nextButtonStyle: { 
        justifyContent: "center",
        width: "5%",
        borderColor: "red",borderWidth: 0
    },
    piechartText: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    piechartUpperText: {
         textAlign:"center",
         color: "#1D1E1F",
         opacity: 0.5,
         marginTop:-5,
         lineHeight:18 
    },
    piechartCenterText: { 
        textAlign:"center",
        color: "#1D1E1F",
        fontSize: 23,
        marginVertical:18,
        fontWeight:"bold" 
    },
    piechartButtomTextView: { 
        borderColor:"blue",borderWidth:0,
        flexDirection:"row",
        justifyContent:"space-between",paddingVertical:3
    },
    categoryCartChild1: { 
        paddingVertical:30,
        width: "93%",
        alignSelf:"center" 
    },
    categoryTitleAmount: { 
        flexDirection:"row",
        justifyContent:"space-between" 
    },
    categoryText: { 
        width:"60%",
        fontWeight:"600",
        fontSize:15,
        color: "#1D1E1F" 
    },
    categoryHikeStyle: { 
        fontSize:10,
        color: "#1D1E1F" 
    },
    categoryAmount: { 
        fontSize:15,
        color: "#1D1E1F" 
    }
})

const mapStateToProps = (state) => {
    return {
        //expenseByCategoryRedux: state.expenseByCategory,
        categoryReduxData: state.plaidCategoryData,
        mainExpenseByCategoryRedux: state.mainExpenseByCategory
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMainExepenseByCategory: (type = 0) => { dispatch(fetchMainExpenseAsyncCreator(type)) },
        //staggingData: (staggingDataParam) => { dispatch(staggingDataParam); }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DetectPlatform(ExpenseByCategory,styles.container));






