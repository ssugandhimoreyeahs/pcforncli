import React from 'react';
import { View } from 'react-native';
import { Defs, Stop, LinearGradient, Svg, Rect, G } from 'react-native-svg';

class BarGraph extends React.Component {
  constructor(props) {
    super(props);
  }
  renderBar() {
    const { height, width, orientation = 'horizontal', barColors, data, barWidth } = this.props;
    const sum = data.reduce((total, acc) => total + acc);
    const percentages = data.map(x => x / sum);
    const heights = percentages.map(x => x * height);
    const widths = percentages.map(x => x * width);
    let offsetY = 0;
    let offsetX = 0;
    return data.map((x, i) => {
      let ret = [];
      if (orientation === 'vertical') {
        ret.push(<Rect key={Math.random()} y={offsetY} width={barWidth} height={heights[i]} fill={barColors[i]} />);
        offsetY += heights[i];
      } else {
        ret.push(<Rect key={Math.random()} x={offsetX} width={widths[i]} height={barWidth} fill={barColors[i]} />);
        offsetX += widths[i];
      }
      return ret;
    });
  }
  renderDefs() {
    const { backgroundGradientFrom, backgroundGradientTo, width, height, chartColor } = this.props;
    return (
      <Defs>
        <LinearGradient id="backgroundGradient" x1="0" y1={height} x2={width} y2={0}>
          <Stop offset="0" stopColor={backgroundGradientFrom} />
          <Stop offset="1" stopColor={backgroundGradientTo} />
        </LinearGradient>
        <LinearGradient id="fillShadowGradient" x1={0} y1={0} x2={0} y2={height}>
          <Stop offset="0" stopColor={chartColor} stopOpacity="0.1" />
          <Stop offset="1" stopColor={chartColor} stopOpacity="0" />
        </LinearGradient>
      </Defs>
    );
  }
  render() {
    const { borderRadius = 0 } = this.props.style;
    const { style, height, width } = this.props;
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs()}
          <Rect width="100%" height={height} rx={borderRadius} ry={borderRadius} fill="url(#backgroundGradient)" />
          <G>{this.renderBar()}</G>
        </Svg>
      </View>
    );
  }
}
export { BarGraph };
