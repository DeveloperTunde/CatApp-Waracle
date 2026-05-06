import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { Alert, Platform } from "react-native";

interface UseImagePickerReturn {
  pickImage: () => Promise<string | null>;
  requestPermission: () => Promise<boolean>;
}

export function useImagePicker(): UseImagePickerReturn {
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === "web") return true;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to upload cat images.",
        [{ text: "OK" }],
      );
      return false;
    }
    return true;
  }, []);

  const pickImage = useCallback(async (): Promise<string | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
      allowsMultipleSelection: false,
    });

    if (result.canceled || !result.assets?.length) return null;

    return result.assets[0].uri;
  }, [requestPermission]);

  return { pickImage, requestPermission };
}
