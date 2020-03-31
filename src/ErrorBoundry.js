import React,{ Component } from "react";
import { Text,View,Button, Platform } from "react-native";
//import crashlytics from "@react-native-firebase/crashlytics";

class ErrorBoundry extends Component{

    constructor(props){
        super(props);

        this.state = {
            hasError: false
        }
    }
    static getDerivedStateFromError(error){
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo){
        console.log("error opened");
        if(Platform.OS == "android"){
            //  console.log("Error occured - ",errorInfo);
            //  crashlytics().log('Error Occured!');
            //  crashlytics().recordError(new Error(error));
            //  crashlytics().crash();
        }
    }
    
    render(){
        if(this.state.hasError){
            return(
                <View>
                    <Text>Error Log!!!</Text>
                </View>
            );
        }else{
            return this.props.children;
        }
    }
}

export default ErrorBoundry;