import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { View, Text, Button, Image, StyleSheet } from "react-native";
import ImageMaskDrawer from "@/components/ImageMaskDrawer";
import { NON_CUSTOMER_FLASH_CARD_KEY } from "@/constants";
import { storage } from "@/lib/storage";

export default function CreateScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [maskedData, setMaskedData] = useState<any[]>([]);

  // TODO: 会員: true。非会員: false
  const isRegisteredMember = true;
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
      const storedData = storage.getString(NON_CUSTOMER_FLASH_CARD_KEY);
      let images = storedData ? JSON.parse(storedData) : [];

      // 非会員は 1 つのみ画像を登録できる要件を考慮
      if (!isRegisteredMember) {
        // 画像を置き換える
        images = [];
      }

      const newImageData = {
        id: Date.now(),
        uri: selectedImage,
        masks: maskedData,
      };

      images.push(newImageData);

      storage.set(NON_CUSTOMER_FLASH_CARD_KEY, JSON.stringify(images));
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
          <Button title="この画像を保存" onPress={handleSaveMaskData} />
          <Text>隠したい部分をなぞってね：</Text>
          {/* 指でなぞった部分の座標を取得するコンポーネント */}
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
