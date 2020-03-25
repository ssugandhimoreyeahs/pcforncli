import React, { Component, Fragment } from "react";
import { StyleSheet, View, TextInput, ToastAndroid, BackHandler,Alert,Platform,Image,TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-elements";
import SelectableTag from "../../controls/SelectableTag";
import BottomNavLayout from "../../controls/bottom-nav-layout";
import { sendUserFeedbackData } from "../../api/api";
import Spinner from "react-native-loading-spinner-overlay";

// import { EvilIcons,Entypo } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
//import { TouchableOpacity } from "react-native-gesture-handler";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import ImagePickerRN from "react-native-image-picker";

EvilIcons.loadFont();
Entypo.loadFont();
export default class FeedbackScreen extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      feedbackImages:[],
      isSpinner:false,
      suggestionTag: false,
      feedbackText:"",
      buttonVisible:true,
      tags: {
        suggestion: false,
        question: false,
        bug: false,
        feature: false,
        compliment: false,
        other: false
      }
    };
  }
  
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
    //console.log("add");
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
  }

  handleBackButton=(nav)=> {
    if (!nav.isFocused()) {
      BackHandler.removeEventListener('hardwareBackPress',  ()=>this.handleBackButton(this.props.navigation));
      return false;
    }else{
    Alert.alert(
      'Exit App',
      'Do you want to Exit..', [{
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
      }, {
          text: 'Exit',
          onPress: () => BackHandler.exitApp()
      }, ], {
          cancelable: false
      })
      
      return true;
    }
  }

  resetState = () => {
    return {
      feedbackImages:[],
      isSpinner:false,
      suggestionTag: false,
      feedbackText:"",
      buttonVisible:true,
      tags: {
        suggestion: false,
        question: false,
        bug: false,
        feature: false,
        compliment: false,
        other: false
      }
    }
  }
  saveFeedBack = () => {
    //ToastAndroid.show("Your Feedback is saved...",ToastAndroid.SHORT);
    this.setState({ isSpinner:true });
    const { tags,feedbackText,feedbackImages } = this.state;
    let composeSuggestionsData = "";
    composeSuggestionsData += tags.suggestion == true ? "Suggestion " : "";
    composeSuggestionsData += tags.question == true ? "Question " : "";
    composeSuggestionsData += tags.bug == true ? "Bug " : "";
    composeSuggestionsData += tags.feature == true ? "Feature " : "";
    composeSuggestionsData += tags.compliment == true ? "Compliment " : "";
    composeSuggestionsData += tags.other == true ? "Other " : "";
    composeSuggestionsData = composeSuggestionsData.length == 0 ? " " : composeSuggestionsData;

    const feedbackFormData = new FormData();
      if(feedbackImages.length > 0)
      {
        for(let i=0;i<feedbackImages.length;i++){
          let milliseconds = (new Date).getTime();
          let feedbackImageObj = {
            uri: `${feedbackImages[i].uri}`,
            type: 'image/jpg',
            name: `image-${i+1}-${milliseconds}.jpg`,
          }
          feedbackFormData.append(`feedbackimage${i+1}`,feedbackImageObj);
        }
      }
      feedbackFormData.append(`message`,feedbackText);
      feedbackFormData.append(`suggestionsData`,composeSuggestionsData);
        sendUserFeedbackData(feedbackFormData).then((response)=>{

      if(response.result == true){

        setTimeout(()=>{
          this.setState(this.resetState());
          this.props.navigation.navigate("FeedbackSubmission");
        },600);

      }else{

      console.log("Feedback api response error inside else part- ",response);
      this.setState({ isSpinner: false },()=>{
        setTimeout(()=>{
          Alert.alert("Error","Error Try Again!");
        },100);
      });

      }

    }).catch((error)=>{
      console.log("Feedback api response error - ",error);
      this.setState({ isSpinner: false },()=>{
        setTimeout(()=>{
          Alert.alert("Error","Error Try Again!");
        },100);
      })
    })


    
    
  }

  handleFeedbackImageSelect = async () => { 


    const options = {
      title: 'Select Images For Feedback',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType:'photo',
      takePhotoButtonTitle: null,
      quality:0.1,
      width:500,
      height:500
    };

    
    ImagePickerRN.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // this.setState({ selectLogoByUser: response });;
         this.setState({ feedbackImages: [...this.state.feedbackImages,response ] })
      }
    });

    // return false;
    // if(Platform.OS === 'ios'){
    //   try{
    //     const takePermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     const permissionStatus = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    //     if( permissionStatus.status === "granted" ){
    //       let result = await ImagePicker.launchImageLibraryAsync({
    //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //       //allowsEditing: false,
    //       // aspect: [4, 3],
    //       quality: 0.4
    //     });
    
    //     if (!result.cancelled) {
    //       this.setState({ feedbackImages: [...this.state.feedbackImages,result ] })
    //     }
    //    }
    //   }catch(error){
    //     Alert.alert("Error","Error While Selecting Image Try Again!");
    //   }
     
       
    // }else{
    //   let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     //allowsEditing: false,
    //     // aspect: [4, 3],
    //     quality: 0.4
    //   });
    //   if (!result.cancelled) {
    //     this.setState({ feedbackImages: [...this.state.feedbackImages,result ] })
    //   }
    // }

  }

  handleDeleteImage = (index) => {
    const { feedbackImages } = this.state;
    if(index == 0){
      if(feedbackImages.length == 1){
        this.setState({ feedbackImages: [] });
      }else{
        let feedbackImagesUpdated = [];
        for(let i=0;i<feedbackImages.length;i++){
            if(i != index){
              feedbackImagesUpdated.push(feedbackImages[i]);
            }
        }
        this.setState({ feedbackImages: feedbackImagesUpdated });
      }
    }else{

          let feedbackImagesUpdated = [];
          for(let i=0;i<feedbackImages.length;i++){
            if(i != index){
              feedbackImagesUpdated.push(feedbackImages[i]);
            }
          }
        this.setState({ feedbackImages: feedbackImagesUpdated });

    }
  }
  render() {

    
    const { feedbackImages } = this.state;
    return (
      <BottomNavLayout navigation={this.props.navigation}>

        <Spinner visible={this.state.isSpinner} />
        <View
          style={{
            alignContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop:25,
          }}
        >
          <Text style={styles.headerLabel}>How can we improve?</Text>

          <View
            style={{
              flexDirection: "row",
              // paddingLeft: 10,
              // paddingRight: 10
              justifyContent:'space-between'
            }}
          >
            <View style={{ width: "34%", alignContent:'center' }}>
            <SelectableTag
              text="Suggestion"
              selected={this.state.tags.suggestion}
              onPress={value => {
                const tags = this.state.tags;
                tags.suggestion = value;
                this.setState({ tags });
              }}
            />
            </View>
            <View style={{ width: "29%", alignContent:'center' }}>
            <SelectableTag
              text="Question"
              selected={this.state.tags.question}
              onPress={value => {
                const tags = this.state.tags;
                tags.question = value;
                this.setState({ tags });
              }}
            />
            </View>
            <View style={{ width: "34%", alignContent:'center' }}>
            <SelectableTag
              text="Bug Report"
              selected={this.state.tags.bug}
              onPress={value => {
                const tags = this.state.tags;
                tags.bug = value;
                this.setState({ tags });
              }}
            />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent:'space-between'
            }}
          >
            <View style={{ width: "40%", alignContent:'center' }}>
              <SelectableTag
                text="Feature Request"
                selected={this.state.tags.feature}
                onPress={value => {
                  const tags = this.state.tags;
                  tags.feature = value;
                  this.setState({ tags });
                }}
              />
            </View>
            <View style={{ width: "33%", alignContent:'center' }}>
              <SelectableTag
                text="Compliment"
                selected={this.state.tags.compliment}
                onPress={value => {
                  const tags = this.state.tags;
                  tags.compliment = value;
                  this.setState({ tags });
                }}
              />
            </View>
            <View style={{ width: "22%", alignContent:'center' }}>
              <SelectableTag
                text="Other"
                selected={this.state.tags.other}
                onPress={value => {
                  const tags = this.state.tags;
                  tags.other = value;
                  this.setState({ tags });
                }}
              />
            </View>
          </View>
        </View>
        <View>
          <TextInput
            editable={true}
            placeholder={'Enter Comments...'}
            textAlignVertical={"top"}
            numberOfLines={10}
            value={this.state.feedbackText}
            onChangeText={text => this.setState({ feedbackText: text })}
            style={{
              borderWidth: 1,
              flex: 1,
              marginRight: 20,
              marginLeft: 20,
              marginTop: 20,
              minHeight: 100
            }}
            multiline={true}
          />
        </View>
        <View style={styles.submitContainer}>

          <View style={{ flexDirection:"row",justifyContent:"center",alignItems:"center" }}>
              {
                feedbackImages.length > 0 ?
                  <View style={{ flexDirection: "row",justifyContent:"center",alignItems:"center" }}>
                      {
                        feedbackImages.map( (singleImage,index) => {
                          return <Fragment key={index}><TouchableOpacity style={{ flexDirection: "row",justifyContent:"center",alignItems:"center" }} onPress={()=>{ this.handleDeleteImage(index); }}>
                              <Image source={{ uri: singleImage.uri }} style={{ height: 50,width: 50 }}/><Entypo style={{ right:35 }} color={"black"} name={"circle-with-cross"} size={20} />
                            </TouchableOpacity></Fragment>
                        })
                      }
                  </View>
                : null
              }
              {
                feedbackImages.length < 3 ?
                <TouchableOpacity onPress={()=>{ this.handleFeedbackImageSelect() }}><EvilIcons name={"image"} size={50} /></TouchableOpacity> : null
              }
          </View>
          <View style={{ justifyContent:"center",alignItems:"center" }}>
          <Button
            style={styles.submit}
            title="Submit"
            disabled={ this.state.feedbackText.trim().length > 0 ? false : true }
            onPress={this.saveFeedBack}
          />
          </View>
        </View>
      </BottomNavLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    alignItems: "center"
    //justifyContent: "center"
  },

  headerLabel: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10
  },
  submit: {},
  submitContainer: {
    width:"90%",
    alignSelf: "center",
    justifyContent:"space-between",
    flexDirection:"row",
    //borderWidth:2,borderColor:"black",
    marginTop:10,
  }
});
