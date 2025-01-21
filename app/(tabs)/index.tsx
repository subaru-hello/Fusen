import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>このアプリの使い方</Text>

      {/* Step1 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step1 画像を登録</Text>
        <Text style={styles.stepContent}>
          画面右下のプラスボタンを押して画像を選択。
          {"\n"}
          隠したい箇所を指でなぞってマスクをかけよう。
          {"\n"}
          全て隠せたら保存を押してね！
        </Text>
      </View>

      {/* Step2 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step2 登録画像一覧ページ</Text>
        <Text style={styles.stepContent}>
          登録した画像を一覧で確認できるよ。
        </Text>
      </View>

      {/* Step3 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step3 画像詳細ページ</Text>
        <Text style={styles.stepContent}>
          マスクのON/OFFはタッチで切り替えられるよ。
        </Text>
      </View>

      {/* 画像登録ボタン */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/study/create")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stepContainer: {
    width: "90%",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  stepContent: {
    fontSize: 14,
    lineHeight: 20,
  },
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
