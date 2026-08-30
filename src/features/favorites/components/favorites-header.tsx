import { SymbolView } from 'expo-symbols';
import { PressableScale } from 'pressto';
import { StyleSheet, View } from 'react-native';

//import constants
import { colors, strings } from '@/constants';

//import components
import { TextComponent } from '@/components';

//import assets

//import types
import type { FavoritesHeaderProps } from '@/features/favorites/model';

/**
 * Displays the favorites section title and add action.
 */
const FavoritesHeader = ({ onPressAdd }: FavoritesHeaderProps) => (
  <View style={styles.container}>
    <TextComponent color={colors.baseWhite} styleProfile={'large3'} text={strings.favorites} />
    <PressableScale
      accessibilityLabel={strings.addFavorite}
      accessibilityRole={'button'}
      onPress={onPressAdd}
      style={styles.addButton}
    >
      <SymbolView
        name={{
          ios: 'plus',
          android: 'add',
        }}
        size={22}
        tintColor={colors.baseWhite}
      />
    </PressableScale>
  </View>
);

export default FavoritesHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    borderRadius: 50,
    backgroundColor: colors.primary,
  },
  addButtonTextContainer: {
    marginLeft: 10,
  },
});
