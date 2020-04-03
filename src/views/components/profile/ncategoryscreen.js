import React,{ Component,Fragment } from "react";
import { Text,View,TouchableOpacity,StyleSheet,ScrollView,Image,ActivityIndicator } from "react-native";
import  DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import ToggleSwitch from 'toggle-switch-react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import IconImage from "../../../assets/CategoryIcon/advertise3.png"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import { fetchExpensesAsyncCreator  } from "../../../reducers/expensecategory";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
import { addPlaidCategory, deletePlaidCategory, editPlaidCategory,addCategoryToTransaction } from "../../../api/api";
AntDesign.loadFont();
EvilIcons.loadFont();
MaterialCommunityIcons.loadFont();

class CategoryScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            toggle: false,
            isEdit: false
        }
    }
    handleHeaderButton = () => {
        const { isEdit } = this.state;
        if(isEdit){
            this.setState({ isEdit: false });
        }else{
            this.props.navigation.goBack();
        }
    }
    header = () => {
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        // error = true;
        const { isEdit } = this.state;
        let antDesignIcon = isEdit == true ? `close` : 'left'
        return(
            <View style={ styles.header }>
                    <View style={{ 
                            //borderWidth:1,borderColor:"red",
                            flexDirection:"row",justifyContent:'space-between',         
                            width: "92%",marginTop:30,alignSelf:"center",alignItems:"center" }}>
                       
                    <TouchableOpacity  onPress={()=>{ this.handleHeaderButton(); }} >
                                <AntDesign name={`${antDesignIcon}`} size={22} color={'#000000'}/>
                    </TouchableOpacity>

                     <Text style={{ fontSize:17,color:"#000" }}>Select Category</Text>
                    {
                       error == true ?
                       <View style={{ width: 35 }}></View> : 
                       isEdit == true ?
                        <View style={{ width: 35 }}></View> : 
                        <TouchableOpacity style={{ paddingRight:2,width: 35 }} onPress={()=>{ this.setState({ isEdit:true }); }} >
                    
                                <Text style={{ color:"#4A90E2",fontSize:17 }}>Edit</Text>
                        </TouchableOpacity>
                    }
                    
                    </View>
                </View> 
        );
    }

    addCategory = () => {
        const { isEdit } = this.state;
        return(
            <View style={{ paddingHorizontal:10,paddingVertical:17,marginTop: 25,height: 70, backgroundColor: "#FFF",width:"90%",alignSelf:"center"
                ,borderRadius: 5,flexDirection:"row",justifyContent:"space-between"
             }}>
                    {
                        isEdit == false ? 
                        <Fragment>
                                <View
                            style={{ width:"77%",flexDirection:"column",justifyContent:"space-between" }}
                            ><Text style={{ fontSize:11,color:"#000",fontWeight:"600" }}>
                                Apply change to all similar transactions
                            </Text>
                            <Text style={{ fontSize:10,color:"#000" }}>Name of Recipient</Text>
                            </View>

                            <View style={{ width:"25%" }}>

                            <ToggleSwitch
                                    isOn={this.state.toggle}
                                    onColor="limegreen"
                                    offColor="#999"
                                    size="large"
                                    onToggle={ isOn => { this.setState({ toggle: !this.state.toggle }) } }
                            />
                            </View>
                        </Fragment> : 
                        <TouchableOpacity style={{ justifyContent:"center",paddingLeft:4 }}>
                            <Text style={{ fontSize:13,color:"#000",fontWeight:"600" }}>Add Category</Text>
                        </TouchableOpacity>
                    }
            </View>
        );
    }
    seprator = () => {
        return(
            <View style={ styles.seprator } />
        );
    }
    renderSingleCategory = ({ categoryData }) => {
        let executingTransactionDetails = this.props.navigation.getParam("currentExecutingTransaction");
        const { isEdit } = this.state;
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        let { categoryName,index,customcategories } = categoryData;
        return(
            <Fragment>
             {
                 isEdit == false ? 
                 <TouchableOpacity style={{ flexDirection:"row",
                 justifyContent:"space-between",
                 width:"93%" }}>
                    
                    <View style={{ width:"15%" }}><Image source={IconImage} height={36} width={36} style={{ height: 36, width: 36 }}/></View>

                    <View style={{ width:"79%",
                        borderWidth:0,borderColor:"red",
                        justifyContent: "center",paddingLeft:13 }}>
                        <Text style={{ 
                            textAlign:"left",
                            fontSize:12,
                            color: "#000", 
                            fontWeight: "600" }}>
                             { categoryName }
                        </Text>
                    </View>
                    {
                        categoryName == executingTransactionDetails.category ?
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"center" }}>
                            <MaterialIcons name='check' size={20} color={'#000000'}/>
                        </View>
                        :
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"center" }}></View>
                    }
                </TouchableOpacity>
                :
                <View style={{ flexDirection:"row",justifyContent:"space-between",width:"95%" }}>

                <View style={{ width:"15%" }}><Image source={IconImage} height={36} width={36} style={{ height: 36, width: 36 }}/></View>

                    <View style={{ width:"70%",
                        borderWidth:0,borderColor:"red",
                        justifyContent: "center",paddingLeft:8 }}>
                        <Text style={{ 
                            textAlign:"left",
                            fontSize:12,
                            color: "#000", 
                            fontWeight: "600" }}>
                             { categoryName }
                        </Text>
                    </View>

                    <View style={{ width:"15%",
                        flexDirection:"row",
                        justifyContent:"center",
                        alignItems:"center" }}>
                    
                        {
                            customcategories == true ?
                            <Fragment>
                                <TouchableOpacity style={{ paddingRight:7 }}>
                                    <EvilIcons name='pencil' size={23} color={'#000'}/>
                                </TouchableOpacity>
                                
                                <TouchableOpacity>
                                    <MaterialIcons name='delete' size={23} color={'#000'}/>
                                </TouchableOpacity>
                            </Fragment> : null
                        }
                    </View>
                
                </View>
             }
             {
                category.length - 1 > index ?
                 <this.seprator /> : null
             }
            </Fragment>
        );
    }
    renderCategories = () => {

        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        return(
            <View style={ styles.categoryBlock }>
                {
                    category.map((singleCategory,index)=>{
                        return <this.renderSingleCategory 
                        key={index} 
                        categoryData={{ ...singleCategory,index }} />
                    })
                }
            </View>
        );
    }

    handleReloadCategories = () => {

        this.props.fetchPlaidCategoryDispatch();
    }
    errorView = () => {

        return(
            <View style={{ width:"100%",
                height:"85%",justifyContent:"center",alignSelf:"center",
                borderColor:"red",borderWidth:2 }}>

            
            
            <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} >
                <AntDesign name="exclamationcircle" size={20} style={{ color:'#070640',alignSelf:"center" }}/>
                <Text style={{ marginLeft:10,alignSelf:"center" }}>Something went wrong!</Text>
            </View> 
            <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:15 }}>
                <TouchableOpacity onPress={()=>{ this.handleReloadCategories(); }} style={{ height:35,width:170,borderRadius:20,backgroundColor:"#090643",borderColor:"#090643",borderWidth:2,justifyContent:"center",alignItems:"center" }}>
                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }} ><MaterialCommunityIcons style={{ marginTop:4 }} name='reload' size={20} color="white"/><Text style={{ color:"white",paddingLeft:5 }}>Reload</Text></View>
                </TouchableOpacity>
            
         </View> 
            </View>
        );
    }
    renderBody = () => {
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        
        return(
            <ScrollView>
                        <this.header /> 
                        <this.addCategory />
                        {
                            loading == false ?
                            <this.renderCategories />
                            :
                            <ActivityIndicator 
                                style = {{ marginTop:50 }}
                                animating={true} 
                                size={"large"}
                            />
                        }
            </ScrollView>
        );
    }
    render(){
        // console.log("getting all redux data here -");
        // console.log(this.props.categoryReduxData);
        // console.log("ends here----");
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        
        return(
            <Fragment>
                {
                    error == true ? <Fragment>
                        <this.header /> 
                        <this.errorView />
                    </Fragment> 
                    :  <this.renderBody />
                }
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#EFEFF1",
        height:"100%",width:"100%"
    },
    header: { 
        elevation:5,
        shadowColor:"#F0F0F0",
        borderBottomColor:"#F0F0F0",borderBottomWidth: 1.5,
        height:70,backgroundColor:"#F8F8F8"
    },
    seprator: { 
        marginVertical: 16,
        borderBottomColor:"#1D1E1F",
        opacity:0.2,
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    categoryBlock: { 
    backgroundColor:"#FFF",borderRadius:5,
    width:"90%",marginTop: 25,marginBottom:40,
    borderColor:"black",borderWidth:0,
    shadowColor:"#000",shadowOpacity: 0.3,
    shadowRadius: 4,shadowOffset: { height:1,width:1 },
    elevation:5,
    paddingLeft:18,
    paddingRight:15,
    paddingTop:20,
    paddingBottom: 30,
    alignSelf:"center"
    }
})

const mapStateToProps = state => {
    return {
        categoryReduxData: state.plaidCategoryData
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlaidCategoryDispatch: () => {  dispatch(triggerPlaidCategoryAsync())  },
        fetchExpenseByCategory: (type = 1) => { dispatch(fetchExpensesAsyncCreator(type)); },
        //fetchMainExepenseByCategory: (type = 1) => { dispatch(fetchMainExpenseAsyncCreator(type)) }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DetectPlatform(CategoryScreen,styles.container));