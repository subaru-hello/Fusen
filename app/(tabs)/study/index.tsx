import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { NON_CUSTOMER_FLASH_CARD_KEY } from "@/constants";
import { storage } from "@/lib/storage";
import { TImage } from "@/types";

export default function StudyListScreen() {
  const [imageList, setImageList] = useState<TImage[]>([]);

  const fetchImages = () => {
    const storedData = storage.getString(NON_CUSTOMER_FLASH_CARD_KEY);
    const images = storedData ? JSON.parse(storedData) : [];
    setImageList(images);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (imageList.length === 0) {
    return (
      <View style={styles.container}>
        <Text>登録された画像がありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={imageList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ display: "flex" }}>
            <Link
              key={item.id}
              href={{
                pathname: "/(tabs)/study/[id]",
                params: { id: item.id },
              }}
            >
              <Text style={styles.item}>画像ID: {item.id}</Text>
            </Link>
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "90%",
  },
});
