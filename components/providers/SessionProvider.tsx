"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
  ...pageProps
}: {
  children: React.ReactNode;
  [key: string]: unknown;
}) {
  return <SessionProvider {...pageProps}>{children}</SessionProvider>;
}
