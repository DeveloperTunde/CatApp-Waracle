import { uploadCatImage } from "@services/catApi";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CatImage } from "../types";

interface UploadState {
  selectedUri: string | null;
  isUploading: boolean;
  error: string | null;
  validationErrors: string[];

  selectImage: (uri: string) => void;
  clearSelection: () => void;
  upload: () => Promise<CatImage | null>;
  clearError: () => void;
}

const ALLOWED_TYPES = ["jpg", "jpeg", "png", "gif", "webp"];

function getExtension(uri: string): string {
  const parts = uri.split(".");
  return parts[parts.length - 1].toLowerCase();
}

export const useUploadStore = create<UploadState>()(
  immer((set, get) => ({
    selectedUri: null,
    isUploading: false,
    error: null,
    validationErrors: [],

    selectImage: (uri: string) => {
      const errors: string[] = [];
      const ext = getExtension(uri);

      if (!ALLOWED_TYPES.includes(ext)) {
        errors.push(
          `File type ".${ext}" is not allowed. Please use: ${ALLOWED_TYPES.join(", ")}`,
        );
      }

      set((state) => {
        state.selectedUri = uri;
        state.validationErrors = errors;
        state.error = null;
      });
    },

    clearSelection: () => {
      set((state) => {
        state.selectedUri = null;
        state.validationErrors = [];
        state.error = null;
      });
    },

    upload: async (): Promise<CatImage | null> => {
      const { selectedUri, validationErrors } = get();

      if (!selectedUri) {
        set((state) => {
          state.error = "Please select an image first";
        });
        return null;
      }

      if (validationErrors.length > 0) {
        return null;
      }

      set((state) => {
        state.isUploading = true;
        state.error = null;
      });

      try {
        const result = await uploadCatImage(selectedUri);
        // console.log("Uploaded cat image:", result);
        set((state) => {
          state.isUploading = false;
          state.selectedUri = null;
        });
        return { id: result.id, url: result.url };
      } catch (err) {
        // console.log("Uploaded cat image:", err);
        set((state) => {
          state.isUploading = false;
          state.error =
            err instanceof Error
              ? err.message
              : "Upload failed. Please try again.";
        });
        return null;
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  })),
);
