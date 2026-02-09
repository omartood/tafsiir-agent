import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <p className="bismillah text-2xl text-gold/80">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Bogga lama helin
        </h1>
        <p className="text-muted-foreground/80">
          Bogga aad raadinayso ma jiro. Ku noqo bogga weyn ee Tafsiir AI.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <BookOpen size={20} />
          Bogga weyn
        </Link>
      </div>
    </div>
  );
}
