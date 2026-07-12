import { NativeTabs } from "expo-router/unstable-native-tabs";

//import constants
import { Colors, Strings } from "@/constants";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="index"
        contentStyle={{ backgroundColor: Colors.BgColor }}
      >
        <NativeTabs.Trigger.Label>{Strings.Contacts}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "phone", selected: "phone.fill" }}
          md="contacts"
          selectedColor={Colors.Primary}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="favorites"
        contentStyle={{ backgroundColor: Colors.BgColor }}
      >
        <NativeTabs.Trigger.Label>{Strings.Favorites}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "star", selected: "star.fill" }}
          md="person_heart"
          selectedColor={Colors.Primary}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="profile"
        contentStyle={{ backgroundColor: Colors.BgColor }}
      >
        <NativeTabs.Trigger.Label>{Strings.Profile}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="person"
          selectedColor={Colors.Primary}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
