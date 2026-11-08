export const BROCHURE_GALLERY_SCAFFOLD_COUNT = 6;

/** Viewport height steps for a brochure section. `full` is one screen; `peek` leaves a sliver of the next section. */
export const BROCHURE_SECTION_SIZES = [
  "full",
  "peek",
  "tall",
  "half",
  "auto",
] as const;

export type BrochureSectionSize = (typeof BROCHURE_SECTION_SIZES)[number];

export type BrochureSectionLayout = "stack" | "split";

export type BrochureComponentId =
  | "BrochureSiteNav"
  | "BrochureHero"
  | "BrochureGallery"
  | "BrochureInventory"
  | "BrochureDivider"
  | "BrochureAbout"
  | "BrochureElfsight"
  | "BrochureBooking"
  | "BrochureContact"
  | "BrochureProcess"
  | "BrochureNewsletter"
  | "BrochureMusic"
  | "BrochureProject"
  | "BrochureShop"
  | "BrochureBanner"
  | "BrochureFooter";

export interface BrochureInstanceRef {
  instanceId: string;
  component: BrochureComponentId;
}

export interface BrochureGalleryItem {
  imageUrl: string;
  /** Piece name. Blank on layouts that only show the photograph. */
  title: string;
  category: string;
  alt: string;
}

export type BrochureGalleryVariant =
  | "grid"
  | "showcase"
  | "cards"
  | "tabs"
  | "lookbook";

/** How the tabs gallery browses photos after a category is selected. */
export type BrochureGalleryBrowseAxis = "vertical" | "horizontal";

/** Idle category picker: wrapping grid, or a single horizontally scrolling row. */
export type BrochureGalleryTabLayout = "grid" | "row";

export interface BrochureService {
  title: string;
  description: string;
}

export interface BrochureTeamMember {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
}

export interface BrochureTestimonial {
  quote: string;
  author: string;
}

export type BrochureHeroVariant =
  | "cover"
  | "split"
  | "editorial"
  | "magazine"
  | "runway"
  | "plate";

export interface BrochureHeroCopy {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  sectionSize: BrochureSectionSize;
}

export interface BrochureHeroSlide {
  imageUrl: string;
  alt: string;
}

export type BrochureHeroCopyAlign = "left" | "center";
export type BrochureHeroLogoSize = "small" | "medium" | "large";

export interface BrochureHeroCoverContent extends BrochureHeroCopy {
  variant: "cover";
  backgroundImageUrl: string;
  logoImageUrl: string;
  logoLayout: "horizontal" | "square";
  logoSize: BrochureHeroLogoSize;
  copyAlign: BrochureHeroCopyAlign;
}

export interface BrochureHeroSplitContent extends BrochureHeroCopy {
  variant: "split";
  slideshowIntervalMs: number;
  slideshowImages: BrochureHeroSlide[];
}

export interface BrochureHeroEditorialContent extends BrochureHeroCopy {
  variant: "editorial";
  /** Full-bleed cover plate behind the display headline. */
  backgroundImageUrl: string;
  imageAlt: string;
  /** Small printed-matter marker, e.g. "Catalogue — Autumn". */
  catalogNote: string;
  /** Italicised word inside the serif headline, rendered emphasised. */
  emphasisWord: string;
}

/** One wide photograph at a time on a timer, with a quiet headline beneath. */
export interface BrochureHeroMagazineSlide extends BrochureHeroSlide {
  /** CSS object-position for the wide crop, e.g. "50% 70%". */
  position: string;
}

export interface BrochureHeroMagazineContent extends BrochureHeroCopy {
  variant: "magazine";
  slideshowIntervalMs: number;
  slideshowImages: BrochureHeroMagazineSlide[];
}

/** Full-screen fashion plate. One photograph, type set on the image. */
export interface BrochureHeroRunwayContent extends BrochureHeroCopy {
  variant: "runway";
  backgroundImageUrl: string;
}

/** Full-bleed ambient video or still. Optional center logo, and an optional retail lockup. */
export interface BrochureHeroPlateContent {
  variant: "plate";
  videoSrc: string;
  imageSrc: string;
  imageAlt: string;
  logoImageUrl: string;
  /** Short line set on the photograph. Blank keeps the plate silent. */
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  bg: string;
  theme: "light" | "dark";
  scrim: boolean;
  sectionSize: BrochureSectionSize;
}

export type BrochureHeroContent =
  | BrochureHeroCoverContent
  | BrochureHeroSplitContent
  | BrochureHeroEditorialContent
  | BrochureHeroMagazineContent
  | BrochureHeroRunwayContent
  | BrochureHeroPlateContent;

