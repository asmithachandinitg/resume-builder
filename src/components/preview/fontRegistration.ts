import { Font } from "@react-pdf/renderer";

import InterRegular from "@fontsource/inter/files/inter-latin-400-normal.woff2";
import InterBold from "@fontsource/inter/files/inter-latin-700-normal.woff2";

let registered = false;

export function registerFonts() {

  if (registered) return;
  registered = true;

  Font.register({
    family: "Inter",
    fonts: [
      { src: InterRegular, fontWeight: 400 },
      { src: InterBold, fontWeight: 700 },
    ],
  });
}