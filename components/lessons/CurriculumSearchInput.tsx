"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function CurriculumSearchInput({ value, onChange }: Props) {
  return (
    <label className="lessons-search">
      <Search size={14} className="lessons-search__icon" aria-hidden="true" />
      <input
        type="search"
        className="lessons-search__input"
        placeholder="Müfredatta ara…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Müfredatta ara"
      />
    </label>
  );
}
