import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

//import components
import { TextComponent } from '@/components';

//import constants
import { colors, fontFamily } from '@/constants';

//import helpers
import { getContactInitial, getContactName } from '@/helpers/customFun';

//import types
import type { DeviceContact } from '@/features/contacts/model';

type FavoriteContactItemProps = {
  item: DeviceContact;
  onPress?: (contact: DeviceContact) => void;
};

const FavoriteContactItem = ({ item, onPress }: FavoriteContactItemProps) => {
  const contactName = getContactName(item);
  const thumbnail = item.thumbnail?.trim() || item.image?.trim();

  return (
    <Pressable
      accessibilityLabel={contactName}
      accessibilityRole='button'
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      {thumbnail ? (
        <Image
          accessibilityLabel={`${contactName} contact photo`}
          cachePolicy='memory-disk'
          contentFit='cover'
          priority='high'
          recyclingKey={item.id}
          source={thumbnail}
          style={styles.contactImage}
          transition={100}
        />
      ) : (
        <View style={styles.defaultContactImage}>
          <TextComponent
            color={colors.primary}
            textAlign={'center'}
            fontFamily={fontFamily.outfitMedium}
            styleProfile='largest1'
            text={getContactInitial(contactName)}
          />
        </View>
      )}
      <TextComponent
        color={colors.baseWhite}
        containerStyle={styles.contactNameContainer}
        fontFamily={fontFamily.outfitRegular}
        numOfLine={2}
        styleProfile='large2'
        text={contactName}
        textAlign='center'
      />
    </Pressable>
  );
};

export default FavoriteContactItem;

const styles = StyleSheet.create({
  container: {
    width: '25%',
    alignItems: 'center',
    paddingTop: 30,
  },
  containerPressed: {
    opacity: 0.7,
  },
  contactImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  defaultContactImage: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
  },
  contactInitial: {
    textAlign: 'center',
  },
  contactNameContainer: {
    width: '90%',
    marginTop: 15,
  },
  contactName: {
    textAlign: 'center',
  },
});
