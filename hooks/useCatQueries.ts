import {
  createFavourite,
  createVote,
  deleteFavourite,
  deleteVote,
  fetchFavourites,
  fetchMyImages,
  fetchVotes,
  uploadCatImage,
} from "@services/catApi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateFavouritePayload,
  CreateVotePayload,
  Favourite,
  Vote,
} from "../types";

export const queryKeys = {
  images: ["images"] as const,
  votes: ["votes"] as const,
  favourites: ["favourites"] as const,
};

//Queries

export function useImagesQuery() {
  return useInfiniteQuery({
    queryKey: queryKeys.images,
    queryFn: ({ pageParam = 0 }) => fetchMyImages(pageParam as number),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 12 ? allPages.length : undefined,
    initialPageParam: 0,
  });
}

export function useVotesQuery() {
  return useQuery({
    queryKey: queryKeys.votes,
    queryFn: fetchVotes,
  });
}

export function useFavouritesQuery() {
  return useQuery({
    queryKey: queryKeys.favourites,
    queryFn: fetchFavourites,
  });
}

//Upload Mutation

export function useUploadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uri: string) => uploadCatImage(uri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images });
    },
  });
}

//Vote Mutations

export function useCreateVoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVotePayload) => createVote(payload),

    onMutate: async (payload) => {
      // Cancel any in-flight refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.votes });

      // Snapshot current state for rollback
      const previousVotes = queryClient.getQueryData<Vote[]>(queryKeys.votes);

      // Optimistically add the new vote
      const optimisticVote: Vote = {
        id: Date.now(),
        image_id: payload.image_id,
        value: payload.value,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Vote[]>(queryKeys.votes, (old = []) => {
        // Remove any existing vote in opposite direction for same image
        const filtered = old.filter(
          (v) =>
            !(v.image_id === payload.image_id && v.value !== payload.value),
        );
        return [...filtered, optimisticVote];
      });

      return { previousVotes };
    },

    onError: (_err, _payload, context) => {
      // Roll back to snapshot on error
      if (context?.previousVotes) {
        queryClient.setQueryData(queryKeys.votes, context.previousVotes);
      }
    },

    onSettled: () => {
      // Always refetch after success or error to sync with server
      queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    },
  });
}

export function useDeleteVoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voteId: number) => deleteVote(voteId),

    onMutate: async (voteId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.votes });
      const previousVotes = queryClient.getQueryData<Vote[]>(queryKeys.votes);

      // Optimistically remove the vote
      queryClient.setQueryData<Vote[]>(queryKeys.votes, (old = []) =>
        old.filter((v) => v.id !== voteId),
      );

      return { previousVotes };
    },

    onError: (_err, _voteId, context) => {
      if (context?.previousVotes) {
        queryClient.setQueryData(queryKeys.votes, context.previousVotes);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    },
  });
}

//Favourite Mutations

export function useCreateFavouriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFavouritePayload) => createFavourite(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites });
      const previousFavourites = queryClient.getQueryData<Favourite[]>(
        queryKeys.favourites,
      );

      // Optimistically add favourite
      const optimisticFav: Favourite = {
        id: Date.now(),
        image_id: payload.image_id,
        user_id: "local",
        created_at: new Date().toISOString(),
        image: { id: payload.image_id, url: "" },
      };

      queryClient.setQueryData<Favourite[]>(
        queryKeys.favourites,
        (old = []) => [...old, optimisticFav],
      );

      return { previousFavourites };
    },

    onError: (_err, _payload, context) => {
      if (context?.previousFavourites) {
        queryClient.setQueryData(
          queryKeys.favourites,
          context.previousFavourites,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favourites });
    },
  });
}

export function useDeleteFavouriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favouriteId: number) => deleteFavourite(favouriteId),

    onMutate: async (favouriteId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites });
      const previousFavourites = queryClient.getQueryData<Favourite[]>(
        queryKeys.favourites,
      );

      // Optimistically remove favourite
      queryClient.setQueryData<Favourite[]>(queryKeys.favourites, (old = []) =>
        old.filter((f) => f.id !== favouriteId),
      );

      return { previousFavourites };
    },

    onError: (_err, _favouriteId, context) => {
      if (context?.previousFavourites) {
        queryClient.setQueryData(
          queryKeys.favourites,
          context.previousFavourites,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favourites });
    },
  });
}
