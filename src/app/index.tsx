import { PressableScale } from 'pressto';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//import svg files
import SvgWelcome from '@/assets/images/svgs/welcome.svg';

//import components
import { TextComponent } from '@/components';

//import constants
import { colors, fontFamily, strings } from '@/constants';

//import store
import { useAppStore } from '@/store/use-app-store';

//CONSTANTS
const WELCOME_IMAGE_WIDTH = 337;
const WELCOME_IMAGE_HEIGHT = 261;
const ONBOARDING_CONTENT_MAX_WIDTH = 420;

/**
 * Displays the onboarding welcome screen and completes the first-launch flow.
 */
export default function Index() {
  //hooks
  const insets = useSafeAreaInsets();

  //store actions
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);

  //function to complete onboarding and unlock the application routes
  const handleGetStarted = () => {
    setOnboardingStatus(true);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 20, paddingTop: insets.top + 20 },
      ]}
      contentInsetAdjustmentBehavior={'never'}
      showsVerticalScrollIndicator={false}
      style={styles.scrollView}
    >
      <View style={styles.heroContainer}>
        <View style={styles.illustrationContainer}>
          <SvgWelcome height={'100%'} width={'100%'} />
        </View>
        <View style={styles.welcomeTextsContainer}>
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
      </View>
      <PressableScale
        accessibilityRole={'button'}
        accessibilityLabel={strings.getStarted}
        onPress={handleGetStarted}
        style={styles.getStartedBtn}
      >
        <TextComponent text={strings.getStarted} color={colors.baseWhite} styleProfile={'large1'} />
      </PressableScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
    paddingHorizontal: 20,
  },
  heroContainer: {
    width: '100%',
    maxWidth: ONBOARDING_CONTENT_MAX_WIDTH,
    alignItems: 'center',
    gap: 24,
  },
  illustrationContainer: {
    width: '100%',
    maxWidth: WELCOME_IMAGE_WIDTH,
    aspectRatio: WELCOME_IMAGE_WIDTH / WELCOME_IMAGE_HEIGHT,
  },
  welcomeTextsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  getStartedBtn: {
    width: '100%',
    maxWidth: ONBOARDING_CONTENT_MAX_WIDTH,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderCurve: 'continuous',
    paddingVertical: 15,
  },
});
