export interface CatImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

export interface Vote {
  id: number;
  image_id: string;
  sub_id?: string;
  created_at: string;
  value: number; // 1 = up, 0 = down
  country_code?: string;
}

export interface Favourite {
  id: number;
  user_id: string;
  image_id: string;
  sub_id?: string;
  created_at: string;
  image: CatImage;
}

export interface UploadResponse {
  id: string;
  url: string;
  pending: number;
  approved: number;
}

export interface CreateVotePayload {
  image_id: string;
  sub_id?: string;
  value: 1 | 0;
}

export interface CreateFavouritePayload {
  image_id: string;
  sub_id?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface CatCardData {
  image: CatImage;
  score: number;
  isFavourited: boolean;
  favouriteId?: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
}

export type VoteDirection = 'up' | 'down';
