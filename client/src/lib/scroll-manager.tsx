/**
 * Site-wide scroll behaviour for the single-page app.
 *
 * - Back / forward (and refresh) return to exactly where you were on that page.
 * - A new page starts at the top, or at its #section if the link has one.
 * - In-page "#section" links scroll smoothly (instantly with reduced motion) and get
 *   their own history entry, so Back returns to where you clicked from.
 *
 * Positions are kept per URL (path + query + hash) in sessionStorage, so they survive a
 * refresh but never leak between tabs.
 */
import { useEffect } from "react";

const STORAGE_KEY = "scroll-positions";
let positions: Record<string, number> = {};
try {
  positions = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "{}");
} catch {
  positions = {};
}

/** Navigations made inside this page load; lets "back" buttons use real history when possible. */
let inAppNavigations = 0;
/** While we are moving the page ourselves, scroll events must not overwrite saved positions. */
let suppressSaving = false;
/** Set when we pushed a #hash entry ourselves, so the push handler leaves the smooth scroll alone. */
let skipNextPush = false;

const currentKey = () => window.location.pathname + window.location.search + window.location.hash;

function persist() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    /* private mode: positions still work for this page load */
  }
}

function saveCurrent() {
  if (suppressSaving) return;
  positions[currentKey()] = Math.round(window.scrollY);
  persist();
}

function jumpTo(y: number) {
  window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
}

const prefersReducedMotion = () =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Retry for a few frames: the next route, its images and fonts may still be rendering. */
function whenReady(attempt: () => boolean, onGiveUp?: () => void, maxFrames = 60) {
  suppressSaving = true;
  let frames = 0;
  const tick = () => {
    if (attempt()) {
      suppressSaving = false;
      return;
    }
    if (frames++ >= maxFrames) {
      onGiveUp?.();
      suppressSaving = false;
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function restoreTo(y: number) {
  whenReady(
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max >= y - 2) {
        jumpTo(y);
        return true;
      }
      return false;
    },
    () => jumpTo(Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight))),
  );
}

function scrollToHash(hash: string, smooth: boolean, fallbackToTop: boolean) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id || id === "top") {
    if (smooth) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? ("instant" as ScrollBehavior) : "smooth" });
    else whenReady(() => (jumpTo(0), true));
    return;
  }
  whenReady(
    () => {
      const el = document.getElementById(id);
      if (!el) return false;
      // Sections carry scroll-margin for the sticky header, which scrollIntoView respects.
      el.scrollIntoView({ block: "start", behavior: smooth && !prefersReducedMotion() ? "smooth" : ("instant" as ScrollBehavior) });
      return true;
    },
    fallbackToTop ? () => jumpTo(0) : undefined,
  );
}

/** Go back to where the visitor came from inside the site, or to `fallback` if they arrived directly. */
export function goBackOr(navigate: (to: string) => void, fallback: string) {
  if (inAppNavigations > 0) window.history.back();
  else navigate(fallback);
}

export function ScrollManager() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";

    // First load (or refresh): an explicit #section wins, then a saved position, else stay at the top.
    const saved = positions[currentKey()];
    if (window.location.hash) scrollToHash(window.location.hash, false, false);
    else if (saved != null) restoreTo(saved);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(saveCurrent);
    };

    // In-app navigation (wouter pushes): new page starts at the top or at its #section.
    const onPush = () => {
      inAppNavigations += 1;
      if (skipNextPush) {
        skipNextPush = false;
        return;
      }
      if (window.location.hash) scrollToHash(window.location.hash, false, true);
      else whenReady(() => (jumpTo(0), true));
    };

    // Back / forward: put the visitor exactly where they were.
    const onPop = () => {
      inAppNavigations = Math.max(0, inAppNavigations - 1);
      const y = positions[currentKey()];
      if (y != null) restoreTo(y);
      else if (window.location.hash) scrollToHash(window.location.hash, false, false);
      else restoreTo(0);
    };

    // Same-page "#section" links: smooth scroll plus a history entry, handled here so the
    // browser's instant jump and our restore logic never fight.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || !href.startsWith("#") || anchor.target) return;
      event.preventDefault();
      saveCurrent();
      if (href !== window.location.hash) {
        skipNextPush = true;
        window.history.pushState(window.history.state, "", href);
      }
      scrollToHash(href, true, false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pushState", onPush);
    window.addEventListener("popstate", onPop);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pushState", onPush);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
