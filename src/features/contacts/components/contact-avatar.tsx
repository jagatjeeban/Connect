import { Image, type ImageProps } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import { TextComponent } from '@/components';

//import types
import type { TextThemeName } from '@/themes/text-theme';

type ContactAvatarProps = {
  accessibilityLabel?: string;
  fallbackBackgroundColor?: ViewStyle['backgroundColor'];
  fallbackTextColor?: string;
  fallbackTextStyle: TextThemeName;
  initial: string;
  priority?: ImageProps['priority'];
  recyclingKey?: string;
  style: ViewStyle;
  thumbnail?: string;
  transition?: number;
};

/**
 * Displays a contact photo or the contact's initial using caller-defined sizing.
 */
const ContactAvatar = ({
  accessibilityLabel,
  fallbackBackgroundColor = colors.primary,
  fallbackTextColor = colors.baseWhite,
  fallbackTextStyle,
  initial,
  priority = 'normal',
  recyclingKey,
  style,
  thumbnail,
  transition,
}: ContactAvatarProps) => {
  return (
    <View style={[styles.container, style]}>
      {thumbnail ? (
        <Image
          accessibilityLabel={accessibilityLabel}
          cachePolicy={'memory-disk'}
          contentFit={'cover'}
          priority={priority}
          recyclingKey={recyclingKey}
          source={thumbnail}
          style={StyleSheet.absoluteFill}
          transition={transition}
        />
      ) : (
        <View
          accessibilityLabel={accessibilityLabel}
          style={[styles.fallback, { backgroundColor: fallbackBackgroundColor }]}
        >
          <TextComponent
            color={fallbackTextColor}
            styleProfile={fallbackTextStyle}
            text={initial}
            textAlign={'center'}
          />
        </View>
      )}
    </View>
  );
};

export default ContactAvatar;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  fallback: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
