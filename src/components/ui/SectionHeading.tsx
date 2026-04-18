import { clsx } from "clsx";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  accent?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
  accent = false,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "mb-12 md:mb-16",
        centered && "text-center",
        className
      )}
    >
      {/* Decorative line */}
      {centered && (
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary-300" />
          <div className="w-2 h-2 rounded-full bg-primary-400" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary-300" />
        </div>
      )}
      <h2 className={clsx(
        "text-balance",
        accent ? "text-gradient" : "text-stone-900"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto text-balance leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
