import { View, StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>About screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
});
