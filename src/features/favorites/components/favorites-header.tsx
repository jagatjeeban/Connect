import { Pressable, StyleSheet, View } from "react-native";

//import components
import TextComponent from "@/components/core-components/text-component";

//import constants
import { colors, strings } from "@/constants";

//import svgs
import SvgPlus from "@/assets/icons/plus.svg";

type FavoritesHeaderProps = {
  onPressAdd: () => void;
};

const FavoritesHeader = ({ onPressAdd }: FavoritesHeaderProps) => (
  <View style={styles.container}>
    <TextComponent
      color={colors.baseWhite}
      styleProfile="large3"
      text={strings.favorites}
    />
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
      <TextComponent
        color={colors.primary}
        containerStyle={styles.addButtonTextContainer}
        styleProfile="large1"
        text={strings.add}
      />
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
  addButtonTextContainer: {
    marginLeft: 10,
  },
});
