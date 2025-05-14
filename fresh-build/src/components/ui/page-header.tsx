
interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-indianmacro-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {description && (
          <p className="mt-4 max-w-3xl text-indianmacro-200">{description}</p>
        )}
      </div>
    </div>
  );
}
