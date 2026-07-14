import { Pressable, StyleSheet, Text, View } from "react-native";

//import constants
import { colors, fontFamily, strings } from "@/constants";

//import svgs
import SvgPlus from "@/assets/icons/plus.svg";

type FavoritesHeaderProps = {
  onPressAdd: () => void;
};

const FavoritesHeader = ({ onPressAdd }: FavoritesHeaderProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{strings.favorites}</Text>
    <Pressable
      accessibilityLabel="Add favorite"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPressAdd}
      style={({ pressed }) => [
        styles.addButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <SvgPlus width={15} height={15} />
      <Text style={styles.addButtonText}>{strings.add}</Text>
    </Pressable>
  </View>
);

export default FavoritesHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    color: colors.baseWhite,
    fontSize: 20,
    fontFamily: fontFamily.outfitMedium,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  addButtonText: {
    marginLeft: 10,
    color: colors.primary,
    fontSize: 16,
    fontFamily: fontFamily.outfitMedium,
  },
});
