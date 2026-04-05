import { NavLink } from 'react-router-dom';
import { docsSections } from '../navigation';

export default function DocSidebar({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <nav className="space-y-7">
      <div className="rounded-[28px] border border-stone-200 bg-white/90 p-5 shadow-[0_22px_80px_-48px_rgba(15,23,42,0.45)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
          Unified handbook
        </p>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Detailed product, backend, and release documentation lives here in the client repo. The
          server repository stays intentionally thin.
        </p>
      </div>

      {docsSections.map((section) => (
        <div key={section.label} className="space-y-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
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
                  <span className="block text-sm font-semibold">{item.label}</span>
                  {item.blurb && (
                    <span className="text-inherit/75 mt-1 block text-xs leading-5">
                      {item.blurb}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="rounded-[28px] border border-stone-200 bg-stone-50/90 p-5 text-sm leading-6 text-stone-700">
        <p className="font-semibold text-stone-900">Source of truth</p>
        <p className="mt-2">
          Publish docs, GitHub Pages, and contribution rules from <code>relay-forge</code>. Keep
          <code> relay-forge-server</code> focused on runtime code and deployment assets.
        </p>
      </div>
    </nav>
  );
}
