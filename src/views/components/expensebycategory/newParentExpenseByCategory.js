import React,{ Component } from "react";
import { Text,View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import DetectPlatform from "../../../DetectPlatform";
import AntDesign from "react-native-vector-icons/AntDesign";

AntDesign.loadFont();

class ExpenseByCategory extends Component{


    header = () => {
        return(
            <View style={{ backgroundColor:"rgba(249,249,249,0.94)",height:70,width:"100%",flexDirection:"row"}}>
                    <View style={{ flexDirection:"row",width:"100%",marginTop:20 }}>
                        <View style={{ width:"10%",justifyContent:"center",alignItems:"center" }}>
                            <TouchableOpacity  onPress={()=>{ this.props.navigation.goBack(); }} >
                                <AntDesign name='left' size={22} color={'#000000'}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width:"80%",justifyContent:"center",alignItems:"center" }}>
                        <Text style={{ fontSize:17,color:"#000",fontWeight: "600" }}>{ `Expense by Category` }</Text>
                            
                        </View>
                    </View>
                </View> 
        );
    }
    render(){
        return(
            <ScrollView>
                <this.header />


            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
export default DetectPlatform(ExpenseByCategory,styles.container);



/*

code here for the svg 

import React from 'react'
import { PieChart } from 'react-native-svg-charts'
import { Circle, G, Image } from 'react-native-svg'


class PieChartWithCenteredLabels extends React.PureComponent {

    render() {

        const data = [
            {
                key: 1,
                amount: 50,
                svg: { fill: '#600080' },
            },
            {
                key: 2,
                amount: 50,
                svg: { fill: '#9900cc' }
            },
            {
                key: 3,
                amount: 40,
                svg: { fill: '#c61aff' }
            },
            {
                key: 4,
                amount: 95,
                svg: { fill: '#d966ff' }
            },
            {
                key: 5,
                amount: 35,
                svg: { fill: '#ecb3ff' }
            }
        ]

        const Labels = ({ slices, height, width }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <G
                        key={index}
                        x={labelCentroid[ 0 ]}
                        y={labelCentroid[ 1 ]}
                    >
                        <Circle
                            r={15}
                            fill={'white'}
                        />
                        <Image
                            source={{ url: `https://image.shutterstock.com/image-vector/letter-c-negative-space-logo-600w-503463199.jpg` }}
                            x={-10}
                            y={10}
                            width={20}
                            height={20}
                            preserveAspectRatio="xMidYMid slice"
                            opacity="1"
                            
                        />
                    </G>
                )
            })
        }

        return (
            <PieChart
                style={{ height: 200 }}
                valueAccessor={({ item }) => item.amount}
                data={data}
                spacing={0}
                outerRadius={'75%'}
            >
                <Labels/>
            </PieChart>
        )
    }

}

export default PieChartWithCenteredLabels
*/