export interface BrochureGalleryCategory {
  title: string;
  description: string;
}

export interface BrochureGalleryContent {
  title: string;
  description: string;
  variant: BrochureGalleryVariant;
  browseAxis: BrochureGalleryBrowseAxis;
  /** Tabs gallery: wrapping grid of category cards, or a 1×N horizontal strip. */
  tabLayout: BrochureGalleryTabLayout;
  /** Tabs gallery: dim non-hovered category cards on desktop hover. */
  dimInactiveTabs: boolean;
  sectionSize: BrochureSectionSize;
  items: BrochureGalleryItem[];
  categories: BrochureGalleryCategory[];
}

export type BrochureInventoryVariant = "showroom" | "teaser" | "archive";

/** `sold` records are kept off the teaser and showroom; the archive variant lists them. */
export type BrochureVehicleStatus = "available" | "incoming" | "private" | "sold";

export interface BrochureVehicleProvenance {
  year: string;
  label: string;
}

export interface BrochureVehicle {
  id: string;
  slug: string;
  year: string;
  make: string;
  model: string;
  chassis: string;
  transmission: string;
  status: BrochureVehicleStatus;
  price: string;
  /** One quiet performance figure, e.g. "Power". */
  metricLabel: string;
  metricValue: string;
  imageUrl: string;
  imageAlt: string;
  galleryImageUrls: string[];
  provenance: BrochureVehicleProvenance[];
  /** Archive variant: one line on where and when the car was placed. */
  placedNote: string;
  /** Longer write-up for the vehicle page. Blank lines split paragraphs. */
  description: string;
}

export interface BrochureInventoryContent {
  variant: BrochureInventoryVariant;
  eyebrow: string;
  title: string;
  intro: string;
  /** Teaser variant: how many records to preview on the home page. */
  teaserLimit: number;
  viewAllLabel: string;
  sectionSize: BrochureSectionSize;
  vehicles: BrochureVehicle[];
}

export type BrochureNavLogoLayout = "square" | "horizontal";

/** Whether the nav shows only the logo mark or logo plus business name. */
export type BrochureNavBrandDisplay = "logo-only" | "logo-and-name";

/** When the nav brand (logo / name) becomes visible. */
export type BrochureNavLogoReveal = "always" | "after-hero";

export type BrochureNavVariant = "bar" | "editorial" | "runway" | "studio";

export interface BrochureNavLink {
  href: string;
  label: string;
}

export interface BrochureNavContent {
  variant: BrochureNavVariant;
  businessName: string;
  phone: string;
  logoMark: string;
  logoImageUrl: string;
  logoLayout: BrochureNavLogoLayout;
  brandDisplay: BrochureNavBrandDisplay;
  logoReveal: BrochureNavLogoReveal;
  links: BrochureNavLink[];
  /** Cross-page links. The injector does not overwrite these. */
  routeLinks: BrochureNavLink[];
  /** Site description for the document head. */
  description: string;
  faviconUrl: string;
  shareImageUrl: string;
}

export type BrochureDividerVariant = "stats" | "swap";

export interface BrochureDividerItem {
  label: string;
  value: string;
}

export interface BrochureDividerStatsContent {
  variant: "stats";
  eyebrow: string;
  items: BrochureDividerItem[];
  sectionSize: BrochureSectionSize;
}

export interface BrochureDividerLogo {
  name: string;
  src: string;
  text: string;
  sub: string;
  /** Dark marks that would disappear under multiply. */
  tone?: "dark";
  /** Optical size vs the default mark height. Files with extra padding need > 1. */
  scale?: number;
}

/** One panel: a line of type crossfades into a client-logo row. */
export interface BrochureDividerSwapContent {
  variant: "swap";
  kicker: string;
  lead: string;
  cue: string;
  label: string;
  logos: BrochureDividerLogo[];
  /** DOM id for the in-page hash, e.g. "video". */
  anchorId: string;
  /** Nav label for that hash. Empty keeps the section out of the nav. */
  navLabel: string;
  bg: string;
  theme: "light" | "dark";
  sectionSize: BrochureSectionSize;
}

export type BrochureDividerContent =
  | BrochureDividerStatsContent
  | BrochureDividerSwapContent;

export type BrochureAboutVariant = "split" | "story" | "values" | "editorial" | "rows" | "salon";

export interface BrochureAboutRow {
  label: string;
  value: string;
}

