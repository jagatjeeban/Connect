import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

//import constants
import { colors, strings } from '@/constants';

//import components
import { TextComponent } from '@/components';
import ContactActionButton from '@/features/contacts/components/contact-action-button';
import ContactAvatar from '@/features/contacts/components/contact-avatar';
import ContactDetailsHeader from '@/features/contacts/components/contact-details-header';
import ContactInfoItem from '@/features/contacts/components/contact-info-item';

//import hooks
import { useResponsive } from '@/hooks';

//import helpers
import {
  measureContactIdentityInWindow,
  useContactSharedTransition,
} from '@/features/contacts/contact-shared-transition';
import { getContactInitial, getContactName } from '@/helpers/custom-functions';

//import assets
import SvgCall from '@/assets/icons/call.svg';
import SvgMail from '@/assets/icons/mail.svg';
import SvgMessage from '@/assets/icons/message.svg';
import SvgShare from '@/assets/icons/share.svg';
import SvgTrash from '@/assets/icons/trash.svg';
import SvgUpperCurve from '@/assets/images/svgs/upper-curve.svg';

//import types
import type { DeviceContact, DevicePhone } from '@/features/contacts/model';

type ContactDetailsContentProps = {
  contact?: DeviceContact;
  phones: readonly DevicePhone[];
  isFavorite: boolean;
  isEditing: boolean;
  isLoading: boolean;
  hasLoadError: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onCall: () => void;
  onMessage: () => void;
  onEmail?: () => void;
  onShare: () => void;
  onDelete: () => void;
};

/**
 * Displays the complete loading, error, and populated states for contact details.
 */
