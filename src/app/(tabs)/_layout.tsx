import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform, StyleSheet } from 'react-native';

//import constants
import { colors, fontFamily, strings } from '@/constants';

/**
 * Configures the native contacts, favorites, and profile tabs.
 */
export default function TabLayout() {
  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      minimizeBehavior={Platform.OS === 'ios' && Number(Platform.Version) >= 26 ? 'onScrollDown' : undefined}
      labelStyle={{ fontFamily: fontFamily.outfitMedium }}
      unstable_nativeProps={Platform.OS === 'ios' ? { colorScheme: 'dark' } : undefined}
    >
      <NativeTabs.Trigger name={'contacts'} contentStyle={{ backgroundColor: colors.backgroundColor }}>
        <NativeTabs.Trigger.Label selectedStyle={styles.selectedLabelStyle}>
          {strings.contacts}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md={{ default: 'contacts', selected: 'contacts' }}
          selectedColor={colors.primary}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name={'favorites'} contentStyle={{ backgroundColor: colors.backgroundColor }}>
        <NativeTabs.Trigger.Label selectedStyle={styles.selectedLabelStyle}>
          {strings.favorites}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'star', selected: 'star.fill' }}
          md={'star'}
          selectedColor={colors.primary}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name={'profile'} contentStyle={{ backgroundColor: colors.backgroundColor }}>
        <NativeTabs.Trigger.Label selectedStyle={styles.selectedLabelStyle}>{strings.profile}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md={'person'}
          selectedColor={colors.primary}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const styles = StyleSheet.create({
  selectedLabelStyle: {
    color: colors.primary,
  },
});
