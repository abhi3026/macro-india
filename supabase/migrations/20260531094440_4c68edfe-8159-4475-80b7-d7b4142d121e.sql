
ALTER TABLE public.educational_posts
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS show_on_homepage boolean NOT NULL DEFAULT false;

ALTER TABLE public.research_articles
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS show_on_homepage boolean NOT NULL DEFAULT false;

-- Default author for existing rows
UPDATE public.educational_posts SET author_name = 'Abhishek Gourav' WHERE author_name IS NULL;
UPDATE public.research_articles SET author_name = 'Abhishek Gourav' WHERE author_name IS NULL;
