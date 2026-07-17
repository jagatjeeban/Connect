import { StyleSheet, View } from 'react-native';

//import constants
import { colors } from '@/constants';

//import components
import { TextComponent } from '@/components';

//import helpers
import { formatContactLabel } from '@/helpers/custom-functions';

//import assets
import SvgCall from '@/assets/icons/call.svg';

//import types
import type { DevicePhone } from '@/features/contacts/model';

type ContactInfoItemProps = {
  phone: DevicePhone;
};

/**
 * Displays one normalized phone number and its device-provided label.
 */
const ContactInfoItem = ({ phone }: ContactInfoItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <SvgCall width={20} height={20} />
      </View>
      <View style={styles.textContainer}>
        <TextComponent color={colors.baseWhite} selectable styleProfile={'large2'} text={phone.number?.trim() ?? ''} />
        <TextComponent color={colors.baseMediumGrey} styleProfile={'large1'} text={formatContactLabel(phone.label)} />
      </View>
    </View>
  );
};

export default ContactInfoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 16,
    gap: 3,
  },
});
