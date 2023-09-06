import { MediaTypeOptions } from "expo-image-picker";

export const imageLibraryOptions = {
  base64: true,
  mediaTypes: MediaTypeOptions.Images,
  // allowsEditing: true,
  // aspect: [9, 16], // Related to allowsEditing setting and works only on Android.
  selectionLimit: 1,
  quality: 1,
};
