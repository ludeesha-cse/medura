import { PageTransition } from "@/components/layout/PageTransition";

/** Re-mounted by Next.js on every navigation → each page animates in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
