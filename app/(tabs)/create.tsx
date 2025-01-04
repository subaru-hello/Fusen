import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { View, Text, Button, Image, StyleSheet } from "react-native";
import { MMKV } from "react-native-mmkv";
import ImageMaskDrawer from "@/components/ImageMaskDrawer";

export const storage = new MMKV();
export const STORAGE_KEY = "@myFlashcardImages"; // ローカルストレージに保存するキー

export default function CreateScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [maskedData, setMaskedData] = useState<any[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: false,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]?.uri);
    }
  };

  /**
   * 描画領域（マスク情報）の保存
   */
  const handleSaveMaskData = async () => {
    if (!selectedImage) return;

    try {
      // 既存データの取得
      const storedData = storage.getString(STORAGE_KEY);
      let images = storedData ? JSON.parse(storedData) : [];

      // 非会員は 1 つのみ画像を登録できる要件を考慮
      if (images.length >= 1) {
        // 置き換えるか、何もしないか等、要件に応じてロジックを追加
        // ここでは例として置き換える仕様に
        images = [];
      }

      const newImageData = {
        id: Date.now(),
        uri: selectedImage,
        masks: maskedData,
      };

      images.push(newImageData);

      storage.set(STORAGE_KEY, JSON.stringify(images));
      alert("画像を保存しました！");
      setSelectedImage(null);
      setMaskedData([]);
    } catch (error) {
      console.log(error);
      alert("保存時にエラーが発生しました");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>勉強用画像を作成</Text>

      {!selectedImage ? (
        <Button title="画像をアップロード" onPress={pickImage} />
      ) : (
        <>
          {/* <Text>選択された画像：</Text>
          <Image
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
            resizeMode="contain"
          /> */}

          <Button title="この画像を保存" onPress={handleSaveMaskData} />
          <Text>マスクを描画：</Text>
          {/* 指でなぞった部分の座標を取得するコンポーネント例 */}
          <ImageMaskDrawer
            imageUri={selectedImage}
            rectMasks={maskedData}
            onChangeMaskData={setMaskedData}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});
