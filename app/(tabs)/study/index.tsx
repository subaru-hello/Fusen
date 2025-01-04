import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { storage } from "../create";

const STORAGE_KEY = "@myFlashcardImages";
export type TMask = { x1: number; y1: number; x2: number; y2: number };
export type TImage = {
  id: number;
  uri: string;
  masks: TMask[];
};
export default function StudyListScreen() {
  const [imageList, setImageList] = useState<TImage[]>([]);
  const router = useRouter();

  const fetchImages = () => {
    const storedData = storage.getString(STORAGE_KEY);
    const images = storedData ? JSON.parse(storedData) : [];
    setImageList(images);
  };

  useEffect(() => {
    // const unsubscribe = router.addListener("focus", fetchImages);
    fetchImages();
    // Expo RouterにはNavigationイベントがないので、実際はuseFocusEffectなど
    // あるいは画面に戻ってきたタイミングで再描画されるようにする
    return () => {
      // もしイベントがあるならdetach
    };
  }, []);

  const handlePressItem = (item: any) => {
    // detail画面へ遷移。クエリパラメータを付ける例
    router.push({
      pathname: "/(tabs)/study/[id]",
      params: { id: item.id, item: item },
    });
  };

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
          <Link
            key={item.id}
            href={{
              pathname: "/(tabs)/study/[id]",
              params: { id: item.id },
            }}
          >
            <TouchableOpacity
              style={styles.item}
              onPress={() => handlePressItem(item)}
            >
              <Text>画像ID: {item.id}</Text>
            </TouchableOpacity>
          </Link>
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
