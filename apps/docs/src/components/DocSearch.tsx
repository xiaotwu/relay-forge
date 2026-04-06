import { useDeferredValue, useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { docSearchEntries } from '../navigation';
import { DocIcon } from './DocIcons';

function rankSearchResults(query: string) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    const quickAccess = new Set([
      '/',
      '/quick-start',
      '/client-apps',
      '/server',
      '/deployment',
      '/references',
    ]);

    return docSearchEntries.filter((item) => quickAccess.has(item.to));
  }

  return docSearchEntries
    .map((item) => {
      let score = 0;
      const label = item.label.toLowerCase();
      const blurb = item.blurb?.toLowerCase() ?? '';
      const keywords = item.keywords ?? [];

      if (label.startsWith(trimmed)) {
        score += 8;
      } else if (label.includes(trimmed)) {
        score += 5;
      }

      if (item.to.includes(trimmed)) {
        score += 4;
      }

      if (item.sectionLabel.toLowerCase().includes(trimmed)) {
        score += 2;
      }

      if (blurb.includes(trimmed)) {
        score += 2;
      }

      if (keywords.some((keyword) => keyword.toLowerCase().includes(trimmed))) {
        score += 3;
      }

      if (item.searchText.includes(trimmed)) {
        score += 1;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) => right.score - left.score || left.item.label.localeCompare(right.item.label),
    )
    .slice(0, 8)
    .map((entry) => entry.item);
}

export default function DocSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsId = useId().replace(/:/g, '-');

  const results = rankSearchResults(deferredQuery);
  const emptyQuery = deferredQuery.trim().length === 0;

  useEffect(() => {
    setQuery('');
    setOpen(false);
    setActiveIndex(0);
  }, [location.pathname]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isTypingContext =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
        return;
      }

      if (!isTypingContext && event.key === '/') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  function openResult(index: number) {
    const result = results[index];
    if (!result) {
      return;
    }

    navigate(result.to);
  }

  return (
    <div ref={containerRef} className="doc-search">
      <label className="doc-search-field" htmlFor={resultsId}>
        <DocIcon name="search" className="h-4 w-4 flex-none text-stone-500" />
        <input
          ref={inputRef}
          id={resultsId}
          type="search"
          value={query}
          placeholder="Search docs, routes, services, or repo paths"
          autoComplete="off"
          spellCheck={false}
          aria-expanded={open}
          aria-controls={`${resultsId}-listbox`}
          aria-autocomplete="list"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }

            if (event.key === 'Enter' && open) {
              event.preventDefault();
              openResult(activeIndex);
            }

            if (event.key === 'Escape') {
              event.preventDefault();
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
        />
        <span className="doc-search-hint" aria-hidden="true">
          /
        </span>
      </label>

      {open && (
        <div className="doc-search-results" id={`${resultsId}-listbox`} role="listbox">
          <div className="doc-search-results-header">
            <span>{emptyQuery ? 'Jump to' : 'Matches'}</span>
            <span>{emptyQuery ? 'Shortcut: / or Ctrl/Cmd K' : `${results.length} result(s)`}</span>
          </div>

          {results.length > 0 ? (
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={result.to}>
                  <button
                    type="button"
                    className={`doc-search-result ${activeIndex === index ? 'active' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openResult(index)}
                  >
                    <span className="doc-search-result-icon">
                      <DocIcon name={result.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="doc-search-result-title">{result.label}</span>
                      <span className="doc-search-result-meta">
                        <DocIcon name={result.sectionIcon} className="h-3.5 w-3.5" />
                        {result.sectionLabel}
                        <span className="text-stone-300">/</span>
                        <code>{result.to}</code>
                      </span>
                    </span>
                    <DocIcon name="arrow-right" className="h-4 w-4 flex-none text-stone-400" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="doc-search-empty">
              <DocIcon name="help" className="h-4 w-4 flex-none" />
              <span>No page matched “{deferredQuery.trim()}”.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
