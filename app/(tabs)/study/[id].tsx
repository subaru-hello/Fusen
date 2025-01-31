import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  LayoutChangeEvent,
  GestureResponderEvent,
  SafeAreaView,
  ActivityIndicator,
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

  // 画像 + マスク情報
  const [imageData, setImageData] = useState<TImage | null>(null);
  // マスク(四角)ごとに隠す/表示を切り替える
  const [hiddenRects, setHiddenRects] = useState<boolean[]>([]);

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
      setHiddenRects(Array(image.masks.length).fill(true));
    };
    fetchData();
  }, []);

  if (!imageData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const toggleRectVisibility = (e: GestureResponderEvent, index: number) => {
    setHiddenRects((prev) => {
      const newHiddenRects = [...prev];
      newHiddenRects[index] = !newHiddenRects[index];
      return newHiddenRects;
    });
  };

  const onImageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    console.log("DetailScreen width height", width, height);
    setDisplayedWidth(width);
    setDisplayedHeight(height);
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // 半透明の背景
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
