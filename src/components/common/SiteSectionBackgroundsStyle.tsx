import { getSectionBackgrounds } from "@/lib/site-settings-cache";
import { buildSectionBackgroundsCss } from "@/lib/section-backgrounds";

export async function SiteSectionBackgroundsStyle() {
  const backgrounds = await getSectionBackgrounds();
  const css = buildSectionBackgroundsCss(backgrounds);
  return <style id="fma-section-backgrounds" dangerouslySetInnerHTML={{ __html: css }} />;
}
