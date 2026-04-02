import React, { useState, useRef, useEffect } from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES: Record<string, string[]> = {
  Smileys: [
    '\u{1F600}',
    '\u{1F603}',
    '\u{1F604}',
    '\u{1F601}',
    '\u{1F605}',
    '\u{1F602}',
    '\u{1F923}',
    '\u{1F607}',
    '\u{1F609}',
    '\u{1F60A}',
    '\u{1F60B}',
    '\u{1F60E}',
    '\u{1F60D}',
    '\u{1F618}',
    '\u{1F617}',
    '\u{1F619}',
    '\u{1F61A}',
    '\u{1F914}',
    '\u{1F928}',
    '\u{1F610}',
    '\u{1F611}',
    '\u{1F636}',
    '\u{1F644}',
    '\u{1F60F}',
    '\u{1F623}',
    '\u{1F625}',
    '\u{1F62E}',
    '\u{1F631}',
    '\u{1F622}',
    '\u{1F62D}',
    '\u{1F624}',
    '\u{1F620}',
    '\u{1F621}',
    '\u{1F92C}',
    '\u{1F971}',
    '\u{1F634}',
    '\u{1F637}',
    '\u{1F912}',
    '\u{1F915}',
    '\u{1F922}',
    '\u{1F92E}',
    '\u{1F927}',
  ],
  People: [
    '\u{1F44D}',
    '\u{1F44E}',
    '\u{1F44A}',
    '\u{270A}',
    '\u{1F91B}',
    '\u{1F91C}',
    '\u{1F44F}',
    '\u{1F64C}',
    '\u{1F450}',
    '\u{1F64F}',
    '\u{1F91D}',
    '\u{270C}\u{FE0F}',
    '\u{1F918}',
    '\u{1F44C}',
    '\u{1F448}',
    '\u{1F449}',
    '\u{1F446}',
    '\u{1F447}',
    '\u{270B}',
    '\u{1F44B}',
    '\u{1F4AA}',
    '\u{1F9E0}',
    '\u{1F441}\u{FE0F}',
    '\u{1F440}',
    '\u{1F442}',
    '\u{1F443}',
  ],
  Nature: [
    '\u{1F436}',
    '\u{1F431}',
    '\u{1F42D}',
    '\u{1F439}',
    '\u{1F430}',
    '\u{1F98A}',
    '\u{1F43B}',
    '\u{1F43C}',
    '\u{1F428}',
    '\u{1F42F}',
    '\u{1F981}',
    '\u{1F42E}',
    '\u{1F437}',
    '\u{1F438}',
    '\u{1F435}',
    '\u{1F412}',
    '\u{1F414}',
    '\u{1F427}',
    '\u{1F426}',
    '\u{1F985}',
    '\u{1F989}',
    '\u{1F40D}',
    '\u{1F422}',
    '\u{1F41B}',
    '\u{1F41D}',
    '\u{1F41E}',
    '\u{1F33B}',
    '\u{1F339}',
    '\u{1F33A}',
    '\u{1F337}',
    '\u{1F331}',
    '\u{1F332}',
    '\u{1F333}',
    '\u{1F334}',
    '\u{1F335}',
  ],
  Food: [
    '\u{1F34E}',
    '\u{1F34F}',
    '\u{1F34A}',
    '\u{1F34B}',
    '\u{1F34C}',
    '\u{1F349}',
    '\u{1F347}',
    '\u{1F353}',
    '\u{1F348}',
    '\u{1F352}',
    '\u{1F351}',
    '\u{1F34D}',
    '\u{1F965}',
    '\u{1F95D}',
    '\u{1F354}',
    '\u{1F355}',
    '\u{1F32E}',
    '\u{1F32F}',
    '\u{1F37F}',
    '\u{1F366}',
    '\u{1F370}',
    '\u{1F382}',
    '\u{2615}',
    '\u{1F375}',
    '\u{1F37A}',
    '\u{1F37B}',
    '\u{1F377}',
    '\u{1F378}',
  ],
  Objects: [
    '\u{2764}\u{FE0F}',
    '\u{1F9E1}',
    '\u{1F49B}',
    '\u{1F49A}',
    '\u{1F499}',
    '\u{1F49C}',
    '\u{1F5A4}',
    '\u{1F4AF}',
    '\u{1F4A5}',
    '\u{1F525}',
    '\u{2B50}',
    '\u{1F31F}',
    '\u{1F389}',
    '\u{1F38A}',
    '\u{1F4E3}',
    '\u{1F4AC}',
    '\u{1F4AD}',
    '\u{1F4A4}',
    '\u{1F4AA}',
    '\u{1F3B5}',
    '\u{1F3B6}',
    '\u{1F4F1}',
    '\u{1F4BB}',
    '\u{1F4A1}',
    '\u{1F4DA}',
    '\u{270F}\u{FE0F}',
    '\u{1F512}',
    '\u{1F513}',
  ],
};

const CATEGORY_NAMES = Object.keys(EMOJI_CATEGORIES);

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(CATEGORY_NAMES[0]);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const filteredCategories = search
    ? {
        Results: Object.values(EMOJI_CATEGORIES)
          .flat()
          .filter(() => true),
      }
    : EMOJI_CATEGORIES;

  return (
    <div
      ref={pickerRef}
      className="bg-surface border-border/30 w-[320px] overflow-hidden rounded-xl border shadow-2xl"
    >
      {/* Search */}
      <div className="border-border/20 border-b p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          className="bg-elevated text-text-primary placeholder:text-text-secondary/50 w-full rounded-lg px-3 py-1.5 text-sm outline-none"
          autoFocus
        />
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="border-border/20 flex border-b px-2">
          {CATEGORY_NAMES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`border-b-2 px-3 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'text-accent border-accent'
                  : 'text-text-secondary hover:text-text-primary border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="scrollbar-thin h-[240px] overflow-y-auto p-2">
        {Object.entries(filteredCategories).map(([cat, emojis]) => {
          if (!search && cat !== activeCategory) return null;
          return (
            <div key={cat}>
              {search && <p className="text-text-secondary px-1 py-1 text-xs font-medium">{cat}</p>}
              <div className="grid grid-cols-8 gap-0.5">
                {emojis.map((emoji, i) => (
                  <button
                    key={`${emoji}-${i}`}
                    onClick={() => onSelect(emoji)}
                    className="hover:bg-elevated flex h-9 w-9 items-center justify-center rounded-md text-xl transition-colors"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
