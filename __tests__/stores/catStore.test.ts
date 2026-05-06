import { act } from "@testing-library/react-hooks";
import { useCatStore } from "../../stores/catStore";

// Mock the API services
jest.mock("../../services/catApi", () => ({
  fetchMyImages: jest.fn(),
  fetchVotes: jest.fn(),
  fetchFavourites: jest.fn(),
  createVote: jest.fn(),
  deleteVote: jest.fn(),
  createFavourite: jest.fn(),
  deleteFavourite: jest.fn(),
}));

import {
  createFavourite,
  createVote,
  deleteFavourite,
  deleteVote,
  fetchFavourites,
  fetchMyImages,
  fetchVotes,
} from "../../services/catApi";

const mockImage = { id: "img1", url: "https://example.com/cat1.jpg" };
const mockVoteUp = {
  id: 1,
  image_id: "img1",
  value: 1 as const,
  created_at: "2024-01-01T00:00:00Z",
};
const mockVoteDown = {
  id: 2,
  image_id: "img1",
  value: 0 as const,
  created_at: "2024-01-02T00:00:00Z",
};
const mockFav = {
  id: 10,
  image_id: "img1",
  user_id: "user1",
  created_at: "2024-01-01T00:00:00Z",
  image: mockImage,
};

function resetStore() {
  useCatStore.setState({
    images: [],
    votes: [],
    favourites: [],
    page: 0,
    hasMore: true,
    isLoadingImages: false,
    isLoadingMeta: false,
    isFetchingMore: false,
    error: null,
  });
}

describe("catStore", () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  describe("loadInitial", () => {
    it("loads images, votes and favourites on success", async () => {
      (fetchMyImages as jest.Mock).mockResolvedValue([mockImage]);
      (fetchVotes as jest.Mock).mockResolvedValue([mockVoteUp]);
      (fetchFavourites as jest.Mock).mockResolvedValue([mockFav]);

      await act(async () => {
        await useCatStore.getState().loadInitial();
      });

      const state = useCatStore.getState();
      expect(state.images).toEqual([mockImage]);
      expect(state.votes).toEqual([mockVoteUp]);
      expect(state.favourites).toEqual([mockFav]);
      expect(state.isLoadingImages).toBe(false);
      expect(state.error).toBeNull();
    });

    it("sets error on failure", async () => {
      (fetchMyImages as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );
      (fetchVotes as jest.Mock).mockResolvedValue([]);
      (fetchFavourites as jest.Mock).mockResolvedValue([]);

      await act(async () => {
        await useCatStore.getState().loadInitial();
      });

      expect(useCatStore.getState().error).toBe("Network error");
    });

    it("sets hasMore false when images < PAGE_SIZE", async () => {
      (fetchMyImages as jest.Mock).mockResolvedValue([mockImage]); // only 1, < 12
      (fetchVotes as jest.Mock).mockResolvedValue([]);
      (fetchFavourites as jest.Mock).mockResolvedValue([]);

      await act(async () => {
        await useCatStore.getState().loadInitial();
      });

      expect(useCatStore.getState().hasMore).toBe(false);
    });
  });

  describe("getCardData", () => {
    it("returns undefined for unknown image", () => {
      const result = useCatStore.getState().getCardData("nonexistent");
      expect(result).toBeUndefined();
    });

    it("calculates score as upvotes minus downvotes", () => {
      useCatStore.setState({
        images: [mockImage],
        votes: [mockVoteUp, mockVoteDown],
        favourites: [],
      });

      const data = useCatStore.getState().getCardData("img1");
      expect(data?.score).toBe(0); // 1 up - 1 down = 0
    });

    it("correctly identifies favourited image", () => {
      useCatStore.setState({
        images: [mockImage],
        votes: [],
        favourites: [mockFav],
      });

      const data = useCatStore.getState().getCardData("img1");
      expect(data?.isFavourited).toBe(true);
      expect(data?.favouriteId).toBe(10);
    });

    it("detects user upvote state", () => {
      useCatStore.setState({
        images: [mockImage],
        votes: [mockVoteUp],
        favourites: [],
      });
      const data = useCatStore.getState().getCardData("img1");
      expect(data?.userUpvoted).toBe(true);
      expect(data?.userDownvoted).toBe(false);
    });
  });

  describe("toggleFavourite", () => {
    it("adds favourite optimistically when not favourited", async () => {
      useCatStore.setState({ images: [mockImage], votes: [], favourites: [] });
      (createFavourite as jest.Mock).mockResolvedValue({ id: 99 });

      await act(async () => {
        await useCatStore.getState().toggleFavourite("img1");
      });

      const { favourites } = useCatStore.getState();
      expect(favourites.some((f) => f.image_id === "img1")).toBe(true);
      expect(favourites[0].id).toBe(99);
    });

    it("removes favourite optimistically when favourited", async () => {
      useCatStore.setState({
        images: [mockImage],
        votes: [],
        favourites: [mockFav],
      });
      (deleteFavourite as jest.Mock).mockResolvedValue(undefined);

      await act(async () => {
        await useCatStore.getState().toggleFavourite("img1");
      });

      expect(useCatStore.getState().favourites).toHaveLength(0);
    });

    it("rolls back on API error when adding", async () => {
      useCatStore.setState({ images: [mockImage], votes: [], favourites: [] });
      (createFavourite as jest.Mock).mockRejectedValue(new Error("API error"));

      await act(async () => {
        await useCatStore.getState().toggleFavourite("img1");
      });

      expect(useCatStore.getState().favourites).toHaveLength(0);
      expect(useCatStore.getState().error).toBe("API error");
    });
  });

  describe("vote", () => {
    it("adds upvote optimistically", async () => {
      useCatStore.setState({ images: [mockImage], votes: [], favourites: [] });
      (createVote as jest.Mock).mockResolvedValue({ id: 55 });

      await act(async () => {
        await useCatStore.getState().vote("img1", "up");
      });

      const { votes } = useCatStore.getState();
      expect(votes.some((v) => v.image_id === "img1" && v.value === 1)).toBe(
        true,
      );
    });

    it("toggles off existing vote in same direction", async () => {
      useCatStore.setState({
        images: [mockImage],
        votes: [mockVoteUp],
        favourites: [],
      });
      (deleteVote as jest.Mock).mockResolvedValue(undefined);

      await act(async () => {
        await useCatStore.getState().vote("img1", "up");
      });

      expect(useCatStore.getState().votes).toHaveLength(0);
    });

    it("switches from downvote to upvote", async () => {
      useCatStore.setState({
        images: [mockImage],
        votes: [mockVoteDown],
        favourites: [],
      });
      (deleteVote as jest.Mock).mockResolvedValue(undefined);
      (createVote as jest.Mock).mockResolvedValue({ id: 66 });

      await act(async () => {
        await useCatStore.getState().vote("img1", "up");
      });

      const { votes } = useCatStore.getState();
      expect(votes.every((v) => v.value === 1)).toBe(true);
    });
  });

  describe("addImage", () => {
    it("prepends image to the list", () => {
      useCatStore.setState({ images: [mockImage] });
      const newImage = { id: "img2", url: "https://example.com/cat2.jpg" };
      useCatStore.getState().addImage(newImage);
      expect(useCatStore.getState().images[0]).toEqual(newImage);
    });
  });

  describe("clearError", () => {
    it("clears the error state", () => {
      useCatStore.setState({ error: "Some error" });
      useCatStore.getState().clearError();
      expect(useCatStore.getState().error).toBeNull();
    });
  });
});
