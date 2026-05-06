import VoteControls from "@/components/shared/VoteControls";
import IconButton from "@/components/ui/IconButton";
import { CARD_MARGIN, CARD_WIDTH, IMAGE_HEIGHT } from "@/utils/index";
import { Colors } from "@constants/colors";
import { BorderRadius, Shadows, Spacing } from "@constants/theme";
import {
  useCreateFavouriteMutation,
  useCreateVoteMutation,
  useDeleteFavouriteMutation,
  useDeleteVoteMutation,
  useFavouritesQuery,
  useVotesQuery,
} from "@hooks/useCatQueries";
import React, { useCallback } from "react";
import { Image, StyleSheet, View } from "react-native";
import { CatImage } from "../../types";

interface CatCardProps {
  image: CatImage;
}

const CatCard: React.FC<CatCardProps> = ({ image }) => {
  const { data: votes = [] } = useVotesQuery();
  const { data: favourites = [] } = useFavouritesQuery();

  const createVote = useCreateVoteMutation();
  const deleteVote = useDeleteVoteMutation();
  const createFavourite = useCreateFavouriteMutation();
  const deleteFavourite = useDeleteFavouriteMutation();

  // Derived state
  const imageVotes = votes.filter((v) => v.image_id === image?.id);
  const upVotes = imageVotes.filter((v) => v.value === 1).length;
  const downVotes = imageVotes.filter((v) => v.value === 0).length;
  const score = upVotes - downVotes;

  const userUpvoted = imageVotes.some((v) => v.value === 1);
  const userDownvoted = imageVotes.some((v) => v.value === 0);

  const favourite = favourites.find((f) => f.image_id === image?.id);
  const isFavourited = !!favourite;

  //Handlers

  const handleFavourite = useCallback(() => {
    if (isFavourited && favourite) {
      deleteFavourite.mutate(favourite.id);
    } else {
      createFavourite.mutate({ image_id: image?.id });
    }
  }, [isFavourited, favourite, image?.id, createFavourite, deleteFavourite]);

  const handleVoteUp = useCallback(() => {
    const existingUpvote = imageVotes.find((v) => v.value === 1);
    if (existingUpvote) {
      // Toggle off
      deleteVote.mutate(existingUpvote.id);
    } else {
      createVote.mutate({ image_id: image?.id, value: 1 });
    }
  }, [imageVotes, image?.id, createVote, deleteVote]);

  const handleVoteDown = useCallback(() => {
    const existingDownvote = imageVotes.find((v) => v.value === 0);
    if (existingDownvote) {
      // Toggle off
      deleteVote.mutate(existingDownvote.id);
    } else {
      createVote.mutate({ image_id: image?.id, value: 0 });
    }
  }, [imageVotes, image?.id, createVote, deleteVote]);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image?.url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.heartContainer}>
          <IconButton
            iconName={isFavourited ? "heart" : "heart-outline"}
            iconSize={22}
            active={isFavourited}
            activeColor={Colors.heartActive}
            iconColor={Colors.white}
            onPress={handleFavourite}
            disabled={createFavourite.isPending || deleteFavourite.isPending}
            style={styles.heartButton}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <VoteControls
          score={score}
          userUpvoted={userUpvoted}
          userDownvoted={userDownvoted}
          onVoteUp={handleVoteUp}
          onVoteDown={handleVoteDown}
          disabled={createVote.isPending || deleteVote.isPending}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    overflow: "hidden",
    ...Shadows.md,
  },
  imageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  heartContainer: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
  },
  heartButton: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
});

export default React.memo(CatCard);
