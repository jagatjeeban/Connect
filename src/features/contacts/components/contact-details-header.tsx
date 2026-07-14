import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//import constants
import { colors } from "@/constants";

//import svgs
import SvgBackArrow from "@/assets/icons/back-arrow.svg";
import SvgPencil from "@/assets/icons/pencil.svg";
import SvgPrimaryFavorite from "@/assets/icons/primary-favorite.svg";
import SvgWhiteFavorite from "@/assets/icons/white-favorite.svg";

type ContactDetailsHeaderProps = {
  isFavorite: boolean;
  isEditing: boolean;
  actionsDisabled?: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
};

const ContactDetailsHeader = ({
  isFavorite,
  isEditing,
  actionsDisabled = false,
  onBack,
  onToggleFavorite,
  onEdit,
}: ContactDetailsHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={10}
        onPress={onBack}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && styles.pressed,
        ]}
      >
        <SvgBackArrow width={12} height={22} />
      </Pressable>

      <View style={styles.rightActions}>
        <Pressable
          accessibilityLabel={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          accessibilityRole="button"
          accessibilityState={{
            disabled: actionsDisabled,
            selected: isFavorite,
          }}
          disabled={actionsDisabled}
          hitSlop={10}
          onPress={onToggleFavorite}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.pressed,
            actionsDisabled && styles.disabled,
          ]}
        >
          {isFavorite ? (
            <SvgPrimaryFavorite width={24} height={23} />
          ) : (
            <SvgWhiteFavorite width={24} height={23} />
          )}
        </Pressable>

        <Pressable
          accessibilityLabel="Edit contact"
          accessibilityRole="button"
          accessibilityState={{ disabled: actionsDisabled || isEditing }}
          disabled={actionsDisabled || isEditing}
          hitSlop={10}
          onPress={onEdit}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.pressed,
            (actionsDisabled || isEditing) && styles.disabled,
          ]}
        >
          {isEditing ? (
            <ActivityIndicator color={colors.baseWhite} size="small" />
          ) : (
            <SvgPencil width={20} height={24} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default ContactDetailsHeader;

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    minHeight: 62,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
});
