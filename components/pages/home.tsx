import { FloatingActions } from "@/components/floating-actions";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SkipLink } from "@/components/skip-link";
import { StructuredData } from "@/components/structured-data";
import { Audiences } from "@/components/sections/audiences";
import { Blog } from "@/components/sections/blog";
import { DemoRequest } from "@/components/sections/demo-request";
import { DevCallout } from "@/components/sections/dev-callout";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Pricing } from "@/components/sections/pricing";
import { Proof } from "@/components/sections/proof";
import { RunStory } from "@/components/sections/run-story";
import { siteConfig } from "@/lib/config";
import type { Lang } from "@/lib/copy";
import { getAllPosts } from "@/lib/posts";

/** Shared shell for `/` and `/en` — only `lang` (for structured data) differs; the rest reads locale from route-scoped context. */
export function HomePage({ lang }: { lang: Lang }) {
  const posts = getAllPosts();

  return (
    <div id="top">
      <StructuredData lang={lang} />
      <SkipLink />
      <Header />
      <main id="main">
        <Hero />
        <Proof />
        <HowItWorks />
        <Audiences />
        <RunStory />
        <DevCallout />
        {siteConfig.pricingEnabled && <Pricing />}
        <Blog posts={posts} />
        <DemoRequest />
        <Faq />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
