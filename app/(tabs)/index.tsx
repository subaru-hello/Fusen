import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import { useEvent } from "expo";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  FlatList,
} from "react-native";
// import {Mp4Video} from "./test.mp4";
// const videoSource =
//   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const video1: VideoSource = require("../../assets/videos/top_video_concurrency_register.mp4");
const video2: VideoSource = require("../../assets/videos/top_video_concurrency_study.mp4");
const video3: VideoSource = require("../../assets/videos/top_video_list.mp4");

export default function Index() {
  const player = useVideoPlayer(video1, (player) => {
    player.loop = true;
    player.play();
  });
  const player2 = useVideoPlayer(video2, (player) => {
    player.loop = true;
    player.play();
  });
  const player3 = useVideoPlayer(video3, (player) => {
    player.loop = true;
    player.play();
  });
  // const { isPlaying } = useEvent(player, "playingChange", {
  //   isPlaying: player.playing,
  // });

  const waysToUseApp = [
    {
      title: "隠して登録",
      content: () => (
        <View>
          <Text>
            好きな画像を登録できるよ。{"\n"}隠したい箇所を指でなぞろう。
          </Text>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      ),
    },
    {
      title: "隠して学習",
      content: () => (
        <View style={{ display: "flex" }}>
          <Text>画像詳細では、隠した部分のつけ外しができるよ。</Text>
          <VideoView
            style={styles.video}
            player={player2}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      ),
    },
    {
      title: "隠した一覧",
      content: () => (
        <View>
          <Text>登録した画像は一覧で確認できるよ。</Text>
          <VideoView
            style={styles.video}
            player={player3}
            allowsFullscreen
            allowsPictureInPicture
          />
        </View>
      ),
    },
  ];
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <Text style={styles.title}>隠スタディの使い方</Text>
      </View>
      <FlatList
        style={styles.container}
        data={waysToUseApp}
        keyExtractor={(_, index) => `key-${index}`}
        renderItem={({ item }) => (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{item.title}</Text>
            <View style={styles.stepContent}>{item.content()}</View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/study/create")}
      >
        {/* アイコンなどを表示。Ionicons などを使っても良い */}
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: "flex",
    // backgroundColor: "white",
    // alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: "column",
    // width: "90%",
    marginBottom: 8,
    // padding: 12,
    // backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  stepContent: {
    // fontSize: 14,
    // lineHeight: 20,
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
  contentContainer: {
    flex: 1,
    padding: 10,
    // alignItems: "center",
    // justifyContent: "certer",
    paddingHorizontal: 50,
  },
  video: {
    height: 275,
  },
  controlsContainer: {
    padding: 10,
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
});
