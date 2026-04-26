export function GlobalBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_8%_0%,rgba(236,72,153,0.22),transparent_42%),radial-gradient(1100px_circle_at_95%_3%,rgba(139,92,246,0.24),transparent_44%),radial-gradient(900px_circle_at_50%_100%,rgba(251,146,60,0.16),transparent_45%)]" />
      <div className="float-gentle absolute left-[-60px] top-24 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="float-gentle absolute right-[-70px] top-40 h-64 w-64 rounded-full bg-violet-400/22 blur-3xl [animation-delay:1.2s]" />
      <div className="float-gentle absolute bottom-[-80px] left-1/3 h-72 w-72 rounded-full bg-orange-300/18 blur-3xl [animation-delay:2s]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(168,85,247,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.14)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.12)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}

