// Helpers for converting between category labels and URL slugs used by /education/:category routes.

export function categoryToSlug(category?: string | null): string {
  if (!category) return "general";
  return category
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "general";
}

// Build the canonical educational post path: /education/:category/:slug
export function educationalPostPath(category: string | null | undefined, slug: string): string {
  return `/education/${categoryToSlug(category)}/${slug}`;
}

export function educationCategoryPath(category?: string | null): string {
  return `/education/${categoryToSlug(category)}`;
}
