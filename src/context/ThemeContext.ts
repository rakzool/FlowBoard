import { createContext } from "react";


type TThemeContextType  = {
  theme: string;
  toggleTheme: VoidFunction;
}


export const ThemeContext = createContext<TThemeContextType|undefined>(undefined);
