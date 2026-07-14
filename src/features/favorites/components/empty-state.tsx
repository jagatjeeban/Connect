import { StyleSheet, Text, View } from "react-native";

//import constants
import { colors, fontFamily } from "@/constants";

//import svgs
import SvgFavorite from "@/assets/icons/favourites.svg";
import SvgSearch from "@/assets/icons/search.svg";

type EmptyStateProps = {
  isSearchResultState?: boolean;
};

const EmptyState = ({ isSearchResultState = false }: EmptyStateProps) => {
  const title = isSearchResultState ? "No results found" : "No favorites yet";
  const description = isSearchResultState
    ? "Try a different name or clear your search to see your favorites again."
    : "Add your go-to people to favorites so they are easier to reach from here.";

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {isSearchResultState ? (
          <SvgSearch width={34} height={34} />
        ) : (
          <SvgFavorite width={34} height={30} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.baseGrey,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
  },
  title: {
    color: colors.baseWhite,
    fontSize: 22,
    fontFamily: fontFamily.outfitMedium,
    textAlign: "center",
  },
  description: {
    maxWidth: 300,
    marginTop: 10,
    color: colors.baseMediumGrey,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.outfitRegular,
    textAlign: "center",
  },
});
