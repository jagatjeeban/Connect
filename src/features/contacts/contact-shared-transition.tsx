import { Image } from 'expo-image';
import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

//import constants
import { colors, fontFamily, fontSize } from '@/constants';

//import hooks
import { useResponsive } from '@/hooks';

//import helpers
import { getContactInitial, getContactName } from '@/helpers/custom-functions';

//import types
import type {
  ContactIdentitySnapshot,
  ContactSharedTransitionSource,
  DeviceContact,
  SharedElementFrame,
} from '@/features/contacts/model';

//constants
const OPEN_DURATION = 420;
const CLOSE_DURATION = 340;
const DESTINATION_MEASUREMENT_TIMEOUT = 500;
const SHARED_ELEMENT_MEASUREMENT_TIMEOUT = 250;
const SOURCE_AVATAR_RADIUS = 10;
const DESTINATION_AVATAR_RADIUS = 30;

type ContactSharedTransitionPhase = 'opening' | 'open' | 'closing';

type ContactSharedTransitionSession = {
  identity: ContactIdentitySnapshot;
  phase: ContactSharedTransitionPhase;
  source: ContactSharedTransitionSource;
  target?: ContactSharedTransitionSource;
};

type ContactSharedTransitionContextValue = {
  activeContactId: string | null;
  beginOpening: (contact: DeviceContact, source?: ContactSharedTransitionSource) => void;
  cancel: (contactId?: string) => void;
  phase: ContactSharedTransitionPhase | null;
  progress: SharedValue<number>;
  registerDestination: (contactId: string, target: ContactSharedTransitionSource) => void;
  requestClose: (contactId: string, removeRoute: () => void) => void;
  updateIdentity: (contact: DeviceContact) => void;
};

type ContactSharedTransitionProviderProps = {
  children: ReactNode;
};

type ContactSharedTransitionOverlayProps = {
  hostOrigin: Pick<SharedElementFrame, 'x' | 'y'>;
  progress: SharedValue<number>;
  session: ContactSharedTransitionSession;
};

const ContactSharedTransitionContext = createContext<ContactSharedTransitionContextValue | null>(null);

//function to compare two measured frames
const areFramesEqual = (firstFrame: SharedElementFrame, secondFrame: SharedElementFrame) =>
  firstFrame.x === secondFrame.x &&
  firstFrame.y === secondFrame.y &&
  firstFrame.width === secondFrame.width &&
  firstFrame.height === secondFrame.height;

//function to create the contact identity rendered by the transition overlay
const createIdentitySnapshot = (contact: DeviceContact): ContactIdentitySnapshot => {
  const name = getContactName(contact);

  return {
    contactId: contact.id,
    initial: getContactInitial(name),
    name,
    thumbnail: contact.thumbnail?.trim() || contact.image?.trim() || undefined,
  };
};

//function to finish measuring one native view in window coordinates
export const measureSharedElementInWindow = (viewRef: RefObject<View | null>): Promise<SharedElementFrame | null> =>
  new Promise((resolve) => {
    const view = viewRef.current;

    if (!view) {
      resolve(null);
      return;
    }

    let isSettled = false;

    //settles the measurement once and clears its bounded native-callback fallback
    const settleMeasurement = (frame: SharedElementFrame | null) => {
      if (isSettled) return;

      isSettled = true;
      clearTimeout(measurementTimeout);
      resolve(frame);
    };

    const measurementTimeout = setTimeout(() => {
      settleMeasurement(null);
    }, SHARED_ELEMENT_MEASUREMENT_TIMEOUT);

    try {
      view.measureInWindow((x, y, width, height) => {
        if (width <= 0 || height <= 0) {
          settleMeasurement(null);
          return;
        }

        settleMeasurement({ x, y, width, height });
      });
    } catch {
      settleMeasurement(null);
    }
  });

//function to measure both identity elements after the current layout commit
export const measureContactIdentityInWindow = async (
  avatarRef: RefObject<View | null>,
  nameRef: RefObject<View | null>,
): Promise<ContactSharedTransitionSource | undefined> => {
  const [avatarFrame, nameFrame] = await Promise.all([
    measureSharedElementInWindow(avatarRef),
    measureSharedElementInWindow(nameRef),
  ]);

  if (!avatarFrame || !nameFrame) return undefined;

  return { avatarFrame, nameFrame };
};

