import { clsx } from "clsx";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "mb-12 md:mb-16",
        centered && "text-center",
        className
      )}
    >
      <h2 className="text-balance text-stone-900">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-stone-500 max-w-2xl mx-auto text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}