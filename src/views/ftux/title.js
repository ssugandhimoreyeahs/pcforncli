import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar,BackHandler,TouchableOpacity } from "react-native";
import { Button, Input, Text } from "react-native-elements";
// import {  } from "react-native-gesture-handler";
import DetectPlatform from "../../DetectPlatform";
import Ionicons from "react-native-vector-icons/Ionicons";

Ionicons.loadFont();

 class Title extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: ""
    };
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
   }
 
   componentWillUnmount(){
     BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
   }
 
   handleBackButton=(nav)=> {
     if (!nav.isFocused()) {
       BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
       return false;
     }else{
       nav.goBack();
       return true;
     }
   }

    handlePress = () => {
    this.props.navigation.navigate("Email", {
      firstName: this.props.navigation.getParam("firstName", ""),
      lastName: this.props.navigation.getParam("lastName", ""),
      title: this.state.title.trim()
    });
  };

  render() {
    return (
      <React.Fragment>
      
        <TouchableOpacity onPress={()=>{
          this.props.navigation.navigate("ValueProp");
        }}>
        <Ionicons size={30} name='md-close' style={{alignSelf:'flex-start', marginLeft:25,marginTop:5}} />
        </TouchableOpacity>
        <Text style={{alignSelf:'center',marginTop:'10%'}} h4>What's your title?</Text>
        <Input
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.input}
          placeholder={"Ex: Founder"}
	  value={this.state.title}
          onChangeText={text => this.setState({ title: text })}
        />
        <Button
          disabled={!this.state.title.trim().length}
          buttonStyle={styles.button}
          disabledStyle={{backgroundColor:'#7FBDFF',}}
          containerStyle={styles.buttonContainer}
          title="Continue"
          onPress={text => this.handlePress(text)}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height:48,
    backgroundColor:'#007AFF',
    
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: "22%"
  },
  text: {
    marginVertical: "50%"
  },
  buttonContainer: {
    marginTop: 50,
    width: "75%",
    alignSelf:'center'
  },
  inputContainer: {
    alignSelf: "center",
    borderBottomColor: "#007AFF",
    marginVertical: "5%",
    width: "75%"
  },
  input: {
    marginVertical: "5%",
    textAlign: "center"
  }
});

export default DetectPlatform(Title,styles.container);