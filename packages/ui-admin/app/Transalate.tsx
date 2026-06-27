"use client";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google?: {
      translate?: {
        TranslateElement?: {
          new (options: TranslateElementOptions, element: string): any;
          InlineLayout?: {
            SIMPLE: string;
            HORIZONTAL: string;
          };
        };
        translate?: (
          element: HTMLElement,
          sourceLanguage: string,
          targetLanguage: string,
        ) => void;
      };
    };
  }
}

interface TranslateElementOptions {
  pageLanguage: string;
  includedLanguages: string;
  layout?: any;
  autoDisplay?: boolean;
  gaTrack?: boolean;
  multilanguagePage?: boolean;
  useSecureConnection?: boolean;
}

const AutoBrowserTranslate: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [browserLanguage, setBrowserLanguage] = useState<string>("en");

  const getBrowserLanguage = (): string => {
    if (typeof window !== "undefined") {
      const lang = navigator.language || (navigator as any).userLanguage;
      const shortLang = lang.split("-")[0];
      return shortLang;
    }
    return "en";
  };

  const forceTranslate = (targetLang: string) => {
    const doTranslate = () => {
      try {
        const selectElement = document.querySelector(
          ".goog-te-combo",
        ) as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = targetLang;
          selectElement.dispatchEvent(new Event("change"));

          const options = selectElement.options;
          for (let i = 0; i < options.length; i++) {
            if (options[i].value === targetLang) {
              options[i].selected = true;
              selectElement.dispatchEvent(new Event("change"));
              break;
            }
          }

          document.cookie = `googtrans=/en/${targetLang}`;
          document.cookie = `googtrans=/en/${targetLang};domain=.${window.location.hostname}`;

          return true;
        }
        return false;
      } catch (err) {
        console.error("Translation attempt failed:", err);
        return false;
      }
    };

    const attemptInterval = setInterval(() => {
      if (doTranslate()) {
        clearInterval(attemptInterval);
      }
    }, 1000);

    setTimeout(() => clearInterval(attemptInterval), 10000);
  };

  useEffect(() => {
    const detectBrowserLanguage = getBrowserLanguage();
    setBrowserLanguage(detectBrowserLanguage);

    if (typeof window === "undefined") return;

    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;

    if (detectBrowserLanguage !== "en") {
      document.cookie = `googtrans=/en/${detectBrowserLanguage}`;
      document.cookie = `googtrans=/en/${detectBrowserLanguage};domain=.${window.location.hostname}`;
    }

    window.googleTranslateElementInit = () => {
      try {
        const initTranslator = () => {
          if (!window.google?.translate?.TranslateElement) {
            setTimeout(initTranslator, 100);
            return;
          }

          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,es,fr,de,ja,ko,zh-CN,ru,ar,hi,pt,it",
              layout:
                window.google.translate.TranslateElement?.InlineLayout?.SIMPLE,
              autoDisplay: true,
              gaTrack: false,
              multilanguagePage: false,
            },
            "google_translate_element",
          );

          setIsLoaded(true);

          if (detectBrowserLanguage !== "en") {
            setTimeout(() => forceTranslate(detectBrowserLanguage), 1000);
            setTimeout(() => forceTranslate(detectBrowserLanguage), 2000);
            setTimeout(() => forceTranslate(detectBrowserLanguage), 3000);
          }
        };

        initTranslator();
      } catch (err) {
        console.error("Translation initialization error:", err);
        setError("Translation initialization failed");
      }
    };

    if (!document.querySelector("script[src*='translate_a/element.js']")) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = (e) => {
        console.error("Script load error:", e);
        setError("Failed to load translation script");
      };
      document.body.appendChild(script);
    }

    return () => {
      try {
        const script = document.querySelector(
          "script[src*='translate_a/element.js']",
        );
        if (script) script.remove();
        // @ts-ignore
        if (window.googleTranslateElementInit)
          // @ts-ignore
          delete window.googleTranslateElementInit;
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };
  }, []);

  // Enhanced CSS to hide all Google Translate UI elements
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Hide Google Translate banner */
      .goog-te-banner-frame,
      .skiptranslate,
      .goog-te-spinner-pos {
        display: none !important;
      }
      
      /* Hide the main Google Translate widget */
      .goog-te-gadget {
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        visibility: hidden !important;
      }
      
      /* Hide all Google Translate elements */
      .goog-te-gadget > * {
        display: none !important;
      }
      
      /* Hide dropdown specifically */
      .goog-te-combo,
      select.goog-te-combo {
        display: none !important;
      }
      
      /* Remove the white space that the widget leaves */
      #google_translate_element {
        height: 0 !important;
        overflow: hidden !important;
        visibility: hidden !important;
        display: none !important;
      }
      
      /* Hide any frames that might appear */
      .goog-te-menu-frame {
        display: none !important;
      }
      
      /* Remove any spacing the widget might create */
      .VIpgJd-ZVi9od-l4eHX-hSRGPd,
      .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
      .VIpgJd-ZVi9od-aZ2wEe-OiiCO {
        display: none !important;
      }
      
      /* Hide the top banner */
      .VIpgJd-ZVi9od-l4eHX-hSRGPd {
        display: none !important;
      }
      
      /* Additional selectors to ensure everything is hidden */
      .goog-tooltip,
      .goog-tooltip:hover,
      .goog-text-highlight,
      .goog-text-highlight:hover {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* Hide any Google branding */
      .goog-logo-link,
      .goog-logo-link:link,
      .goog-logo-link:visited,
      .goog-logo-link:hover,
      .goog-logo-link:active {
        display: none !important;
      }
      
      /* Remove any margins or padding that might create space */
      #google_translate_element,
      .skiptranslate {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Ensure body is not pushed down */
      body {
        top: 0 !important;
        position: static !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none", height: 0, overflow: "hidden" }}
    />
  );
};

export default AutoBrowserTranslate;
