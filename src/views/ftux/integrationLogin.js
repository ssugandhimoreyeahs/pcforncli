import React, { Component } from "react";
import { View, TouchableOpacity,BackHandler } from "react-native";
import { Card, Icon, Input, Image } from "react-native-elements";
import DetectPlatform from "../../DetectPlatform";

class IntegrationLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
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

  validateFormAndSubmit = () => {
    if (this.state.username && this.state.password) {
      this.props.navigation.getParam("stateFunction")();
      this.props.navigation.navigate("Setup");
    }
  };

  render() {
    const icon = (
      <Icon
        name="lock"
        type="feather"
        iconStyle={{ color: "#7B7B7B" }}
        size={15}
      />
    );

    const integrator = this.props.navigation.getParam("selection", "");

    return (
      <View
        style={{
          backgroundColor: "#F1F3F5",
          flexDirection: "column",
          alignItems: "center",
          height: "100%"
        }}
      >
        {integrator && <Text h3>`${integrator.name}`</Text>}
        <View
          style={{
            alignItems: "center",
            marginVertical: "75%",
            height: "100%",
            width: "100%"
          }}
        >
          <Card
            containerStyle={{
              borderRadius: 5,
              borderWidth: 0,
              width: 296,
              shadowOpacity: 0,
              padding: 0
            }}
          >
            <Input
              placeholder="username"
              rightIcon={icon}
              inputContainerStyle={{ borderBottomColor: "#FFF" }}
              onChangeText={text => {
                this.setState({ username: text });
              }}
              onSubmitEditing={this.validateFormAndSubmit}
            />
          </Card>
          <Card
            containerStyle={{
              borderRadius: 5,
              borderWidth: 0,
              width: 296,
              shadowOpacity: 0,
              padding: 0
            }}
          >
            <Input
              placeholder="password"
              secureTextEntry
              rightIcon={icon}
              inputContainerStyle={{ borderBottomColor: "#FFF" }}
              onChangeText={text => {
                this.setState({ password: text });
              }}
              onSubmitEditing={this.validateFormAndSubmit}
            />
          </Card>
        </View>
      </View>
    );
  }
}

export default DetectPlatform(IntegrationLogin);