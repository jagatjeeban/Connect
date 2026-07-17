import { StyleSheet } from 'react-native';
import { Toaster } from 'sonner-native';

//import constants
import { colors, fontFamily, fontSize } from '@/constants';

//constants
const TOAST_DURATION_MS = 5000;
const TOAST_NATIVE_TAB_OFFSET = 120;
const VISIBLE_TOAST_COUNT = 3;

/**
 * Renders the globally available, app-themed toast surface.
 */
const AppToaster = () => (
  <Toaster
    allowFontScaling
    duration={TOAST_DURATION_MS}
    enableStacking={false}
    gap={10}
    offset={TOAST_NATIVE_TAB_OFFSET}
    position={'bottom-center'}
    swipeToDismissDirection={'up'}
    theme={'dark'}
    toastOptions={{
      buttonsStyle: styles.actions,
      descriptionStyle: styles.description,
      style: styles.toast,
      textContainerStyle: styles.content,
      titleStyle: styles.title,
    }}
    visibleToasts={VISIBLE_TOAST_COUNT}
  />
);

export default AppToaster;

const styles = StyleSheet.create({
  toast: {
    borderWidth: 1,
    borderColor: colors.baseGrey,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    minHeight: 44,
    justifyContent: 'center',
    paddingRight: 80,
  },
  actions: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 0,
  },
  title: {
    color: colors.baseWhite,
    fontFamily: fontFamily.outfitSemiBold,
    fontSize: fontSize.large,
    lineHeight: 20,
  },
  description: {
    color: colors.baseMediumGrey,
    fontFamily: fontFamily.outfitRegular,
    fontSize: fontSize.xxNormal,
    lineHeight: 20,
  },
});
