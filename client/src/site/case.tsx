import { useEffect } from "react";
import { useLocation } from "wouter";
import { goBackOr } from "@/lib/scroll-manager";
import { cases } from "./copy";
import { track } from "./hi-data";
import { boxSecondary, Closing, label, mono, sans, serif } from "./ui";


export function CasePage({ slug }: { slug: string }) {
  const aliases: Record<string, keyof typeof cases> = { pantry: "umbc" };
  const key = (aliases[slug] ?? slug) as keyof typeof cases;
  const story = cases[key];

  const [, navigate] = useLocation();

  // Scroll position is handled site-wide by ScrollManager.
  useEffect(() => {
    if (story) document.title = `${story.title} · Vishwanth Reddy`;
  }, [slug, story]);

  return (
    <div style={{ ...sans, color: "#f3efe6" }} className="min-h-[100svh] overflow-x-clip bg-[#0c0b09]">
      <main className="mx-auto max-w-2xl px-[max(1.125rem,env(safe-area-inset-left))] pb-[max(3rem,env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pt-10">
        {/* Returns to the exact spot on the previous page; opens the home page's proof if they arrived directly. */}
        <button type="button" onClick={() => goBackOr(navigate, "/#proof")} className={`${boxSecondary} px-3`}>
          ← back
        </button>

        {!story ? (
          <section className="mt-12">
            <p className={label}>not found</p>
            <h1 className="mt-3 text-[2.5rem] leading-[1.12]" style={serif}>
              That story isn't here.
            </h1>
          </section>
        ) : (
          <>
            <p className={`${label} mt-10`}>{story.role.toLowerCase()}</p>
            <h1 className="mt-2 text-[clamp(3rem,14vw,4.5rem)] leading-[1.04] text-[#f6f1e7]" style={serif}>
              {story.title}
            </h1>
            <p className={`${mono} mt-3 text-[13px] lowercase text-[#a39e93]`}>{story.when}</p>
            <div className="mt-10 space-y-9">
              {story.sections.map((section, index) => (
                <section key={section.heading}>
                  <p className={`${label} text-[#d4845a]`}>0{index + 1}</p>
                  <h2 className="mt-1 text-[1.9rem] leading-tight text-[#f6f1e7]" style={serif}>
                    {section.heading}
                  </h2>
                  <p className="mt-2 text-[17px] leading-relaxed text-[#c9c2b5]">{section.body}</p>
                </section>
              ))}
            </div>
            <p className={`${label} mt-12 leading-relaxed`}>{story.stack.toLowerCase()}</p>
          </>
        )}

        <div className="mt-14">
          <Closing
            onLinkedIn={() => track("linkedin_clicked", { page: `work/${key}` })}
            onCalendly={() => track("calendly_clicked", { page: `work/${key}` })}
          />
        </div>
      </main>
    </div>
  );
}
