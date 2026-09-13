import { FC } from "react";
import type { SvgProps } from "react-native-svg";
import GoogleIcon from "./google.svg";

export const ICONS = {
  google: GoogleIcon,
} as const;

type IconKey = keyof typeof ICONS;

const getIcon = (iconKey: IconKey): FC<SvgProps> => {
  return ICONS[iconKey];
};

export { getIcon, IconKey };
