
import React from "react";

interface PageHeroProps {
  title: string;
  description?: string;
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="w-full bg-accent1 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl mx-auto text-white/90">{description}</p>
        )}
      </div>
    </section>
  );
}

export default PageHero;
