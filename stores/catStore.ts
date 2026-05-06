import { PAGE_SIZE } from "@constants/api";
import {
  createFavourite,
  createVote,
  deleteFavourite,
  deleteVote,
  fetchFavourites,
  fetchMyImages,
  fetchVotes,
} from "@services/catApi";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CatCardData, CatImage, Favourite, Vote } from "../types";

interface CatState {
  images: CatImage[];
  votes: Vote[];
  favourites: Favourite[];

  page: number;
  hasMore: boolean;
  isLoadingImages: boolean;
  isLoadingMeta: boolean;
  isFetchingMore: boolean;

  error: string | null;

  // Derived / computed
  getCardData: (imageId: string) => CatCardData | undefined;

  // Actions
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleFavourite: (imageId: string) => Promise<void>;
  vote: (imageId: string, direction: "up" | "down") => Promise<void>;
  addImage: (image: CatImage) => void;
  clearError: () => void;
}

export const useCatStore = create<CatState>()(
  immer((set, get) => ({
    images: [],
    votes: [],
    favourites: [],
    page: 0,
    hasMore: true,
    isLoadingImages: false,
    isLoadingMeta: false,
    isFetchingMore: false,
    error: null,

    getCardData: (imageId: string): CatCardData | undefined => {
      const { images, votes, favourites } = get();
      const image = images.find((img) => img.id === imageId);
      if (!image) return undefined;

      const imageVotes = votes.filter((v) => v.image_id === imageId);
      const upVotes = imageVotes.filter((v) => v.value === 1).length;
      const downVotes = imageVotes.filter((v) => v.value === 0).length;
      const score = upVotes - downVotes;

      const favourite = favourites.find((f) => f.image_id === imageId);
      const isFavourited = !!favourite;

      // Determine user's current vote (last vote wins)
      const sorted = [...imageVotes].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      const lastVote = sorted[0];
      const userUpvoted = lastVote?.value === 1;
      const userDownvoted = lastVote?.value === 0;

      return {
        image,
        score,
        isFavourited,
        favouriteId: favourite?.id,
        userUpvoted,
        userDownvoted,
      };
    },

    loadInitial: async () => {
      set((state) => {
        state.isLoadingImages = true;
        state.isLoadingMeta = true;
        state.error = null;
        state.page = 0;
      });

      try {
        const [images, votes, favourites] = await Promise.all([
          fetchMyImages(0),
          fetchVotes(),
          fetchFavourites(),
        ]);

        set((state) => {
          state.images = images;
          state.votes = votes;
          state.favourites = favourites;
          state.page = 0;
          state.hasMore = images.length === PAGE_SIZE;
          state.isLoadingImages = false;
          state.isLoadingMeta = false;
        });
      } catch (err) {
        set((state) => {
          state.error =
            err instanceof Error ? err.message : "Failed to load cats";
          state.isLoadingImages = false;
          state.isLoadingMeta = false;
        });
      }
    },

    loadMore: async () => {
      const { isFetchingMore, hasMore, page } = get();
      if (isFetchingMore || !hasMore) return;

      const nextPage = page + 1;
      set((state) => {
        state.isFetchingMore = true;
      });

      try {
        const newImages = await fetchMyImages(nextPage);
        set((state) => {
          state.images = [...state.images, ...newImages];
          state.page = nextPage;
          state.hasMore = newImages.length === PAGE_SIZE;
          state.isFetchingMore = false;
        });
      } catch (err) {
        set((state) => {
          state.error =
            err instanceof Error ? err.message : "Failed to load more cats";
          state.isFetchingMore = false;
        });
      }
    },

    refresh: async () => {
      await get().loadInitial();
    },

    toggleFavourite: async (imageId: string) => {
      const { favourites } = get();
      const existing = favourites.find((f) => f.image_id === imageId);

      if (existing) {
        // Optimistic remove
        set((state) => {
          state.favourites = state.favourites.filter(
            (f) => f.image_id !== imageId,
          );
        });
        try {
          await deleteFavourite(existing.id);
        } catch (err) {
          // Rollback
          set((state) => {
            state.favourites.push(existing);
            state.error =
              err instanceof Error ? err.message : "Failed to unfavourite";
          });
        }
      } else {
        // Optimistic add
        const optimisticFav: Favourite = {
          id: Date.now(),
          user_id: "local",
          image_id: imageId,
          created_at: new Date().toISOString(),
          image: get().images.find((img) => img.id === imageId)!,
        };
        set((state) => {
          state.favourites.push(optimisticFav);
        });
        try {
          const { id } = await createFavourite({ image_id: imageId });
          set((state) => {
            const idx = state.favourites.findIndex(
              (f) => f.id === optimisticFav.id,
            );
            if (idx !== -1) state.favourites[idx].id = id;
          });
        } catch (err) {
          // Rollback
          set((state) => {
            state.favourites = state.favourites.filter(
              (f) => f.id !== optimisticFav.id,
            );
            state.error =
              err instanceof Error ? err.message : "Failed to favourite";
          });
        }
      }
    },

    vote: async (imageId: string, direction: "up" | "down") => {
      const value = direction === "up" ? 1 : 0;
      const { votes } = get();

      // If same direction vote exists, remove it (toggle off)
      const existing = votes.find(
        (v) => v.image_id === imageId && v.value === value,
      );

      if (existing) {
        set((state) => {
          state.votes = state.votes.filter((v) => v.id !== existing.id);
        });
        try {
          await deleteVote(existing.id);
        } catch (err) {
          set((state) => {
            state.votes.push(existing);
            state.error =
              err instanceof Error ? err.message : "Failed to remove vote";
          });
        }
        return;
      }

      // Remove opposite vote if exists
      const opposite = votes.find(
        (v) => v.image_id === imageId && v.value !== value,
      );
      if (opposite) {
        set((state) => {
          state.votes = state.votes.filter((v) => v.id !== opposite.id);
        });
        try {
          await deleteVote(opposite.id);
        } catch {
          // best effort
        }
      }

      // Optimistic add
      const optimisticVote: Vote = {
        id: Date.now(),
        image_id: imageId,
        value,
        created_at: new Date().toISOString(),
      };
      set((state) => {
        state.votes.push(optimisticVote);
      });

      try {
        const { id } = await createVote({ image_id: imageId, value });
        set((state) => {
          const idx = state.votes.findIndex((v) => v.id === optimisticVote.id);
          if (idx !== -1) state.votes[idx].id = id;
        });
      } catch (err) {
        set((state) => {
          state.votes = state.votes.filter((v) => v.id !== optimisticVote.id);
          state.error = err instanceof Error ? err.message : "Failed to vote";
        });
      }
    },

    addImage: (image: CatImage) => {
      set((state) => {
        state.images.unshift(image);
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  })),
);
