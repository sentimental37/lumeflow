import type { ReactNode } from "react";
import "@lumeflow/next/styles.css";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
