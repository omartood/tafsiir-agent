import { cn } from "@/lib/utils";

interface IslamicPatternProps {
  className?: string;
  variant?: "subtle" | "decorative";
}

export function IslamicPattern({ className, variant = "subtle" }: IslamicPatternProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        variant === "subtle" ? "opacity-100" : "opacity-60",
        className
      )}
    >
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-islamic dark:pattern-islamic-dark" />
      
      {/* Corner ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
    </div>
  );
}

interface CornerOrnamentProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

function CornerOrnament({ position, className }: CornerOrnamentProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <div
      className={cn(
        "absolute w-24 h-24 pointer-events-none opacity-20 dark:opacity-15",
        positionClasses[position],
        className
      )}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 0 L50 0 Q30 20 20 30 Q10 40 0 50 Z"
          className="fill-secondary"
        />
        <path
          d="M0 0 L30 0 Q20 10 10 15 Q5 20 0 30 Z"
          className="fill-primary opacity-50"
        />
      </svg>
    </div>
  );
}

interface DecorativeDividerProps {
  className?: string;
}

export function DecorativeDivider({ className }: DecorativeDividerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 my-6", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary/50" />
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-secondary"
        >
          <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="4" fill="currentColor" />
          <path
            d="M20 8 L20 4 M20 32 L20 36 M8 20 L4 20 M32 20 L36 20"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 12 L9 9 M28 28 L31 31 M12 28 L9 31 M28 12 L31 9"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary/50" />
    </div>
  );
}

interface StarPatternProps {
  className?: string;
}

export function StarPattern({ className }: StarPatternProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary opacity-10", className)}
    >
      <polygon
        points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="50,20 56,42 79,42 61,55 67,77 50,64 33,77 39,55 21,42 44,42"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  );
}
