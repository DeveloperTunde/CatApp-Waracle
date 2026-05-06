import '@testing-library/jest-native/extend-expect';

// Mock expo modules
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(async () => ({
    canceled: false,
    assets: [{ uri: 'file://test-cat.jpg' }],
  })),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  SafeAreaProvider: ({ children }: any) => children,
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({ data, renderItem, ListEmptyComponent }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    if (!data?.length && ListEmptyComponent) {
      return React.createElement(View, null, React.createElement(ListEmptyComponent));
    }
    return React.createElement(
      View,
      null,
      data?.map((item: any, i: number) =>
        React.createElement(View, { key: i }, renderItem({ item, index: i })),
      ),
    );
  },
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => children,
}));

// Silence specific warnings
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (args[0]?.includes?.('Warning:')) return;
    originalWarn(...args);
  };
});
afterAll(() => {
  console.warn = originalWarn;
});
