import React, { Component } from 'react';
import { StyleSheet, Text, Image,Alert, SafeAreaView } from 'react-native';
import { Button } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DetectPlatform from "../../DetectPlatform";
import { loggedOutUser } from "../../api/api";
import Spinner from 'react-native-loading-spinner-overlay';

class SomethingWrong extends Component {
    constructor(props) {
        super(props);
        this.state = {
          spinner: false
        }
        
      }
      handleLogoutButton = async () => {
        this.setState({ spinner: true });
        const confirmLogout = await loggedOutUser();
        if(confirmLogout){
          this.setState( (prevState) => { return { spinner:!prevState.spinner } },()=>{ this.props.navigation.navigate("ValueProp"); });
        }
    } 
    render(){
  return (
    <React.Fragment>
      <Spinner visible = { this.state.spinner } />
       <Image
          style={{width: 133, height: 156, marginTop:'55%'}}
          source={require('../../assets/errorillustration.png')}
          resizeMode="contain"
        />
      <Text style={styles.text}>Oops:(</Text>
      <Text style = {styles.textSecond}>Something went wrong.</Text>
      <Button buttonStyle={styles.buttonStyle}
          icon={
            <MaterialCommunityIcons name='reload' size={20} color="white"/>
          }
          
          title="Retry"
          titleStyle={{textAlign:'center',fontSize:15,marginTop:-3}}
          type="solid"
          onPress={()=> { this.props.handleButton(); }}
        />
        {
          this.props.showLoggedOutButton == true && 
          <Button buttonStyle={styles.buttonStyle}
          // icon={
          //   <MaterialCommunityIcons name='reload' size={20} color="white"/>
          // }
          
          title="Logout"
          titleStyle={{textAlign:'center',fontSize:15,marginTop:-3}}
          type="solid"
          onPress={()=> { this.handleLogoutButton(); }}
        />
        }
  </React.Fragment>
  );
}}                      

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text:{
    fontSize:22,
    fontFamily:'System',
    fontWeight:'normal',
    marginVertical:10
  },
  textSecond:{
    fontSize:17,
    fontFamily:'System',
    fontWeight:'normal',
    marginVertical:10
  },
  buttonStyle: {
    width:101,
    height:36,
    borderRadius:18,
    backgroundColor:'#007AFF',
    marginTop:'5%'
  },
  
});



export default DetectPlatform(SomethingWrong, styles.container);