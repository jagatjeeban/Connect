//import constants
import { colors } from '@/constants';

//import types
import type { DeviceContact } from '@/features/contacts/model';

//constants
export const FAVORITE_CARD_HEIGHTS = [190, 225, 260] as const;
export const FAVORITE_CARD_GRADIENT = `linear-gradient(to top, ${colors.primaryLight} 0%, ${colors.primaryLight}F0 20%, ${colors.primaryLight}B8 42%, ${colors.primaryLight}70 62%, ${colors.primaryLight}2E 80%, ${colors.primaryLight}00 100%)`;
export const FAVORITE_BUTTON_BACKGROUND = `${colors.baseDarkBlack}E6`;

//types
export type EmptyStateProps = {
  isSearchResultState?: boolean;
  onClearSearch?: () => void;
};

export type FavoriteContactItemProps = {
  item: DeviceContact;
  onPress: (contact: DeviceContact) => void;
  onRemoveFavorite: (contact: DeviceContact) => void;
};

export type FavoritesHeaderProps = {
  onPressAdd: () => void;
};
