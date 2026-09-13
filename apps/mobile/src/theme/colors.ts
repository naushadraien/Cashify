export type ThemeMode = "dark" | "light";

let activeTheme: ThemeMode = "dark";

export const getActiveTheme = (): ThemeMode => activeTheme;

export const setActiveTheme = (theme: ThemeMode) => {
  activeTheme = theme;
};

export const DARK_COLORS = {
  TEXT_COLOR: "#FFFFFF",
  BACKGROUND: "#0A0A0A",
  FOREGROUND: "#1A1A1A",
  BORDER: "#2A2A2A",
  INPUT: "#1A1A1A",
  PRIMARY: "#CDF248",
  PRIMARY_FOREGROUND: "#000000",
  SECONDARY: "#1A1A1A",
  DANGER: "#FF4444",
  MUTED_FOREGROUND: "#666666",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",
  TRANSPARENT: "transparent",
  TAGPRIMARYBG: "rgba(198, 241, 53, 0.14)",
} as const;

export const LIGHT_COLORS = {
  TEXT_COLOR: "#000000",
  BACKGROUND: "#FFFFFF",
  FOREGROUND: "#0A0A0A",
  BORDER: "#E2E8F0",
  INPUT: "#F8FAFC",
  PRIMARY: "#CDF248",
  PRIMARY_FOREGROUND: "#000000",
  SECONDARY: "#F1F5F9",
  DANGER: "#EF4444",
  MUTED_FOREGROUND: "#64748B",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",
  TRANSPARENT: "transparent",
  TAGPRIMARYBG: "rgba(198, 241, 53, 0.14)",
} as const;

export type ColorKey = keyof typeof DARK_COLORS;

export const getColor = (colorKey: ColorKey): string => {
  const palette = activeTheme === "light" ? LIGHT_COLORS : DARK_COLORS;
  return palette[colorKey] ?? DARK_COLORS[colorKey];
};

export const COLORS = new Proxy(
  {},
  {
    get(_, prop: ColorKey) {
      return getColor(prop);
    },
  },
) as typeof DARK_COLORS;
