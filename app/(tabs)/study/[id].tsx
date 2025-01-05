import React, { useState, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  LayoutChangeEvent,
  GestureResponderEvent,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { NON_CUSTOMER_FLASH_CARD_KEY } from "@/constants";
import { TImage } from "@/types";
import { storage } from "@/lib/storage";
import MaskedBlocks from "@/components/MaskedBlocks";

export default function StudyDetailScreen() {
  const local = useLocalSearchParams();

  const [displayedWidth, setDisplayedWidth] = useState(0);
  const [displayedHeight, setDisplayedHeight] = useState(0);
  // Local Storage から画像を取得
  const imageData: TImage = useMemo(() => {
    const storedData = storage.getString(NON_CUSTOMER_FLASH_CARD_KEY);
    const images: TImage[] = storedData ? JSON.parse(storedData) : [];
    const card = images.find((img) => img.id === Number(local.id));
    return card ?? { id: 0, uri: "", masks: [] };
  }, [local]);

  // 四角ごとに「隠す/表示」を管理する
  // ※ 初期値 true = 隠れてる(黒塗り)
  const [hiddenRects, setHiddenRects] = useState<boolean[]>(
    Array(imageData.masks.length).fill(true)
  );

  const toggleRectVisibility = (e: GestureResponderEvent, index: number) => {
    setHiddenRects((prev) => {
      // 配列をコピーして指定されたインデックスの値を反転
      const newHiddenRects = [...prev];
      newHiddenRects[index] = !newHiddenRects[index];
      return newHiddenRects;
    });
  };

  const onImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDisplayedWidth(width);
    setDisplayedHeight(height);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer} onLayout={onImageLayout}>
        <Image
          source={{ uri: imageData.uri }}
          style={styles.image}
          resizeMode="contain"
        />

        <MaskedBlocks
          imageData={imageData}
          displayedWidth={displayedWidth}
          displayedHeight={displayedHeight}
          toggleRectVisibility={toggleRectVisibility}
          hiddenRects={hiddenRects}
        />
      </View>
    </View>
  );
}

// const DEVICE_WIDTH = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
});
