import { API_BASE_URL, API_KEY, ENDPOINTS, PAGE_SIZE } from "@constants/api";
import axios from "axios";
import {
  CatImage,
  CreateFavouritePayload,
  CreateVotePayload,
  Favourite,
  UploadResponse,
  Vote,
} from "../types";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      let message = `Request failed with status ${status}`;

      if (typeof data === "string" && data.length > 0) {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("No response from server. Check your connection."),
      );
    }

    return Promise.reject(
      new Error(error.message ?? "An unexpected error occurred"),
    );
  },
);

export async function fetchMyImages(page: number = 0): Promise<CatImage[]> {
  const { data } = await apiClient.get<CatImage[]>(ENDPOINTS.images, {
    params: { limit: PAGE_SIZE, page, order: "DESC" },
  });
  //console.log("Fetched images:", data);
  return data;
}

export async function uploadCatImage(uri: string): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as unknown as Blob);

  const { data } = await apiClient.post<UploadResponse>(
    ENDPOINTS.imageUpload,
    formData,
    {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data) => data,
    },
  );

  return data;
}

export async function fetchVotes(): Promise<Vote[]> {
  const { data } = await apiClient.get<Vote[]>(ENDPOINTS.votes, {
    params: { limit: 100 },
  });
  return data;
}

export async function createVote(
  payload: CreateVotePayload,
): Promise<{ id: number }> {
  const { data } = await apiClient.post<{ id: number }>(
    ENDPOINTS.votes,
    payload,
  );
  return data;
}

export async function deleteVote(voteId: number): Promise<void> {
  await apiClient.delete(`${ENDPOINTS.votes}/${voteId}`);
}

export async function fetchFavourites(): Promise<Favourite[]> {
  const { data } = await apiClient.get<Favourite[]>(ENDPOINTS.favourites, {
    params: { limit: 100 },
  });
  return data;
}

export async function createFavourite(
  payload: CreateFavouritePayload,
): Promise<{ id: number }> {
  const { data } = await apiClient.post<{ id: number }>(
    ENDPOINTS.favourites,
    payload,
  );
  return data;
}

export async function deleteFavourite(favouriteId: number): Promise<void> {
  await apiClient.delete(`${ENDPOINTS.favourites}/${favouriteId}`);
}
