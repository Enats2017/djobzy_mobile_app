import { Dimensions, PixelRatio } from "react-native";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
export const scale = (size) => (width / guidelineBaseWidth) * size;

export const fontScale = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(scale(size)));
