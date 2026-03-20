"use client";

import { useState } from "react";
import type { InputHTMLAttributes, KeyboardEvent } from "react";

import { Eye, EyeOff } from "lucide-react";

type DashboardAuthInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  icon: "mail";
  label: string;
};

const inputClassName =
  "h-12 w-full border border-b-2 border-[#dfbfbc] bg-transparent px-11 pr-11 text-base text-[#1f1b10] outline-none transition-colors placeholder:text-[rgba(91,91,129,0.4)] focus:border-[#831618]";

function handleEnterSubmit(event: KeyboardEvent<HTMLInputElement>) {
  if (
    event.key !== "Enter" ||
    event.shiftKey ||
    event.nativeEvent.isComposing
  ) {
    return;
  }

  const form = event.currentTarget.form;

  if (!form) {
    return;
  }

  event.preventDefault();
  form.requestSubmit();
}

export function DashboardAuthInput({
  label,
  icon,
  className,
  onKeyDown,
  ...props
}: DashboardAuthInputProps) {
  return (
    <label className="block space-y-2.5">
      <span className="text-[10px] font-bold tracking-[0.1em] text-[#5b5b81] uppercase">
        {label}
      </span>
      <div className="relative">
        {icon === "mail" ? (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-[#831618]/45"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 7.5h16v9H4z"
              rx="1.75"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="m5.5 9 6.5 5 6.5-5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        ) : null}
        <input
          className={`${inputClassName} ${className ?? ""}`.trim()}
          onKeyDown={(event) => {
            onKeyDown?.(event);

            if (!event.defaultPrevented) {
              handleEnterSubmit(event);
            }
          }}
          {...props}
        />
      </div>
    </label>
  );
}

export function DashboardAuthPasswordInput({
  label,
  onKeyDown,
  ...props
}: Omit<DashboardAuthInputProps, "icon" | "type">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="block space-y-2.5">
      <span className="text-[10px] font-bold tracking-[0.1em] text-[#5b5b81] uppercase">
        {label}
      </span>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-[#831618]/45"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M8 10V7a4 4 0 118 0v3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <rect
            height="10"
            rx="1.75"
            stroke="currentColor"
            strokeWidth="1.7"
            width="12"
            x="6"
            y="10"
          />
        </svg>
        <input
          className={inputClassName}
          onKeyDown={(event) => {
            onKeyDown?.(event);

            if (!event.defaultPrevented) {
              handleEnterSubmit(event);
            }
          }}
          type={isVisible ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#5b5b81] transition-colors hover:text-[#831618]"
          onClick={() => setIsVisible((value) => !value)}
          type="button"
        >
          {isVisible ? (
            <EyeOff className="h-[18px] w-[18px]" />
          ) : (
            <Eye className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </label>
  );
}
