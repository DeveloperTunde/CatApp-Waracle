import { useImagePicker } from "@hooks/useImagePicker";
import { act, renderHook } from "@testing-library/react-hooks";
import * as ImagePicker from "expo-image-picker";

jest.mock("expo-image-picker");

const mockRequestPermission =
  ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock;
const mockLaunchLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;

describe("useImagePicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when permission is denied", async () => {
    mockRequestPermission.mockResolvedValue({ status: "denied" });

    const { result } = renderHook(() => useImagePicker());

    let uri: string | null = "initial";
    await act(async () => {
      uri = await result.current.pickImage();
    });

    expect(uri).toBeNull();
    expect(mockLaunchLibrary).not.toHaveBeenCalled();
  });

  it("returns null when user cancels picker", async () => {
    mockRequestPermission.mockResolvedValue({ status: "granted" });
    mockLaunchLibrary.mockResolvedValue({ canceled: true, assets: [] });

    const { result } = renderHook(() => useImagePicker());

    let uri: string | null = "initial";
    await act(async () => {
      uri = await result.current.pickImage();
    });

    expect(uri).toBeNull();
  });

  it("returns URI when image is selected", async () => {
    mockRequestPermission.mockResolvedValue({ status: "granted" });
    mockLaunchLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file://photos/cat.jpg" }],
    });

    const { result } = renderHook(() => useImagePicker());

    let uri: string | null = null;
    await act(async () => {
      uri = await result.current.pickImage();
    });

    expect(uri).toBe("file://photos/cat.jpg");
  });

  it("requestPermission returns true for granted", async () => {
    mockRequestPermission.mockResolvedValue({ status: "granted" });

    const { result } = renderHook(() => useImagePicker());

    let granted = false;
    await act(async () => {
      granted = await result.current.requestPermission();
    });

    expect(granted).toBe(true);
  });

  it("requestPermission returns false for denied", async () => {
    mockRequestPermission.mockResolvedValue({ status: "denied" });

    const { result } = renderHook(() => useImagePicker());

    let granted = true;
    await act(async () => {
      granted = await result.current.requestPermission();
    });

    expect(granted).toBe(false);
  });
});
