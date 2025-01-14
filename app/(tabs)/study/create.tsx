import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Button, StyleSheet } from "react-native";
import ImageMaskDrawer from "@/components/organisms/study/ImageMaskDrawer";
import { NON_CUSTOMER_FLASH_CARD_KEY } from "@/constants";
import { getValueFor, saveToLocalStorage } from "@/lib/storage";
import { router } from "expo-router";

export default function CreateScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [maskedData, setMaskedData] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  // 会員: true。非会員: false
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

  const handleSaveMaskData = async () => {
    if (!selectedImage) return;

    try {
      // 既存データの取得
      const storedData = await getValueFor(NON_CUSTOMER_FLASH_CARD_KEY);
      let images = storedData ? JSON.parse(storedData) : [];

      // 非会員は 1つだけ登録可能
      if (!isRegisteredMember) {
        images = [];
      }

      const newImageData = {
        id: Date.now(),
        uri: selectedImage,
        masks: maskedData,
      };

      images.push(newImageData);
      saveToLocalStorage(NON_CUSTOMER_FLASH_CARD_KEY, JSON.stringify(images));
      setSelectedImage(null);
      setMaskedData([]);
      alert("画像を保存しました！");
      router.navigate(`./${newImageData.id}`);
    } catch (error) {
      console.log(error);
      setSelectedImage(null);
      setMaskedData([]);
      alert("保存時にエラーが発生しました");
    }
  };

  return (
    <View style={styles.rootContainer}>
      {/* 
        画像を未選択ならボタン表示、
        画像を選択したらマスク機能表示 
      */}
      {!selectedImage ? (
        <Button title="勉強用の画像を選択" onPress={pickImage} />
      ) : (
        <>
          <Button title="画像登録" onPress={handleSaveMaskData} />
          <Text>隠したい部分をなぞってね</Text>
          <View style={styles.imageContainer}>
            <ImageMaskDrawer
              imageUri={selectedImage}
              rectMasks={maskedData}
              onChangeMaskData={setMaskedData}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    // 不要なpaddingがあれば外す
    // padding: 20,  ← これがあると高さが変わる原因
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
});
