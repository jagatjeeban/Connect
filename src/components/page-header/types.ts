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

export type NormalHeaderProps = {
  placeholder: string;
  backBtn: boolean;
  crossBtn: boolean;
  loaderStatus: boolean;
  headerTitle: string;
  headerTitleColor: ColorValue;
  iconArr: readonly PageHeaderIcon[];
  customClickEvent?: () => void;
  rightBtnClickEvent?: (action: PageHeaderAction) => void;
  searchStatus: boolean;
  updateSearchStatus: () => void;
  searchBlur?: TextInputProps['onBlur'];
  textChangeEvent?: (value: string) => void;
};
