import { View, StyleSheet } from "react-native";

import { Image } from "expo-image";
import PlaceHolderImage from "@/assets/images/background-image.png";
export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image source={PlaceHolderImage} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
