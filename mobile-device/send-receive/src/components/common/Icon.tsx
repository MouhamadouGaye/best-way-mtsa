import React from "react";
import * as LucideIcons from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  [key: string]: any;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "black",
  ...props
}) => {
  const LucideIcon = LucideIcons[name] as LucideIcon;

  if (!LucideIcon) {
    console.warn(`⚠️ Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return <LucideIcon size={size} color={color} {...props} />;
};

export default Icon;
