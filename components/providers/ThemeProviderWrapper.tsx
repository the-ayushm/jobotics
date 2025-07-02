// components/providers/ThemeProviderWrapper.tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import React from "react";
export function ThemeProviderWrapper({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}