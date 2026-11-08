import type { ComponentType } from "react";
import type {
  BrochureBlockProps,
  BrochureHeroContent,
  BrochureHeroVariant,
} from "@/types/brochure";
import { CoverHero } from "@/components/heroes/templates/cover/CoverHero";
import { SplitHero } from "@/components/heroes/templates/split/SplitHero";
import { EditorialHero } from "@/components/heroes/templates/editorial/EditorialHero";
import { MagazineHero } from "@/components/heroes/templates/magazine/MagazineHero";
import { RunwayHero } from "@/components/heroes/templates/runway/RunwayHero";
import { PlateHero } from "@/components/heroes/templates/plate/PlateHero";

export type HeroTemplateComponent = ComponentType<
  BrochureBlockProps<BrochureHeroContent>
>;

export const heroTemplates = {
  cover: CoverHero,
  split: SplitHero,
  editorial: EditorialHero,
  magazine: MagazineHero,
  runway: RunwayHero,
  plate: PlateHero,
} satisfies Record<BrochureHeroVariant, HeroTemplateComponent>;