export interface BrochureAboutContent {
  variant: BrochureAboutVariant;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  /** `salon`: which side the photograph sits on. */
  imageSide: "left" | "right";
  services: BrochureService[];
  team: BrochureTeamMember[];
  testimonials: BrochureTestimonial[];
  teamSectionLabel: string;
  /** `rows` variant: label/value pairs beside the portrait. */
  rows: BrochureAboutRow[];
  /** Optional mailto (or other) link under the rows. */
  ctaLabel: string;
  ctaHref: string;
  sectionSize: BrochureSectionSize;
}

export type BrochureElfsightVariant = "widget";

export interface BrochureElfsightContent {
  variant: BrochureElfsightVariant;
  eyebrow: string;
  title: string;
  description: string;
  appId: string;
  sectionSize: BrochureSectionSize;
}

export type BrochureBookingVariant = "widget";
export type BrochureBookingTheme = "light" | "dark" | "auto";
export type BrochureBookingLayout = "month_view" | "week_view" | "column_view";

export interface BrochureBookingContent {
  variant: BrochureBookingVariant;
  eyebrow: string;
  title: string;
  description: string;
  /** Cal.com event slug (`org/consult`) or full booking URL. */
  calLink: string;
  /** Cloud default is `https://app.cal.com`. Self-hosted: your Cal origin. */
  origin: string;
  theme: BrochureBookingTheme;
  brandColor: string;
  hideEventTypeDetails: boolean;
  hideBranding: boolean;
  layout: BrochureBookingLayout;
  sectionSize: BrochureSectionSize;
}

export type BrochureContactVariant =
  | "form"
  | "split"
  | "concierge"
  | "acquisition"
  | "plate";

export interface BrochureContactLink {
  label: string;
  href: string;
}

export interface BrochureContactContent {
  variant: BrochureContactVariant;
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  phone: string;
  serviceArea: string;
  hours: string;
  /** FormSubmit recipient for the concierge inquiry (browser POST). */
  email: string;
  /** Optional WhatsApp number for a private, direct line. */
  whatsapp: string;
  /** Extra contact destinations (auction profiles, directories, etc.). */
  links: BrochureContactLink[];
  /** `plate` variant: ambient clip behind the wordmark. */
  videoSrc: string;
  logoImageUrl: string;
  /** Page color for the closing plate. */
  bg: string;
  theme: "light" | "dark";
  /** Subject line on the mailto. The address is `email`. */
  mailtoSubject: string;
  sectionSize: BrochureSectionSize;
}

export type BrochureProcessVariant = "steps";

export interface BrochureProcessStep {
  title: string;
  body: string;
}

export interface BrochureProcessContent {
  variant: BrochureProcessVariant;
  eyebrow: string;
  title: string;
  intro: string;
  /** Optional closing link to the contact block. Empty hides it. */
  ctaLabel: string;
  sectionSize: BrochureSectionSize;
  steps: BrochureProcessStep[];
}

export type BrochureNewsletterVariant = "teaser" | "index";

export type BrochureNewsletterImageAlign = "left" | "right" | "full";

export type BrochureNewsletterBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | {
      type: "image";
      imageUrl: string;
      alt: string;
      caption: string;
      /** Left/right wrap the following copy; `full` is a plate across the column. */
      align: BrochureNewsletterImageAlign;
    };

export interface BrochureNewsletterPost {
  slug: string;
  /** Display date, e.g. "Autumn 2026". */
  date: string;
  /** Calendar year for directory filters, e.g. "2026". */
  year: string;
  /** Calendar month 1–12 for directory filters. */
  month: string;
  title: string;
  excerpt: string;
  heroImageUrl: string;
  heroImageAlt: string;
  blocks: BrochureNewsletterBlock[];
}

export interface BrochureNewsletterContent {
  variant: BrochureNewsletterVariant;
  eyebrow: string;
  title: string;
  intro: string;
  viewAllLabel: string;
  teaserLimit: number;
  sectionSize: BrochureSectionSize;
  posts: BrochureNewsletterPost[];
}

export type BrochureMusicVariant = "bar";

export interface BrochureMusicTrack {
  title: string;
  artist: string;
  src: string;
}

export interface BrochureMusicContent {
  variant: BrochureMusicVariant;
  /** Short chrome label, e.g. "In the room". */
  label: string;
  tracks: BrochureMusicTrack[];
}

export type BrochureProjectVariant = "plates" | "grid" | "essay" | "still";

