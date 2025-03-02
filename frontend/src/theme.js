import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

//color design token
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#d6dce5",
          200: "#acb9cb",
          300: "#8395b2",
          400: "#597298",
          500: "#304f7e",
          600: "#263f65",
          700: "#1d2f4c",
          800: "#132032",
          900: "#0a1019",
        },
        primary: {
          100: "#d1d3dc",
          200: "#a3a8b9",
          300: "#757c95",
          400: "#475172",
          500: "#19254f",
          600: "#141e3f",
          700: "#0f162f",
          800: "#0a0f20",
          900: "#050710",
        },
        blueAccent: {
          100: "#d6dce5",
          200: "#acb9cb",
          300: "#8395b2",
          400: "#597298",
          500: "#223458",
          600: "#263f65",
          700: "#1d2f4c",
          800: "#132032",
          900: "#0a1019",
        },
        yellowAccent: {
          100: "#f5f4f1",
          200: "#ece9e3",
          300: "#e2ddd6",
          400: "#d9d2c8",
          500: "#cfc7ba",
          600: "#a69f95",
          700: "#7c7770",
          800: "#53504a",
          900: "#292825",
        },
        bleuAcc: {
          100: "#dadeea",
          200: "#b6bcd5",
          300: "#919bc0",
          400: "#6d79ab",
          500: "#485896",
          600: "#3a4678",
          700: "#2b355a",
          800: "#1d233c",
          900: "#0e121e",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
      }
    : {
        grey: {
          100: "#0a1019",
          200: "#132032",
          300: "#1d2f4c",
          400: "#263f65",
          500: "#304f7e",
          600: "#597298",
          700: "#8395b2",
          800: "#acb9cb",
          900: "#d6dce5",
        },
        primary: {
          100: "#050710",
          200: "#0a0f20",
          300: "#0f162f",
          400: "#141e3f",
          500: "#19254f",
          600: "#475172",
          700: "#757c95",
          800: "#a3a8b9",
          900: "#d1d3dc",
        },
        blueAccent: {
          100: "#0a1019",
          200: "#132032",
          300: "#1d2f4c",
          400: "#263f65",
          500: "#304f7e",
          600: "#597298",
          700: "#8395b2",
          800: "#acb9cb",
          900: "#d6dce5",
        },
        yellowAccent: {
          100: "#292825",
          200: "#53504a",
          300: "#7c7770",
          400: "#a69f95",
          500: "#cfc7ba",
          600: "#d9d2c8",
          700: "#e2ddd6",
          800: "#ece9e3",
          900: "#f5f4f1",
        },
        bleuAcc: {
          100: "#0e121e",
          200: "#1d233c",
          300: "#2b355a",
          400: "#3a4678",
          500: "#485896",
          600: "#6d79ab",
          700: "#919bc0",
          800: "#b6bcd5",
          900: "#dadeea",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
      }),
});
//mui theme setting
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[400],
            },

            secondary: {
              main: colors.yellowAccent[500],
            },

            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[200],
            },
            background: {
              default: colors.primary[900],
            },
          }
        : {
            primary: {
              main: colors.primary[500],
            },

            secondary: {
              main: colors.yellowAccent[500],
            },

            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[200],
            },
            background: {
              default: colors.primary[200],
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
