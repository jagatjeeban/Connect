import type { ReactNode } from "react";
import type { ColorValue, TextInputProps } from "react-native";

export type PageHeaderIcon =
  | "search"
  | "whiteStar"
  | "pencil"
  | "share"
  | "trash"
  | "saveBtn"
  | "updateBtn"
  | "addBtn";

export type PageHeaderAction =
  | "star"
  | "edit"
  | "share"
  | "delete"
  | "save"
  | "add";

export interface HeaderNavigation {
  goBack?: () => void;
}

export interface PageHeaderProps {
  navigation?: HeaderNavigation;
  placeholder?: string;
  loaderStatus?: boolean;
  headerType?: "normalHeader";
  headerTitle?: ReactNode;
  headerTitleColor?: ColorValue;
  iconArr?: readonly PageHeaderIcon[];
  backBtn?: boolean;
  crossBtn?: boolean;
  customClickEvent?: () => void;
  rightBtnClickEvent?: (action: PageHeaderAction) => void;
  searchBlur?: TextInputProps["onBlur"];
  searchEvent?: (value: string) => void;
}