export type BrochureProjectMediaShape =
  | "vertical"
  | "portrait"
  | "horizontal"
  | "square";

export interface BrochureProjectClip {
  src: string;
  shape: BrochureProjectMediaShape;
}

export interface BrochureProjectRecord {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: number;
  role: string;
  location: string;
  category: string;
  description: string;
  story: string[];
  videoSrc: string;
  vimeoId: string;
  youtubeUrl: string;
  imageSrc: string;
  images: string[];
  media: BrochureProjectClip[];
  /** Section background. Default paper. */
  bg: string;
  /** Cover crop, 0–100. Omitted keeps the grid default. */
  focalY?: number;
}

export interface BrochureProjectContent {
  variant: BrochureProjectVariant;
  sectionSize: BrochureSectionSize;
  /** Photography grid pads with empty cells up to this count. */
  minSlots: number;
  projects: BrochureProjectRecord[];
}

export type BrochureShopVariant = "rail" | "gallery";

/** `sold` records stay off the home rail and the shop page. */
export type BrochureShopStatus = "available" | "sold";

export interface BrochureShopDetail {
  label: string;
  value: string;
}

export interface BrochureShopItem {
  id: string;
  slug: string;
  brand: string;
  /** Group for the category index. Blank pieces stay off that index. */
  category: string;
  title: string;
  /** Display price, already formatted. e.g. "$285.00". */
  price: string;
  imageUrl: string;
  imageAlt: string;
  /** More frames after the cover. */
  images: string[];
  /** Blank lines split paragraphs on the piece page. */
  description: string;
  /** Labeled facts: size, material, condition. */
  details: BrochureShopDetail[];
  status: BrochureShopStatus;
}

export interface BrochureShopContent {
  variant: BrochureShopVariant;
  sectionSize: BrochureSectionSize;
  /** Home rail heading. */
  title: string;
  /** Shop page heading. Blank uses `title`. */
  galleryTitle: string;
  /** Home category index. Hidden when no listed piece has a category. */
  categoriesTitle: string;
  viewAllLabel: string;
  /** Home rail: how many available pieces to preview. */
  teaserLimit: number;
  items: BrochureShopItem[];
}

export type BrochureBannerVariant = "dock";

export interface BrochureBannerCue {
  /** Section id. When that section reaches the band, `line` replaces the home line. */
  targetId: string;
  line: string;
}

export interface BrochureBannerContent {
  variant: BrochureBannerVariant;
  sectionSize: BrochureSectionSize;
  /** Line shown with the hero, until a section cue takes over. */
  line: string;
  cues: BrochureBannerCue[];
}

export type BrochureFooterVariant = "simple" | "stacked" | "editorial";

export interface BrochureFooterContent {
  variant: BrochureFooterVariant;
  businessName: string;
  logoImageUrl: string;
  tagline: string;
  phone: string;
  serviceArea: string;
  hours: string;
  /** Closing line under the name. Empty keeps the editorial footer’s default sentence. */
  colophon: string;
  links: BrochureNavLink[];
  sectionSize: BrochureSectionSize;
}

export type BrochureInstanceContent =
  | ({ component: "BrochureSiteNav" } & BrochureNavContent)
  | ({ component: "BrochureHero" } & BrochureHeroContent)
  | ({ component: "BrochureGallery" } & BrochureGalleryContent)
  | ({ component: "BrochureInventory" } & BrochureInventoryContent)
  | ({ component: "BrochureDivider" } & BrochureDividerContent)
  | ({ component: "BrochureAbout" } & BrochureAboutContent)
  | ({ component: "BrochureElfsight" } & BrochureElfsightContent)
  | ({ component: "BrochureBooking" } & BrochureBookingContent)
  | ({ component: "BrochureContact" } & BrochureContactContent)
  | ({ component: "BrochureProcess" } & BrochureProcessContent)
  | ({ component: "BrochureNewsletter" } & BrochureNewsletterContent)
  | ({ component: "BrochureMusic" } & BrochureMusicContent)
  | ({ component: "BrochureProject" } & BrochureProjectContent)
  | ({ component: "BrochureShop" } & BrochureShopContent)
  | ({ component: "BrochureBanner" } & BrochureBannerContent)
  | ({ component: "BrochureFooter" } & BrochureFooterContent);

/** Keys are auto-numbered from JSX: BrochureHero_1, BrochureHero_2, … */
export type BrochureBlueprint = Record<string, BrochureInstanceContent>;

export type BrochureBlockProps<T> = {
  instanceId?: string;
  data?: T;
};
