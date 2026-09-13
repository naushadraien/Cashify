export const BORDER_RADIUS = {
  RADIUS_4: 4,
  RADIUS_8: 8,
  RADIUS_12: 12,
  RADIUS_16: 16,
  RADIUS_20: 20,
  RADIUS_24: 24,
  RADIUS_28: 28,
  RADIUS_FULL: 9999,
} as const;

export type RadiusType = keyof typeof BORDER_RADIUS;

export const getBorderRadius = (radiusKey: RadiusType): number => {
  return BORDER_RADIUS[radiusKey];
};
