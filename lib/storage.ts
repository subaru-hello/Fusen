import * as SecureStore from "expo-secure-store";

export async function saveToLocalStorage(key: any, value: any) {
  console.log("saveToLocalStorage", key + value);
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: any) {
  console.log("=====key", key);
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("🔐 Here's your value 🔐 \n" + result);
    return result;
  } else {
    console.log("No values stored under that key.");
    return "";
  }
}
