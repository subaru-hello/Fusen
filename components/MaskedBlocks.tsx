import { TImage, TMask } from "@/types";
import { StyleSheet } from "react-native";
import { GestureResponderEvent } from "react-native";
import Svg, { Rect } from "react-native-svg";

const MaskedBlocks = ({
  imageData,
  displayedWidth,
  displayedHeight,
  toggleRectVisibility,
  hiddenRects,
}: {
  imageData: TImage;
  displayedWidth: number;
  displayedHeight: number;
  toggleRectVisibility: (e: GestureResponderEvent, i: number) => void;
  hiddenRects: boolean[];
}) => {
  const masks = imageData.masks;
  return (
    <Svg style={styles.svg}>
      {masks.map((mask: TMask, index: number) => {
        // 四隅から実際の描画サイズを求める
        const left = Math.min(mask.x1, mask.x2) * displayedWidth;
        const top = Math.min(mask.y1, mask.y2) * displayedHeight;
        const width = Math.abs(mask.x2 - mask.x1) * displayedWidth;
        const height = Math.abs(mask.y2 - mask.y1) * displayedHeight;

        // hiddenRects[index]がtrueなら黒塗り、falseなら透明にするとか
        const isHidden = hiddenRects[index] ?? true;
        console.log("isHidden", isHidden);
        const fillColor = isHidden ? "black" : "transparent";

        return (
          <Rect
            key={index}
            x={left}
            y={top}
            width={width}
            height={height}
            fill={fillColor}
            onPress={(e: GestureResponderEvent) =>
              toggleRectVisibility(e, index)
            }
          />
        );
      })}
    </Svg>
  );
};

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
});

export default MaskedBlocks;
