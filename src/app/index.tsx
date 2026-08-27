import { Redirect, router } from 'expo-router';
import { PressableScale } from 'pressto';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

//import svg files
import SvgWelcome from '@/assets/images/svgs/welcome.svg';

//import hooks
import { useResponsive } from '@/hooks';

//import components
import { TextComponent } from '@/components';

//import constants
import { colors, fontFamily, strings } from '@/constants';
import { useAppStore } from '@/store/use-app-store';

export default function Index() {
  //hooks
  const { width, height } = useResponsive();
  const insets = useSafeAreaInsets();

  //store events
  const onboardingStatus = useAppStore((state) => state.onboardingStatus);
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);

  const iconWidth = width / 1.2;
  const iconHeight = height / 2;

  //function to navigate to the contacts screen
  const navigateToContacts = useCallback(() => {
    setOnboardingStatus(true);
    router.replace('/(tabs)/contacts');
  }, [setOnboardingStatus]);

  if (onboardingStatus) {
    return <Redirect href={'/(tabs)/contacts'} />;
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SvgWelcome width={iconWidth} height={iconHeight} />
      <View style={[styles.welcomeTextsContainer, { top: iconHeight, maxWidth: iconWidth }]}>
        <TextComponent
          text={strings.welcomeToConnect}
          color={colors.baseWhite}
          fontFamily={fontFamily.outfitMedium}
          styleProfile={'largest1'}
        />
        <TextComponent
          text={strings.welcomeText}
          color={colors.baseMediumGrey}
          textAlign={'center'}
          styleProfile={'normal4'}
        />
      </View>
      <PressableScale onPress={navigateToContacts} style={[styles.getStartedBtn, { bottom: insets.bottom + 20 }]}>
        <TextComponent text={'Get Started'} color={colors.baseWhite} styleProfile={'large1'} />
      </PressableScale>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  welcomeTextsContainer: {
    alignItems: 'center',
    gap: 20,
    position: 'absolute',
  },
  getStartedBtn: {
    position: 'absolute',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    width: '90%',
  },
});
