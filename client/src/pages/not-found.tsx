import { Link } from "wouter";

const display = { fontFamily: '"Newsreader", "Iowan Old Style", Georgia, serif' } as const;
const sans = { fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", sans-serif' } as const;

export default function NotFound() {
  return (
    <main
      className="flex min-h-[100svh] flex-col justify-center bg-[#13110f] px-5 py-16 text-[#f3eee6]"
      style={sans}
    >
      <div className="mx-auto w-full max-w-[640px]">
        <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">404</p>
        <h1 className="mt-3 text-[2.25rem] leading-[1.05] tracking-[-0.01em]" style={display}>
          That page isn't here.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed opacity-75">
          The link may be mistyped, or the page has moved. The main site has everything.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center border border-white/25 px-6 text-[12px] uppercase tracking-[0.16em] active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e2a15a]"
        >
          Go to the main site
        </Link>
      </div>
    </main>
  );
}
