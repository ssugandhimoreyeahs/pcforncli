import React, { Component } from "react";
import { View, SafeAreaView , StatusBar,BackHandler} from "react-native";
import { Card, Text } from "react-native-elements";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import DetectPlatform from "../../DetectPlatform";
class IntegrationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: []
    };
  }

  componentDidMount(){
    this.setState({ items: this.props.integrationItems });
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

  handlePress(selection) {
    this.props.navigation.navigate("IntegrationLogin", {
      selection: selection,
      stateFunction: this.props.stateFunction
    });
    
  }

  render() {
    return (
      <React.Fragment>
        {this.state.items.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={selection => this.handlePress(selection)}
            >
              <Card
                containerStyle={{
                  borderRadius: 5,
                  borderWidth: 0,
                  width: 296,
                  shadowOpacity: 0
                }}
              >
                <Text style={{ alignSelf: "center" }}>{item.name}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </React.Fragment>
    );
  }
}

export default DetectPlatform(IntegrationList);
