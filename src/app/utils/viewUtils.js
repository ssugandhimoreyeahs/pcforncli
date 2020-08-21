import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {DEFAULT_VIEWPORT as ViewPort} from "@constants";

export const deviceWidth = Dimensions.get("screen").width;
export const deviceHeight = Dimensions.get("screen").height;

const getHp = (pixels = ViewPort.height) => {
  return hp(((pixels / ViewPort.height) * 100).toFixed(2));
};

const getWp = (pixels = ViewPort.width) => {
  return wp(((pixels / ViewPort.width) * 100).toFixed(2));
};

export { wp, hp, getHp, getWp };
