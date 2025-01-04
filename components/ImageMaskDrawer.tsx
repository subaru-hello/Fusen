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
  PanGestureHandler,
  PinchGestureHandler,
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
  const [scaleValue, setScaleValue] = useState(1);

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

  /**
   * ドラッグ開始
   */
  const handleGestureBegin = (event: any) => {
    // ピンチで拡大していると、実際のView上の座標と画像の論理サイズがずれるので注意
    // ここでは「スクリーン上のx,yをそのまま使う→あとで逆変換」する想定
    const { x, y } = event.nativeEvent;
    startPos.current = { x, y };
    setCurrentRect({ startX: x, startY: y, endX: x, endY: y });
  };

  /**
   * ドラッグ中
   */
  const handleGestureEvent = (event: any) => {
    const { x, y } = event.nativeEvent;
    if (currentRect) {
      setCurrentRect({
        startX: startPos.current.x,
        startY: startPos.current.y,
        endX: x,
        endY: y,
      });
    }
  };

  /**
   * ドラッグ終了 => Rectを確定し、相対座標で保存
   */
  const handleGestureEnd = () => {
    if (!currentRect || displayedWidth === 0 || displayedHeight === 0) {
      setCurrentRect(null);
      return;
    }
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
  };

  const handleRemoveRectangle = (id: number) => {
    const removedRectMasks = rectMasks.filter((_, i) => i !== id);
    onChangeMaskData(removedRectMasks);
  };

  /**
   * ピンチイベント
   */
  const pinchRef = useRef(null);
  const onPinchEvent = (event: any) => {
    // gesture scale
    const scale = event.nativeEvent.scale;
    setScaleValue(scale);
  };
  const onPinchEnd = () => {
    // ピンチが終わったタイミングで scaleValue が確定される
    // 必要に応じて、最小/最大スケールを制御
    // setScaleValue(Math.max(1, Math.min(scaleValue, 3)));
  };

  return (
    /**
     * GestureHandlerRootViewでラップ
     * PinchGestureHandler 内に PanGestureHandler をネスト可能
     */
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onPinchEvent}
        onEnded={onPinchEnd}
      >
        <View style={styles.container}>
          <View
            style={{
              ...styles.imageContainer,
              transform: [{ scale: scaleValue }],
            }}
            onLayout={onImageLayout}
          >
            {/* 
              transform: scaleValue で画像+SVGごと拡縮 
              origin (0,0) が左上なので、中心拡縮をしたい場合は additional transformが必要
            */}
            {/* <View
              style={{
                transform: [{ scale: scaleValue }],
                // transformOrigin 的なものを調整する場合は
                // e.g. transform: [{ translateX: -someOffset }, { translateY: -someOffset }, { scale: scaleValue }, ... ]
              }}
            > */}
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain" // or "cover"
            />

            <PanGestureHandler
              onBegan={handleGestureBegin}
              onGestureEvent={handleGestureEvent}
              onEnded={handleGestureEnd}
            >
              <Svg style={[StyleSheet.absoluteFill]}>
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
            </PanGestureHandler>
          </View>
        </View>
        {/* </View> */}
      </PinchGestureHandler>
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
    width: "100%",
    height: "100%",
  },
});
