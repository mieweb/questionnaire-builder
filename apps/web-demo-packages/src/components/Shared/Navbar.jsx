export function Navbar() {
  const isDev = import.meta.env.DEV;
  const docsUrl = isDev 
    ? 'http://localhost:3000' 
    : 'https://forms-doc.os.mieweb.org';

  return (
    <div className="back-to-docs h-[60px] px-6 flex items-center bg-white border-b border-slate-200 sticky top-0 z-50">
      <a
        href={docsUrl}
        className="back-to-docs-link inline-flex items-center gap-2 text-slate-600 hover:text-green-600 text-base font-bold no-underline transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <img src="/mie_icon_logo.png" alt="MIE" className="h-8 w-8" />
        Forms
      </a>
    </div>
  );
}
