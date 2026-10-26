import { useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PromptTheme } from "@/themes/prompt-theme";
import { SignalTheme } from "@/themes/signal-theme";
import { ThreadTheme } from "@/themes/thread-theme";
import { themeMeta, type ThemeId } from "@/themes/content";

const views: Record<ThemeId, () => ReactElement> = {
  prompt: PromptTheme,
  thread: ThreadTheme,
  signal: SignalTheme,
};

const chrome: Record<ThemeId, { bar: string; text: string; muted: string; active: string }> = {
  prompt: {
    bar: "bg-[#0c0b09] border-[#2a2622]",
    text: "text-[#f3efe6]",
    muted: "text-[#a39e93]",
    active: "bg-[#d4845a] text-[#1a120b]",
  },
  thread: {
    bar: "bg-[#f3ecdf] border-[#e2d3c3]",
    text: "text-[#1a120b]",
    muted: "text-[#8a7364]",
    active: "bg-[#d6341a] text-[#fff8f3]",
  },
  signal: {
    bar: "bg-[#0e1116] border-[#243041]",
    text: "text-[#e7edf5]",
    muted: "text-[#9aa6b2]",
    active: "bg-[#ffb020] text-[#1a1208]",
  },
};

function themeFromUrl(): ThemeId {
  if (typeof window === "undefined") return "prompt";
  const value = new URLSearchParams(window.location.search).get("theme");
  if (value === "thread" || value === "signal" || value === "prompt") return value;
  return "prompt";
}

export default function ThemesPage() {
  const [theme, setTheme] = useState<ThemeId>(themeFromUrl);
  const skin = chrome[theme];
  const meta = themeMeta.find((item) => item.id === theme)!;
  const View = views[theme];

  return (
    <div className="flex h-[100dvh] flex-col">
      <div className={`z-20 flex shrink-0 flex-col gap-3 border-b px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${skin.bar}`}>
        <div className="min-w-0">
          <p className={`text-[10px] uppercase tracking-[0.22em] ${skin.muted}`}>Three directions · pick one</p>
          <p className={`truncate text-sm ${skin.text}`}>{meta.note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {themeMeta.map((item) => {
            const on = item.id === theme;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTheme(item.id);
                  const url = new URL(window.location.href);
                  url.searchParams.set("theme", item.id);
                  window.history.replaceState({}, "", url);
                }}
                className={`px-3 py-2 text-left text-[11px] uppercase tracking-[0.16em] transition ${
                  on ? skin.active : `${skin.muted} border border-current/20 hover:border-current`
                }`}
              >
                {item.index} {item.name}
                {item.id === "prompt" ? " · recommended" : ""}
              </button>
            );
          })}
          <a
            href="/classic"
            className={`px-3 py-2 text-[11px] uppercase tracking-[0.16em] ${skin.muted}`}
          >
            Current site
          </a>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <View />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
