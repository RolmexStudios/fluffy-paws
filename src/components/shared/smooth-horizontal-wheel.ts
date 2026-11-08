import { useEffect, type RefObject } from "react";

export type SmoothHorizontalWheelOptions = {
  /** Per-frame velocity retention (0–1). Higher = longer glide. */
  friction?: number;
  /** Multiplier on wheel delta before it becomes scroll velocity. */
  sensitivity?: number;
  /**
   * When true (default), vertical wheel/trackpad pans the strip.
   * When false, vertical motion scrolls the page and leaves the strip alone.
   */
  mapVertical?: boolean;
};

function normalizeWheelDelta(event: WheelEvent, clientWidth: number): number {
  let delta = event.deltaY + event.deltaX;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= clientWidth;
  }
  return delta;
}

/**
 * Maps vertical wheel/trackpad motion to smooth horizontal scroll with momentum.
 * Disables scroll-snap while gliding via `data-smooth-wheel="active"`.
 */
export function attachSmoothHorizontalWheelScroll(
  element: HTMLElement,
  options: SmoothHorizontalWheelOptions = {},
): () => void {
  const friction = options.friction ?? 0.9;
  const sensitivity = options.sensitivity ?? 0.92;
  const mapVertical = options.mapVertical !== false;

  let velocity = 0;
  let rafId = 0;
  let snapRestoreTimer: ReturnType<typeof setTimeout> | undefined;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function markScrolling() {
    element.dataset.smoothWheel = "active";
    clearTimeout(snapRestoreTimer);
    snapRestoreTimer = setTimeout(() => {
      delete element.dataset.smoothWheel;
    }, 180);
  }

  function tick() {
    if (Math.abs(velocity) < 0.4) {
      velocity = 0;
      rafId = 0;
      return;
    }

    const maxScroll = element.scrollWidth - element.clientWidth;
    const next = element.scrollLeft + velocity;

    if (next <= 0 || next >= maxScroll) {
      element.scrollLeft = Math.max(0, Math.min(maxScroll, next));
      velocity *= 0.55;
    } else {
      element.scrollLeft = next;
      velocity *= friction;
    }

    markScrolling();
    rafId = requestAnimationFrame(tick);
  }

  function onWheel(event: WheelEvent) {
    if (element.scrollWidth <= element.clientWidth + 1) return;

    const absY = Math.abs(event.deltaY);
    const absX = Math.abs(event.deltaX);
    const horizontal = event.shiftKey || (absX > absY && absX > 0.5);

    if (horizontal) {
      if (motionQuery.matches) return;
      event.preventDefault();
      const raw = event.shiftKey
        ? normalizeWheelDelta(event, element.clientWidth)
        : event.deltaX;
      velocity += raw * sensitivity * (event.shiftKey ? 1 : 0.65);
      markScrolling();
      if (!rafId) rafId = requestAnimationFrame(tick);
      return;
    }

    if (absY <= 0.5) return;

    if (!mapVertical) {
      // Keep overflow-x from turning a page-scroll into a sideways jump.
      event.preventDefault();
      let dy = event.deltaY;
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        dy *= 16;
      } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        dy *= window.innerHeight;
      }
      const root = document.scrollingElement ?? document.documentElement;
      root.scrollTop += dy;
      return;
    }

    event.preventDefault();

    const delta = normalizeWheelDelta(event, element.clientWidth) * sensitivity;

    if (motionQuery.matches) {
      element.scrollLeft += delta;
      return;
    }

    velocity += delta;
    markScrolling();
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  element.addEventListener("wheel", onWheel, { passive: false });

  return () => {
    element.removeEventListener("wheel", onWheel);
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(snapRestoreTimer);
    delete element.dataset.smoothWheel;
  };
}

export function useSmoothHorizontalWheelScroll(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: SmoothHorizontalWheelOptions,
): void {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    return attachSmoothHorizontalWheelScroll(root, options);
  }, [ref, enabled, options?.friction, options?.sensitivity, options?.mapVertical]);
}
