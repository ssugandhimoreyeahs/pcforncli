import React,{ Component,Fragment } from "react";
import { Alert,Text,View,TouchableOpacity,StyleSheet,ScrollView,Image,ActivityIndicator } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import ToggleSwitch from 'toggle-switch-react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DialogInput from 'react-native-dialog-input';
import { connect } from "react-redux";
import { allFirstWordCapital } from "../../../api/common";
import Spinner from 'react-native-loading-spinner-overlay';
import { fetchExpensesAsyncCreator  } from "../../../reducers/expensecategory";
import { triggerPlaidCategoryAsync } from "../../../reducers/plaidCategory";
import { addPlaidCategory, deletePlaidCategory, editPlaidCategory,addCategoryToTransaction } from "../../../api/api";
import { PLAID_EXPENSE_CATEGORIES,EXPENSES_COLOR,getCategoryInitials } from "../../../api/common";
import { CHANGECATEGORY,ERRORCATEGORY,ADDEDCATEGORY,DELETECATEGORY } from "../../../api/message";
AntDesign.loadFont();
EvilIcons.loadFont();
MaterialCommunityIcons.loadFont();

class CategoryScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            toggle: false,
            isEdit: false,

            isSpinner: false,
            addCategoryDialogVisible: false,
            showPleaseEnterCategory: false,
            editInitDialogValue:'',
            editCategoryDialogVisible: false,
            pointIconToDefaultCategory: false
        }
    }
    componentDidMount(){
        let recievedData = this.props.navigation.getParam("currentExecutingTransaction");
        console.log("Again Component Mount for the category Screen - ");
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
                        <TouchableOpacity 
                        onPress={() => {
                            this.setState((prevState)=>{ return { addCategoryDialogVisible: !prevState.addCategoryDialogVisible } });
                        }}
                        style={{ justifyContent:"center",paddingLeft:4 }} >
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

    handleChangeCategory = async (categoryId,categoryName) => {
        const { _id } = this.props.navigation.getParam("currentExecutingTransaction");
        
        let changePlaidCategoryResponse = await addCategoryToTransaction(_id,categoryId);
        
        
        
        if(changePlaidCategoryResponse.result == true){

           setTimeout(()=>{
            this.setState({  isSpinner:false },()=>{
               
                this.props.navigation.getParam("resetTransactionScreen")();
                setTimeout(()=>{
                     this.props.navigation.goBack();
                },1000);
                
            });
           },500);

        }else{
            this.setState({ isSpinner:false },()=>{
                setTimeout(()=>{
                    Alert.alert(ERRORCATEGORY.title,ERRORCATEGORY.message,[ { text:ERRORCATEGORY.button1 } ],{ cancelable: false });
                },100);
            });
        }
    }

    handleChangeCategoryAlert = (categoryId,categoryName) => {
        
        Alert.alert(CHANGECATEGORY.title,CHANGECATEGORY.message,[
            { text:CHANGECATEGORY.button1},
            { text:CHANGECATEGORY.button2,onPress:()=>{
                this.setState({ isSpinner:true },()=>{
                    this.handleChangeCategory(categoryId,categoryName);
                });
                
            } }
        ])
        
    }

    deletePlaidCategory = async  (categoryId) => {
        const plaidCategoryDeleteResponse = await deletePlaidCategory(categoryId);
        if(plaidCategoryDeleteResponse.result == true){
            
            
            setTimeout(()=>{
                this.setState({ isSpinner: false },()=>{
                    setTimeout(()=>{
                        
                            //this.props.fetchPlaidCategoryDispatch();  
                        
                            //code change after the edit of the category by user
                            this.props.fetchPlaidCategoryDispatch();
                            setTimeout(()=>{
                                this.props.navigation.getParam("resetTransactionScreen")();
                            },500);
                            setTimeout(()=>{
                                this.props.fetchExpenseByCategory(3);
                            },1500);
                    },500);
                });
            },1000);
            // this.setState((prevState)=>{ return { isSpinner: !prevState.isSpinner } },()=>{
            //     setTimeout(()=>{
                    
            //             this.props.navigation.getParam("resetTransactionScreen")();
            //             this.props.fetchExpenseByCategory(3);
            //             this.props.fetchPlaidCategoryDispatch();
                      
            //     },500);
            // })
        }else{
            this.setState({ isSpinner: false,pointIconToDefaultCategory: false },()=>{
                setTimeout(()=>{
                    Alert.alert(ERRORCATEGORY.title,ERRORCATEGORY.message,[ { text:ERRORCATEGORY.button1 } ],{ cancelable: false });
                },100);
            });
        }
    }

    handleCategoryDataDelete = (categoryId,categoryName) => {
        
        Alert.alert(DELETECATEGORY.title,DELETECATEGORY.message(categoryName),[
            { text:DELETECATEGORY.button1 },
            { text:DELETECATEGORY.button2, onPress: ()=>{ 
                //Api Trigers here for deleting the Category Data
                let { category } = this.props.navigation.getParam("currentExecutingTransaction");
                let pointIconToDefaultCategory = false;
                if(categoryName == category){
                    pointIconToDefaultCategory = true;
                }
                this.setState({ isSpinner: true,pointIconToDefaultCategory },()=>{
                    this.deletePlaidCategory(categoryId);
                });

              }}
        ],
        { cancelable: false }
        );
    }
    renderSingleCategory = ({ categoryData }) => {
        let executingTransactionDetails = this.props.navigation.getParam("currentExecutingTransaction");
        const { isEdit,pointIconToDefaultCategory } = this.state;
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        let { categoryName,index,customcategories,id } = categoryData;
        let showCheckIcon  = pointIconToDefaultCategory == true ?
        categoryName == executingTransactionDetails.defaultCategory ? true : false :
        categoryName == executingTransactionDetails.category ? true : false;
        let isIconAvailable = false;
        let iconPath = null;
        let categoryBackgroundColor = `#F98361`;
        for(let i=0;i<PLAID_EXPENSE_CATEGORIES.length;i++){
            if(PLAID_EXPENSE_CATEGORIES[i].categoryName == categoryName){
                isIconAvailable = true;
                iconPath = PLAID_EXPENSE_CATEGORIES[i].categoryIcon;
                break;
            }
        }

        
        return(
            <Fragment>
             {
                 isEdit == false ? 
                 <TouchableOpacity 
                 disabled={showCheckIcon}
                 onPress={() => {  
                    this.handleChangeCategoryAlert(id,categoryName);
                  }}
                 style={{ flexDirection:"row",
                 justifyContent:"space-between",
                 width:"93%",paddingLeft:6 }}>
                    
                    <View style={{ width:"15%" }}>
                            {
                                isIconAvailable == true ?
                                <Image source={ iconPath } height={36} width={36} style={{ height: 36, width: 36 }}/>
                                : <View style={{ borderRadius:50,
                                   justifyContent:"center",
                                   alignItems:"center",
                                   width: 36,
                                   height:36,
                                   borderColor: "#FFF",
                                   backgroundColor: categoryBackgroundColor
                                }}>
                                    <Text style={{ color:'#FFF' }}>
                                        {
                                            getCategoryInitials(categoryName)
                                        }
                                    </Text>
                                </View>
                                
                            }
                            
                    </View>

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
                        showCheckIcon == true ?
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"center" }}>
                            <MaterialIcons name='check' size={20} color={'#000000'}/>
                        </View>
                        :
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"center" }}></View>
                    }
                </TouchableOpacity>
                :
                <View style={{ 
                    paddingLeft:6, 
                    flexDirection:"row",
                    justifyContent:"space-between",width:"95%" }}>

                    <View style={{ width:"15%" }}>
                            {
                                isIconAvailable == true ?
                                <Image source={ iconPath } height={36} width={36} style={{ height: 36, width: 36 }}/>
                                : <View style={{ borderRadius:50,
                                   justifyContent:"center",
                                   alignItems:"center",
                                   width: 36,
                                   height:36,
                                   borderColor: "#FFF",
                                   backgroundColor: categoryBackgroundColor
                                }}>
                                    <Text style={{ color:'#FFF' }}>
                                        {
                                            getCategoryInitials(categoryName)
                                        }
                                    </Text>
                                </View>
                                
                            }
                            
                    </View>

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
                                <TouchableOpacity onPress={()=>{
                                    this.handleCategoryDataEdit(id,categoryName);
                                }}
                                style={{ paddingRight:7 }}>
                                    <EvilIcons name='pencil' size={23} color={'#000'}/>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={()=>{
                                    this.handleCategoryDataDelete(id,categoryName);
                                }}>
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

    handleCategoryDataEdit = async (categoryId,categoryName) => {
        this.setState({ 
            editInitDialogId: categoryId,
            editInitDialogValue:categoryName 
        },()=>{
            this.setState({ editCategoryDialogVisible: true });
        });
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

    addNewCategory = (categoryInput) => {
        
            this.setState({ addCategoryDialogVisible:false,isSpinner:true }, async ()=>{

            const addCategoryResponse = await addPlaidCategory(allFirstWordCapital(categoryInput));
            if(addCategoryResponse.result == true){
                
                setTimeout(()=>{
                    this.setState({ isSpinner:false,showPleaseEnterCategory:false },()=>{
                        setTimeout(()=>{
                            Alert.alert(ADDEDCATEGORY.title,
                            ADDEDCATEGORY.message,[ 
                                { text:ADDEDCATEGORY.button1,onPress:()=>{  
                                    this.setState({ isEdit: false },()=>{
                                        this.props.fetchPlaidCategoryDispatch();  
                                    });
                                } } ],{ cancelable: false });
                        },100);
                    });
                },1300);

            }else if(addCategoryResponse.result == false){
                
                setTimeout(()=>{
                    this.setState({ isSpinner: false,showPleaseEnterCategory:false },()=>{
                        setTimeout(()=>{
                            Alert.alert(ERRORCATEGORY.title,ERRORCATEGORY.message,[ { text:ERRORCATEGORY.button1 } ],{ cancelable: false });
                        },100);
                    });
                },1300);
            }else{
                
                setTimeout(()=>{
                    this.setState({ isSpinner: false,showPleaseEnterCategory:false },()=>{
                        setTimeout(()=>{
                            Alert.alert(ERRORCATEGORY.title,ERRORCATEGORY.message,[ { text:ERRORCATEGORY.button1 } ],{ cancelable: false });
                        },100);
                    });
                },1300);
            }
            });
           
            

        
      }

      handleEditPlaidCategoryApi = (category) => {
        
        this.setState({ isSpinner: true,editCategoryDialogVisible: false }, async ()=>{
            const editPlaidCategoryResponse = await editPlaidCategory(this.state.editInitDialogId,category);
        if(editPlaidCategoryResponse.result == true){
            
            setTimeout(()=>{
                this.setState({ isSpinner: false }, ()=>{
                    setTimeout(()=>{
                        
                            //this.props.fetchPlaidCategoryDispatch();  
                        
                            //code change after the edit of the category by user
                            // this.setState({ isEdit: false },()=>{
                                this.props.fetchPlaidCategoryDispatch();
                            // });
                            setTimeout(()=>{
                                this.props.navigation.getParam("resetTransactionScreen")();
                            },500);
                            setTimeout(()=>{
                                this.props.fetchExpenseByCategory(3);
                            },1500);
                    },500);
                });
            },1000);
        }else{
            this.setState({ isSpinner: false },()=>{
                setTimeout(()=>{
                    Alert.alert(ERRORCATEGORY.title,ERRORCATEGORY.message,[ { text:ERRORCATEGORY.button1 } ],{ cancelable: false });
                },100);
            });
        }
        })
    }
    isCategoryAlreadyExistOnClient = (categoryInput,actionType) => {
        if(categoryInput == "" && actionType == "add"){
            this.setState({ showPleaseEnterCategory: true });
            return true;
        }
        if(categoryInput == "" && actionType == "edit"){
            this.setState({ showPleaseEnterCategory: true });
            return true;
        }
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        let isCategoryAlreadyPresent = false;
        for(let i=0;i<category.length;i++){
            if(categoryInput.toLowerCase() == category[i].categoryName.toLowerCase()){
                isCategoryAlreadyPresent = true;
                break;
            }
        }
        
        if(isCategoryAlreadyPresent){
            this.setState({ isSpinner:true,editCategoryDialogVisible:false,addCategoryDialogVisible:false,showPleaseEnterCategory: false },()=>{
                setTimeout(()=>{
                    this.setState({ isSpinner: false },()=>{
                        setTimeout(()=>{
                            Alert.alert(
                                "Message",
                                "Category Already Exist",[
                                    { text: "Okay" }
                                ],{ cancelable: false });
                        },100);
                    })
                },900);
            });
            return true;
        }else{
            return isCategoryAlreadyPresent;
        }

    }
    renderBody = () => {
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        //loading = true;
        let { editInitDialogValue,
            editCategoryDialogVisible,
            addCategoryDialogVisible,
            showPleaseEnterCategory } = this.state;
        return(
            <ScrollView keyboardShouldPersistTaps={"always"}>
                <this.header /> 
                <this.addCategory />
                <DialogInput 
                    dialogStyle={{ marginTop:-80 }}
                    isDialogVisible={addCategoryDialogVisible}
                    title={"Add Category"}
                    message={<Fragment><Text>{"Please Add New Category Here..."}</Text>{
                            showPleaseEnterCategory == true ? <Text style={{ color:"red" }}>{`\n\nPlease Enter Category Name`}</Text> : null
                    }</Fragment>}
                    hintInput ={"Name of the Category"}
                    submitInput={ (categoryInput) => {
                        let isCategoryAlreadyExist = this.isCategoryAlreadyExistOnClient(categoryInput,"add");
                        if(!isCategoryAlreadyExist){
                            this.addNewCategory(categoryInput);
                        }
                    }}
                    closeDialog={ () => {
                        this.setState({ 
                            addCategoryDialogVisible:false,
                            showPleaseEnterCategory:false 
                        });
                    }}
                    >
                </DialogInput>

                <DialogInput
                    dialogStyle={{ marginTop:-80 }} 
                    isDialogVisible={editCategoryDialogVisible}
                    initValueTextInput={editInitDialogValue}
                    title={"Edit Category"}
                    message={<Fragment><Text>{"Please Edit Category Here..."}</Text>{
                            showPleaseEnterCategory == true ? <Text style={{ color:"red" }}>{`\n\nPlease Enter Category Name`}</Text> : null
                    }</Fragment>}
                    hintInput ={"Name of the Category"}
                    submitInput={ (editInitDialogNewValue) => {
                     
                    let isCategoryAlreadyExist = this.isCategoryAlreadyExistOnClient(editInitDialogNewValue,"edit");
                    if(!isCategoryAlreadyExist){
                        this.handleEditPlaidCategoryApi(editInitDialogNewValue); 
                    }
                    return false;
                     this.setState({ isSpinner: true,editCategoryDialogVisible:false },()=>{

                            this.handleEditPlaidCategoryApi(editInitDialogNewValue); 
                        
                     });
                     }}
                    closeDialog={ () => {
                    this.setState({editCategoryDialogVisible:false})
                    }}
                    >
                </DialogInput>
               
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
        
        let { category,error,isFetched,loading } = this.props.categoryReduxData;
        
        return(
            <Fragment>
                <Spinner visible={this.state.isSpinner} />
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
    paddingBottom: 20,
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