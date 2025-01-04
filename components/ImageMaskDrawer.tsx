import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  LayoutChangeEvent,
  Dimensions,
} from "react-native";
import Svg, { Rect, Text } from "react-native-svg";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

type RectMask = {
  x1: number; // 相対座標（0~1）
  y1: number;
  x2: number;
  y2: number;
};

type Props = {
  imageUri: string;
  rectMasks: RectMask[];
  onChangeMaskData: (rectMasks: RectMask[]) => void;
};

export default function ImageMaskDrawerRect({
  imageUri,
  rectMasks,
  onChangeMaskData,
}: Props) {
  const [displayedWidth, setDisplayedWidth] = useState(0);
  const [displayedHeight, setDisplayedHeight] = useState(0);

  // ピンチによるズーム量を管理
  const scaleValue = 1;
  //   const [scaleValue, setScaleValue] = useState(1);

  // ドラッグ中の一時的な「絶対座標」(スクリーン座標)
  const startPos = useRef({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  /**
   * 画像のレイアウトが確定したときに、描画サイズを取得
   */
  const onImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDisplayedWidth(width);
    setDisplayedHeight(height);
  };

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      console.log("onBegin", e);
      const { x, y } = e;
      const initialx = x;
      const initialy = y;
      startPos.current = { x, y };
      setCurrentRect({
        startX: initialx,
        startY: initialy,
        endX: initialx,
        endY: initialy,
      });
    })
    .onUpdate((e) => {
      console.log("onUpdate", e);
      const { x, y } = e;
      const endX = x;
      const endY = y;
      if (currentRect) {
        setCurrentRect({
          startX: startPos.current.x,
          startY: startPos.current.y,
          endX,
          endY,
        });
      }
    })
    .onEnd((e) => {
      if (!currentRect || displayedWidth === 0 || displayedHeight === 0) {
        setCurrentRect(null);
        return;
      }
      console.log("onEnd", e);
      const { startX, startY, endX, endY } = currentRect;

      // いま表示されている見かけ上は scaleValue倍になっている。
      // つまり "スクリーン座標" (scaled) を "実画像座標" に戻すには 1/scaleValue する
      const realStartX = startX / scaleValue;
      const realStartY = startY / scaleValue;
      const realEndX = endX / scaleValue;
      const realEndY = endY / scaleValue;

      // 画像に対する相対座標(0~1)に変換
      const x1 = realStartX / displayedWidth;
      const y1 = realStartY / displayedHeight;
      const x2 = realEndX / displayedWidth;
      const y2 = realEndY / displayedHeight;

      const newRect: RectMask = { x1, y1, x2, y2 };
      const updated = [...rectMasks, newRect];
      onChangeMaskData(updated);

      setCurrentRect(null);
    });

  const handleRemoveRectangle = (id: number) => {
    const removedRectMasks = rectMasks.filter((_, i) => i !== id);
    onChangeMaskData(removedRectMasks);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <View
          style={{
            ...styles.imageContainer,
            // transform: [{ scale: scaleValue }],
          }}
          onLayout={onImageLayout}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
          {/* <Svg style={[StyleSheet.absoluteFill]}> */}
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
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    flex: 1,
  },
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
  box: {
    position: "relative",
    width: 100,
    height: 100,
    backgroundColor: "#b58df1",
    borderRadius: 20,
  },
});
