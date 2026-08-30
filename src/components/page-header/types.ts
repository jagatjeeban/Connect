import type { ColorValue, TextInputProps } from 'react-native';

export type PageHeaderIcon = 'search' | 'whiteStar' | 'pencil' | 'share' | 'trash' | 'saveBtn' | 'updateBtn' | 'addBtn';

export type PageHeaderAction = 'star' | 'edit' | 'share' | 'delete' | 'save' | 'add';

export type PageHeaderProps = {
  placeholder?: string;
  loaderStatus?: boolean;
  headerType?: 'normalHeader';
  headerTitle?: string;
  headerTitleColor?: ColorValue;
  iconArr?: readonly PageHeaderIcon[];
  backBtn?: boolean;
  crossBtn?: boolean;
  customClickEvent?: () => void;
  rightBtnClickEvent?: (action: PageHeaderAction) => void;
  searchBlur?: TextInputProps['onBlur'];
  searchEvent?: (value: string) => void;
};
