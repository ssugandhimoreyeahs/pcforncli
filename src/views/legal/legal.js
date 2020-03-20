import React, { Component } from "react";
import { View, Text, TouchableOpacity ,BackHandler, SafeAreaView, ScrollView, StatusBar,StyleSheet} from "react-native";
import WebView from "react-native-webview";
import {Ionicons} from "@expo/vector-icons";
import DetectPlatfrom from "../../DetectPlatform";

 class Legal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTosEnabled: true
    };
  }

  handleToggleTos(isTosEnabled) {
    this.setState({ isTosEnabled: isTosEnabled });
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


  render() {
    return (
      <React.Fragment>
      {/* <View style={{ backgroundColor: '#070640', height: StatusBar.currentHeight, width:'100%' }} />
      <View style={styles.container} > */}
      <View>
      <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
        <Ionicons size={30} name='md-close' style={{alignSelf:'flex-end', marginRight:15,}} />
        </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingVertical: 10
            }}
          >
            <TouchableOpacity
              disabled={this.state.isTosEnabled}
              onPress={() => this.handleToggleTos(true)}
            >
              <View style={this.state.isTosEnabled && styles.underline}>
                <Text
                  style={
                    this.state.isTosEnabled
                      ? styles.headerTextEnabled
                      : styles.headerTextDisabled
                  }>
                    
                  Terms of Service
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!this.state.isTosEnabled}
              onPress={() => this.handleToggleTos(false)}
            >
              <View style={!this.state.isTosEnabled && styles.underline}>
                <Text
                  style={
                    this.state.isTosEnabled
                      ? styles.headerTextDisabled
                      : styles.headerTextEnabled
                  }
                >
                  Privacy Policy
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            {this.state.isTosEnabled ? termsOfService : privacyPolicy}
          </View>
        </View>
      {/* </View> */}
      </React.Fragment>
    );
  }
}

const termsOfService = (
    <WebView source={{uri:`https://www.pocketcfoapp.com/terms-of-use`}} />
);

const privacyPolicy = (
 
    <WebView source={{uri:`https://www.pocketcfoapp.com/privacy-policy`}} />
  
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18
  },
  contentContainer: {
    flex:1
  },
  headerTextEnabled: {
    fontSize: 17,
    fontWeight: "bold",
    paddingBottom: 10,
    paddingHorizontal: 18
  },
  headerTextDisabled: {
    fontSize: 17,
    fontWeight: "bold",
    opacity: 0.25,
    paddingBottom: 10,
    paddingHorizontal: 18
  },
  underline: {
    borderBottomColor: "#000",
    borderBottomWidth: 5
  }
});

export default DetectPlatfrom(Legal,styles.container)