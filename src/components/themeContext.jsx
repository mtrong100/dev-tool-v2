import React, { createContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference first
    const savedTheme = localStorage.getItem("DEVTOOLV2_THEME");
    if (savedTheme) return savedTheme;

    // Fallback to system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Default to light if no preference detected
    return "light";
  });

  useEffect(() => {
    // Apply theme class to document element
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Store preference
    try {
      localStorage.setItem("DEVTOOLV2_THEME", theme);
    } catch (e) {
      console.warn("Failed to save theme preference to localStorage", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
