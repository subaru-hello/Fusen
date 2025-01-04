import React, { useState, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useLocalSearchParams } from "expo-router";
import { storage, STORAGE_KEY } from "../create";
import { TImage, TMask } from "./index";

export default function StudyDetailScreen() {
  const local = useLocalSearchParams();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  // Local Storage から画像を取得
  const imageData: TImage = useMemo(() => {
    const storedData = storage.getString(STORAGE_KEY);
    const images: TImage[] = storedData ? JSON.parse(storedData) : [];
    const card = images.find((img) => img.id === Number(local.id));
    return card ?? { id: 0, uri: "", masks: [] };
  }, [local]);

  // 四角ごとに「隠す/表示」を管理するための state
  // ※ 初期値 true = 隠れてる(黒塗り)
  const [hiddenRects, setHiddenRects] = useState<Record<number, boolean>>({});

  const toggleRectVisibility = (index: number) => {
    setHiddenRects((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const onContainerLayout = (e: LayoutChangeEvent) => {
    setLayoutWidth(e.nativeEvent.layout.width);
    setLayoutHeight(e.nativeEvent.layout.height);
  };
  console.log("~~~~~~", imageData.masks);
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} onLayout={onContainerLayout}>
        {/* 画像の表示 */}
        <Image
          source={{ uri: imageData.uri }}
          style={styles.image}
          resizeMode="contain"
        />

        <Svg style={styles.svg}>
          {imageData.masks.map((mask: TMask, index: number) => {
            // 四隅から実際の描画サイズを求める
            const left = Math.min(mask.x1, mask.x2) * layoutWidth;
            const top = Math.min(mask.y1, mask.y2) * layoutHeight;
            const width = Math.abs(mask.x2 - mask.x1) * layoutWidth;
            const height = Math.abs(mask.y2 - mask.y1) * layoutHeight;

            // hiddenRects[index]がtrueなら黒塗り、falseなら透明にするとか
            const isHidden = hiddenRects[index] ?? true;
            const fillColor = isHidden ? "black" : "transparent";

            return (
              <Rect
                key={index}
                x={left}
                y={top}
                width={width}
                height={height}
                fill={fillColor}
                onPress={() => toggleRectVisibility(index)}
              />
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const DEVICE_WIDTH = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    // 例として正方形にする
    height: DEVICE_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH,
    zIndex: -1,
  },
  svg: {
    position: "absolute",
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH,
    zIndex: 2,
  },
});
