import {
  createFavourite,
  createVote,
  deleteFavourite,
  deleteVote,
  fetchFavourites,
  fetchMyImages,
  fetchVotes,
  uploadCatImage,
} from "../../services/catApi";

jest.mock("../../services/catApi", () => ({
  fetchMyImages: jest.fn(),
  uploadCatImage: jest.fn(),
  fetchVotes: jest.fn(),
  createVote: jest.fn(),
  deleteVote: jest.fn(),
  fetchFavourites: jest.fn(),
  createFavourite: jest.fn(),
  deleteFavourite: jest.fn(),
}));

const mockedApi = {
  fetchMyImages: fetchMyImages as jest.MockedFunction<typeof fetchMyImages>,
  uploadCatImage: uploadCatImage as jest.MockedFunction<typeof uploadCatImage>,
  fetchVotes: fetchVotes as jest.MockedFunction<typeof fetchVotes>,
  createVote: createVote as jest.MockedFunction<typeof createVote>,
  deleteVote: deleteVote as jest.MockedFunction<typeof deleteVote>,
  fetchFavourites: fetchFavourites as jest.MockedFunction<
    typeof fetchFavourites
  >,
  createFavourite: createFavourite as jest.MockedFunction<
    typeof createFavourite
  >,
  deleteFavourite: deleteFavourite as jest.MockedFunction<
    typeof deleteFavourite
  >,
};

describe("catApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchMyImages", () => {
    it("returns list of images on success", async () => {
      const images = [{ id: "1", url: "https://example.com/cat.jpg" }];
      mockedApi.fetchMyImages.mockResolvedValueOnce(images);

      const result = await fetchMyImages(0);
      expect(result).toEqual(images);
    });

    it("passes correct page param", async () => {
      mockedApi.fetchMyImages.mockResolvedValueOnce([]);

      await fetchMyImages(2);
      expect(mockedApi.fetchMyImages).toHaveBeenCalledWith(2);
    });

    it("throws on error response", async () => {
      mockedApi.fetchMyImages.mockRejectedValueOnce(new Error("Server error"));
      await expect(fetchMyImages()).rejects.toThrow("Server error");
    });
  });

  describe("uploadCatImage", () => {
    it("returns upload response on success", async () => {
      const uploadResult = {
        id: "abc123",
        url: "https://cdn.thecatapi.com/abc123.jpg",
        pending: 0,
        approved: 1,
      };
      mockedApi.uploadCatImage.mockResolvedValueOnce(uploadResult);

      const result = await uploadCatImage("file://local/cat.jpg");
      expect(result).toEqual(uploadResult);
    });

    it("throws on upload failure", async () => {
      mockedApi.uploadCatImage.mockRejectedValueOnce(
        new Error("Upload failed"),
      );
      await expect(uploadCatImage("file://test.jpg")).rejects.toThrow(
        "Upload failed",
      );
    });
  });

  describe("fetchVotes", () => {
    it("returns votes array", async () => {
      const votes = [
        { id: 1, image_id: "x", value: 1 as const, created_at: "2024-01-01" },
      ];
      mockedApi.fetchVotes.mockResolvedValueOnce(votes);

      const result = await fetchVotes();
      expect(result).toEqual(votes);
    });
  });

  describe("createVote", () => {
    it("posts vote and returns id", async () => {
      mockedApi.createVote.mockResolvedValueOnce({ id: 42 });

      const result = await createVote({ image_id: "abc", value: 1 });
      expect(result).toEqual({ id: 42 });
      expect(mockedApi.createVote).toHaveBeenCalledWith({
        image_id: "abc",
        value: 1,
      });
    });
  });

  describe("deleteVote", () => {
    it("calls delete with correct id", async () => {
      mockedApi.deleteVote.mockResolvedValueOnce(undefined);

      await deleteVote(99);
      expect(mockedApi.deleteVote).toHaveBeenCalledWith(99);
    });
  });

  describe("fetchFavourites", () => {
    it("returns favourites array", async () => {
      const favs = [
        {
          id: 1,
          image_id: "abc",
          user_id: "u1",
          created_at: "2024-01-01",
          image: { id: "abc", url: "" },
        },
      ];
      mockedApi.fetchFavourites.mockResolvedValueOnce(favs);

      const result = await fetchFavourites();
      expect(result).toEqual(favs);
    });
  });

  describe("createFavourite", () => {
    it("posts favourite and returns id", async () => {
      mockedApi.createFavourite.mockResolvedValueOnce({ id: 77 });

      const result = await createFavourite({ image_id: "xyz" });
      expect(result.id).toBe(77);
    });
  });

  describe("deleteFavourite", () => {
    it("calls delete with correct id", async () => {
      mockedApi.deleteFavourite.mockResolvedValueOnce(undefined);

      await deleteFavourite(55);
      expect(mockedApi.deleteFavourite).toHaveBeenCalledWith(55);
    });
  });
});
