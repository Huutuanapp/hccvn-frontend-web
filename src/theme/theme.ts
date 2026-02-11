export const theme = {
  colors: {
    primary: '#2563EB',
    primaryDark: '#1d4ed8',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    gray50: '#F2F2F7',
    gray100: '#E5E5EA',
    gray200: '#D1D1D6',
    gray300: '#C7C7CC',
    gray600: '#8E8E93',
    gray700: '#636366',
    gray900: '#1C1C1E',
    surface: '#FFFFFF',
    background: '#F2F2F7',
    gradientStart: '#FF8A00',
    gradientEnd: '#FFC837',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.06)',
    md: '0 4px 12px rgba(0, 0, 0, 0.08)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    card: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  radius: {
    sm: '10px',
    md: '14px',
    lg: '20px',
    xl: '24px',
  },
  spacing: (n: number) => `${n * 8}px`,
  fonts: {
    system: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
  },
};

export type Theme = typeof theme;
