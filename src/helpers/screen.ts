import resolveConfig from "tailwindcss/resolveConfig";
// @ts-ignore
import tailwindConfig from "../../tailwind.config.js";

const twConfig = resolveConfig(tailwindConfig);

const parseScreen = (str: string) => {
   return +twConfig.theme.screens[str].replace("px", "");
};

export const gamesPerRow = () => {
   const width = window.innerWidth;

   if (width > parseScreen("lg")) {
      return 6;
   } else if (width > parseScreen("sm")) {
      return 4;
   } else {
      return 2;
   }
};
