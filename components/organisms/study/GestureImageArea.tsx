import React from "react";
import { View, Image, LayoutChangeEvent, StyleSheet } from "react-native";
import Svg, { Rect, Text } from "react-native-svg";
import { RectMask } from "@/types/index";

const GestureImageArea = ({
  imageUri,
  rectMasks,
  onChangeMaskData,
  setDisplayedWidth,
  setDisplayedHeight,
  displayedWidth,
  displayedHeight,
  currentRect,
}: {
  imageUri: string;
  rectMasks: RectMask[];
  onChangeMaskData: (rectMasks: RectMask[]) => void;
  setDisplayedWidth: (width: number) => void;
  setDisplayedHeight: (height: number) => void;
  displayedWidth: number;
  displayedHeight: number;
  currentRect: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null;
}) => {
  console.log("==GestureImageArea==");
  /**
   * 画像のレイアウトが確定したときに、描画サイズを取得
   */
  const onImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDisplayedWidth(width);
    setDisplayedHeight(height);
  };
  const handleRemoveRectangle = (id: number) => {
    const removedRectMasks = rectMasks.filter((_, i) => i !== id);
    onChangeMaskData(removedRectMasks);
  };
  return (
    <View style={styles.imageContainer} onLayout={onImageLayout}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
      <Svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        {/* 既存マスクの表示 */}
        {rectMasks.map((r, i) => {
          // 相対座標 -> 実際の座標に変換
          const rx1 = r.x1 * displayedWidth;
          const ry1 = r.y1 * displayedHeight;
          const rx2 = r.x2 * displayedWidth;
          const ry2 = r.y2 * displayedHeight;
          const left = Math.min(rx1, rx2);
          const top = Math.min(ry1, ry2);
          const width = Math.abs(rx2 - rx1);
          const height = Math.abs(ry2 - ry1);

          return (
            <React.Fragment key={i}>
              <Rect
                x={left}
                y={top}
                width={width}
                height={height}
                fill="black"
                //   opacity={0.7}
              />
              <Text
                x={left + 2}
                y={top + 10}
                fill="white"
                onPress={() => handleRemoveRectangle(i)}
              >
                ×
              </Text>
            </React.Fragment>
          );
        })}

        {/* ドラッグ中の点線表示 (scale適用後の画面座標) */}
        {currentRect && (
          <Rect
            x={Math.min(currentRect.startX, currentRect.endX)}
            y={Math.min(currentRect.startY, currentRect.endY)}
            width={Math.abs(currentRect.endX - currentRect.startX)}
            height={Math.abs(currentRect.endY - currentRect.startY)}
            fill="none"
            stroke="blue"
            strokeWidth={2}
            strokeDasharray={[5, 5]}
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
});
export default GestureImageArea;
