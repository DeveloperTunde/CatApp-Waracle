export const Colors = {
  primary: '#f93b02',
  primaryLight: '#ff6a3d',
  primaryDark: '#c42d00',

  white: '#ffffff',
  black: '#000000',

  background: '#f8f8f8',
  surface: '#ffffff',
  surfaceSecondary: '#f2f2f2',

  text: '#1a1a1a',
  textSecondary: '#6b6b6b',
  textDisabled: '#b0b0b0',
  textInverse: '#ffffff',

  border: '#e0e0e0',
  borderLight: '#f0f0f0',

  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  heartActive: '#ef4444',
  heartInactive: '#b0b0b0',

  voteUp: '#22c55e',
  voteDown: '#ef4444',

  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorKey = keyof typeof Colors;
