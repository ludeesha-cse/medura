import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getSite } from "@/lib/content";

export const metadata = { title: "Page not found" };

/** 404 page — exported as out/404.html, which Cloudflare Pages serves for unknown URLs. */
export default function NotFound() {
  const site = getSite();
  return (
    <>
      <PageHeader
        intro={{
          eyebrow: "Error 404",
          heading: "This page isn't on our drawings.",
          subheading: "The page you're looking for may have moved, or the link may be mistyped.",
        }}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="accent" size="lg">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </ButtonLink>
          {site.navCta && (
            <ButtonLink href={site.navCta.href} variant="outline-on-dark" size="lg">
              {site.navCta.label}
            </ButtonLink>
          )}
        </div>
      </PageHeader>
      <nav aria-label="Popular pages" className="mx-auto max-w-site px-(--gutter) py-16">
        <h2 className="font-body text-xs font-medium tracking-eyebrow text-accent-ink uppercase">
          Popular pages
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {site.navigation.map((item) => (
            <li key={item.href}>
              <ButtonLink href={item.href} variant="outline" size="sm">
                {item.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
