import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import ImageMaskDrawer from "@/components/organisms/study/ImageMaskDrawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { NON_CUSTOMER_FLASH_CARD_KEY } from "@/constants";
import { getValueFor, saveToLocalStorage } from "@/lib/storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
  useEffect(() => {
    //   router.push("/study/index");
    pickImage();
  }, []);

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
      {!selectedImage ? (
        <>
          <Text style={styles.selectImageText}>
            右下のボタンを押して、画像を選択しよう
          </Text>
          <TouchableOpacity style={styles.fab} onPress={pickImage}>
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <ImageMaskDrawer
              imageUri={selectedImage}
              rectMasks={maskedData}
              onChangeMaskData={setMaskedData}
            />
          </View>
          <View style={styles.overlayButtonContainer}>
            {/* 別の画像を選択するボタン */}
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>別の画像を選択</Text>
            </TouchableOpacity>

            {/* マスクを初期化するボタン */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setMaskedData([])}
            >
              <Text style={styles.buttonText}>マスクを初期化</Text>
            </TouchableOpacity>

            {/* 保存ボタン */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSaveMaskData}
            >
              <Text style={styles.buttonText}>保存する</Text>
              <MaterialIcons name="save-alt" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
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
  overlayButtonContainer: {
    position: "absolute",
    bottom: 0, // 画面下に固定
    left: 0, // 左右に余白を持たせたいなら調整
    right: 0,
    flexDirection: "row", // 横並びにする
    alignItems: "center", // 垂直方向のセンタリング
    justifyContent: "center", // 水平方向の配置（centerだと真ん中寄せ）
    padding: 10,
    borderRadius: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f57c00",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginRight: 6,
  },
  saveText: {
    marginRight: 12, // アイコンとの間に適度な余白
    fontSize: 16,
  },
  selectImageText: {
    alignItems: "center",
    margin: "auto",
  }, // 右下に表示する丸ボタン
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // 高さ/2 で丸に

    backgroundColor: "#f57c00",
    alignItems: "center",
    justifyContent: "center",

    // iOS向けシャドウ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,

    // Android向けシャドウ
    elevation: 5,
  },
});
