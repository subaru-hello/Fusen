import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  LayoutChangeEvent,
  GestureResponderEvent,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { NON_CUSTOMER_FLASH_CARD_KEY } from "@/constants";
import { TImage } from "@/types";
import MaskedBlocks from "@/components/organisms/study/MaskedBlocks";
import { getValueFor } from "@/lib/storage";

export default function StudyDetailScreen() {
  const local = useLocalSearchParams();

  const [displayedWidth, setDisplayedWidth] = useState(0);
  const [displayedHeight, setDisplayedHeight] = useState(0);

  // 四角ごとに「隠す/表示」を管理する
  // ※ 初期値 true = 隠れてる(黒塗り)
  const [imageData, setImageData] = useState<TImage | null>(null);
  const [hiddenRects, setHiddenRects] = useState<boolean[]>([]);

  // 非同期処理でデータを取得
  useEffect(() => {
    const fetchData = async () => {
      const storedData = await getValueFor(NON_CUSTOMER_FLASH_CARD_KEY);
      const images: TImage[] = storedData ? JSON.parse(storedData) : [];
      const image = images.find((img) => img.id === Number(local.id)) ?? {
        id: 0,
        uri: "",
        masks: [],
      };
      setImageData(image);

      // hiddenRects をマスクの数に合わせて初期化
      setHiddenRects(Array(image.masks.length).fill(true));
    };

    fetchData();
  }, []);

  // 画像データがまだロードされていない場合
  if (!imageData) {
    return <Text>ロード中...</Text>; // ローディング中のUI
  }

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
  },
});
