import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Field({
  label,
  help,
  htmlFor,
  required,
  children,
  className,
}: {
  label: string;
  help?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-base font-semibold text-ink">
        {label}
        {required && <span className="text-rojo"> *</span>}
      </label>
      {help && <p className="text-sm text-slate-500">{help}</p>}
      {children}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "touch-target w-full rounded-xl border border-slate-300 bg-white px-4 text-lg text-ink",
        "placeholder:text-slate-400 focus:border-brand",
        className,
      )}
    />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-ink",
        "placeholder:text-slate-400 focus:border-brand min-h-24",
        className,
      )}
    />
  );
}
