import { act } from '@testing-library/react-hooks';
import { useUploadStore } from '../../stores/uploadStore';

jest.mock('../../services/catApi', () => ({
  uploadCatImage: jest.fn(),
}));

import { uploadCatImage } from '../../services/catApi';

function resetStore() {
  useUploadStore.setState({
    selectedUri: null,
    isUploading: false,
    error: null,
    validationErrors: [],
  });
}

describe('uploadStore', () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  describe('selectImage', () => {
    it('sets selectedUri on valid image', () => {
      useUploadStore.getState().selectImage('file://cat.jpg');
      expect(useUploadStore.getState().selectedUri).toBe('file://cat.jpg');
      expect(useUploadStore.getState().validationErrors).toHaveLength(0);
    });

    it('sets validation error for unsupported type', () => {
      useUploadStore.getState().selectImage('file://doc.pdf');
      expect(useUploadStore.getState().validationErrors.length).toBeGreaterThan(0);
    });

    it('clears previous error on new selection', () => {
      useUploadStore.setState({ error: 'Previous error' });
      useUploadStore.getState().selectImage('file://cat.png');
      expect(useUploadStore.getState().error).toBeNull();
    });
  });

  describe('clearSelection', () => {
    it('resets all upload state', () => {
      useUploadStore.setState({
        selectedUri: 'file://cat.jpg',
        error: 'some error',
        validationErrors: ['bad file'],
      });
      useUploadStore.getState().clearSelection();
      const state = useUploadStore.getState();
      expect(state.selectedUri).toBeNull();
      expect(state.error).toBeNull();
      expect(state.validationErrors).toHaveLength(0);
    });
  });

  describe('upload', () => {
    it('returns null and sets error when no image selected', async () => {
      let result: unknown;
      await act(async () => {
        result = await useUploadStore.getState().upload();
      });
      expect(result).toBeNull();
      expect(useUploadStore.getState().error).toBe('Please select an image first');
    });

    it('returns null when validation errors exist', async () => {
      useUploadStore.setState({
        selectedUri: 'file://doc.pdf',
        validationErrors: ['File type ".pdf" is not allowed'],
      });
      let result: unknown;
      await act(async () => {
        result = await useUploadStore.getState().upload();
      });
      expect(result).toBeNull();
      expect(uploadCatImage).not.toHaveBeenCalled();
    });

    it('calls API and returns CatImage on success', async () => {
      useUploadStore.setState({ selectedUri: 'file://cat.jpg', validationErrors: [] });
      (uploadCatImage as jest.Mock).mockResolvedValue({
        id: 'newcat123',
        url: 'https://cdn.thecatapi.com/newcat123.jpg',
        pending: 0,
        approved: 1,
      });

      let result: unknown;
      await act(async () => {
        result = await useUploadStore.getState().upload();
      });

      expect(result).toEqual({ id: 'newcat123', url: 'https://cdn.thecatapi.com/newcat123.jpg' });
      expect(useUploadStore.getState().selectedUri).toBeNull();
      expect(useUploadStore.getState().isUploading).toBe(false);
    });

    it('sets error on API failure', async () => {
      useUploadStore.setState({ selectedUri: 'file://cat.jpg', validationErrors: [] });
      (uploadCatImage as jest.Mock).mockRejectedValue(new Error('Upload failed'));

      let result: unknown;
      await act(async () => {
        result = await useUploadStore.getState().upload();
      });

      expect(result).toBeNull();
      expect(useUploadStore.getState().error).toBe('Upload failed');
      expect(useUploadStore.getState().isUploading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('clears error state', () => {
      useUploadStore.setState({ error: 'Test error' });
      useUploadStore.getState().clearError();
      expect(useUploadStore.getState().error).toBeNull();
    });
  });
});
