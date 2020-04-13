import React,{ Component, Fragment } from "react";
import { ActivityIndicator,Text,View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image as RNImage, Platform } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart } from 'react-native-svg-charts'
import { Circle, G, Image } from 'react-native-svg'
import { connect } from "react-redux";
import { ALL_MONTHS,FULL_MONTH } from "../../../constants/constants";
import CategoryFactory from "./categoryFactory";
import { fetchMainExpenseAsyncCreator } from "../../../reducers/mainexpensecategory";
import { numberWithCommas,firstLetterCapital,PLAID_EXPENSE_CATEGORIES,getCategoryInitials } from "../../../api/common";

FontAwesome.loadFont();
AntDesign.loadFont();
MaterialCommunityIcons.loadFont();

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
    static getDerivedStateFromProps(props){
        let currentRange = props.mainExpenseByCategoryRedux.expenseType;
       
        return { requestType:{
            current: currentRange,
            maximum: 5,
            minimum: 0
        }};
    }
    readyGraphData = () => {

        const { expensesData } = this.props.mainExpenseByCategoryRedux;
        const { ExpenseByCategory } = expensesData;

        let graphArray = [];
        
        ExpenseByCategory.map((item,index)=>{
            let categoryIcon = {
                key: 0,
                amount: 0,
                svg: { fill: '#6C5BC1' },
                image: null,
                isIcon: false,
                percentage: 0
            }
            categoryIcon.key = index;
            categoryIcon.amount = item.amount;
            categoryIcon.percentage = item.percentage;
            // console.log("I am getting successfully percantage here - ",item.percentage);
            for(let i=0; i<PLAID_EXPENSE_CATEGORIES.length; i++){
                if(item.category.toLowerCase() === PLAID_EXPENSE_CATEGORIES[i].categoryName.toLowerCase()){
                    categoryIcon.svg.fill = PLAID_EXPENSE_CATEGORIES[i].categoryColor;
                    categoryIcon.image = PLAID_EXPENSE_CATEGORIES[i].categoryIcon;
                    categoryIcon.isIcon = true;
                    break;
                }
            }
            if(!categoryIcon.isIcon){
                categoryIcon.image = require("../../../assets/CategoryIcon/uncategorized3.png");
                //categoryIcon.amount = 25;
            }
            graphArray.push(categoryIcon);

        });

        return graphArray;

        
    }
    
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
                    <View style={ styles.headerChild }>
                        <TouchableOpacity onPress={()=>{ this.props.navigation.goBack(); }} 
                        style={ styles.headerBack }>
                            <AntDesign name='left' size={22} color={'#000000'}/>
                        </TouchableOpacity>
                        <View style={{ width:"80%",justifyContent:"center",alignItems:"center" }}>
                        <Text style={{ fontSize:18,color:"#000",fontWeight: "600" }}>{ `Expense by Category` }</Text>
                            
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
            this.props.fetchMainExepenseByCategory(requestType.current);
            this.setState({ requestType });
        }

    }
    switchExpensePrevRequest = () => {

        let { requestType } = this.state;
        let { current,maximum,minimum } = requestType;
        if( current < maximum ){
            requestType.current = requestType.current+1;
            this.props.fetchMainExepenseByCategory(requestType.current);
            this.setState({ requestType });
        }
        
    }
    expensePie = () => { 
        const { requestType } = this.state;
        const { current,maximum,minimum } = requestType;
        const { expensesData,isFetched } = this.props.mainExpenseByCategoryRedux;
        let { ExpenseByCategory } = expensesData;
        
        return(
           <Fragment>
               <View style={{ height: 370,backgroundColor:"#FFF" }}>
                    {
                        ExpenseByCategory.length > 0 ?
                        <this.RenderPieChart /> : 
                        <View style={{ height:335,width:"100%",justifyContent:"center",alignItems:"center" }}> 
                        <Text style={{ color:"#070640",fontWeight:"500" }}>You have not spent anything this month.</Text>
                        </View>
                    }
                    <View style={ styles.filterButton }>
                        <TouchableOpacity
                        onPress={() => {
                            this.switchExpensePrevRequest();
                        }}
                        disabled = { current == maximum }
                        style={{ opacity: current == maximum ? 0 : 1,
                            justifyContent:"center",
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
                    {/* <Text style={{ textAlign:"center" }}>{ `\n${current}` }</Text> */}
               </View>
              <this.renderCategory />
           </Fragment>
        );
    }

    renderCategory = () => {
        const { expensesData } = this.props.mainExpenseByCategoryRedux;
        const { ExpenseByCategory } = expensesData;
        return(
            <Fragment>
                {
                    ExpenseByCategory.length > 0 ?
                        <View style={ styles.categoryCart }>
                            <View style={ styles.categoryCartChild1 }>
                              {
                                ExpenseByCategory.map((singleCategory,index)=>{
                                      return <this.renderSingleCategory key={index} currentIndex={index} item={singleCategory} />
                                })
                              }
                            </View>
                        </View> : null
                }
                </Fragment>
        );
    }

    renderSingleCategory = ({ currentIndex,item }) => {
        const { expensesData,expenseType } = this.props.mainExpenseByCategoryRedux;
        const { ExpenseByCategory } = expensesData;
        
        //let categoryBackgroundColor = `#F98361`;
        let categoryIcon = {
            backgroundColor: `#F98361`,
            isIcon: false,
            iconPath: null
        }
        for(let i=0; i<PLAID_EXPENSE_CATEGORIES.length; i++){
            if(item.category.toLowerCase() === PLAID_EXPENSE_CATEGORIES[i].categoryName.toLowerCase()){
            categoryIcon.backgroundColor = PLAID_EXPENSE_CATEGORIES[i].categoryColor;
            categoryIcon.isIcon = true;
            categoryIcon.iconPath = PLAID_EXPENSE_CATEGORIES[i].categoryIcon;
            break;
            }
        }

        let isShowUpDownIcon = {};
        isShowUpDownIcon.isShow = false;
        isShowUpDownIcon.iconType = ``;
        isShowUpDownIcon.text = ``;
        isShowUpDownIcon.iconColor = ``;
        if(item.isUp != null && item.isDown == null){
            isShowUpDownIcon.isShow = true;
            isShowUpDownIcon.iconType = `arrow-up`;
            isShowUpDownIcon.text = item.isUp;
            isShowUpDownIcon.iconColor = `#FF784B`;
        }else if(item.isUp == null && item.isDown != null){
            isShowUpDownIcon.isShow = true;
            isShowUpDownIcon.iconType = `arrow-down`;
            isShowUpDownIcon.text = item.isDown;
            isShowUpDownIcon.iconColor = `#1188DF`;
        }
        return(
           <Fragment>
                <View style={ styles.categoryRenderCart }>
                    <View style={ styles.categoryIconStyle }>
                    {
                        categoryIcon.isIcon == true ?
                          <RNImage 
                          style={{ height: 40, width: 40 }}
                          source={ categoryIcon.iconPath }/>
                        :
                        <View style={{ borderRadius:50,borderColor: categoryIcon.backgroundColor,
                            justifyContent:"center",alignItems:"center",height: 40, width: 40,backgroundColor: categoryIcon.backgroundColor }}>
                            <Text style={{ color:'#FFF',fontSize:18 }}>
                                        {
                                            getCategoryInitials(item.category)
                                        }
                            </Text>
                        </View>
                    }
                    </View>

                    <View style={ styles.categoryRenderStyle }>
                        <View style={ styles.categoryTitleAmount }>
                            <Text style={ styles.categoryText }>
                                {`${firstLetterCapital(item.category)}`} 
                                {/* {`${CategoryFactory.getCategoryName(item.categoryId)}`} */}
                            </Text>
                            <Text style={ styles.categoryAmount }>
                                {`-$${numberWithCommas(item.amount)}`}
                            </Text>
                        </View>

                        <View style={ styles.categoryTitleAmount }>
                            <Text style={{ ...styles.categoryHikeStyle,
                                borderWidth:0,borderColor:"red",
                                width:"70%",textAlign:"left"
                            }}>
                                {
                                    isShowUpDownIcon.isShow == true ?
                                    <FontAwesome 
                                    name={`${isShowUpDownIcon.iconType}`} 
                                    color={`${isShowUpDownIcon.iconColor}`} />
                                    : null    
                                }
                                {
                                    isShowUpDownIcon.isShow == true ?
                                    ` ${isShowUpDownIcon.text} since previous month`  : null
                                }
                                </Text>
                                <Text style={{ ...styles.categoryHikeStyle,
                                textAlign:"right",
                                borderWidth:0,borderColor:"red",width:"30%"
                                }}>
                                    {`${item.percentage}% of total`}
                            </Text>
                        </View>
                        </View>


                    <TouchableOpacity 
                    onPress={()=>{
                        this.props.navigation.navigate("NewExpenseByCategoryChild",{
                            currentExpenseCategory: {
                                ...item,
                                ...categoryIcon,
                                expenseType
                            }
                        });
                    }}
                    style={ styles.nextButtonStyle }>
                        <AntDesign size={16} name={"right"} color={"#030538"} style={{ opacity: 0.5 }} />
                    </TouchableOpacity>

                    </View>
                    {
                        currentIndex < ExpenseByCategory.length - 1 ?
                        <this.seprator /> : null
                    }
           </Fragment>
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
                //code to check that the percentage is greater than 30
                //for rendering the image
                if(data.percentage < 30)
                    return false;
                return (
                    <G
                        key={index}
                        x={labelCentroid[ 0 ]}
                        y={labelCentroid[ 1 ]}
                    >
                        <Image
                            href={data.image}
                            x={-18}
                            y={-18}
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
        const { expensesData } = this.props.mainExpenseByCategoryRedux;
        let isShowUpDownIcon = {};
        isShowUpDownIcon.isShow = false;
        isShowUpDownIcon.iconType = ``;
        isShowUpDownIcon.text = ``;
        isShowUpDownIcon.iconColor = ``;
        if(expensesData.isUp != null && expensesData.isDown == null){
            isShowUpDownIcon.isShow = true;
            isShowUpDownIcon.iconType = `arrow-up`;
            isShowUpDownIcon.text = expensesData.isUp;
            isShowUpDownIcon.iconColor = `#FF784B`;
        }else if(expensesData.isUp == null && expensesData.isDown != null){
            isShowUpDownIcon.isShow = true;
            isShowUpDownIcon.iconType = `arrow-down`;
            isShowUpDownIcon.text = expensesData.isDown;
            isShowUpDownIcon.iconColor = `#1188DF`;
        }

        //isShowUpDownIcon.isShow = true;
        return(
            <PieChart
                style={ styles.pieChartParent }
                valueAccessor={({ item }) => item.amount}
                data={this.readyGraphData()}
                // spacing={10}
                outerRadius={'65%'}
                innerRadius={'59%'}
            >   
                <this.Labels/>
                <View style={styles.piechartText}>
                    <Text style={ styles.piechartUpperText }>
                        { `Total Spending\nin ${FULL_MONTH[this.getDynamicMonth()]}` }
                    </Text>
                    <Text style={ styles.piechartCenterText}>
                        { `-$${numberWithCommas(expensesData.amount)}` }
                    </Text>
                
                    {
                        isShowUpDownIcon.isShow == false ? 
                        <View style={{ marginTop:31 }}/> :
                        <Fragment>
                            <View style={ styles.piechartButtomTextView }>
                            <FontAwesome name={`${isShowUpDownIcon.iconType}`} 
                            color={`${isShowUpDownIcon.iconColor}`} size={14}/>
                            <Text style={{ textAlign:"center",fontSize:12,color:"#1D1E1F",paddingLeft:5 }}>
                                `${isShowUpDownIcon.text}`
                            </Text>
                            </View>
                            <Text style={{ textAlign:"center",color:"#1D1E1F",opacity:0.5 }}>
                                since last month
                            </Text>
                        </Fragment>
                    }
                </View>
            </PieChart>
        );
    }
    handleReloadMainExpenseByCategory = () => {
        const { requestType } = this.state;
        this.props.fetchMainExepenseByCategory(requestType.current);
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
                        <TouchableOpacity onPress={()=>{ this.handleReloadMainExpenseByCategory(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                            <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Try Again</Text></View>
                        </TouchableOpacity>
                    </View>
            </View>
            </View>
        );
    }
    loaderView = () => {

        return(
            <View style={{ flex: 1 }}>
                <this.header /> 
                <View style={{ flex:0.9,justifyContent:"center" }}>
                    <ActivityIndicator animating={true} size={"large"} color={`#070640`} />
                </View>
            </View>
        );
    }
    loadExpenseScreen = () => {
        return(
            <ScrollView style={{ flex:1 }}>
                <this.header />
                <this.expensePie />
            </ScrollView>
        );
    }
    render(){
        let { error,loader,isFetched } = this.props.mainExpenseByCategoryRedux;
        
        return(
            <Fragment>
                {
                    error == true ? <this.errorView /> 
                    : loader == true ? <this.loaderView />
                    : isFetched == true ? <this.loadExpenseScreen />
                    : null
                }
            </Fragment>
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
    categoryCart: { 
        backgroundColor:"#FFF",
        borderRadius:5,
        width:"90%",
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
        marginVertical: 22,
        borderBottomColor:"#1D1E1F",
        width:"95%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.2
    },
    filterButton:{
        paddingHorizontal:12,
        borderRadius:10,
        height:40,
        backgroundColor:"#E6E6EC",
        alignSelf:"center",
        marginTop: -40,
        width: 160,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    categoryIconStyle:{ 
        width:"14%",
        borderColor: "red",
        borderWidth: 0
    },
    categoryRenderStyle: { 
        paddingRight:5,
        paddingLeft:9,
        width: "80%",
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
        width: "90%",
        alignSelf:"center" 
    },
    categoryTitleAmount: { 
        flexDirection:"row",
        justifyContent:"space-between" 
    },
    categoryText: { 
        width:"60%",
        fontWeight:"600",
        fontSize:14,
        color: "#1D1E1F" 
    },
    categoryHikeStyle: { 
        fontSize:10,
        color: "#1D1E1F" 
    },
    categoryAmount: { 
        fontSize:15,
        color: "#1D1E1F",
        fontWeight:"500" 
    },
    pieChartParent: { 
        borderWidth:0,borderColor:"red",
        marginHorizontal:24,
        height: 390,
        marginTop: Platform.OS == "ios" ? -60 : -45 
    },
    categoryRenderCart: { 
        flexDirection: "row", 
        justifyContent:"space-between" 
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






// return data = [
//     {
//         key: 1,
//         amount: 40,
//         svg: { fill: '#FBBC10' },
//         image: require("../../../assets/CategoryIcon/vehicle2.png")
//     },
//     {
//         key: 2,
//         amount: 40,
//         svg: { fill: '#E89200' },
//         image: require("../../../assets/CategoryIcon/payroll2.png")
//     },
//     {
//         key: 3,
//         amount: 15,
//         svg: { fill: '#AA9637' },
//         image: require("../../../assets/CategoryIcon/membership_fees2.png")
//     },
//     {
//         key: 4,
//         amount: 8,
//         svg: { fill: '#7785E9' },
//         image: require("../../../assets/CategoryIcon/charitable_contributions2.png")
//     },
//      {
//         key: 5,
//         amount: 5,
//         svg: { fill: '#EA727A' },
//         image: require("../../../assets/CategoryIcon/charitable_contributions2.png")
//     }
// ]