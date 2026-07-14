import { NativeTabs } from "expo-router/unstable-native-tabs";

//import constants
import { colors, fontFamily, strings } from "@/constants";

export default function TabLayout() {
  return (
    <NativeTabs labelStyle={{ fontFamily: fontFamily.outfitMedium }}>
      <NativeTabs.Trigger
        name="contacts"
        contentStyle={{ backgroundColor: colors.backgroundColor }}
      >
        <NativeTabs.Trigger.Label
          selectedStyle={{
            color: colors.primary,
            fontFamily: fontFamily.outfitRegular,
          }}
        >
          {strings.contacts}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "phone", selected: "phone.fill" }}
          md={{ default: "phone", selected: "phone" }}
          selectedColor={colors.primary}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="favorites"
        contentStyle={{ backgroundColor: colors.backgroundColor }}
      >
        <NativeTabs.Trigger.Label
          selectedStyle={{
            color: colors.primary,
          }}
        >
          {strings.favorites}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "star", selected: "star.fill" }}
          md={"star"}
          selectedColor={colors.primary}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="profile"
        contentStyle={{ backgroundColor: colors.backgroundColor }}
      >
        <NativeTabs.Trigger.Label
          selectedStyle={{
            color: colors.primary,
          }}
        >
          {strings.profile}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="person"
          selectedColor={colors.primary}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
