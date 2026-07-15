import { Linking, Share } from 'react-native';

type VerticalItemLayout = {
  height: number;
  y: number;
};

/**
 * Finds the scrubber letter whose vertical center is closest to a touch point.
 *
 * @param locationY - Touch position relative to the scrubber rail.
 * @param letters - Ordered letters available in the scrubber.
 * @param letterLayouts - Measured vertical layouts keyed by letter.
 * @returns The nearest measured letter, or `null` when none can be resolved.
 */
export const getNearestScrubberLetter = (
  locationY: number,
  letters: readonly string[],
  letterLayouts: Readonly<Record<string, VerticalItemLayout>>,
): string | null => {
  let closestLetter: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const letter of letters) {
    const layout = letterLayouts[letter];

    if (!layout) continue;

    const centerY = layout.y + layout.height / 2;
    const nextDistance = Math.abs(locationY - centerY);

    if (nextDistance < closestDistance) {
      closestDistance = nextDistance;
      closestLetter = letter;
    }
  }

  return closestLetter;
};

const openExternalUrl = async (url: string): Promise<void> => {
  const isSupported = await Linking.canOpenURL(url);

  if (!isSupported) {
    throw new Error('The device cannot open the requested URL');
  }

  await Linking.openURL(url);
};

/**
 * Opens the device dialer for a phone number.
 *
 * @param phoneNumber - Phone number to pass to the system dialer.
 */
export const openPhoneCall = async (phoneNumber: string): Promise<void> => {
  const normalizedPhoneNumber = phoneNumber.trim().replace(/\s+/g, '');
  await openExternalUrl(`tel:${normalizedPhoneNumber}`);
};

/**
 * Opens the device messaging application for a phone number.
 *
 * @param phoneNumber - Phone number to pass to the messaging application.
 */
export const openTextMessage = async (phoneNumber: string): Promise<void> => {
  const normalizedPhoneNumber = phoneNumber.trim().replace(/\s+/g, '');
  await openExternalUrl(`sms:${normalizedPhoneNumber}`);
};

/**
 * Opens the device email application for an email address.
 *
 * @param emailAddress - Recipient email address.
 */
export const openEmail = async (emailAddress: string): Promise<void> => {
  await openExternalUrl(`mailto:${emailAddress.trim()}`);
};

/**
 * Opens the native share sheet with a text payload.
 *
 * @param message - Text content to share.
 */
export const shareText = async (message: string): Promise<void> => {
  await Share.share({ message });
};
