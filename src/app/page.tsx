"use client";

import { About } from "@/components/abouts";
import { Banner } from "@/components/banners";
import { Contact } from "@/components/contacts";
import { Divider } from "@/components/dividers";
import { Footer } from "@/components/footers";
import { Gallery } from "@/components/galleries";
import { Hero } from "@/components/heroes";
import { Process } from "@/components/processes";
import { SmoothScrollScope } from "@/components/shared/hash-link";
import { SiteNav } from "@/components/navs";
import { injectBrochureInstances } from "@/lib/brochure/inject-instances";
import { parseBrochureBlueprint } from "@/lib/brochure/schema";
import blueprintJson from "../../content/blueprint.json";

export default function Home() {
  const blueprint = parseBrochureBlueprint(blueprintJson);
  return injectBrochureInstances(
    <SmoothScrollScope className="min-h-screen bg-[#faf8f5] text-[#1c1916]">
      <SiteNav />
      <main id="top">
        <Hero />
        <Banner />
        <Gallery />
        <About />
        <Divider />
        <Gallery />
        <Process />
        <Contact />
      </main>
      <Footer />
    </SmoothScrollScope>,
    blueprint,
  );
}