const ContactDetailsContent = ({
  contact,
  phones,
  isFavorite,
  isEditing,
  isLoading,
  hasLoadError,
  onBack,
  onToggleFavorite,
  onEdit,
  onCall,
  onMessage,
  onEmail,
  onShare,
  onDelete,
}: ContactDetailsContentProps) => {
  //hooks
  const { width, rh } = useResponsive();
  const { activeContactId, phase, progress, registerDestination, updateIdentity } = useContactSharedTransition();

  //refs
  const avatarRef = useRef<View>(null);
  const nameRef = useRef<View>(null);

  const curveHeight = rh(20);
  const contactName = contact ? getContactName(contact) : '';
  const thumbnail = contact?.thumbnail?.trim() || contact?.image?.trim();
  const isOpeningTransition = activeContactId === contact?.id && phase === 'opening';
  const isIdentityHidden = activeContactId === contact?.id && (phase === 'opening' || phase === 'closing');

  const contentAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: isOpeningTransition ? interpolate(progress.value, [0, 0.18, 1], [0, 0, 1]) : 1,
      transform: [
        {
          translateY: isOpeningTransition ? interpolate(progress.value, [0, 1], [8, 0]) : 0,
        },
      ],
    }),
    [isOpeningTransition],
  );

  //measures the destination identity after its native layout has committed
  const measureDestinationIdentity = useCallback(() => {
    if (!contact || activeContactId !== contact.id || phase !== 'opening') return;

    requestAnimationFrame(() => {
      void measureContactIdentityInWindow(avatarRef, nameRef).then((target) => {
        if (target) {
          registerDestination(contact.id, target);
        }
      });
    });
  }, [activeContactId, contact, phase, registerDestination]);

  //covers cases where cached contact content mounts with its final layout immediately
  useEffect(() => {
    measureDestinationIdentity();
  }, [measureDestinationIdentity]);

  //keeps the persistent overlay content current after a native edit succeeds
  useEffect(() => {
    if (contact) {
      updateIdentity(contact);
    }
  }, [contact, updateIdentity]);

  return (
    <View style={styles.container}>
      <SvgUpperCurve
        pointerEvents={'none'}
        preserveAspectRatio={'xMidYMid slice'}
        style={[styles.upperCurve, { top: -curveHeight * 0.25 }]}
        width={width}
      />

      <Animated.View style={[styles.animatedContent, contentAnimatedStyle]}>
        <ContactDetailsHeader
          actionsDisabled={!contact}
          isEditing={isEditing}
          isFavorite={isFavorite}
          onBack={onBack}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
        />

        {!contact ? (
          <View style={styles.stateContainer}>
            {isLoading ? <ActivityIndicator color={colors.primary} size={'large'} /> : null}
            <TextComponent
              color={colors.baseMediumGrey}
              styleProfile={'large2'}
              text={
                isLoading ? strings.loadingContact : hasLoadError ? strings.unableLoadContact : strings.contactNotFound
              }
              textAlign={'center'}
            />
          </View>
        ) : (
          <ScrollView
            contentInsetAdjustmentBehavior={'automatic'}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contactHeaderContainer}>
              <View
                ref={avatarRef}
                collapsable={false}
                onLayout={measureDestinationIdentity}
                style={isIdentityHidden ? styles.hiddenIdentity : undefined}
              >
                <ContactAvatar
                  accessibilityLabel={`${contactName} contact photo`}
                  fallbackTextStyle={'largest3'}
                  initial={getContactInitial(contactName)}
                  priority={'high'}
                  style={styles.contactImage}
                  thumbnail={thumbnail}
                  transition={100}
                />
              </View>

              <View
                ref={nameRef}
                collapsable={false}
                onLayout={measureDestinationIdentity}
                style={[styles.contactNameTarget, isIdentityHidden && styles.hiddenIdentity]}
              >
                <TextComponent
                  color={colors.baseWhite}
                  numOfLine={2}
                  styleProfile={'large4'}
                  text={contactName}
                  textAlign={'center'}
                />
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <ContactActionButton
                disabled={phones.length === 0}
                icon={<SvgCall width={22} height={22} />}
                label={strings.call}
                onPress={onCall}
              />
              <ContactActionButton
                disabled={phones.length === 0}
                icon={<SvgMessage width={25} height={24} />}
                label={strings.message}
                onPress={onMessage}
              />
              {onEmail ? (
                <ContactActionButton
                  icon={<SvgMail width={26} height={21} />}
                  label={strings.email}
                  onPress={onEmail}
                />
              ) : null}
              <ContactActionButton icon={<SvgShare width={21} height={24} />} label={strings.share} onPress={onShare} />
            </View>

            <View style={styles.contactInfoContainer}>
              <TextComponent color={colors.baseMediumGrey} styleProfile={'large1'} text={strings.contactInfo} />

              <View style={styles.phoneList}>
                {phones.map((phone, index) => (
                  <View key={phone.id}>
                    {index > 0 ? <View style={styles.separator} /> : null}
                    <ContactInfoItem phone={phone} />
                  </View>
                ))}
              </View>
            </View>

            <Pressable
              accessibilityLabel={strings.deleteContact}
              accessibilityRole={'button'}
              onPress={onDelete}
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
            >
              <SvgTrash width={20} height={21} />
              <TextComponent color={colors.baseRed} styleProfile={'large1'} text={strings.deleteContact} />
            </Pressable>
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

export default ContactDetailsContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.backgroundColor,
  },
  upperCurve: {
    position: 'absolute',
    left: 0,
  },
  animatedContent: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 64,
    gap: 30,
  },
  stateContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  contactHeaderContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 20,
  },
  contactImage: {
    width: 140,
    height: 140,
    borderRadius: 30,
  },
  contactNameTarget: {
    width: '100%',
    alignItems: 'center',
  },
  hiddenIdentity: {
    opacity: 0,
  },
  actionsContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  contactInfoContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 22,
    borderCurve: 'continuous',
    gap: 20,
    backgroundColor: colors.backgroundLight,
  },
  phoneList: {
    gap: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 15,
    backgroundColor: colors.baseGrey,
  },
  deleteButton: {
    minHeight: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 15,
  },
  pressed: {
    opacity: 0.7,
  },
});
