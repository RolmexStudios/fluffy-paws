import type { ZodType } from "zod";
import type { BrochureComponentId } from "@/types/brochure";
import {
  COMPONENT_ID as HERO,
  emptyHeroBlueprint,
  heroBlueprintSchema,
} from "@/components/heroes/blueprint";
import {
  COMPONENT_ID as NAV,
  emptyNavBlueprint,
  navBlueprintSchema,
} from "@/components/navs/blueprint";
import {
  COMPONENT_ID as GALLERY,
  emptyGalleryBlueprint,
  galleryBlueprintSchema,
} from "@/components/galleries/blueprint";
import {
  COMPONENT_ID as INVENTORY,
  emptyInventoryBlueprint,
  inventoryBlueprintSchema,
} from "@/components/inventory/blueprint";
import {
  COMPONENT_ID as DIVIDER,
  emptyDividerBlueprint,
  dividerBlueprintSchema,
} from "@/components/dividers/blueprint";
import {
  COMPONENT_ID as ABOUT,
  emptyAboutBlueprint,
  aboutBlueprintSchema,
} from "@/components/abouts/blueprint";
import {
  COMPONENT_ID as ELFSIGHT,
  emptyElfsightBlueprint,
  elfsightBlueprintSchema,
} from "@/components/elfsights/blueprint";
import {
  COMPONENT_ID as BOOKING,
  emptyBookingBlueprint,
  bookingBlueprintSchema,
} from "@/components/bookings/blueprint";
import {
  COMPONENT_ID as CONTACT,
  emptyContactBlueprint,
  contactBlueprintSchema,
} from "@/components/contacts/blueprint";
import {
  COMPONENT_ID as PROCESS,
  emptyProcessBlueprint,
  processBlueprintSchema,
} from "@/components/processes/blueprint";
import {
  COMPONENT_ID as NEWSLETTER,
  emptyNewsletterBlueprint,
  newsletterBlueprintSchema,
} from "@/components/newsletters/blueprint";
import {
  COMPONENT_ID as FOOTER,
  emptyFooterBlueprint,
  footerBlueprintSchema,
} from "@/components/footers/blueprint";
import {
  COMPONENT_ID as MUSIC,
  emptyMusicBlueprint,
  musicBlueprintSchema,
} from "@/components/music/blueprint";
import {
  COMPONENT_ID as PROJECT,
  emptyProjectBlueprint,
  projectBlueprintSchema,
} from "@/components/projects/blueprint";
import {
  COMPONENT_ID as SHOP,
  emptyShopBlueprint,
  shopBlueprintSchema,
} from "@/components/shops/blueprint";
import {
  COMPONENT_ID as BANNER,
  bannerBlueprintSchema,
  emptyBannerBlueprint,
} from "@/components/banners/blueprint";

export const brochureComponentRegistry: Record<
  BrochureComponentId,
  { schema: ZodType; empty: () => object }
> = {
  [NAV]: { schema: navBlueprintSchema, empty: emptyNavBlueprint },
  [HERO]: { schema: heroBlueprintSchema, empty: emptyHeroBlueprint },
  [GALLERY]: { schema: galleryBlueprintSchema, empty: emptyGalleryBlueprint },
  [INVENTORY]: {
    schema: inventoryBlueprintSchema,
    empty: emptyInventoryBlueprint,
  },
  [DIVIDER]: { schema: dividerBlueprintSchema, empty: emptyDividerBlueprint },
  [ABOUT]: { schema: aboutBlueprintSchema, empty: emptyAboutBlueprint },
  [ELFSIGHT]: { schema: elfsightBlueprintSchema, empty: emptyElfsightBlueprint },
  [BOOKING]: { schema: bookingBlueprintSchema, empty: emptyBookingBlueprint },
  [CONTACT]: { schema: contactBlueprintSchema, empty: emptyContactBlueprint },
  [PROCESS]: { schema: processBlueprintSchema, empty: emptyProcessBlueprint },
  [NEWSLETTER]: {
    schema: newsletterBlueprintSchema,
    empty: emptyNewsletterBlueprint,
  },
  [MUSIC]: { schema: musicBlueprintSchema, empty: emptyMusicBlueprint },
  [PROJECT]: { schema: projectBlueprintSchema, empty: emptyProjectBlueprint },
  [SHOP]: { schema: shopBlueprintSchema, empty: emptyShopBlueprint },
  [BANNER]: { schema: bannerBlueprintSchema, empty: emptyBannerBlueprint },
  [FOOTER]: { schema: footerBlueprintSchema, empty: emptyFooterBlueprint },
};