/**
 * Provides contact-transition state that survives route changes and renders its overlay above navigation.
 */
export const ContactSharedTransitionProvider = ({ children }: ContactSharedTransitionProviderProps) => {
  //refs
  const overlayHostRef = useRef<View>(null);
  const sessionRef = useRef<ContactSharedTransitionSession | null>(null);
  const openingAnimationContactIdRef = useRef<string | null>(null);

  //states
  const [hostOrigin, setHostOrigin] = useState({ x: 0, y: 0 });
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [session, setSession] = useState<ContactSharedTransitionSession | null>(null);

  //animation values
  const progress = useSharedValue(0);

  //commits transition state while keeping event callbacks synchronized
  const commitSession = useCallback((nextSession: ContactSharedTransitionSession | null) => {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  //finishes the opening transition without discarding frames needed for back navigation
  const finishOpening = useCallback(
    (contactId: string) => {
      const currentSession = sessionRef.current;

      if (!currentSession || currentSession.identity.contactId !== contactId || currentSession.phase !== 'opening') {
        return;
      }

      openingAnimationContactIdRef.current = null;
      commitSession({ ...currentSession, phase: 'open' });
    },
    [commitSession],
  );

  //clears the completed reverse transition
  const finishClosing = useCallback(
    (contactId: string) => {
      if (sessionRef.current?.identity.contactId !== contactId) return;

      commitSession(null);
    },
    [commitSession],
  );

  //starts a transition after the contact row has been measured
  const beginOpening = useCallback(
    (contact: DeviceContact, source?: ContactSharedTransitionSource) => {
      if (Platform.OS !== 'android' || isReduceMotionEnabled || !source) {
        commitSession(null);
        return;
      }

      openingAnimationContactIdRef.current = null;
      progress.set(0);
      commitSession({
        identity: createIdentitySnapshot(contact),
        phase: 'opening',
        source,
      });
    },
    [commitSession, isReduceMotionEnabled, progress],
  );

  //stores destination measurements exactly once for the active contact
  const registerDestination = useCallback(
    (contactId: string, target: ContactSharedTransitionSource) => {
      const currentSession = sessionRef.current;

      if (!currentSession || currentSession.identity.contactId !== contactId) return;
      if (
        currentSession.target &&
        areFramesEqual(currentSession.target.avatarFrame, target.avatarFrame) &&
        areFramesEqual(currentSession.target.nameFrame, target.nameFrame)
      ) {
        return;
      }

      if (currentSession.target) return;

      commitSession({ ...currentSession, target });
    },
    [commitSession],
  );

  //clears a stale or deliberately skipped shared transition
  const cancel = useCallback(
    (contactId?: string) => {
      if (contactId && sessionRef.current?.identity.contactId !== contactId) return;

      openingAnimationContactIdRef.current = null;
      progress.set(1);
      commitSession(null);
    },
    [commitSession, progress],
  );

  //keeps the reverse-transition snapshot synchronized after native contact edits
  const updateIdentity = useCallback(
    (contact: DeviceContact) => {
      const currentSession = sessionRef.current;

      if (!currentSession || currentSession.identity.contactId !== contact.id) return;

      commitSession({ ...currentSession, identity: createIdentitySnapshot(contact) });
    },
    [commitSession],
  );

  //coordinates route removal with the persistent reverse-transition overlay
  const requestClose = useCallback(
    (contactId: string, removeRoute: () => void) => {
      const currentSession = sessionRef.current;

      if (currentSession?.phase === 'closing') return;

      if (
        Platform.OS !== 'android' ||
        isReduceMotionEnabled ||
        !currentSession?.target ||
        currentSession.identity.contactId !== contactId
      ) {
        cancel(contactId);
        removeRoute();
        return;
      }

      const closingSession = { ...currentSession, phase: 'closing' as const };
      if (currentSession.phase === 'open') {
        progress.set(1);
      }
      commitSession(closingSession);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          removeRoute();
          progress.set(
            withTiming(
              0,
              {
                duration: CLOSE_DURATION,
                easing: Easing.inOut(Easing.cubic),
              },
              (finished) => {
                runOnJS(finishClosing)(contactId);
                void finished;
              },
            ),
          );
        });
      });
    },
    [cancel, commitSession, finishClosing, isReduceMotionEnabled, progress],
  );

  //measures the overlay host so window coordinates can be converted to its local coordinate space
  const measureOverlayHost = useCallback(() => {
    requestAnimationFrame(() => {
      overlayHostRef.current?.measureInWindow((x, y) => {
        setHostOrigin((currentOrigin) => (currentOrigin.x === x && currentOrigin.y === y ? currentOrigin : { x, y }));
      });
    });
  }, []);

  //tracks the system reduce-motion preference without requiring native configuration changes
  useEffect(() => {
    let isMounted = true;

    void AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      if (isMounted) {
        setIsReduceMotionEnabled(isEnabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsReduceMotionEnabled);

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  //starts the forward motion once both destination elements have valid frames
  useEffect(() => {
    if (!session?.target || session.phase !== 'opening') return;
    if (openingAnimationContactIdRef.current === session.identity.contactId) return;

    const contactId = session.identity.contactId;
    openingAnimationContactIdRef.current = contactId;
    progress.set(
      withTiming(
        1,
        {
          duration: OPEN_DURATION,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(finishOpening)(contactId);
          }
        },
      ),
    );
  }, [finishOpening, progress, session]);

  //prevents a failed destination measurement from leaving the details content hidden
  useEffect(() => {
    if (!session || session.phase !== 'opening' || session.target) return;

    const contactId = session.identity.contactId;
    const timeout = setTimeout(() => {
      const currentSession = sessionRef.current;

      if (
        currentSession?.identity.contactId === contactId &&
        currentSession.phase === 'opening' &&
        !currentSession.target
      ) {
        progress.set(1);
        finishOpening(contactId);
      }
    }, DESTINATION_MEASUREMENT_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [finishOpening, progress, session]);

  const contextValue = useMemo<ContactSharedTransitionContextValue>(
    () => ({
      activeContactId: session?.identity.contactId ?? null,
      beginOpening,
      cancel,
      phase: session?.phase ?? null,
      progress,
      registerDestination,
      requestClose,
      updateIdentity,
    }),
    [beginOpening, cancel, progress, registerDestination, requestClose, session, updateIdentity],
  );

  return (
    <ContactSharedTransitionContext.Provider value={contextValue}>
      {children}
      <View
        ref={overlayHostRef}
        collapsable={false}
        onLayout={measureOverlayHost}
        pointerEvents={'none'}
        style={[StyleSheet.absoluteFill, styles.overlayHost]}
      >
        {session && session.phase !== 'open' ? (
          <ContactSharedTransitionOverlay hostOrigin={hostOrigin} progress={progress} session={session} />
        ) : null}
      </View>
    </ContactSharedTransitionContext.Provider>
  );
};

/**
 * Returns the contact shared-transition coordinator for source and destination screens.
 */
export const useContactSharedTransition = () => {
  const context = useContext(ContactSharedTransitionContext);

  if (!context) {
    throw new Error('useContactSharedTransition must be used inside ContactSharedTransitionProvider.');
  }

  return context;
};

/**
 * Renders the avatar and name snapshots while native navigation swaps the real screens.
 */
const ContactSharedTransitionOverlay = ({ hostOrigin, progress, session }: ContactSharedTransitionOverlayProps) => {
  //hooks
  const { fontSizeToRf } = useResponsive();

  const target = session.target ?? session.source;
  const sourceAvatar = session.source.avatarFrame;
  const targetAvatar = target.avatarFrame;
  const sourceName = session.source.nameFrame;
  const targetName = target.nameFrame;
  const sourceNameFontSize = fontSizeToRf(fontSize.xLarge);
  const targetNameFontSize = fontSizeToRf(fontSize.xxxxLarge);
  const sourceInitialFontSize = fontSizeToRf(fontSize.xxxLarge);
  const targetInitialFontSize = fontSizeToRf(fontSize.xxxLargest);
  const sourceNameCenterX = sourceName.x + sourceName.width / 2;
  const sourceNameCenterY = sourceName.y + sourceName.height / 2;
  const targetNameCenterX = targetName.x + targetName.width / 2;
  const targetNameCenterY = targetName.y + targetName.height / 2;

  const avatarStyle = useAnimatedStyle(() => ({
    left: interpolate(progress.value, [0, 1], [sourceAvatar.x - hostOrigin.x, targetAvatar.x - hostOrigin.x]),
    top: interpolate(progress.value, [0, 1], [sourceAvatar.y - hostOrigin.y, targetAvatar.y - hostOrigin.y]),
    width: interpolate(progress.value, [0, 1], [sourceAvatar.width, targetAvatar.width]),
    height: interpolate(progress.value, [0, 1], [sourceAvatar.height, targetAvatar.height]),
    borderRadius: interpolate(progress.value, [0, 1], [SOURCE_AVATAR_RADIUS, DESTINATION_AVATAR_RADIUS]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.primaryLight, colors.primary]),
  }));

  const fallbackTextStyle = useAnimatedStyle(() => {
    const resolvedFontSize = interpolate(progress.value, [0, 1], [sourceInitialFontSize, targetInitialFontSize]);

    return {
      fontSize: resolvedFontSize,
      lineHeight: Math.round(resolvedFontSize * 1.15),
    };
  });

  const sourceNameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.72, 1], [1, 1, 0]),
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [0, targetNameCenterX - sourceNameCenterX]),
      },
      {
        translateY: interpolate(progress.value, [0, 1], [0, targetNameCenterY - sourceNameCenterY]),
      },
      {
        scale: interpolate(progress.value, [0, 1], [1, targetNameFontSize / sourceNameFontSize]),
      },
    ],
  }));

  const targetNameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.45, 1], [0, 0, 1]),
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [sourceNameCenterX - targetNameCenterX, 0]),
      },
      {
        translateY: interpolate(progress.value, [0, 1], [sourceNameCenterY - targetNameCenterY, 0]),
      },
      {
        scale: interpolate(progress.value, [0, 1], [sourceNameFontSize / targetNameFontSize, 1]),
      },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.avatar, avatarStyle]}>
        {session.identity.thumbnail ? (
          <Image
            cachePolicy={'memory-disk'}
            contentFit={'cover'}
            priority={'high'}
            source={session.identity.thumbnail}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <Animated.Text style={[styles.fallbackInitial, fallbackTextStyle]}>{session.identity.initial}</Animated.Text>
        )}
      </Animated.View>

      <Animated.Text
        numberOfLines={1}
        style={[
          styles.sourceName,
          {
            left: sourceName.x - hostOrigin.x,
            top: sourceName.y - hostOrigin.y,
            width: sourceName.width,
            fontSize: sourceNameFontSize,
            lineHeight: Math.round(sourceNameFontSize * 1.15),
          },
          sourceNameStyle,
        ]}
      >
        {session.identity.name}
      </Animated.Text>

      <Animated.Text
        numberOfLines={2}
        style={[
          styles.targetName,
          {
            left: targetName.x - hostOrigin.x,
            top: targetName.y - hostOrigin.y,
            width: targetName.width,
            fontSize: targetNameFontSize,
            lineHeight: Math.round(targetNameFontSize * 1.15),
          },
          targetNameStyle,
        ]}
      >
        {session.identity.name}
      </Animated.Text>
    </>
  );
};

const styles = StyleSheet.create({
  overlayHost: {
    zIndex: 100,
    elevation: 100,
  },
  avatar: {
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackInitial: {
    color: colors.baseWhite,
    fontFamily: fontFamily.outfitBold,
    includeFontPadding: false,
    textAlign: 'center',
  },
  sourceName: {
    position: 'absolute',
    color: colors.baseWhite,
    fontFamily: fontFamily.outfitRegular,
    includeFontPadding: false,
    textAlign: 'left',
  },
  targetName: {
    position: 'absolute',
    color: colors.baseWhite,
    fontFamily: fontFamily.outfitMedium,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
