import { Colors } from "@constants/colors";
import { Spacing } from "@constants/theme";
import { useImagesQuery } from "@hooks/useCatQueries";
import EmptyState from "@shared/EmptyState";
import { FlashList } from "@shopify/flash-list";
import { CARD_MARGIN, NUM_COLUMNS } from "@utils/index";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { CatImage } from "../../types";
import CatCard from "./CatCard";

interface CatGridProps {
  onUploadPress: () => void;
  onRefresh: () => Promise<void>;
}

const CatGrid: React.FC<CatGridProps> = ({ onUploadPress, onRefresh }) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
  } = useImagesQuery();

  const images: CatImage[] = data?.pages.flat() ?? [];

  const renderItem = useCallback(
    ({ item }: { item: CatImage }) => <CatCard image={item} />,
    [],
  );

  const keyExtractor = useCallback((item: CatImage) => item.id, []);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ListFooter = useCallback(() => {
    if (!isFetchingNextPage) return <View style={styles.listFooter} />;
    return (
      <View style={styles.loadMoreContainer}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlashList
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.contentContainer}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={ListFooter}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
      ListEmptyComponent={
        <EmptyState
          iconName="paw-outline"
          title="No cats yet!"
          subtitle="Upload your first cat photo to get started"
          actionLabel="Upload a Cat"
          onAction={onUploadPress}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: CARD_MARGIN,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreContainer: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  listFooter: {
    height: Spacing.xl,
  },
});

export default CatGrid;
