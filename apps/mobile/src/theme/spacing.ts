export const SPACING = {
  SPACING_2: 2,
  SPACING_4: 4,
  SPACING_6: 6,
  SPACING_8: 8,
  SPACING_10: 10,
  SPACING_12: 12,
  SPACING_14: 14,
  SPACING_16: 16,
  SPACING_20: 20,
  SPACING_24: 24,
  SPACING_28: 28,
  SPACING_32: 32,
  SPACING_40: 40,
  SPACING_48: 48,
  SPACING_56: 56,
  SPACING_64: 64,
} as const;

export type SpacingType = keyof typeof SPACING;

export const getSpacing = (spacingKey: SpacingType): number => {
  return SPACING[spacingKey];
};
