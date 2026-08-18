import type { ReactNode } from "react";
import "@sentimental37/visual-flow-next/styles.css";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
