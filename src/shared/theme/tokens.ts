/**
 * Design System — Design Tokens
 *
 * Centraliza cores, espaçamentos, tipografia e sombras.
 * Nunca use valores mágicos espalhados pelo projeto.
 */

export const colors = {
  brand: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a5f",
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    600: "#16a34a",
    700: "#047857",
    800: "#065f46",
  },
  warning: {
    100: "#fef3c7",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
  },
  danger: {
    100: "#fee2e2",
    600: "#dc2626",
  },
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  white: "#ffffff",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const typography = {
  heading: {
    fontWeight: "600" as const,
    fontSize: 20,
  },
} as const;
