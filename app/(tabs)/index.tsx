import { View, StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>楽しく暗記</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
});
