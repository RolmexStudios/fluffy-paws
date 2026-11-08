import { localizeSiteAssets } from "../src/lib/brochure/localize-assets";

async function main() {
  const siteRoot = process.argv[2] ? process.argv[2] : process.cwd();
  const result = await localizeSiteAssets({ siteRoot });
  console.log(
    JSON.stringify(
      {
        siteRoot,
        localized: result.localized,
        skipped: result.skipped,
        files: result.files,
      },
      null,
      2,
    ),
  );
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Failed to localize assets.";
  console.error(message);
  process.exit(1);
});
