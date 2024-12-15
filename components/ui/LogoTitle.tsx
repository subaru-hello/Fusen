import { Image, StyleSheet } from "react-native";

export function LogoTitle() {
  return (
    <Image
      style={styles.image}
      source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
