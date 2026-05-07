export const API_BASE_URL = process.env.EXPO_PUBLIC_CAT_API_BASE_URL ?? "";
export const API_KEY = process.env.EXPO_PUBLIC_CAT_API_KEY ?? "";

if (__DEV__ && process.env.NODE_ENV !== "test") {
  if (!API_BASE_URL) console.warn("Missing EXPO_PUBLIC_CAT_API_BASE_URL");
  if (!API_KEY) console.warn("Missing EXPO_PUBLIC_CAT_API_KEY");
}

export const ENDPOINTS = {
  images: "/images",
  imageUpload: "/images/upload",
  votes: "/votes",
  favourites: "/favourites",
} as const;

export const PAGE_SIZE = 12;
