
interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="w-full bg-accent1 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        {description && (
          <p className="text-white/90 max-w-3xl mx-auto">{description}</p>
        )}
      </div>
    </section>
  );
}
