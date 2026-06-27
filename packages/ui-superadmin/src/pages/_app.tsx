import "@/styles/globals.css";
import type { AppProps } from "next/app";
import AutoBrowserTranslate from "./Transalate";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const publicRoutes = ["/"];

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access-token")
        : null;

    if (!token && !publicRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [router.pathname]);

  return (
    <>
      <AutoBrowserTranslate />
      <Component {...pageProps} />
    </>
  );
}