import { getWp } from "@utils";
import { getHp } from "./viewUtils";

const computeFontSize = (maxFont = 40) => {
  let key = "Text";
  let obj = {};
  for (let i = 1; i <= maxFont; i++) {
    obj = { ...obj, [`${key}${i}`]: getWp(i) };
  }
  return obj;
};
export const FONTSIZE = {
  ...computeFontSize(),
};

export const FONT_FAMILY = {
  SFProText: "SourceSansPro-Regular",
  SFProBold: "SourceSansPro-Bold"
};
