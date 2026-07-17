import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { TextComponent } from '@/components';
import ContactActionButton from '@/features/contacts/components/contact-action-button';
import ContactDetailsHeader from '@/features/contacts/components/contact-details-header';
import ContactInfoItem from '@/features/contacts/components/contact-info-item';

//import hooks
import { useResponsive } from '@/hooks';

//import helpers
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

  const curveHeight = rh(20);
  const contactName = contact ? getContactName(contact) : '';
  const thumbnail = contact?.thumbnail?.trim() || contact?.image?.trim();

  return (
    <View style={styles.container}>
      <SvgUpperCurve
        pointerEvents={'none'}
        preserveAspectRatio={'xMidYMid slice'}
        style={[styles.upperCurve, { top: -curveHeight * 0.25 }]}
        width={width}
      />

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
            {thumbnail ? (
              <Image
                accessibilityLabel={`${contactName} contact photo`}
                cachePolicy={'memory-disk'}
                contentFit={'cover'}
                priority={'high'}
                source={thumbnail}
                style={styles.contactImage}
                transition={100}
              />
            ) : (
              <View style={styles.defaultContactImage}>
                <TextComponent
                  color={colors.baseWhite}
                  styleProfile={'largest3'}
                  text={getContactInitial(contactName)}
                  textAlign={'center'}
                />
              </View>
            )}

            <TextComponent
              color={colors.baseWhite}
              numOfLine={2}
              styleProfile={'large4'}
              text={contactName}
              textAlign={'center'}
            />
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
              <ContactActionButton icon={<SvgMail width={26} height={21} />} label={strings.email} onPress={onEmail} />
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
  defaultContactImage: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: colors.primary,
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
