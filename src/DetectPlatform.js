import React,{ Component,Fragment } from "react";
import { Platform,SafeAreaView,StatusBar,View } from "react-native";
import { connect } from "react-redux";

const NewComponent = (OriginalComponent, customStyle = {} ) => {
    class DetectPlatform extends Component{

        constructor(props){
            super(props);
            // this.state = {
            //     platformIOS:null,
            //     platformANDROID:null
            // }
        }
        // renderAccordingToPlatform = () => {
        //     if(Platform.OS == "android"){
        //         this.setState({ platformANDROID: true });
        //     }else if(Platform.OS == "ios"){
        //         this.setState({ platformIOS: true });
        //     }
        // }   
        // componentDidMount=()=>{
        //     this.renderAccordingToPlatform();
        // }
        render(){
            // const { platformIOS,platformANDROID } = this.state;
            return(
                <Fragment>
                {   
                   (Platform.OS == "ios") ? 
                    <Fragment>
                    <SafeAreaView style={{ flex: 0, backgroundColor: '#9c9a9a' }} />
                     <SafeAreaView style={{ ...customStyle}}>
                         <OriginalComponent {...this.props} />
                    </SafeAreaView>
                    </Fragment> : null
                }

                {
                    ( Platform.OS == "android" ) ?
                    <Fragment>
                        <View style={{  width:'100%' }} />
                        <View style={{ ...customStyle }}>
                        <OriginalComponent {...this.props} />
                        </View>
                    </Fragment> 
                    : null
                }
                </Fragment>
            );
        };
    }
    //Approach 1 Using Redux
    // const mapStateToProps = state => ({reduxState: state});
    // const mapDispatchToProps = dispatch => ({reduxDispatch: dispatch});

    // return connect(mapStateToProps,mapDispatchToProps)(DetectPlatform);
    //Approach 2 Import for the existing codes
    return DetectPlatform;
}

export default NewComponent;