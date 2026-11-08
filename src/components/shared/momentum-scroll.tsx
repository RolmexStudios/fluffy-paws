"use client";

import { useEffect } from "react";

/**
 * Wheel smoothing close to the studio site's momentum scroll
 * (duration ~1.1s, exponential ease). Touch scrolling stays native:
 * the loop never starts on a phone, and a finger down cancels it so
 * it cannot fight iOS inertial scroll or the collapsing URL bar.
 * Reduced motion leaves the browser scroll alone.
 */

let active = false;
let target = 0;
let current = 0;
let begin: ((keepTarget?: boolean) => void) | null = null;

function maxScroll() {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
}

function clampScroll(value: number) {
  return Math.min(maxScroll(), Math.max(0, value));
}

function isTouchPrimary() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

export function hasMomentumScroll() {
  return active;
}

export function momentumScrollTo(top: number) {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    isTouchPrimary()
  ) {
    return;
  }
  current = window.scrollY;
  target = clampScroll(top);
  begin?.(true);
}

function ownsScroll(start: EventTarget | null, deltaY: number) {
  let node = start instanceof Element ? start : null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    const canScroll =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      node.scrollHeight > node.clientHeight + 1;
    if (canScroll) {
      const atTop = node.scrollTop <= 0;
      const atBottom =
        node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) return true;
    }
    node = node.parentElement;
  }
  return false;
}

export function MomentumScroll() {
  useEffect(() => {
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    let frame = 0;
    let expected = window.scrollY;
    let running = false;

    const stop = () => {
      running = false;
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const blocked = () => reduceQuery.matches || coarseQuery.matches || isTouchPrimary();

    const tick = () => {
      if (!running) return;
      target = clampScroll(target);
      const delta = target - current;
      if (Math.abs(delta) < 0.4) {
        current = target;
        expected = current;
        window.scrollTo({ top: current, behavior: "instant" });
        stop();
        return;
      }
      current += delta * 0.055;
      expected = current;
      window.scrollTo({ top: current, behavior: "instant" });
      frame = requestAnimationFrame(tick);
    };

    const start = (keepTarget = false) => {
      if (blocked()) {
        stop();
        return;
      }
      if (running) return;
      running = true;
      active = true;
      current = window.scrollY;
      if (!keepTarget) target = window.scrollY;
      frame = requestAnimationFrame(tick);
    };

    begin = start;

    const onWheel = (event: WheelEvent) => {
      if (blocked() || event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (ownsScroll(event.target, event.deltaY)) return;
      event.preventDefault();
      let delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      if (event.deltaMode === 2) delta *= window.innerHeight;
      if (!running) {
        current = window.scrollY;
        target = window.scrollY;
      }
      target = clampScroll(target + delta);
      start(true);
    };

    const onScroll = () => {
      if (!running) return;
      if (Math.abs(window.scrollY - expected) < 1.5) return;
      current = window.scrollY;
      target = window.scrollY;
      expected = window.scrollY;
    };

    const onTouch = () => stop();
    const onChange = () => {
      if (blocked()) stop();
    };

    reduceQuery.addEventListener("change", onChange);
    coarseQuery.addEventListener("change", onChange);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    return () => {
      stop();
      begin = null;
      reduceQuery.removeEventListener("change", onChange);
      coarseQuery.removeEventListener("change", onChange);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return null;
}
