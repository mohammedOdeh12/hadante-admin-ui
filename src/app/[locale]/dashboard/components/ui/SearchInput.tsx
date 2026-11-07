"use client";

import { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export default function SearchInput({ placeholder, ...props }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-80 lg:w-96">
      <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-foreground/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="w-full ps-10 pe-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm text-start"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}