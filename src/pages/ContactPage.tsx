import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { Mail, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

interface ContactMethod {
  label: string;
  value: string;
  description: string;
  href: string;
  external: boolean;
  Icon: typeof Mail;
  cta: string;
}

const methods: ContactMethod[] = [
  {
    label: "Email",
    value: "contact@indianmacro.com",
    description: "Research inquiries, partnerships, editorial collaboration and press.",
    href: "mailto:contact@indianmacro.com",
    external: false,
    Icon: Mail,
    cta: "Open mail client",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/company/indian-macro",
    description: "Follow our company page for institutional updates and macro commentary.",
    href: "https://www.linkedin.com/company/indian-macro",
    external: true,
    Icon: Linkedin,
    cta: "Visit profile",
  },
  {
    label: "Instagram",
    value: "@indianmacroinsights",
    description: "Daily visual briefings on India's economy, markets and policy moves.",
    href: "https://www.instagram.com/indianmacroinsights",
    external: true,
    Icon: Instagram,
    cta: "Visit profile",
  },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Contact IndianMacro | Research, Partnerships & Editorial"
        description="Reach IndianMacro for research inquiries, partnerships, editorial collaboration and macroeconomic insights. Email, LinkedIn and Instagram."
        canonicalUrl="/contact"
        keywords="contact IndianMacro, research inquiry, partnerships, editorial collaboration, macro insights"
      />
      <StructuredData
        type="BreadcrumbList"
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />

      <Navbar />

      {/* Hero */}
      <section className="bg-[hsl(240_100%_13%)] text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-white/80 mb-6">
              <span className="h-px w-8 bg-white/30" />
              Contact
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Talk to IndianMacro
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-2xl">
              Connect with us for research, partnerships, editorial collaboration
              and macroeconomic insights. We respond to institutional inquiries
              within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Contact methods */}
      <section className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Direct Channels
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Choose the channel that fits your inquiry
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              For confidential or contractual matters, email remains the preferred
              and fastest channel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {methods.map(({ label, value, description, href, external, Icon, cta }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-6 md:p-7
                           transition-all duration-300 ease-out
                           hover:-translate-y-1 hover:border-foreground/20
                           hover:shadow-[0_20px_50px_-20px_hsl(240_100%_13%/0.25)]
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[hsl(240_100%_13%)] text-white transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground transition-all duration-300
                               group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.75}
                  />
                </div>

                <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  {label}
                </div>
                <div className="font-display text-lg md:text-xl font-semibold text-foreground tracking-tight break-all">
                  {value}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>

                <div className="mt-6 pt-6 border-t border-border">
                  <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                    {cta} →
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Footnote / trust strip */}
          <div className="mt-16 md:mt-20 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Response Time
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Within one business day for institutional inquiries.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Working Hours
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Monday – Friday, 09:30 – 18:30 IST.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Editorial & Press
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                For media, attribution or syndication, please email us directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
