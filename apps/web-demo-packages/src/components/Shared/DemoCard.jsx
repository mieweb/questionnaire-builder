import { Link } from 'react-router-dom';

export function DemoCard({ title, desc, to }) {
  return (
    <Link to={to} className="demo-card-link block no-underline">
      <div className="demo-card group h-full p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-green-500 transition-all duration-300 hover:-translate-y-1">
        <h3 className="demo-card-title m-0 mb-3 text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
          {title}
        </h3>
        <p className="demo-card-desc m-0 text-slate-600 leading-relaxed mb-4">
          {desc}
        </p>
        <div className="demo-card-arrow inline-flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all">
          Explore
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
