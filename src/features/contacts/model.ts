import { ContactField, type PartialContactDetails } from 'expo-contacts';
import { type LayoutRectangle, type StyleProp, type ViewStyle, type ViewabilityConfig } from 'react-native';

export const CONTACT_FIELDS = [
  ContactField.FULL_NAME,
  ContactField.PHONES,
  ContactField.EMAILS,
  // Expo Contacts 57's iOS thumbnail mapper reads imageData internally.
  // Fetch IMAGE with THUMBNAIL so that native access is always available.
  ContactField.IMAGE,
  ContactField.THUMBNAIL,
] as const;

export type DeviceContact = PartialContactDetails<typeof CONTACT_FIELDS>;

export type DevicePhone = DeviceContact['phones'][number];

export type ContactHeaderItem = {
  id: string;
  type: 'header';
  letter: string;
};

export type ContactRowItem = {
  id: string;
  type: 'contact';
  letter: string;
  contact: DeviceContact;
};

export type ContactListItem = ContactHeaderItem | ContactRowItem;

export type PreparedContacts = {
  listItems: ContactListItem[];
  stickyHeaderIndices: number[];
  scrubberLetters: string[];
  letterToHeaderIndex: Record<string, number>;
};

//CONSTANTS
export const SCRUBBER_PREVIEW_GAP = 8 as const;
export const LIST_FOOTER_HEIGHT_IOS = 200 as const;
export const LIST_FOOTER_HEIGHT_ANDROID = 230 as const;
export const EMPTY_CONTACTS: readonly DeviceContact[] = [];
export const SCRUBBER_PREVIEW_HIDDEN_STYLE = { opacity: 0 } satisfies ViewStyle;
export const VIEWABILITY_CONFIG: ViewabilityConfig = {
  itemVisiblePercentThreshold: 1,
};
export const SCRUBBER_CONTENT_GUTTER = 60 as const;

export type ScrubberLetterLayout = Pick<LayoutRectangle, 'height' | 'y'>;
export type ScrubberLetterLayouts = Record<string, ScrubberLetterLayout>;
export type MeasuredScrubberRailLayout = LayoutRectangle & {
  pageX?: number;
  pageY?: number;
};

export type ContactRenderOptions = {
  isSelectEvent: boolean;
  selectedContactIds: ReadonlySet<string> | null;
  onClickContact?: (contact: DeviceContact) => void;
  hasScrubber: boolean;
};

export type ContactsListProps = {
  contacts?: readonly DeviceContact[];
  loaderStatus?: boolean;
  isSelectEvent?: boolean;
  isScrubberVisible?: boolean;
  selectedContactIds?: ReadonlySet<string> | null;
  selectionVersion?: number;
  onClearSearch?: () => void;
  onClickContact?: (contact: DeviceContact) => void;
  searchText?: string;
  totalContactsCount?: number;
  style?: StyleProp<ViewStyle>;
};

export type ContactSectionHeaderProps = {
  letter: string;
  isSticky?: boolean;
  hasScrubber?: boolean;
};

export type ContactItemProps = {
  item: DeviceContact;
  isSelectEvent?: boolean;
  isSelected?: boolean;
  onClickEvent?: (contact: DeviceContact) => void;
  hasScrubber?: boolean;
};
