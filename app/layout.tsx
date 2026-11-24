import type { Metadata, Viewport } from "next";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { Logo } from "@/components/ui/Logo";
import { BRAND_COLORS } from "@/lib/brand";
import { getContact, getSite, mailtoHref, telHref, whatsappHref } from "@/lib/content";
import { bodyFont, headingFont } from "@/lib/fonts";
import "./globals.css";

const site = getSite();
const contact = getContact();

// Site-wide defaults; each page adds its own title, canonical URL and Open Graph via lib/seo.ts.
export const metadata: Metadata = {
  applicationName: site.legalName,
  authors: [{ name: site.legalName }],
  formatDetection: { telephone: false },
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: site.seo.titleTemplate },
  description: site.seo.description,
  keywords: site.seo.keywords,
  icons: {
    // app/favicon.ico is linked automatically by Next.js as the fallback
    icon: [{ url: site.favicon, type: "image/svg+xml" }],
    ...(site.appleTouchIcon ? { apple: site.appleTouchIcon } : {}),
  },
};

// Browser toolbar color on mobile, matching the page background in each theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND_COLORS.lightBackground },
    { media: "(prefers-color-scheme: dark)", color: BRAND_COLORS.darkBackground },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const logoClass = "h-9 w-auto sm:h-10";
  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html> before React hydrates.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <Providers>
          <a
            id="skip-link"
            href="#main"
            className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-button bg-accent px-4 py-2 font-medium text-accent-foreground transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar
            items={site.navigation}
            cta={site.navCta}
            logo={<Logo variant="horizontal" className={logoClass} />}
            logoOnDark={<Logo variant="horizontal" tone="on-dark" className={logoClass} />}
            phone={{ label: contact.phone, href: telHref(contact.phone) }}
            email={{ label: contact.email, href: mailtoHref(contact.email) }}
          />
          <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
            {children}
          </main>
          <Footer />
          <FloatingActions
            whatsappHref={whatsappHref(contact.whatsapp, contact.form.messageGreeting)}
          />
        </Providers>
      </body>
    </html>
  );
}
