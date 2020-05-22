import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Slider, Text} from "react-native-elements";
import NumberFormat from "react-number-format";
//import {Ionicons} from '@expo/vector-icons';

import Ionicons from 'react-native-vector-icons/Ionicons';

Ionicons.loadFont();
export default class SliderField extends Component {
  
  constructor(props){
    super(props);

    this.state = { min: 0, max: 1, steps: 100, value: 0 }
    // state = ;
  }
  componentDidMount() {
    const { min, max, steps, value } = this.props;
    this.setState({ min, max, steps, value });
  }

  methodToBeRunAfterReset = (value) => { 
    this.setState({ value });
    console.log("This is the sliderField method to be run after the resetting the forecast logic - ");

  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.label}>
          <View style={styles.title}>
            <Text style={{ fontVariant: ["small-caps"], fontSize:12, }}>
              {this.props.label}
            </Text>
            <Ionicons name='md-information-circle-outline' style={{height:12,width:12,margin:2}}/>
          </View>
          <View style={styles.value}>
            <NumberFormat
              value={this.state.value}
              displayType={"text"}
              decimalScale={0}
              thousandSeparator={true}
              prefix={this.props.valuePrefix}
              renderText={value => (
                <Text style={{ fontWeight: "bold" }}>{value}</Text>
              )}
            />
          </View>
        </View>
        <View style={styles.slider}>
          <Slider
            minimumValue={this.state.min}
            maximumValue={this.state.max}
            step={(this.state.max - this.state.min) / this.props.steps}
            value={this.state.value}
            onValueChange={value => {
              this.setState({ value });
              this.props.onChange && this.props.onChange(value);
            }}
            style={{ marginTop: 20 }}
            thumbStyle={{
              elevation:2,
              shadowOffset: { width: 0, height: 1 },
              shadowColor: "#000",
              shadowOpacity: 0.3
            }}
            thumbTintColor={"#bfbdbe"}
            minimumTrackTintColor={this.props.trackTint}
            maximumTrackTintColor={"#C7C7CC"}
          />
        </View>
        {
          this.props.label == `Cash on Hand` ?
            this.props.isShowReset == true ?
            <TouchableOpacity  onPress={()=>{ this.props.resetForecast(); }} style={{ alignSelf: "flex-end", margin: 22 }}>
              <Text style={{ color: `#0B61C8`,fontSize: 15, fontWeight:"bold" }}>{ `Reset` }</Text>
            </TouchableOpacity>
            : null : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 0,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "#FFF",
    flex:1,
    borderRadius:10,
    elevation:10,
  },
  label: {
    paddingLeft: 8,
    width: "60%",
    height:21,
    marginTop:25,
    flexDirection: "row",
    justifyContent:"space-between"
  },
  slider: {
    flex:1
  },
  title: { color: "#000",flexDirection:"row", },
  value: {
    fontWeight: "bold",
    alignItems: "flex-end",
    justifyContent:'flex-end',
    paddingRight:8,
    marginBottom:5,
  }
});