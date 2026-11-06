"use client";

import { createElement, useEffect } from "react";
import { useSite } from "@/components/providers";
import { siteConfig } from "@/lib/config";
import { WIDGET_STRINGS } from "@/lib/widget-strings";

const SCRIPT_ID = "harnix-widget-script";

/**
 * Loads the widget script once, after the page has finished loading and the browser is idle,
 * so the ~40 KB script never competes with the hero (LCP) or the first interaction.
 */
function loadWidgetScript(apiUrl: string): () => void {
  if (document.getElementById(SCRIPT_ID)) return () => {};
  const inject = () => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${apiUrl}/v2/widget/v1/widget.js`;
    script.async = true;
    document.head.appendChild(script);
  };
  // Safari has no requestIdleCallback.
  const idle = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(inject, { timeout: 4000 });
    else window.setTimeout(inject, 1500);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => window.removeEventListener("load", idle);
}

/**
 * The Harnix assistant of harnix.vn: the same `<harnix-chat>` customers embed (bubble mode:
 * the widget draws its own launcher and panel, bottom right). Night theme and the site's
 * accent colour; the language follows the page. Rendered only when `siteConfig.liveChat`
 * is on, i.e. a publishable key is configured.
 */
export function HarnixChat() {
  const { lang, c } = useSite();
  const { pk, agent, apiUrl } = siteConfig.harnixChat;

  useEffect(() => loadWidgetScript(apiUrl), [apiUrl]);

  return createElement("harnix-chat", {
    pk,
    ...(agent ? { agent } : {}),
    "api-url": apiUrl,
    mode: "bubble",
    position: "right",
    theme: "dark",
    "primary-color": "#0f8f6a",
    title: c.chat.title,
    greeting: c.chat.liveGreeting,
    logo: `${siteConfig.url}/apple-icon`,
    strings: JSON.stringify(WIDGET_STRINGS[lang]),
    // Per-language starter chips: the agent's own list is Vietnamese only.
    suggestions: JSON.stringify(c.chat.liveSuggestions),
    // Shown when the visitor sends too fast, the assistant is busy or today's limit is reached.
    "contact-url": `${siteConfig.url}${lang === "en" ? "/en" : "/"}#demo`,
  });
}
