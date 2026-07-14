import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

//import components
import TextComponent from "@/components/core-components/text-component";

//import constants
import { colors } from "@/constants";

type ContactActionButtonProps = {
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

const ContactActionButton = ({
  icon,
  label,
  disabled = false,
  onPress,
}: ContactActionButtonProps) => {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <TextComponent
        color={colors.baseWhite}
        styleProfile="large1"
        text={label}
        textAlign="center"
      />
    </Pressable>
  );
};

export default ContactActionButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
