"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

export default function CustomSelect({
  name,
  value,
  options,
  onChange,
  placeholder,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value.toString() === value?.toString());

  const handleSelect = (selectedValue: string) => {
    onChange({
      target: { name, value: selectedValue, type: "select-one" },
    } as React.ChangeEvent<HTMLSelectElement>);
    
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* الحقل الظاهر (الزر) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border bg-background transition-all shadow-sm cursor-pointer select-none ${
          isOpen ? "border-primary ring-primary/40" : "border-border hover:border-foreground/30"
        }`}
      >
        <span className={selectedOption ? "text-foreground" : "text-foreground/50"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-foreground/50 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* تم إضافة الكلاس space-y-1 هنا لعمل مسافة عمودية بين الخيارات */}
          <ul className="max-h-60 overflow-y-auto py-1.5 space-y-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between mx-1.5 rounded-lg ${
                  value?.toString() === option.value
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-foreground hover:bg-secondary/10 hover:text-primary"
                }`}
              >
                {option.label}
                
                {value?.toString() === option.value && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}