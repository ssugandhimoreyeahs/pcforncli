import React,{ Component,Fragment } from "react";
import { Text,View,TouchableOpacity,StyleSheet,ScrollView,Image } from "react-native";
import  DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";
import ToggleSwitch from 'toggle-switch-react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import IconImage from "../../../assets/CategoryIcon/advertise3.png"

AntDesign.loadFont();
EvilIcons.loadFont();
class CategoryScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            toggle: false,
            isEdit: true
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
    renderSingleCategory = () => {
        const { isEdit } = this.state;
        return(
            <Fragment>
             {
                 isEdit == false ? 
                 <TouchableOpacity style={{ flexDirection:"row",justifyContent:"space-between",width:"93%" }}>

                    <Image source={IconImage} height={36} width={36} style={{ height: 36, width: 36 }}/>

                    <View style={{ justifyContent: "center",marginLeft:-35 }}>
                        <Text style={{ fontSize:12,color: "#000", fontWeight: "600" }}>
                             Advertising & Marketing
                        </Text>
                    </View>

                    <View style={{ justifyContent:"center",alignItems:"center" }}><MaterialIcons name='check' size={20} color={'#000000'}/></View>
                </TouchableOpacity>
                :

                <View style={{ flexDirection:"row",justifyContent:"space-between",width:"95%" }}>

                    <Image source={IconImage} height={36} width={36} style={{ height: 36, width: 36 }}/>

                    <View style={{ justifyContent: "center",marginLeft:-30 }}>
                       <Text style={{ fontSize:12,color: "#000", fontWeight: "600" }}>
                            Advertising & Marketing
                       </Text>
                    </View>

                    <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }}>
                    
                        <TouchableOpacity style={{ paddingRight:5 }}><EvilIcons name='pencil' size={23} color={'#000'}/></TouchableOpacity>

                        <TouchableOpacity><MaterialIcons name='delete' size={20} color={'#000'}/></TouchableOpacity>
                    </View>
                
                </View>
                
             }
            </Fragment>
        );
    }
    renderCategories = () => {

        return(
            <View style={ styles.categoryBlock }>

                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                <this.seprator />
                <this.renderSingleCategory />
                

            </View>
        );
    }
    render(){

        return(
            <ScrollView>
                <this.header /> 
                <this.addCategory />
                <this.renderCategories />
            </ScrollView>
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
        marginVertical: 12,
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
export default DetectPlatform(CategoryScreen,styles.container);