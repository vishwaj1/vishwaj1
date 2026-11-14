import { Link } from "wouter";
import { boxSecondary, label, sans, serif } from "@/site/ui";

export default function NotFound() {
  return (
    <main
      className="flex min-h-[100svh] flex-col justify-center bg-[#0c0b09] px-[max(1.125rem,env(safe-area-inset-left))] py-16 text-[#f3efe6]"
      style={sans}
    >
      <div className="mx-auto w-full max-w-[640px]">
        <p className={label}>404</p>
        <h1 className="mt-3 text-[2.75rem] leading-[1.1] text-[#f6f1e7]" style={serif}>
          That page <i className="text-[#d4845a]">isn't here.</i>
        </h1>
        <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#c9c2b5]">
          The link may be mistyped, or the page has moved. The main site has everything.
        </p>
        <Link href="/" className={`${boxSecondary} mt-8`}>
          go to the main site →
        </Link>
      </div>
    </main>
  );
}
