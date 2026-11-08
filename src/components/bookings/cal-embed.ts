export const DEFAULT_CAL_ORIGIN = "https://app.cal.com";

export type CalTheme = "light" | "dark" | "auto";
export type CalLayout = "month_view" | "week_view" | "column_view";

export type CalUiConfig = {
  theme?: CalTheme;
  hideEventTypeDetails?: boolean;
  hideBranding?: boolean;
  layout?: CalLayout;
  styles?: { branding?: { brandColor?: string } };
  cssVarsPerTheme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
};

type CalCommandQueue = unknown[];

export type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: CalCommandQueue;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

export type CalTarget = {
  origin: string;
  calLink: string;
};

function envCalLink() {
  return process.env.NEXT_PUBLIC_CAL_LINK?.trim() ?? "";
}

function envCalOrigin() {
  const origin = process.env.NEXT_PUBLIC_CAL_ORIGIN?.trim();
  return origin ? origin.replace(/\/+$/, "") : "";
}

/** Accept a slug (`org/consult`) or a full Cal URL (`https://cal.example.com/org/consult`). */
export function resolveCalTarget(
  calLink: string,
  origin: string,
): CalTarget | null {
  const linkInput = calLink.trim() || envCalLink();
  const originInput =
    origin.trim().replace(/\/+$/, "") || envCalOrigin() || DEFAULT_CAL_ORIGIN;
  if (!linkInput) {
    return null;
  }

  if (/^https?:\/\//i.test(linkInput)) {
    try {
      const url = new URL(linkInput);
      const slug = url.pathname.replace(/^\/+|\/+$/g, "");
      if (!slug) {
        return null;
      }
      return {
        origin: `${url.protocol}//${url.host}`,
        calLink: slug,
      };
    } catch {
      return null;
    }
  }

  const slug = linkInput.replace(/^\/+|\/+$/g, "");
  if (!/^[a-z0-9._-]+(?:\/[a-z0-9._-]+)*$/i.test(slug)) {
    return null;
  }

  return { origin: originInput, calLink: slug };
}

export function calEmbedScriptUrl(origin: string) {
  return `${origin.replace(/\/+$/, "")}/embed/embed.js`;
}

function enqueue(api: CalApi, args: IArguments | unknown[]) {
  api.q = api.q ?? [];
  api.q.push(args);
}

/**
 * Official Cal.com embed snippet, parameterized by origin so cloud and
 * self-hosted installs both work. Safe to call more than once.
 */
export function ensureCalEmbed(origin: string): CalApi {
  if (typeof window === "undefined") {
    throw new Error("Cal.com embed can only load in the browser");
  }

  if (window.Cal) {
    return window.Cal;
  }

  const embedJsUrl = calEmbedScriptUrl(origin);

  window.Cal = function Cal() {
    const cal = window.Cal!;
    const args = arguments;

    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q ?? [];
      const script = document.createElement("script");
      script.src = embedJsUrl;
      script.async = true;
      document.head.appendChild(script);
      cal.loaded = true;
    }

    if (args[0] === "init") {
      const api = function namespacedCal() {
        enqueue(api, arguments);
      } as CalApi;
      const namespace = args[1];
      api.q = api.q ?? [];
      if (typeof namespace === "string") {
        cal.ns = cal.ns ?? {};
        cal.ns[namespace] = cal.ns[namespace] ?? api;
        enqueue(cal.ns[namespace], args);
        enqueue(cal, ["initNamespace", namespace]);
      } else {
        enqueue(cal, args);
      }
      return;
    }

    enqueue(cal, args);
  } as CalApi;

  return window.Cal;
}

export function namespacedCalApi(cal: CalApi, namespace: string): CalApi {
  return cal.ns?.[namespace] ?? cal;
}

export function mountCalInline(options: {
  element: HTMLElement;
  namespace: string;
  origin: string;
  calLink: string;
  layout: CalLayout;
  theme: CalTheme;
  ui: CalUiConfig;
}) {
  const cal = ensureCalEmbed(options.origin);
  cal("init", options.namespace, { origin: options.origin });
  const api = namespacedCalApi(cal, options.namespace);
  api("inline", {
    elementOrSelector: options.element,
    calLink: options.calLink,
    config: {
      layout: options.layout,
      theme: options.theme,
    },
  });
  api("ui", options.ui);
}
