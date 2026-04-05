import { NavLink } from 'react-router-dom';
import { DocIcon } from './DocIcons';
import { docsSections } from '../navigation';

export default function DocSidebar({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="space-y-7">
      <div className="rounded-[22px] border border-stone-200 bg-white/90 px-4 py-3 shadow-[0_22px_80px_-48px_rgba(15,23,42,0.45)]">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
          <DocIcon name="book" className="h-3.5 w-3.5" />
          Unified handbook
        </p>
      </div>

      {docsSections.map((section) => (
        <div key={section.label} className="space-y-2">
          <p className="inline-flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            <DocIcon name={section.icon} className="h-3.5 w-3.5" />
            {section.label}
          </p>
          <ul className="space-y-1.5">
            {section.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `block rounded-2xl px-3 py-3 transition ${
                      isActive
                        ? 'bg-stone-950 text-stone-50 shadow-[0_20px_56px_-36px_rgba(15,23,42,0.65)]'
                        : 'bg-transparent text-stone-700 hover:bg-white/90 hover:text-stone-950'
                    }`
                  }
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                      <DocIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 block text-sm font-semibold">{item.label}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-[22px] border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm leading-6 text-stone-700">
        <p className="inline-flex items-center gap-2 font-semibold text-stone-900">
          <DocIcon name="link" className="h-4 w-4" />
          Source of truth
        </p>
      </div>
    </nav>
  );
}
